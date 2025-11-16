import express from 'express';
import {
  createVoucher,
  getAllVouchers,
  getAvailableVouchers,
  validateVoucher,
  getVoucherByCode,
  updateVoucher,
  deleteVoucher,
  getVoucherStatistics
} from '../controllers/voucherController.js';
import { protect, restrictTo, optionalAuth } from '../middlewares/auth.js';

const router = express.Router();

// Public routes
router.get('/available', optionalAuth, getAvailableVouchers);
router.get('/:code', getVoucherByCode);

// Protected routes - Customer
router.use(protect);
router.post('/validate', restrictTo('customer'), validateVoucher);

// Admin routes
router.use(restrictTo('admin'));
router.post('/', createVoucher);
router.get('/', getAllVouchers);
router.put('/:id', updateVoucher);
router.delete('/:id', deleteVoucher);
router.get('/:id/statistics', getVoucherStatistics);

export default router;
