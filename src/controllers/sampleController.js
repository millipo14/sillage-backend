const { Sample, Perfume, SubscriptionSample } = require('../models');
const { Op } = require('sequelize');

const sampleController = {
    // Получить все пробники
    getAllSamples: async (req, res) => {
        try {
            const {
                perfume,
                available_only = true,
                page = 1,
                limit = 20
            } = req.query;

            const where = {};
            if (available_only === 'true') {
                where.stock = { [Op.gt]: 0 };
            }

            const include = [
                {
                    model: Perfume,
                    as: 'perfume',
                    include: ['brand', 'notes']
                }
            ];

            if (perfume) {
                include[0].where = {
                    name: { [Op.iLike]: `%${perfume}%` }
                };
            }

            const offset = (page - 1) * limit;

            const { count, rows } = await Sample.findAndCountAll({
                where,
                include,
                limit: parseInt(limit),
                offset: parseInt(offset),
                order: [['sample_id', 'ASC']]
            });

            res.json({
                total: count,
                page: parseInt(page),
                totalPages: Math.ceil(count / limit),
                samples: rows
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Получить пробник по ID
    getSampleById: async (req, res) => {
        try {
            const sample = await Sample.findByPk(req.params.id, {
                include: [
                    {
                        model: Perfume,
                        as: 'perfume',
                        include: ['brand', 'notes']
                    },
                    {
                        model: SubscriptionSample,
                        as: 'subscription_samples',
                        limit: 10
                    }
                ]
            });

            if (!sample) {
                return res.status(404).json({ error: 'Пробник не найден' });
            }

            res.json(sample);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Создать пробник
    createSample: async (req, res) => {
        try {
            const { perfume_id, volume_ml, price, image_url, stock = 0 } = req.body;

            // Проверка существования аромата
            const perfume = await Perfume.findByPk(perfume_id);
            if (!perfume) {
                return res.status(404).json({ error: 'Аромат не найден' });
            }

            // Проверка существования пробника для этого аромата и объема
            const existingSample = await Sample.findOne({
                where: {
                    perfume_id,
                    volume_ml
                }
            });

            if (existingSample) {
                return res.status(400).json({
                    error: 'Пробник для этого аромата и объема уже существует'
                });
            }

            const sample = await Sample.create({
                perfume_id,
                volume_ml,
                price,
                image_url: image_url || perfume.image_url,
                stock
            });

            const sampleWithDetails = await Sample.findByPk(sample.sample_id, {
                include: [{
                    model: Perfume,
                    as: 'perfume',
                    include: ['brand']
                }]
            });

            res.status(201).json({
                message: 'Пробник успешно создан',
                sample: sampleWithDetails
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Обновить пробник
    updateSample: async (req, res) => {
        try {
            const sample = await Sample.findByPk(req.params.id);
            if (!sample) {
                return res.status(404).json({ error: 'Пробник не найден' });
            }

            await sample.update(req.body);

            const updatedSample = await Sample.findByPk(sample.sample_id, {
                include: [{
                    model: Perfume,
                    as: 'perfume',
                    include: ['brand']
                }]
            });

            res.json({
                message: 'Пробник успешно обновлен',
                sample: updatedSample
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Удалить пробник
    deleteSample: async (req, res) => {
        try {
            const sample = await Sample.findByPk(req.params.id);
            if (!sample) {
                return res.status(404).json({ error: 'Пробник не найден' });
            }

            // Проверка использования в подписках
            const usedInSubscriptions = await SubscriptionSample.findOne({
                where: { sample_id: req.params.id }
            });

            if (usedInSubscriptions) {
                return res.status(400).json({
                    error: 'Нельзя удалить пробник, так как он используется в подписках'
                });
            }

            await sample.destroy();
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Получить пробники для подписки (доступные)
    getAvailableSamples: async (req, res) => {
        try {
            const { limit = 50, volume_ml } = req.query;

            const where = {
                stock: { [Op.gt]: 0 }
            };

            if (volume_ml) {
                where.volume_ml = parseFloat(volume_ml);
            }

            const samples = await Sample.findAll({
                where,
                include: [{
                    model: Perfume,
                    as: 'perfume',
                    include: [
                        { model: Brand, as: 'brand' },
                        { model: Note, as: 'notes' }
                    ]
                }],
                limit: parseInt(limit),
                order: [['perfume_id', 'ASC']]
            });

            res.json(samples);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = sampleController;