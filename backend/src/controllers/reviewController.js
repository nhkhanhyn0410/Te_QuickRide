import asyncHandler from '../utils/asyncHandler.js';
import { successResponse, paginatedResponse } from '../utils/response.js';
import {
  NotFoundError,
  BadRequestError,
  AuthorizationError,
  ConflictError
} from '../utils/errors.js';
import { Review, Booking, Trip } from '../models/index.js';

/**
 * @desc    Create review for a trip
 * @route   POST /api/reviews
 * @access  Private (Customer)
 */
export const createReview = asyncHandler(async (req, res) => {
  const {
    tripId,
    bookingId,
    rating,
    title,
    comment,
    serviceRating,
    driverRating,
    vehicleRating,
    punctualityRating,
    images
  } = req.body;

  // Check if booking exists and belongs to user
  const booking = await Booking.findById(bookingId).populate('tripId');

  if (!booking) {
    throw new NotFoundError('Booking not found');
  }

  if (booking.customerId.toString() !== req.user._id.toString()) {
    throw new AuthorizationError('You can only review your own bookings');
  }

  // Check if trip is completed
  if (booking.status !== 'completed') {
    throw new BadRequestError('You can only review completed trips');
  }

  // Check if trip matches
  if (booking.tripId._id.toString() !== tripId) {
    throw new BadRequestError('Trip does not match booking');
  }

  // Check if review already exists
  const existingReview = await Review.findOne({
    customerId: req.user._id,
    tripId
  });

  if (existingReview) {
    throw new ConflictError('You have already reviewed this trip');
  }

  // Create review
  const review = await Review.create({
    customerId: req.user._id,
    tripId,
    operatorId: booking.operatorId,
    bookingId,
    rating,
    title,
    comment,
    serviceRating,
    driverRating,
    vehicleRating,
    punctualityRating,
    images,
    isApproved: true // Auto-approve for now, can add moderation later
  });

  // Populate review details
  await review.populate('customerId', 'fullName avatar');

  successResponse(res, { review }, 'Review created successfully', 201);
});

/**
 * @desc    Get reviews for a trip
 * @route   GET /api/reviews/trip/:tripId
 * @access  Public
 */
export const getTripReviews = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, sortBy = 'createdAt' } = req.query;

  const query = {
    tripId: req.params.tripId,
    isApproved: true,
    isHidden: false
  };

  const total = await Review.countDocuments(query);

  const reviews = await Review.find(query)
    .populate('customerId', 'fullName avatar loyaltyTier')
    .sort({ [sortBy]: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  // Calculate rating statistics
  const stats = await Review.aggregate([
    { $match: query },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
        rating5: { $sum: { $cond: [{ $eq: ['$rating', 5] }, 1, 0] } },
        rating4: { $sum: { $cond: [{ $eq: ['$rating', 4] }, 1, 0] } },
        rating3: { $sum: { $cond: [{ $eq: ['$rating', 3] }, 1, 0] } },
        rating2: { $sum: { $cond: [{ $eq: ['$rating', 2] }, 1, 0] } },
        rating1: { $sum: { $cond: [{ $eq: ['$rating', 1] }, 1, 0] } }
      }
    }
  ]);

  paginatedResponse(
    res,
    reviews,
    page,
    limit,
    total,
    'Reviews retrieved successfully',
    stats.length > 0 ? { statistics: stats[0] } : {}
  );
});

/**
 * @desc    Get reviews for an operator
 * @route   GET /api/reviews/operator/:operatorId
 * @access  Public
 */
