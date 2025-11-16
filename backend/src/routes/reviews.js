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
import { param } from 'express-validator';
import { validate } from '../middlewares/validate.js';

const router = express.Router();

// Public routes with validation
router.get('/trip/:tripId',
  param('tripId').isMongoId().withMessage('Invalid trip ID'),
  validate,
  getTripReviews
);
router.get('/operator/:operatorId',
  param('operatorId').isMongoId().withMessage('Invalid operator ID'),
  validate,
  getOperatorReviews
);

// Protected routes - Customer
router.use(protect);
router.use(restrictTo('customer'));

router.post('/', createReview);
router.get('/my', getMyReviews);
router.put('/:id',
  param('id').isMongoId().withMessage('Invalid review ID'),
  validate,
  updateReview
);
router.delete('/:id',
  param('id').isMongoId().withMessage('Invalid review ID'),
  validate,
  deleteReview
);

// Operator routes
router.post('/:id/respond',
  param('id').isMongoId().withMessage('Invalid review ID'),
  validate,
  restrictTo('operator'),
  respondToReview
);

export default router;
