const RecommendationService = require('../services/recommendationService');

const recommendationController = {
    getRecommendations: async (req, res) => {
        try {
            const userId = req.user?.id || req.user?.userId;

            if (!userId) {
                console.error("ОШИБКА: ID пользователя не найден в req.user. Проверь authMiddleware.");
                return res.status(401).json({ error: 'Пользователь не авторизован или токен не содержит ID' });
            }

            const { limit = 10 } = req.query;

            const recommendations = await RecommendationService.getRecommendations(
                userId,
                parseInt(limit)
            );

            res.json({
                message: 'Рекомендации успешно загружены',
                recommendations,
                count: recommendations.length
            });
        } catch (error) {
            console.error("ОШИБКА КОНТРОЛЛЕРА:", error.message);
            res.status(500).json({ error: error.message });
        }
    },
};

module.exports = recommendationController;