export const getOperatorReviews = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, rating } = req.query;

  const query = {
    operatorId: req.params.operatorId,
    isApproved: true,
    isHidden: false
  };

  if (rating) {
    query.rating = parseInt(rating);
  }

  const total = await Review.countDocuments(query);

  const reviews = await Review.find(query)
    .populate('customerId', 'fullName avatar loyaltyTier')
    .populate('tripId', 'tripCode departureTime')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  // Calculate rating statistics
  const stats = await Review.aggregate([
    {
      $match: {
        operatorId: new mongoose.Types.ObjectId(req.params.operatorId),
        isApproved: true,
        isHidden: false
      }
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
        averageServiceRating: { $avg: '$serviceRating' },
        averageDriverRating: { $avg: '$driverRating' },
        averageVehicleRating: { $avg: '$vehicleRating' },
        averagePunctualityRating: { $avg: '$punctualityRating' },
        rating5: { $sum: { $cond: [{ $eq: ['$rating', 5] }, 1, 0] } },
        rating4: { $sum: { $cond: [{ $eq: ['$rating', 4] }, 1, 0] } },
        rating3: { $sum: { $cond: [{ $eq: ['$rating', 3] }, 1, 0] } },
        rating2: { $sum: { $cond: [{ $eq: ['$rating', 2] }, 1, 0] } },
        rating1: { $sum: { $cond: [{ $eq: ['$rating', 1] }, 1, 0] } }
      }
    }
  ]);

  paginatedResponse(
    res,
    reviews,
    page,
    limit,
    total,
    'Reviews retrieved successfully',
    stats.length > 0 ? { statistics: stats[0] } : {}
  );
});

/**
 * @desc    Get my reviews
 * @route   GET /api/reviews/my
 * @access  Private (Customer)
 */
export const getMyReviews = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;

  const query = { customerId: req.user._id };

  const total = await Review.countDocuments(query);

  const reviews = await Review.find(query)
    .populate('tripId', 'tripCode departureTime')
    .populate('operatorId', 'companyName logo')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  paginatedResponse(res, reviews, page, limit, total, 'Reviews retrieved successfully');
});

/**
 * @desc    Update review
 * @route   PUT /api/reviews/:id
 * @access  Private (Customer - own review)
 */
export const updateReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    throw new NotFoundError('Review not found');
  }

  // Check if review belongs to user
  if (review.customerId.toString() !== req.user._id.toString()) {
    throw new AuthorizationError('You can only update your own reviews');
  }

  const allowedUpdates = [
    'rating',
    'title',
    'comment',
    'serviceRating',
    'driverRating',
    'vehicleRating',
    'punctualityRating',
    'images'
  ];

  const updates = {};
  Object.keys(req.body).forEach(key => {
    if (allowedUpdates.includes(key)) {
      updates[key] = req.body[key];
    }
  });

  const updatedReview = await Review.findByIdAndUpdate(
    req.params.id,
    updates,
    { new: true, runValidators: true }
  ).populate('customerId', 'fullName avatar');

  successResponse(res, { review: updatedReview }, 'Review updated successfully');
});

/**
 * @desc    Delete review
 * @route   DELETE /api/reviews/:id
 * @access  Private (Customer - own review)
 */
export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    throw new NotFoundError('Review not found');
  }

  // Check if review belongs to user
  if (review.customerId.toString() !== req.user._id.toString()) {
    throw new AuthorizationError('You can only delete your own reviews');
  }

  await review.remove();

  successResponse(res, null, 'Review deleted successfully');
});

/**
 * @desc    Respond to review (Operator)
 * @route   POST /api/reviews/:id/respond
 * @access  Private (Operator)
 */
export const respondToReview = asyncHandler(async (req, res) => {
  const { message } = req.body;

  const review = await Review.findById(req.params.id);

  if (!review) {
    throw new NotFoundError('Review not found');
  }

  // Check if review is for this operator
  if (review.operatorId.toString() !== req.user._id.toString()) {
    throw new AuthorizationError('You can only respond to reviews for your company');
  }

  review.operatorResponse = {
    message,
    respondedAt: new Date(),
    respondedBy: req.user._id
  };

  await review.save();

  successResponse(res, { review }, 'Response added successfully');
});
