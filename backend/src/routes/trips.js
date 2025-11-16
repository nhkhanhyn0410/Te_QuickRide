import express from 'express';
import {
  searchTrips,
  getTripDetails,
  getAvailableSeats,
  lockSeats,
  releaseSeats,
  createTrip,
  updateTrip,
  cancelTrip,
  getMyTrips
} from '../controllers/tripController.js';
import {
  searchTripsValidator,
  createTripValidator,
  updateTripValidator,
  getTripValidator
} from '../middlewares/validators/tripValidators.js';
import { validate } from '../middlewares/validate.js';
import { protect, restrictTo, requireApproval, optionalAuth } from '../middlewares/auth.js';

const router = express.Router();

// Public routes (with optional auth for better experience)
router.get('/search', searchTripsValidator, validate, optionalAuth, searchTrips);

// Operator routes - must come before /:id routes to avoid conflicts
router.get('/my-trips', protect, restrictTo('operator'), requireApproval, getMyTrips);

// Public parameterized routes
router.get('/:id', getTripValidator, validate, optionalAuth, getTripDetails);
router.get('/:id/seats', getTripValidator, validate, getAvailableSeats);

// Seat locking (public, session-based)
router.post('/:id/lock-seats', lockSeats);
router.post('/:id/release-seats', releaseSeats);

// Operator routes for create/update/delete
router.post('/', protect, restrictTo('operator'), requireApproval, createTripValidator, validate, createTrip);
router.put('/:id', protect, restrictTo('operator'), requireApproval, updateTripValidator, validate, updateTrip);
router.delete('/:id', protect, restrictTo('operator'), requireApproval, cancelTrip);

export default router;
