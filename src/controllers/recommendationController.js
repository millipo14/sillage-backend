const RecommendationService = require('../services/recommendationService');
const { Review, sequelize } = require('../models');

const recommendationController = {
    getRecommendations: async (req, res) => {
        try {
            const userId = req.user?.id || req.user?.userId;
            const { limit = 32 } = req.query;
            const recommendations = await RecommendationService.getRecommendations(userId, parseInt(limit));
            const enriched = await Promise.all(recommendations.map(async (perfume) => {
                const p = perfume.toJSON ? perfume.toJSON() : perfume;
                const ratingData = await Review.findOne({
                    where: { perfume_id: p.perfume_id },
                    attributes: [
                        [sequelize.fn('AVG', sequelize.col('rating')), 'average']
                    ],
                    raw: true
                });
                return {
                    ...p,
                    rating: parseFloat(ratingData?.average) || 0
                };
            }));
            res.json({
                message: 'Рекомендации успешно загружены',
                recommendations: enriched,
                count: enriched.length
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = recommendationController;