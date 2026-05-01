const { Brand, Perfume } = require('../models');

const brandController = {
    getAllBrands: async (req, res) => {
        try {
            const brands = await Brand.findAll({
                include: [{
                    model: Perfume,
                    as: 'perfumes',
                    attributes: ['perfume_id', 'name', 'image_url']
                }]
            });
            res.json(brands);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getBrandById: async (req, res) => {
        try {
            const brand = await Brand.findByPk(req.params.id, {
                include: [{
                    model: Perfume,
                    as: 'perfumes',
                    include: ['notes']
                }]
            });
            if (!brand) {
                return res.status(404).json({ error: 'Brand not found' });
            }
            res.json(brand);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    createBrand: async (req, res) => {
        try {
            const brand = await Brand.create(req.body);
            res.status(201).json(brand);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    updateBrand: async (req, res) => {
        try {
            const brand = await Brand.findByPk(req.params.id);
            if (!brand) {
                return res.status(404).json({ error: 'Brand not found' });
            }
            await brand.update(req.body);
            res.json(brand);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    deleteBrand: async (req, res) => {
        try {
            const brand = await Brand.findByPk(req.params.id);
            if (!brand) {
                return res.status(404).json({ error: 'Brand not found' });
            }
            await brand.destroy();
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = brandController;