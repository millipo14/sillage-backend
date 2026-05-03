const {
    Perfume,
    NotePreference,
    CategoryPreference,
    User,
    sequelize
} = require('../models');

class RecommendationService {
    static async getRecommendations(userId, limit = 20) {
        try {
            const [notePrefs, catPrefs, user] = await Promise.all([
                NotePreference.findAll({
                    where: { customer_id: userId },
                    raw: true
                }),
                CategoryPreference.findAll({
                    where: { customer_id: userId },
                    raw: true
                }),
                User.findByPk(userId, {
                    attributes: ['target_gender']
                })
            ]);

            const perfumes = await Perfume.findAll({
                include: [
                    { model: sequelize.models.Brand, as: 'brand' },
                    { model: sequelize.models.Note, as: 'notes' },
                    { model: sequelize.models.PerfumeVolume, as: 'volumes' }
                ]
            });

            const categories = catPrefs
                .map(c => c.category_name?.toLowerCase())
                .filter(Boolean);

            const noteIds = notePrefs.map(n => n.note_id);

            const allowedGenders =
                user?.target_gender && user.target_gender !== 'any'
                    ? user.target_gender === 'male'
                        ? ['male', 'unisex']
                        : ['female', 'unisex']
                    : null;

            const scored = perfumes.map(p => {
                const plain = p.get({ plain: true });

                if (
                    allowedGenders &&
                    !allowedGenders.includes(plain.gender)
                ) {
                    return null;
                }

                let score = 0;


                const categoryMatch =
                    categories.length &&
                    categories.some(c =>
                        plain.perfume_category?.toLowerCase().includes(c)
                    );

                if (categoryMatch) score += 3;

                const noteMatch =
                    noteIds.length &&
                    plain.notes?.some(n =>
                        noteIds.includes(n.note_id)
                    );

                if (noteMatch) score += 2;

                if (categoryMatch && noteMatch) {
                    score += 2;
                }

                if (score === 0) return null;

                return {
                    ...plain,
                    score
                };
            });

            const results = scored
                .filter(Boolean)
                .sort((a, b) => b.score - a.score)
                .slice(0, limit);

            if (results.length < 5) {
                const fallback = perfumes
                    .map(p => p.get({ plain: true }))
                    .filter(p =>
                        allowedGenders
                            ? allowedGenders.includes(p.gender)
                            : true
                    )
                    .slice(0, limit);

                return fallback;
            }

            return results;
        } catch (error) {
            console.error('RecommendationService error:', error);
            return [];
        }
    }
    static async getHybridRecommendations(userId, count) {
        return await this.getRecommendations(userId, count);
    }
}

module.exports = RecommendationService;