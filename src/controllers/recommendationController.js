const RecommendationService = require('../services/recommendationService');

const recommendationController = {
    // Получить рекомендации для пользователя
    getRecommendations: async (req, res) => {
        try {
            const userId = req.user.userId;
            const { limit = 10 } = req.query;

            const recommendations = await RecommendationService.getHybridRecommendations(
                userId,
                parseInt(limit)
            );

            res.json({
                message: 'Рекомендации успешно загружены',
                recommendations,
                count: recommendations.length
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Получить популярные ароматы (публичный)
    getPopularPerfumes: async (req, res) => {
        try {
            const { limit = 10 } = req.query;

            const popularPerfumes = await RecommendationService.getPopularPerfumes(
                parseInt(limit)
            );

            res.json({
                message: 'Популярные ароматы',
                perfumes: popularPerfumes
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Получить новинки (публичный)
    getNewPerfumes: async (req, res) => {
        try {
            const { limit = 10 } = req.query;

            const newPerfumes = await RecommendationService.getNewPerfumes(
                parseInt(limit)
            );

            res.json({
                message: 'Новинки',
                perfumes: newPerfumes
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = recommendationController;