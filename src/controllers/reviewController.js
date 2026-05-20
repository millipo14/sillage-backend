const { Review, User, Perfume, sequelize } = require('../models');
const { Op } = require('sequelize');

const reviewController = {
    // Получить отзывы для аромата
    getReviewsByPerfume: async (req, res) => {
        try {
            const { perfume_id } = req.params;
            const { page = 1, limit = 10, rating } = req.query;

            const where = { perfume_id };
            if (rating) {
                where.rating = rating;
            }

            const offset = (page - 1) * limit;

            const { count, rows } = await Review.findAndCountAll({
                where,
                include: [
                    {
                        model: User,
                        as: 'customer',
                        attributes: ['first_name', 'last_name', 'customer_id']
                    }
                ],
                order: [['created_at', 'DESC']],
                limit: parseInt(limit),
                offset: parseInt(offset)
            });

            // Расчет среднего рейтинга
            const avgRating = await Review.findOne({
                where: { perfume_id },
                attributes: [
                    [sequelize.fn('AVG', sequelize.col('rating')), 'average']
                ],
                raw: true
            });

            const rawDistribution = await Review.findAll({
                where: { perfume_id },
                attributes: [
                    'rating',
                    [sequelize.fn('COUNT', sequelize.col('rating')), 'count']
                ],
                group: ['rating'],
                raw: true
            });

            const total = count;

            const ratingBar = [5, 4, 3, 2, 1].map(star => {
                const found = rawDistribution.find(d => parseInt(d.rating) === star);
                const starCount = found ? parseInt(found.count) : 0;
                return {
                    label: star,
                    count: starCount,
                    percent: total > 0 ? Math.round((starCount / total) * 100) : 0
                };
            });

            res.json({
                total,
                page: parseInt(page),
                totalPages: Math.ceil(total / limit),
                averageRating: parseFloat(avgRating.average) || 0,
                ratingBar,
                reviews: rows
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Создать отзыв
    createReview: async (req, res) => {
        try {
            const userId = req.user.userId;
            const { perfume_id, rating, comment } = req.body;

            // Проверка существования аромата
            const perfume = await Perfume.findByPk(perfume_id);
            if (!perfume) {
                return res.status(404).json({ error: 'Аромат не найден' });
            }

            // Проверка существующего отзыва
            const existingReview = await Review.findOne({
                where: {
                    customer_id: userId,
                    perfume_id
                }
            });

            if (existingReview) {
                return res.status(400).json({
                    error: 'Вы уже оставляли отзыв на этот аромат'
                });
            }

            const review = await Review.create({
                customer_id: userId,
                perfume_id,
                rating,
                comment
            });

            const reviewWithDetails = await Review.findByPk(review.review_id, {
                include: [
                    {
                        model: User,
                        as: 'customer',
                        attributes: ['first_name', 'last_name']
                    },
                    {
                        model: Perfume,
                        as: 'perfume',
                        attributes: ['name', 'brand_id']
                    }
                ]
            });

            // Начисление баллов лояльности за отзыв
            //     await User.increment('loyalty_points', {
            //         by: 10,
            //         where: { customer_id: userId }
            //     });

            res.status(201).json({
                message: 'Отзыв успешно добавлен',
                review: reviewWithDetails,
                pointsAwarded: 10
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Обновить отзыв
    updateReview: async (req, res) => {
        try {
            const userId = req.user.userId;
            const { id } = req.params;
            const { rating, comment } = req.body;

            const review = await Review.findOne({
                where: {
                    review_id: id,
                    customer_id: userId
                }
            });

            if (!review) {
                return res.status(404).json({ error: 'Отзыв не найден' });
            }

            await review.update({
                rating: rating || review.rating,
                comment: comment || review.comment
            });

            const updatedReview = await Review.findByPk(review.review_id, {
                include: [
                    {
                        model: User,
                        as: 'customer',
                        attributes: ['first_name', 'last_name']
                    }
                ]
            });

            res.json({
                message: 'Отзыв успешно обновлен',
                review: updatedReview
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Удалить отзыв
    deleteReview: async (req, res) => {
        try {
            const userId = req.user.userId;
            const { id } = req.params;

            const review = await Review.findOne({
                where: {
                    review_id: id,
                    customer_id: userId
                }
            });

            if (!review) {
                return res.status(404).json({ error: 'Отзыв не найден' });
            }

            await review.destroy();
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Получить отзывы пользователя
    getUserReviews: async (req, res) => {
        try {
            const userId = req.user.userId;
            const { page = 1, limit = 10 } = req.query;
            const offset = (page - 1) * limit;

            const { count, rows } = await Review.findAndCountAll({
                where: { customer_id: userId },
                include: [
                    {
                        model: Perfume,
                        as: 'perfume',
                        include: ['brand']
                    }
                ],
                order: [['created_at', 'DESC']],
                limit: parseInt(limit),
                offset: parseInt(offset)
            });

            res.json({
                total: count,
                page: parseInt(page),
                totalPages: Math.ceil(count / limit),
                reviews: rows
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = reviewController;