import express from 'express';
import {
  createRoute,
  getRoutes,
  getRouteById,
  updateRoute,
  deleteRoute,
  getMyRoutes,
  getPopularRoutes,
  getPublicRoutes
} from '../controllers/routeController.js';
import { protect, restrictTo, requireApproval, optionalAuth } from '../middlewares/auth.js';

const router = express.Router();

// Public routes - MUST come before protect middleware
router.get('/popular', getPopularRoutes);
router.get('/public', getPublicRoutes);

// Protected routes
router.use(protect);

// Admin routes - MUST come before operator routes for '/' path
router.get('/', restrictTo('admin'), getRoutes);

// Operator routes
router.post('/', restrictTo('operator'), requireApproval, createRoute);
router.get('/my', restrictTo('operator'), requireApproval, getMyRoutes);
router.get('/:id', restrictTo('operator'), requireApproval, getRouteById);
router.put('/:id', restrictTo('operator'), requireApproval, updateRoute);
router.delete('/:id', restrictTo('operator'), requireApproval, deleteRoute);

export default router;
