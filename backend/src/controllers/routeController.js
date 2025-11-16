import asyncHandler from '../utils/asyncHandler.js';
import { successResponse, paginatedResponse } from '../utils/response.js';
import {
  NotFoundError,
  BadRequestError,
  AuthorizationError
} from '../utils/errors.js';
import { Route, Trip } from '../models/index.js';

/**
 * @desc    Create new route
 * @route   POST /api/routes
 * @access  Private (Operator)
 */
export const createRoute = asyncHandler(async (req, res) => {
  const {
    routeName,
    origin,
    destination,
    distance,
    estimatedDuration,
    pickupPoints,
    dropoffPoints
  } = req.body;

  // Create route
  const route = await Route.create({
    operatorId: req.user._id,
    routeName,
    origin,
    destination,
    distance,
    estimatedDuration,
    pickupPoints,
    dropoffPoints,
    isActive: true
  });

  successResponse(res, { route }, 'Route created successfully', 201);
});

/**
 * @desc    Get all routes for operator
 * @route   GET /api/routes/my
 * @access  Private (Operator)
 */
export const getMyRoutes = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, isActive } = req.query;

  const query = { operatorId: req.user._id };

  if (isActive !== undefined) {
    query.isActive = isActive === 'true';
  }

  const total = await Route.countDocuments(query);

  const routes = await Route.find(query)
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  paginatedResponse(res, routes, page, limit, total, 'Routes retrieved successfully');
});

/**
 * @desc    Get route by ID
 * @route   GET /api/routes/:id
 * @access  Private (Operator)
 */
export const getRouteById = asyncHandler(async (req, res) => {
  const route = await Route.findById(req.params.id);

  if (!route) {
    throw new NotFoundError('Route not found');
  }

  // Check if route belongs to operator
  if (route.operatorId.toString() !== req.user._id.toString()) {
    throw new AuthorizationError('You are not authorized to access this route');
  }

  successResponse(res, { route }, 'Route retrieved successfully');
});

/**
 * @desc    Update route
 * @route   PUT /api/routes/:id
 * @access  Private (Operator)
 */
export const updateRoute = asyncHandler(async (req, res) => {
  const route = await Route.findById(req.params.id);

  if (!route) {
    throw new NotFoundError('Route not found');
  }

  // Check if route belongs to operator
  if (route.operatorId.toString() !== req.user._id.toString()) {
    throw new AuthorizationError('You are not authorized to update this route');
  }

  const allowedUpdates = [
    'routeName',
    'origin',
    'destination',
    'distance',
    'estimatedDuration',
    'pickupPoints',
    'dropoffPoints',
    'isActive'
  ];

  const updates = {};
  Object.keys(req.body).forEach(key => {
    if (allowedUpdates.includes(key)) {
      updates[key] = req.body[key];
    }
  });

  const updatedRoute = await Route.findByIdAndUpdate(
    req.params.id,
    updates,
    { new: true, runValidators: true }
  );

  successResponse(res, { route: updatedRoute }, 'Route updated successfully');
});

/**
 * @desc    Delete route
 * @route   DELETE /api/routes/:id
 * @access  Private (Operator)
 */
export const deleteRoute = asyncHandler(async (req, res) => {
  const route = await Route.findById(req.params.id);

  if (!route) {
    throw new NotFoundError('Route not found');
  }

  // Check if route belongs to operator
  if (route.operatorId.toString() !== req.user._id.toString()) {
    throw new AuthorizationError('You are not authorized to delete this route');
  }

  // Check if route has active trips
  const activeTrips = await Trip.countDocuments({
    routeId: req.params.id,
    status: { $in: ['scheduled', 'boarding'] }
  });

  if (activeTrips > 0) {
    throw new BadRequestError('Cannot delete route with active trips');
  }

  // Soft delete - mark as inactive
  route.isActive = false;
  await route.save();

  successResponse(res, null, 'Route deleted successfully');
});

/**
 * @desc    Get all routes (Admin)
 * @route   GET /api/routes
 * @access  Private (Admin)
 */
export const getRoutes = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, operatorId } = req.query;

  const query = {};
  if (operatorId) {
    query.operatorId = operatorId;
  }

  const total = await Route.countDocuments(query);

  const routes = await Route.find(query)
    .populate('operatorId', 'companyName email')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  paginatedResponse(res, routes, page, limit, total, 'Routes retrieved successfully');
});

/**
 * @desc    Get popular routes
 * @route   GET /api/routes/popular
 * @access  Public
 */
export const getPopularRoutes = asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;

  // Get routes with most trips
  const routes = await Route.aggregate([
    { $match: { isActive: true } },
    {
      $lookup: {
        from: 'trips',
        localField: '_id',
        foreignField: 'routeId',
        as: 'trips'
      }
    },
    {
      $addFields: {
        tripCount: { $size: '$trips' }
      }
    },
    { $sort: { tripCount: -1 } },
    { $limit: parseInt(limit) },
    {
      $project: {
        routeName: 1,
        origin: 1,
        destination: 1,
        distance: 1,
        estimatedDuration: 1,
        tripCount: 1
      }
    }
  ]);

  successResponse(res, { routes }, 'Popular routes retrieved successfully');
});
