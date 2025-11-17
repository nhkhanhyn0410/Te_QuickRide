import express from 'express';
import {
  createBooking,
  getBookingDetails,
  getMyBookings,
  getOperatorBookings,
  getAllBookings,
  cancelBooking,
  confirmBooking,
  checkinBooking
} from '../controllers/bookingController.js';
import {
  createBookingValidator,
  getBookingValidator,
  cancelBookingValidator
} from '../middlewares/validators/bookingValidators.js';
import { validate } from '../middlewares/validate.js';
import { protect, restrictTo } from '../middlewares/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Customer routes
router.post('/', restrictTo('customer'), createBookingValidator, validate, createBooking);
router.get('/my-bookings', restrictTo('customer'), getMyBookings);
router.put('/:id/cancel', restrictTo('customer'), getBookingValidator, cancelBookingValidator, validate, cancelBooking);

// Operator routes
router.get('/operator-bookings', restrictTo('operator'), getOperatorBookings);

// Admin routes - must come before /:id routes to avoid conflicts
router.get('/', restrictTo('admin'), getAllBookings);

// Shared routes (customer or operator can view)
router.get('/:id', getBookingValidator, validate, getBookingDetails);

// Payment confirmation (customer)
router.put('/:id/confirm', restrictTo('customer'), confirmBooking);

// Check-in (staff/trip manager)
router.put('/:id/checkin', checkinBooking);

export default router;
