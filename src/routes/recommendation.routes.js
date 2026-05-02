const router = require('express').Router();
const recommendationController = require('../controllers/recommendationController');
const authMiddleware = require('../middleware/authMiddleware');

// Защищенные маршруты
router.get('/', authMiddleware, recommendationController.getRecommendations);

module.exports = router;