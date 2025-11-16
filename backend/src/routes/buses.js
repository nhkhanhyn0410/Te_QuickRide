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

// Protected routes - Operator only
router.use(protect);
router.use(restrictTo('operator'));
router.use(requireApproval);

router.post('/', createBus);
router.get('/my', getMyBuses);
router.get('/:id', getBusById);
router.put('/:id', updateBus);
router.delete('/:id', deleteBus);

// Admin routes
router.get('/', restrictTo('admin'), getBuses);

export default router;
