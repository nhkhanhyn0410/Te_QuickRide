import express from 'express';
import {
  getDashboardStats,
  getRevenueAnalytics,
  getBookingAnalytics,
  getUserGrowthAnalytics,
  getOperatorPerformance,
  getRouteAnalytics,
  getTopRoutes,
  getCommissionAnalytics,
  exportAnalytics
} from '../controllers/analyticsController.js';
import { protect, restrictTo } from '../middlewares/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Admin-only routes
router.get('/dashboard', restrictTo('admin'), getDashboardStats);
router.get('/revenue', restrictTo('admin'), getRevenueAnalytics);
router.get('/bookings', restrictTo('admin'), getBookingAnalytics);
router.get('/user-growth', restrictTo('admin'), getUserGrowthAnalytics);
router.get('/routes', restrictTo('admin'), getRouteAnalytics);
router.get('/top-routes', restrictTo('admin'), getTopRoutes);
router.get('/commission', restrictTo('admin'), getCommissionAnalytics);
router.get('/export/:type', restrictTo('admin'), exportAnalytics);

// Admin or Operator routes
router.get('/operator-performance', restrictTo('admin', 'operator'), getOperatorPerformance);

export default router;
