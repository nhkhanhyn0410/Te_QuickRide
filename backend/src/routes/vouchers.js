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
import { param } from 'express-validator';
import { validate } from '../middlewares/validate.js';

const router = express.Router();

// Public routes - specific routes first
router.get('/available', optionalAuth, getAvailableVouchers);

// Protected routes - Customer
router.post('/validate', protect, restrictTo('customer'), validateVoucher);

// Admin routes - specific routes before parameterized routes
router.post('/', protect, restrictTo('admin'), createVoucher);
router.get('/', protect, restrictTo('admin'), getAllVouchers);

// Routes with parameters - specific patterns before generic patterns
router.get('/:id/statistics',
  param('id').isMongoId().withMessage('Invalid voucher ID'),
  validate,
  protect,
  restrictTo('admin'),
  getVoucherStatistics
);
router.put('/:id',
  param('id').isMongoId().withMessage('Invalid voucher ID'),
  validate,
  protect,
  restrictTo('admin'),
  updateVoucher
);
router.delete('/:id',
  param('id').isMongoId().withMessage('Invalid voucher ID'),
  validate,
  protect,
  restrictTo('admin'),
  deleteVoucher
);

// Generic parameterized route last - public route (code can be any string, not just ObjectId)
router.get('/:code', getVoucherByCode);

export default router;
