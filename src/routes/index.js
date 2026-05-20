const router = require('express').Router();
const brandRoutes = require('./brand.routes');
const perfumeRoutes = require('./perfume.routes');
const noteRoutes = require('./note.routes');
const userRoutes = require('./user.routes');
const orderRoutes = require('./order.routes');
const subscriptionRoutes = require('./subscription.routes');
const sampleRoutes = require('./sample.routes');
const reviewRoutes = require('./review.routes');
const preferenceRoutes = require('./preference.routes');
const recommendationRoutes = require('./recommendation.routes');
const adminAnalyticsRoutes = require('./adminAnalytics.routes');

router.use('/brands', brandRoutes);
router.use('/perfumes', perfumeRoutes);
router.use('/notes', noteRoutes);
router.use('/users', userRoutes);
router.use('/orders', orderRoutes);
router.use('/subscriptions', subscriptionRoutes);
router.use('/samples', sampleRoutes);
router.use('/reviews', reviewRoutes);
router.use('/preferences', preferenceRoutes);
router.use('/recommendations', recommendationRoutes);
router.use('/admin/analytics', adminAnalyticsRoutes);

module.exports = router;