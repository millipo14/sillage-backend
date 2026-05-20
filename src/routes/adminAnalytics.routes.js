const express = require('express');
const router = express.Router();

const adminAnalyticsController = require('../controllers/adminAnalyticsController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/stats', authMiddleware, adminAnalyticsController.getDashboardStats);

router.get('/charts', authMiddleware, adminAnalyticsController.getRevenueAnalytics);

router.get('/genders', authMiddleware, adminAnalyticsController.getGenderStats);

router.get('/top-perfumes', authMiddleware, adminAnalyticsController.getTopPerfumes);

module.exports = router;