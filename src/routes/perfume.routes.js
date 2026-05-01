const router = require('express').Router();
const perfumeController = require('../controllers/perfumeController');

router.get('/', perfumeController.getAllPerfumes);
router.get('/search', perfumeController.searchPerfumes);
router.get('/filters', perfumeController.getFilterOptions)
router.get('/:id', perfumeController.getPerfumeById);
router.post('/', perfumeController.createPerfume);
router.put('/:id', perfumeController.updatePerfume);
router.delete('/:id', perfumeController.deletePerfume);

module.exports = router;