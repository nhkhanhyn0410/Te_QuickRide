import express from 'express';
import {
  createPayment,
  vnpayReturn,
  momoCallback,
  zaloPayCallback,
  getPaymentStatus,
  getMyPayments,
  processRefund
} from '../controllers/paymentController.js';
import { protect, restrictTo } from '../middlewares/auth.js';
import { body } from 'express-validator';
import { validate } from '../middlewares/validate.js';

const router = express.Router();

// Payment creation (protected)
router.post('/create',
  protect,
  restrictTo('customer'),
  [
    body('bookingId').notEmpty().withMessage('Booking ID is required').isMongoId().withMessage('Invalid booking ID'),
    body('paymentMethod').notEmpty().withMessage('Payment method is required')
      .isIn(['vnpay', 'momo', 'zalopay', 'cod']).withMessage('Invalid payment method')
  ],
  validate,
  createPayment
);

// Payment gateway callbacks (public - called by payment gateways)
router.get('/vnpay/return', vnpayReturn);
router.post('/momo/callback', momoCallback);
router.post('/zalopay/callback', zaloPayCallback);

// Payment status and history (protected)
router.use(protect);
router.use(restrictTo('customer', 'admin'));

// Specific routes must come before parameterized routes
router.get('/my-payments', getMyPayments);
router.get('/:id/status', getPaymentStatus);

// Refund (admin only)
router.post('/:id/refund', restrictTo('admin'), processRefund);

export default router;
