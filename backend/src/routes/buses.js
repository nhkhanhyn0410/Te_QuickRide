import express from 'express';
import {
  createBus,
  getBuses,
  getBusById,
  updateBus,
  deleteBus,
  getMyBuses
} from '../controllers/busController.js';
import { protect, restrictTo, requireApproval } from '../middlewares/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Admin routes - MUST come before operator routes for '/' path
router.get('/', restrictTo('admin'), getBuses);

// Operator routes
router.post('/', restrictTo('operator'), requireApproval, createBus);
router.get('/my', restrictTo('operator'), requireApproval, getMyBuses);
router.get('/:id', restrictTo('operator'), requireApproval, getBusById);
router.put('/:id', restrictTo('operator'), requireApproval, updateBus);
router.delete('/:id', restrictTo('operator'), requireApproval, deleteBus);

export default router;
