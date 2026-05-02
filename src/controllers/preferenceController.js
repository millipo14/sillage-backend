'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class NotePreference extends Model {
        static associate(models) {
            NotePreference.belongsTo(models.User, {//принадлежность пользователю
                foreignKey: 'customer_id',
                as: 'customer'
            });
            NotePreference.belongsTo(models.Note, {//принадлежность ноте
                foreignKey: 'note_id',
                as: 'note'
            });
        }
    }

    NotePreference.init({
        customer_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            references: {
                model: 'customers',
                key: 'customer_id'
            }
        },
        note_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            references: {
                model: 'perfume_notes',
                key: 'note_id'
            }
        }
    }, {
        sequelize,
        modelName: 'NotePreference',
        tableName: 'note_preferences',
        timestamps: false,
        underscored: true
    });

    return NotePreference;
};
const { BrandPreference, NotePreference, Brand, Note, User, CategoryPreference, Perfume, Sequelize } = require('../models');

const preferenceController = {
    // Получить предпочтения пользователя
    getUserPreferences: async (req, res) => {
        try {
            const userId = req.user.userId;

            const [brandPreferences, notePreferences, categoryPreferences ] = await Promise.all([
                BrandPreference.findAll({
                    where: { customer_id: userId },
                    include: [{ model: Brand, as: 'brand' }]
                }),
                NotePreference.findAll({
                    where: { customer_id: userId },
                    include: [{ model: Note, as: 'note' }]
                }),
                CategoryPreference.findAll({
                    where: { customer_id: userId }
                })
            ]);

            res.json({
                brand_preferences: brandPreferences,
                note_preferences: notePreferences,
                category_preferences: categoryPreferences
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Добавить предпочтение бренда
    addBrandPreference: async (req, res) => {
        try {
            const userId = req.user.userId;
            const { brand_id } = req.body;

            // Проверка существования бренда
            const brand = await Brand.findByPk(brand_id);
            if (!brand) {
                return res.status(404).json({ error: 'Бренд не найден' });
            }

            // Проверка существующего предпочтения
            const existingPreference = await BrandPreference.findOne({
                where: {
                    customer_id: userId,
                    brand_id
                }
            });

            if (existingPreference) {
                return res.status(400).json({
                    error: 'Этот бренд уже добавлен в предпочтения'
                });
            }

            const preference = await BrandPreference.create({
                customer_id: userId,
                brand_id
            });

            const preferenceWithDetails = await BrandPreference.findOne({
                where: {
                    customer_id: userId,
                    brand_id
                },
                include: [{ model: Brand, as: 'brand' }]
            });

            res.status(201).json({
                message: 'Бренд добавлен в предпочтения',
                preference: preferenceWithDetails
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Добавить предпочтение ноты
    addNotePreference: async (req, res) => {
        try {
            const userId = req.user.userId;
            const { note_id } = req.body;

            // Проверка существования ноты
            const note = await Note.findByPk(note_id);
            if (!note) {
                return res.status(404).json({ error: 'Нота не найдена' });
            }

            // Проверка существующего предпочтения
            const existingPreference = await NotePreference.findOne({
                where: {
                    customer_id: userId,
                    note_id
                }
            });

            if (existingPreference) {
                return res.status(400).json({
                    error: 'Эта нота уже добавлена в предпочтения'
                });
            }

            const preference = await NotePreference.create({
                customer_id: userId,
                note_id
            });

            const preferenceWithDetails = await NotePreference.findOne({
                where: {
                    customer_id: userId,
                    note_id
                },
                include: [{ model: Note, as: 'note' }]
            });

            res.status(201).json({
                message: 'Нота добавлена в предпочтения',
                preference: preferenceWithDetails
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Удалить предпочтение бренда
    removeBrandPreference: async (req, res) => {
        try {
            const userId = req.user.userId;
            const { brand_id } = req.params;

            const deleted = await BrandPreference.destroy({
                where: {
                    customer_id: userId,
                    brand_id
                }
            });

            if (!deleted) {
                return res.status(404).json({ error: 'Предпочтение не найдено' });
            }

            res.json({ message: 'Предпочтение бренда удалено' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Удалить предпочтение ноты
    removeNotePreference: async (req, res) => {
        try {
            const userId = req.user.userId;
            const { note_id } = req.params;

            const deleted = await NotePreference.destroy({
                where: {
                    customer_id: userId,
                    note_id
                }
            });

            if (!deleted) {
                return res.status(404).json({ error: 'Предпочтение не найдено' });
            }

            res.json({ message: 'Предпочтение ноты удалено' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Очистить все предпочтения
    clearPreferences: async (req, res) => {
        try {
            const userId = req.user.userId;

            await Promise.all([
                BrandPreference.destroy({
                    where: { customer_id: userId }
                }),
                NotePreference.destroy({
                    where: { customer_id: userId }
                })
            ]);

            res.json({ message: 'Все предпочтения очищены' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },


    // Получить опции специально для квиза (с сохранением ID нот)
    getQuizOptions: async (req, res) => {
        try {
            // 1. ПОЛУЧАЕМ И ОЧИЩАЕМ КАТЕГОРИИ
            const rawCategories = await Perfume.findAll({
                attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('perfume_category')), 'category']],
                raw: true
            });

            // Разбиваем сложные названия (н-р "шипровые цветочные" -> ["шипровые", "цветочные"])
            const flatCategories = rawCategories
                .map(c => c.category)
                .filter(Boolean)
                .flatMap(c => c.toLowerCase().split(/[\s-]+/)); // разбиваем по пробелу или дефису

            // Оставляем только уникальные и красивые названия (убираем "мускусные", если это просто добавка)
            const uniqueCategories = [...new Set(flatCategories)].filter(word =>
                word.length > 3 && !['свежие', 'пряные'].includes(word)
            );

            // 2. ПОЛУЧАЕМ ТОЛЬКО УНИКАЛЬНЫЕ НОТЫ ПО ИМЕНИ
            // Группировка по имени решает проблему дубликатов
            const notes = await Note.findAll({
                attributes: [
                    [Sequelize.fn('MIN', Sequelize.col('note_id')), 'id'], // Берем любой ID для этой ноты
                    'note_name'
                ],
                group: ['note_name'], // ГРУППИРОВКА ПО ИМЕНИ
                order: [['note_name', 'ASC']],
                raw: true
            });

            res.json({
                categories: uniqueCategories,
                notes: notes.map(n => ({
                    id: n.id,
                    name: n.note_name
                }))
            });
        } catch (error) {
            console.error('Ошибка в getQuizOptions:', error);
            res.status(500).json({ error: error.message });
        }
    },

    saveQuizResults: async (req, res) => {
        try {
            const userId = req.user.userId;
            const { gender, categories, notes } = req.body;

            // 1. Обновляем гендер у пользователя
            // На фронте это будет результат 1-го шага (male/female/unisex/any)
            await User.update(
                { target_gender: gender },
                { where: { customer_id: userId } }
            );

            // 2. Обновляем категории
            await CategoryPreference.destroy({ where: { customer_id: userId } });
            if (categories && categories.length > 0) {
                const categoryRecords = categories.map(catName => ({
                    customer_id: userId,
                    category_name: catName
                }));
                await CategoryPreference.bulkCreate(categoryRecords);
            }

            // 3. Обновляем ноты
            await NotePreference.destroy({ where: { customer_id: userId } });
            if (notes && notes.length > 0) {
                const noteRecords = notes.map(noteId => ({
                    customer_id: userId,
                    note_id: noteId
                }));
                await NotePreference.bulkCreate(noteRecords);
            }

            res.json({ message: 'Результаты опроса успешно сохранены' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = preferenceController;
