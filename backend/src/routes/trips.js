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
router.get('/:id', getTripValidator, validate, optionalAuth, getTripDetails);
router.get('/:id/seats', getTripValidator, validate, getAvailableSeats);

// Seat locking (public, session-based)
router.post('/:id/lock-seats', lockSeats);
router.post('/:id/release-seats', releaseSeats);

// Operator routes
router.use(protect);
router.use(restrictTo('operator'));
router.use(requireApproval);

router.post('/', createTripValidator, validate, createTrip);
router.get('/my/trips', getMyTrips);
router.put('/:id', updateTripValidator, validate, updateTrip);
router.delete('/:id', cancelTrip);

export default router;
