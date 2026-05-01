const router = require('express').Router();
const recommendationController = require('../controllers/recommendationController');
const authMiddleware = require('../middleware/authMiddleware');

// Публичные маршруты
router.get('/popular', recommendationController.getPopularPerfumes);
router.get('/new', recommendationController.getNewPerfumes);

// Защищенные маршруты
router.get('/', authMiddleware, recommendationController.getRecommendations);

module.exports = router;