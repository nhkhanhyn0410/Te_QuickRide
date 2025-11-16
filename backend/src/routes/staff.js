import express from 'express';
import {
  createStaff,
  getMyStaff,
  getStaffById,
  updateStaff,
  deleteStaff,
  assignTripToStaff,
  getStaffTrips
} from '../controllers/staffController.js';
import { protect, restrictTo, requireApproval } from '../middlewares/auth.js';

const router = express.Router();

// Protected routes - Operator only
router.use(protect);
router.use(restrictTo('operator'));
router.use(requireApproval);

router.post('/', createStaff);
router.get('/my', getMyStaff);
router.get('/:id', getStaffById);
router.put('/:id', updateStaff);
router.delete('/:id', deleteStaff);
router.post('/:id/assign-trip', assignTripToStaff);
router.get('/:id/trips', getStaffTrips);

export default router;
