import express from 'express';
import {
  registerOperator,
  getOperatorProfile,
  updateOperatorProfile,
  getAllOperators,
  verifyOperator,
  suspendOperator,
  getOperatorStatistics
} from '../controllers/operatorController.js';
import { protect, restrictTo } from '../middlewares/auth.js';

const router = express.Router();

// Public routes
router.post('/register', registerOperator);

// Protected routes
router.use(protect);

// Operator routes
router.get('/profile', restrictTo('operator'), getOperatorProfile);
router.put('/profile', restrictTo('operator'), updateOperatorProfile);
router.get('/statistics', restrictTo('operator'), getOperatorStatistics);

// Admin routes
router.get('/', restrictTo('admin'), getAllOperators);
router.put('/:id/verify', restrictTo('admin'), verifyOperator);
router.put('/:id/suspend', restrictTo('admin'), suspendOperator);

export default router;
