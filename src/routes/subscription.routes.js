const router = require('express').Router();
const subscriptionController = require('../controllers/subscriptionController');
const authMiddleware = require('../middleware/authMiddleware');

// Публичные маршруты (тарифы)
router.get('/plans', subscriptionController.getAllPlans);

// Защищенные маршруты (требуют авторизации)
router.use(authMiddleware);
router.post('/', subscriptionController.createSubscription);
router.get('/', subscriptionController.getUserSubscriptions);
router.get('/active', subscriptionController.getActiveSubscription);
router.get('/samples', subscriptionController.getSubscriptionSamples);
router.get('/recommended', subscriptionController.getRecommendedSamples);
router.put('/:subscription_id/status', subscriptionController.updateSubscriptionStatus);
router.post('/:subscription_id/samples', subscriptionController.selectSamples);
router.get('/admin/all', subscriptionController.getAllSubscriptions)

module.exports = router;