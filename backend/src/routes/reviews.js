import express from 'express';
import {
  createReview,
  getTripReviews,
  getOperatorReviews,
  getMyReviews,
  updateReview,
  deleteReview,
  respondToReview
} from '../controllers/reviewController.js';
import { protect, restrictTo, optionalAuth } from '../middlewares/auth.js';

const router = express.Router();

// Public routes
router.get('/trip/:tripId', getTripReviews);
router.get('/operator/:operatorId', getOperatorReviews);

// Protected routes - Customer
router.use(protect);
router.use(restrictTo('customer'));

router.post('/', createReview);
router.get('/my', getMyReviews);
router.put('/:id', updateReview);
router.delete('/:id', deleteReview);

// Operator routes
router.post('/:id/respond', restrictTo('operator'), respondToReview);

export default router;
