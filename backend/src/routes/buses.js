import express from 'express';
import {
  createBus,
  getBuses,
  getBusById,
  updateBus,
  deleteBus,
  getMyBuses,
  getBusTypes,
  getBusAvailability
} from '../controllers/busController.js';
import { protect, restrictTo, requireApproval, optionalAuth } from '../middlewares/auth.js';

const router = express.Router();

// Public routes
router.get('/types', getBusTypes);

// All other routes require authentication
router.use(protect);

// Admin routes - MUST come before operator routes for '/' path
router.get('/', restrictTo('admin'), getBuses);

// Operator routes
router.post('/', restrictTo('operator'), requireApproval, createBus);
router.get('/my', restrictTo('operator'), requireApproval, getMyBuses);
router.get('/:id', restrictTo('operator'), requireApproval, getBusById);
router.get('/:id/availability', restrictTo('operator', 'admin'), getBusAvailability);
router.put('/:id', restrictTo('operator'), requireApproval, updateBus);
router.delete('/:id', restrictTo('operator'), requireApproval, deleteBus);

export default router;
