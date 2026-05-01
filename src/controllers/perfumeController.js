const { Perfume, Brand, Note, PerfumeVolume, Sequelize, Review } = require('../models');
const { Op } = require('sequelize');

const perfumeController = {
    // 1. ПОЛУЧЕНИЕ ВСЕХ ПАРФЮМОВ С ФИЛЬТРАЦИЕЙ
    getAllPerfumes: async (req, res) => {
        try {
            const {
                brand,
                gender,
                minPrice,
                maxPrice,
                notes,
                category,
                concentration,
                sort,
                page = 1,
                limit = 8
            } = req.query;

            const where = {};

            if (brand) where.brand_id = brand;
            if (gender) where.gender = gender;
            if (concentration) where.concentration = concentration;

            if (category) {
                where.perfume_category = { [Op.iLike]: `%${category}%` };
            }

            const hasPriceFilter = minPrice || maxPrice;
            const minPriceNum = minPrice ? parseFloat(minPrice) : null;
            const maxPriceNum = maxPrice ? parseFloat(maxPrice) : null;

            // Фильтр по нотам
            let notesFilter = null;
            if (notes) {
                const notesArray = notes.split(',').map(n => n.trim());
                notesFilter = {
                    note_name: { [Op.in]: notesArray }
                };
            }

            // Сначала получаем ВСЕ ароматы с фильтрами
            const allPerfumes = await Perfume.findAll({
                attributes: {
                    include: [
                        [Sequelize.fn('AVG', Sequelize.col('reviews.rating')), 'rating']
                    ]
                },
                where,
                include: [
                    { model: Brand, as: 'brand' },
                    {
                        model: Note,
                        as: 'notes',
                        where: notesFilter || undefined,
                        required: !!notesFilter
                    },
                    {
                        model: PerfumeVolume,
                        as: 'volumes',
                        required: false
                    },
                    {
                        model: Review,
                        as: 'reviews',
                        attributes: []
                    }
                ],
                group: [
                    'Perfume.perfume_id',
                    'brand.brand_id',
                    'volumes.id',
                    'notes.note_id'
                ],
                distinct: true,
                subQuery: false
            });

            let filteredPerfumes = allPerfumes;
            if (hasPriceFilter) {
                filteredPerfumes = allPerfumes.filter(perfume => {
                    if (!perfume.volumes || perfume.volumes.length === 0) return false;

                    const minVolumePrice = Math.min(...perfume.volumes.map(v => v.price));

                    if (minPriceNum && minVolumePrice < minPriceNum) return false;
                    if (maxPriceNum && minVolumePrice > maxPriceNum) return false;

                    return true;
                });
            }

            if (sort === 'price-asc') {
                filteredPerfumes.sort((a, b) => {
                    const priceA = a.volumes?.length ? Math.min(...a.volumes.map(v => v.price)) : Infinity;
                    const priceB = b.volumes?.length ? Math.min(...b.volumes.map(v => v.price)) : Infinity;
                    return priceA - priceB;
                });
            } else if (sort === 'price-desc') {
                filteredPerfumes.sort((a, b) => {
                    const priceA = a.volumes?.length ? Math.min(...a.volumes.map(v => v.price)) : 0;
                    const priceB = b.volumes?.length ? Math.min(...b.volumes.map(v => v.price)) : 0;
                    return priceB - priceA;
                });
            } else if (sort === 'rating') {
                filteredPerfumes.sort((a, b) => {
                    const ratingA = parseFloat(a.getDataValue('rating')) || 0;
                    const ratingB = parseFloat(b.getDataValue('rating')) || 0;

                    if (ratingB !== ratingA) {
                        return ratingB - ratingA;
                    }
                    return new Date(b.created_at) - new Date(a.created_at);
                });
            } else {
                filteredPerfumes.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            }

            const total = filteredPerfumes.length;
            const offset = (parseInt(page) - 1) * parseInt(limit);
            const paginatedPerfumes = filteredPerfumes.slice(offset, offset + parseInt(limit));

            const formattedPerfumes = paginatedPerfumes.map(perfume => {
                const p = perfume.get({ plain: true });
                const rawRating = perfume.getDataValue('rating');
                p.rating = rawRating ? parseFloat(rawRating).toFixed(1) : "0.0";

                return p;
            });
            res.json({
                total: total,
                page: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                perfumes: formattedPerfumes
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    },

    // ДИНАМИЧЕСКИЕ ОПЦИИ ДЛЯ ФИЛЬТРОВ
    getFilterOptions: async (req, res) => {
        try {
            const categories = await Perfume.findAll({
                attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('perfume_category')), 'category']],
                raw: true
            });

            const concentration = await Perfume.findAll({
                attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('concentration')), 'concentration']],
                raw: true
            });

            const notes = await Note.findAll({
                attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('note_name')), 'note_name']],
                raw: true
            });

            res.json({
                categories: categories.map(c => c.category).filter(Boolean),
                concentration: concentration.map(c => c.concentration).filter(Boolean),
                notes: notes.map(n => n.note_name).sort()
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    },

    // ПОЛУЧЕНИЕ ПО ID
    getPerfumeById: async (req, res) => {
        try {
            const perfume = await Perfume.findByPk(req.params.id, {
                include: [
                    { model: Brand, as: 'brand' },
                    { model: Note, as: 'notes' },
                    { model: PerfumeVolume, as: 'volumes' }
                ]
            });

            if (!perfume) return res.status(404).json({ error: 'Perfume not found' });
            res.json(perfume);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    //ПОИСК
    searchPerfumes: async (req, res) => {
        try {
            const { q } = req.query;
            const perfumes = await Perfume.findAll({
                where: {
                    [Op.or]: [
                        { name: { [Op.iLike]: `%${q}%` } },
                        { description: { [Op.iLike]: `%${q}%` } }
                    ]
                },
                include: [
                    { model: Brand, as: 'brand' },
                    { model: PerfumeVolume, as: 'volumes' }
                ],
                limit: 8
            });
            res.json(perfumes);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // СОЗДАНИЕ
    createPerfume: async (req, res) => {
        try {
            const { volumes, ...perfumeData } = req.body;

            const perfume = await Perfume.create(perfumeData);

            if (volumes && volumes.length) {
                await Promise.all(
                    volumes.map(v =>
                        PerfumeVolume.create({
                            ...v,
                            perfume_id: perfume.perfume_id
                        })
                    )
                );
            }

            const result = await Perfume.findByPk(perfume.perfume_id, {
                include: [{ model: PerfumeVolume, as: 'volumes' }]
            });

            res.status(201).json(result);

        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // ОБНОВЛЕНИЕ
    updatePerfume: async (req, res) => {
        try {
            const { volumes, ...perfumeData } = req.body;

            const perfume = await Perfume.findByPk(req.params.id);

            if (!perfume) {
                return res.status(404).json({ error: 'Perfume not found' });
            }

            await perfume.update(perfumeData);

            if (volumes && volumes.length) {
                await Promise.all(volumes.map(async v => {
                    if (v.id) {
                        const existing = await PerfumeVolume.findByPk(v.id);
                        if (existing) await existing.update(v);
                    } else {
                        await PerfumeVolume.create({
                            ...v,
                            perfume_id: perfume.perfume_id
                        });
                    }
                }));
            }

            const updated = await Perfume.findByPk(perfume.perfume_id, {
                include: [{ model: PerfumeVolume, as: 'volumes' }]
            });

            res.json(updated);

        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // УДАЛЕНИЕ
    deletePerfume: async (req, res) => {
        try {
            const perfume = await Perfume.findByPk(req.params.id);

            if (!perfume) {
                return res.status(404).json({ error: 'Perfume not found' });
            }

            await perfume.destroy();

            res.status(204).send();

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = perfumeController;