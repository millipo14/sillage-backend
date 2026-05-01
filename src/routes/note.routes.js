const router = require('express').Router();
const noteController = require('../controllers/noteController');

router.get('/perfume/:perfumeId', noteController.getNotesByPerfume);
router.post('/perfume/:perfumeId', noteController.addNoteToPerfume);
router.put('/:id', noteController.updateNote);
router.delete('/:id', noteController.deleteNote);

module.exports = router;