const router = require('express').Router();
const sampleController = require('../controllers/sampleController');
const authMiddleware = require('../middleware/authMiddleware');

// Публичные маршруты
router.get('/', sampleController.getAllSamples);
router.get('/available', sampleController.getAvailableSamples);
router.get('/:id', sampleController.getSampleById);

// Защищенные маршруты (админ)
router.use(authMiddleware);
router.post('/', sampleController.createSample);
router.put('/:id', sampleController.updateSample);
router.delete('/:id', sampleController.deleteSample);

module.exports = router;