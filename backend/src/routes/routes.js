import express from 'express';
import {
  createRoute,
  getRoutes,
  getRouteById,
  updateRoute,
  deleteRoute,
  getMyRoutes,
  getPopularRoutes
} from '../controllers/routeController.js';
import { protect, restrictTo, requireApproval, optionalAuth } from '../middlewares/auth.js';

const router = express.Router();

// Public routes
router.get('/popular', getPopularRoutes);

// Protected routes - Operator only
router.use(protect);
router.use(restrictTo('operator'));
router.use(requireApproval);

router.post('/', createRoute);
router.get('/my', getMyRoutes);
router.get('/:id', getRouteById);
router.put('/:id', updateRoute);
router.delete('/:id', deleteRoute);

// Admin routes
router.get('/', restrictTo('admin'), getRoutes);

export default router;
