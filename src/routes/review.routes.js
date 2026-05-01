const router = require('express').Router();
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');

// Публичные маршруты
router.get('/perfume/:perfume_id', reviewController.getReviewsByPerfume);

// Защищенные маршруты
router.use(authMiddleware);
router.post('/', reviewController.createReview);
router.get('/my', reviewController.getUserReviews);
router.put('/:id', reviewController.updateReview);
router.delete('/:id', reviewController.deleteReview);

module.exports = router;