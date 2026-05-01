const { Perfume, Review, BrandPreference, NotePreference, User, sequelize } = require('../models');
const { Op } = require('sequelize');

class RecommendationService {
    // Гибридные рекомендации
    static async getHybridRecommendations(userId, limit = 10) {
        try {
            const user = await User.findByPk(userId, {
                include: ['preferred_brands', 'reviews']
            });

            if (!user) {
                return this.getPopularPerfumes(limit);
            }

            // 1. Контентная фильтрация (по предпочтениям брендов и нот)
            const contentBased = await this.getContentBasedRecommendations(userId, limit);

            // 2. Коллаборативная фильтрация (по похожим пользователям)
            const collaborativeBased = await this.getCollaborativeRecommendations(userId, limit);

            // 3. Новинки и популярные
            const [newPerfumes, popularPerfumes] = await Promise.all([
                this.getNewPerfumes(limit / 2),
                this.getPopularPerfumes(limit / 2)
            ]);

            // Объединение и дедупликация
            const allPerfumes = [
                ...contentBased,
                ...collaborativeBased,
                ...newPerfumes,
                ...popularPerfumes
            ];

            // Удаление дубликатов
            const uniquePerfumes = this.removeDuplicates(allPerfumes, 'perfume_id');

            // Сортировка по релевантности
            return this.sortByRelevance(uniquePerfumes, user).slice(0, limit);
        } catch (error) {
            console.error('Error generating recommendations:', error);
            return this.getPopularPerfumes(limit);
        }
    }

    // Контентная фильтрация
    static async getContentBasedRecommendations(userId, limit = 10) {
        const userPreferences = await BrandPreference.findAll({
            where: { customer_id: userId },
            include: ['brand']
        });

        const preferredBrandIds = userPreferences.map(p => p.brand.brand_id);

        let perfumes = [];

        if (preferredBrandIds.length > 0) {
            // Поиск по предпочтительным брендам
            perfumes = await Perfume.findAll({
                where: {
                    brand_id: { [Op.in]: preferredBrandIds }
                },
                include: ['brand', 'notes'],
                limit: limit * 2,
                order: [['price', 'DESC']]
            });
        }

        // Если недостаточно рекомендаций, добавляем популярные
        if (perfumes.length < limit) {
            const additional = await this.getPopularPerfumes(limit - perfumes.length);
            perfumes = [...perfumes, ...additional];
        }

        return perfumes;
    }

    // Коллаборативная фильтрация
    static async getCollaborativeRecommendations(userId, limit = 10) {
        // Находим пользователей с похожими предпочтениями
        const similarUsers = await BrandPreference.findAll({
            where: {
                brand_id: {
                    [Op.in]: sequelize.literal(`(
                        SELECT brand_id FROM brand_preferences 
                        WHERE customer_id = ${userId}
                    )`)
                },
                customer_id: { [Op.ne]: userId }
            },
            attributes: ['customer_id'],
            group: ['customer_id'],
            having: sequelize.literal('COUNT(*) >= 2'),
            limit: 5
        });

        if (similarUsers.length === 0) {
            return [];
        }

        const similarUserIds = similarUsers.map(u => u.customer_id);

        // Находим ароматы, которые нравятся похожим пользователям
        const similarUserReviews = await Review.findAll({
            where: {
                customer_id: { [Op.in]: similarUserIds },
                rating: { [Op.gte]: 4 }
            },
            include: [{
                model: Perfume,
                as: 'perfume',
                include: ['brand', 'notes']
            }],
            limit: limit * 2
        });

        // Фильтруем ароматы, которые пользователь еще не оценивал
        const userReviews = await Review.findAll({
            where: { customer_id: userId },
            attributes: ['perfume_id']
        });

        const reviewedPerfumeIds = userReviews.map(r => r.perfume_id);

        return similarUserReviews
            .filter(r => !reviewedPerfumeIds.includes(r.perfume.perfume_id))
            .map(r => r.perfume);
    }

    // Получить популярные ароматы
    static async getPopularPerfumes(limit = 10) {
        return await Perfume.findAll({
            include: ['brand', 'notes'],
            order: [
                [sequelize.literal('(SELECT AVG(rating) FROM reviews WHERE perfume_id = perfumes.perfume_id)'), 'DESC'],
                ['created_at', 'DESC']
            ],
            limit
        });
    }

    // Получить новинки
    static async getNewPerfumes(limit = 10) {
        return await Perfume.findAll({
            include: ['brand', 'notes'],
            order: [['created_at', 'DESC']],
            limit
        });
    }

    // Вспомогательные методы
    static removeDuplicates(array, key) {
        const seen = new Set();
        return array.filter(item => {
            const value = item[key];
            if (seen.has(value)) {
                return false;
            }
            seen.add(value);
            return true;
        });
    }

    static sortByRelevance(perfumes, user) {
        return perfumes.sort((a, b) => {
            // Вес по цене (предпочтение средней цены)
            const priceWeight = (price) => {
                const avgPrice = 15000; // Средняя цена в системе
                return 1 - Math.abs(price - avgPrice) / avgPrice;
            };

            // Вес по рейтингу
            const ratingWeight = (perfume) => {
                // Здесь можно добавить логику расчета рейтинга
                return 1;
            };

            const scoreA = priceWeight(a.price) * ratingWeight(a);
            const scoreB = priceWeight(b.price) * ratingWeight(b);

            return scoreB - scoreA;
        });
    }
}

module.exports = RecommendationService;