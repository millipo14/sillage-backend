const { Note, Perfume } = require('../models');

const noteController = {
    getNotesByPerfume: async (req, res) => {
        try {
            const notes = await Note.findAll({
                where: { perfume_id: req.params.perfumeId },
                include: [{ model: Perfume, as: 'perfume' }]
            });
            res.json(notes);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    addNoteToPerfume: async (req, res) => {
        try {
            const note = await Note.create({
                perfume_id: req.params.perfumeId,
                ...req.body
            });
            res.status(201).json(note);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    updateNote: async (req, res) => {
        try {
            const note = await Note.findByPk(req.params.id);
            if (!note) {
                return res.status(404).json({ error: 'Note not found' });
            }
            await note.update(req.body);
            res.json(note);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    deleteNote: async (req, res) => {
        try {
            const note = await Note.findByPk(req.params.id);
            if (!note) {
                return res.status(404).json({ error: 'Note not found' });
            }
            await note.destroy();
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = noteController;