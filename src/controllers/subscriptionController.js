const { Subscription, SubscriptionPlan, User, SubscriptionSample, Sample, Perfume } = require('../models');
const RecommendationService = require('../services/recommendationService');
const { Op } = require('sequelize')

const subscriptionController = {
    // Получить все тарифные планы
    getAllPlans: async (req, res) => {
        try {
            const plans = await SubscriptionPlan.findAll({
                order: [['price_per_month', 'ASC']]
            });
            res.json(plans);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Создать подписку с разделением на рекомендованные и пользовательские пробники
    createSubscription: async (req, res) => {
        console.log(req.body)
        try {
            const userId = req.user.userId;
            const { plan_id, custom_samples, shipping_address, start_date } = req.body;

            // Проверка существующей активной подписки
            const existingSubscription = await Subscription.findOne({
                where: {
                    customer_id: userId,
                    status: 'active'
                }
            });

            if (existingSubscription) {
                return res.status(400).json({
                    error: 'У вас уже есть активная подписка'
                });
            }

            // Проверка тарифа
            const plan = await SubscriptionPlan.findByPk(plan_id);
            if (!plan) return res.status(404).json({ error: 'Тариф не найден' });

            // Проверка количества пользовательских пробников
            if (custom_samples.length > plan.custom_samples) {
                return res.status(400).json({
                    error: `Вы можете выбрать максимум ${plan.custom_samples} пробников самостоятельно. Ваш тариф включает: ${plan.recommended_samples} рекомендованных + ${plan.custom_samples} на ваш выбор`
                });
            }

            // Проверка доступности пользовательских пробников
            const finalCustomSampleIds = [];

            for (const item of custom_samples) {
                // Ищем пробник по perfume_id и объему из тарифа
                const sample = await Sample.findOne({
                    where: {
                        perfume_id: item.perfume_id,
                        volume_ml: item.volume_ml || plan.sample_volume_ml
                    },
                    include: [{ model: Perfume, as: 'perfume' }]
                });

                if (!sample) {
                    return res.status(404).json({
                        error: `Пробник для аромата с ID ${item.perfume_id} не найден в объеме ${plan.sample_volume_ml}мл`
                    });
                }

                if (sample.stock < 1) {
                    return res.status(400).json({
                        error: `Пробник "${sample.perfume.name}" временно отсутствует`
                    });
                }

                finalCustomSampleIds.push(sample.sample_id); 
            }

            // Генерация рекомендованных пробников на основе предпочтений пользователя
            const recommendedSamples = await subscriptionController.generateRecommendedSamples(
                userId,
                plan.recommended_samples,
                plan.sample_volume_ml
            );

            // Проверяем, что общее количество пробников соответствует тарифу
            const totalSelected = recommendedSamples.length + custom_samples.length;
            if (totalSelected !== plan.samples_included) {
                return res.status(400).json({
                    error: `Для тарифа "${plan.name}" необходимо выбрать ${plan.samples_included} пробников. Вы выбрали: ${custom_samples.length} самостоятельно, система подобрала: ${recommendedSamples.length} рекомендованных`
                });
            }

            // Создание подписки
            const subscription = await Subscription.create({
                customer_id: userId,
                plan_id,
                start_date: start_date || new Date(),
                status: 'active',
                payment_status: 'pending',
                shipping_status: 'awaiting_shipment'
            });

            // Создание записей о рекомендованных пробниках
            for (const sId of recommendedSamples) {
                await SubscriptionSample.create({
                    subscription_id: subscription.subscription_id,
                    sample_id: sId,
                    sample_type: 'recommended',
                    status: 'selected'
                });
                await Sample.decrement('stock', { where: { sample_id: sId } });
            }

            // 4. ЗАПИСЬ В ТАБЛИЦУ SubscriptionSample (Пользовательские)
            // Используем наш массив finalCustomSampleIds с реальными ID
            for (const sId of finalCustomSampleIds) {
                await SubscriptionSample.create({
                    subscription_id: subscription.subscription_id,
                    sample_id: sId,
                    sample_type: 'custom',
                    status: 'selected'
                });
                await Sample.decrement('stock', { where: { sample_id: sId } });
            }

            // Обновление статуса пользователя
            await User.update(
                { subscription_status: 'active' },
                { where: { customer_id: userId } }
            );

            const subscriptionWithDetails = await Subscription.findByPk(
                subscription.subscription_id,
                {
                    include: [
                        { model: SubscriptionPlan, as: 'plan' },
                        {
                            model: SubscriptionSample,
                            as: 'selected_samples',
                            include: [{
                                model: Sample,
                                as: 'sample',
                                include: ['perfume']
                            }]
                        }
                    ]
                }
            );

            res.status(201).json({
                message: 'Подписка успешно оформлена!',
                subscription: subscriptionWithDetails,
                summary: {
                    plan: plan.name,
                    price_per_month: plan.price_per_month,
                    total_samples: plan.samples_included,
                    recommended_samples: recommendedSamples.length,
                    custom_samples: custom_samples.length,
                    next_billing_date: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]
                }
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Получить подписки пользователя
    getUserSubscriptions: async (req, res) => {
        try {
            const userId = req.user.userId;
            const subscriptions = await Subscription.findAll({
                where: { customer_id: userId },
                include: [
                    { model: SubscriptionPlan, as: 'plan' },
                    {
                        model: SubscriptionSample,
                        as: 'selected_samples',
                        include: [{
                            model: Sample,
                            as: 'sample',
                            include: ['perfume']
                        }]
                    }
                ],
                order: [['created_at', 'DESC']]
            });

            // Добавляем статистику по типам пробников для каждой подписки
            const subscriptionsWithStats = await Promise.all(
                subscriptions.map(async (subscription) => {
                    const subscriptionJson = subscription.toJSON();

                    // Подсчет типов пробников
                    const samples = subscriptionJson.selected_samples || [];
                    const recommendedCount = samples.filter(s => s.sample_type === 'recommended').length;
                    const customCount = samples.filter(s => s.sample_type === 'custom').length;

                    return {
                        ...subscriptionJson,
                        stats: {
                            recommended_samples: recommendedCount,
                            custom_samples: customCount,
                            total_samples: samples.length
                        }
                    };
                })
            );

            res.json(subscriptionsWithStats);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Получить активную подписку
    getActiveSubscription: async (req, res) => {
        try {
            const userId = req.user.userId;
            const subscription = await Subscription.findOne({
                where: {
                    customer_id: userId,
                    status: 'active'
                },
                include: [
                    { model: SubscriptionPlan, as: 'plan' },
                    {
                        model: SubscriptionSample,
                        as: 'selected_samples',
                        include: [{
                            model: Sample,
                            as: 'sample',
                            include: ['perfume']
                        }]
                    }
                ]
            });

            if (!subscription) {
                return res.status(404).json({
                    error: 'Активная подписка не найдена'
                });
            }

            // Добавляем статистику
            const subscriptionJson = subscription.toJSON();
            const samples = subscriptionJson.selected_samples || [];
            const recommendedCount = samples.filter(s => s.sample_type === 'recommended').length;
            const customCount = samples.filter(s => s.sample_type === 'custom').length;

            res.json({
                ...subscriptionJson,
                stats: {
                    recommended_samples: recommendedCount,
                    custom_samples: customCount,
                    total_samples: samples.length
                }
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Обновить статус подписки
    updateSubscriptionStatus: async (req, res) => {
        try {
            const userId = req.user.userId;
            const { subscription_id } = req.params;
            const { status } = req.body;

            const subscription = await Subscription.findOne({
                where: {
                    subscription_id,
                    customer_id: userId
                }
            });

            if (!subscription) {
                return res.status(404).json({ error: 'Подписка не найдена' });
            }

            // Если отменяем подписку, возвращаем пробники на склад
            if (status === 'cancelled') {
                const subscriptionSamples = await SubscriptionSample.findAll({
                    where: { subscription_id },
                    include: [{ model: Sample, as: 'sample' }]
                });

                for (const subSample of subscriptionSamples) {
                    await Sample.increment('stock', {
                        by: 1,
                        where: { sample_id: subSample.sample_id }
                    });
                }

                // Удаляем записи о пробниках
                await SubscriptionSample.destroy({
                    where: { subscription_id }
                });
            }

            await subscription.update({ status });

            // Обновление статуса пользователя
            if (status === 'cancelled' || status === 'paused') {
                await User.update(
                    { subscription_status: status },
                    { where: { customer_id: userId } }
                );
            }

            res.json({
                message: `Статус подписки обновлен на "${status}"`,
                subscription
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Выбрать пользовательские пробники для подписки (обновление выбора)
    selectSamples: async (req, res) => {
        try {
            const userId = req.user.userId;
            const { subscription_id } = req.params;
            const { custom_samples = [] } = req.body;

            const subscription = await Subscription.findOne({
                where: {
                    subscription_id,
                    customer_id: userId,
                    status: 'active'
                },
                include: [{ model: SubscriptionPlan, as: 'plan' }]
            });

            if (!subscription) {
                return res.status(404).json({ error: 'Активная подписка не найдена' });
            }

            // Проверка количества пользовательских пробников
            if (custom_samples.length > subscription.plan.custom_samples) {
                return res.status(400).json({
                    error: `Ваш тариф позволяет выбрать максимум ${subscription.plan.custom_samples} пробников самостоятельно`
                });
            }

            // Возвращаем старые пользовательские пробники на склад
            const oldCustomSamples = await SubscriptionSample.findAll({
                where: {
                    subscription_id,
                    sample_type: 'custom'
                }
            });

            for (const oldSample of oldCustomSamples) {
                await Sample.increment('stock', {
                    by: 1,
                    where: { sample_id: oldSample.sample_id }
                });
            }

            // Удаляем старые пользовательские выборы
            await SubscriptionSample.destroy({
                where: {
                    subscription_id,
                    sample_type: 'custom'
                }
            });

            // Проверка доступности новых пользовательских пробников
            // for (const sampleId of custom_samples) {
            //     const sample = await Sample.findByPk(sampleId);
            //     if (!sample || sample.stock < 1) {
            //         return res.status(400).json({
            //             error: `Пробник ${sampleId} недоступен`
            //         });
            //     }
            // }
            const finalSampleIds = [];

            for (const item of custom_samples) {
                let sample;

                if (typeof item === 'number' || typeof item === 'string') {
                    sample = await Sample.findByPk(item);
                }
                else if (item && item.perfume_id) {
                    sample = await Sample.findOne({
                        where: {
                            perfume_id: item.perfume_id,
                            volume_ml: item.volume_ml || activePlan.sample_volume_ml
                        }
                    });
                }

                if (!sample || sample.stock < 1) {
                    return res.status(404).json({
                        error: `Пробник для аромата ${item.perfume_id || item} недоступен или закончился`
                    });
                }
                finalSampleIds.push(sample.sample_id);
            }
            for (const sId of finalSampleIds) {
                await SubscriptionSample.create({
                    subscription_id,
                    sample_id: sId,
                    sample_type: 'custom',
                    status: 'selected'
                });
                await Sample.decrement('stock', {
                    by: 1,
                    where: { sample_id: sId }
                });
            }

            // Создание новых пользовательских выборов
            for (const sampleId of custom_samples) {
                await SubscriptionSample.create({
                    subscription_id,
                    sample_id: sampleId,
                    sample_type: 'custom',
                    status: 'selected'
                });

                // Уменьшение количества на складе
                await Sample.decrement('stock', {
                    where: { sample_id: sampleId }
                });
            }

            // Обновляем рекомендованные пробники (каждый месяц новые рекомендации)
            await subscriptionController.updateRecommendedSamples(subscription_id, userId, subscription.plan);

            // Обновление статуса доставки
            await subscription.update({
                shipping_status: 'selected',
                updated_at: new Date()
            });

            const updatedSubscription = await Subscription.findByPk(
                subscription_id,
                {
                    include: [
                        { model: SubscriptionPlan, as: 'plan' },
                        {
                            model: SubscriptionSample,
                            as: 'selected_samples',
                            include: [{
                                model: Sample,
                                as: 'sample',
                                include: ['perfume']
                            }]
                        }
                    ]
                }
            );

            res.json({
                message: 'Пробники успешно обновлены',
                subscription: updatedSubscription,
                note: 'Рекомендованные пробники также обновлены на основе ваших текущих предпочтений'
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Получить рекомендованные пробники для подписки
    getRecommendedSamples: async (req, res) => {
        try {
            const userId = req.user.userId;
            const { limit = 10 } = req.query;

            // Получаем рекомендации ароматов
            const perfumeRecommendations = await RecommendationService.getHybridRecommendations(
                userId,
                parseInt(limit)
            );

            // Преобразуем ароматы в доступные пробники
            const recommendedSamples = [];

            for (const perfume of perfumeRecommendations) {
                // Ищем доступные пробники для этого аромата
                const samples = await Sample.findAll({
                    where: {
                        perfume_id: perfume.perfume_id,
                        where: { stock: { [Op.gt]: 0 } }
                    },
                    include: [{
                        model: Perfume,
                        as: 'perfume',
                        include: ['brand', 'notes']
                    }]
                });

                for (const sample of samples) {
                    recommendedSamples.push({
                        ...sample.toJSON(),
                        recommendation_reason: 'На основе ваших предпочтений в брендах и нотах'
                    });
                }
            }

            res.json({
                message: 'Рекомендованные пробники для вашей подписки',
                samples: recommendedSamples.slice(0, limit),
                total: recommendedSamples.length
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Вспомогательный метод: генерация рекомендованных пробников
    generateRecommendedSamples: async (userId, count, volume_ml) => {
        try {
            const { Op } = require('sequelize');

            // 1. Пытаемся получить умные рекомендации
            const perfumeRecommendations = await RecommendationService.getHybridRecommendations(
                userId,
                count * 2
            );

            const recommendedSampleIds = [];
            const targetVolume = parseFloat(volume_ml);

            // 2. Ищем пробники нужного объема для рекомендованных парфюмов
            for (const perfume of perfumeRecommendations) {
                if (recommendedSampleIds.length >= count) break;

                const sample = await Sample.findOne({
                    where: {
                        perfume_id: perfume.perfume_id || perfume.id, // на случай разных имен полей
                        stock: { [Op.gt]: 0 },
                        volume_ml: targetVolume
                    }
                });

                if (sample) {
                    recommendedSampleIds.push(sample.sample_id);
                }
            }

            // 3. ЖЕСТКИЙ ДОБОР (если рекомендаций не хватило или их 0)
            if (recommendedSampleIds.length < count) {
                const remainingCount = count - recommendedSampleIds.length;

                const fallbackSamples = await Sample.findAll({
                    where: {
                        stock: { [Op.gt]: 0 },
                        volume_ml: targetVolume,
                        sample_id: { [Op.notIn]: recommendedSampleIds.length > 0 ? recommendedSampleIds : [-1] }
                    },
                    limit: remainingCount
                });

                for (const s of fallbackSamples) {
                    recommendedSampleIds.push(s.sample_id);
                }
            }

            return recommendedSampleIds;
        } catch (error) {
            console.error('Error generating recommended samples:', error);
            return [];
        }
    },

    // Вспомогательный метод: обновление рекомендованных пробников
    updateRecommendedSamples: async (subscription_id, userId, plan) => {
        try {
            // Возвращаем старые рекомендованные пробники на склад
            const oldRecommendedSamples = await SubscriptionSample.findAll({
                where: {
                    subscription_id,
                    sample_type: 'recommended'
                }
            });

            for (const oldSample of oldRecommendedSamples) {
                await Sample.increment('stock', {
                    by: 1,
                    where: { sample_id: oldSample.sample_id }
                });
            }

            // Удаляем старые рекомендации
            await SubscriptionSample.destroy({
                where: {
                    subscription_id,
                    sample_type: 'recommended'
                }
            });

            // Генерируем новые рекомендации
            const newRecommendedSamples = await subscriptionController.generateRecommendedSamples(
                userId,
                plan.recommended_samples,
                plan.sample_volume_ml
            );

            // Создаем записи о новых рекомендованных пробниках
            for (const sampleId of newRecommendedSamples) {
                await SubscriptionSample.create({
                    subscription_id,
                    sample_id: sampleId,
                    sample_type: 'recommended',
                    status: 'selected'
                });

                await Sample.decrement('stock', {
                    where: { sample_id: sampleId }
                });
            }

            return newRecommendedSamples.length;
        } catch (error) {
            console.error('Error updating recommended samples:', error);
            return 0;
        }
    },

    // Получить пробники текущей активной подписки с разделением по типам
    getSubscriptionSamples: async (req, res) => {
        try {
            const userId = req.user.userId;

            const subscription = await Subscription.findOne({
                where: {
                    customer_id: userId,
                    status: 'active'
                },
                include: [
                    { model: SubscriptionPlan, as: 'plan' },
                    {
                        model: SubscriptionSample,
                        as: 'selected_samples',
                        include: [{
                            model: Sample,
                            as: 'sample',
                            include: ['perfume']
                        }]
                    }
                ]
            });

            if (!subscription) {
                return res.status(404).json({ error: 'Активная подписка не найдена' });
            }

            const subscriptionJson = subscription.toJSON();
            const allSamples = subscriptionJson.selected_samples || [];

            // Разделяем пробники по типам
            const recommended = allSamples.filter(s => s.sample_type === 'recommended');
            const custom = allSamples.filter(s => s.sample_type === 'custom');

            res.json({
                subscription_id: subscriptionJson.subscription_id,
                plan: subscriptionJson.plan,
                recommended_samples: {
                    count: recommended.length,
                    max: subscriptionJson.plan.recommended_samples,
                    samples: recommended
                },
                custom_samples: {
                    count: custom.length,
                    max: subscriptionJson.plan.custom_samples,
                    samples: custom
                },
                total: {
                    selected: allSamples.length,
                    max: subscriptionJson.plan.samples_included
                }
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = subscriptionController;