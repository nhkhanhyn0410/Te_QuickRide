import asyncHandler from '../utils/asyncHandler.js';
import { successResponse, paginatedResponse } from '../utils/response.js';
import {
  NotFoundError,
  BadRequestError,
  AuthorizationError,
  ConflictError
} from '../utils/errors.js';
import { Bus } from '../models/index.js';

/**
 * @desc    Create new bus
 * @route   POST /api/buses
 * @access  Private (Operator)
 */
export const createBus = asyncHandler(async (req, res) => {
  const {
    busNumber,
    busType,
    totalSeats,
    seatLayout,
    amenities,
    images,
    isActive
  } = req.body;

  // Check if bus number already exists for this operator
  const existingBus = await Bus.findOne({
    operatorId: req.user._id,
    busNumber
  });

  if (existingBus) {
    throw new ConflictError('Bus number already exists');
  }

  // Create bus
  const bus = await Bus.create({
    operatorId: req.user._id,
    busNumber,
    busType,
    totalSeats,
    seatLayout,
    amenities,
    images,
    isActive: isActive !== undefined ? isActive : true
  });

  successResponse(res, { bus }, 'Bus created successfully', 201);
});

/**
 * @desc    Get all buses for operator
 * @route   GET /api/buses/my
 * @access  Private (Operator)
 */
export const getMyBuses = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, isActive } = req.query;

  const query = { operatorId: req.user._id };

  if (isActive !== undefined) {
    query.isActive = isActive === 'true';
  }

  const total = await Bus.countDocuments(query);

  const buses = await Bus.find(query)
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  paginatedResponse(res, buses, page, limit, total, 'Buses retrieved successfully');
});

/**
 * @desc    Get bus by ID
 * @route   GET /api/buses/:id
 * @access  Private (Operator)
 */
export const getBusById = asyncHandler(async (req, res) => {
  const bus = await Bus.findById(req.params.id);

  if (!bus) {
    throw new NotFoundError('Bus not found');
  }

  // Check if bus belongs to operator
  if (bus.operatorId.toString() !== req.user._id.toString()) {
    throw new AuthorizationError('You are not authorized to access this bus');
  }

  successResponse(res, { bus }, 'Bus retrieved successfully');
});

/**
 * @desc    Update bus
 * @route   PUT /api/buses/:id
 * @access  Private (Operator)
 */
export const updateBus = asyncHandler(async (req, res) => {
  const bus = await Bus.findById(req.params.id);

  if (!bus) {
    throw new NotFoundError('Bus not found');
  }

  // Check if bus belongs to operator
  if (bus.operatorId.toString() !== req.user._id.toString()) {
    throw new AuthorizationError('You are not authorized to update this bus');
  }

  const allowedUpdates = [
    'busNumber',
    'busType',
    'totalSeats',
    'seatLayout',
    'amenities',
    'images',
    'isActive'
  ];

  const updates = {};
  Object.keys(req.body).forEach(key => {
    if (allowedUpdates.includes(key)) {
      updates[key] = req.body[key];
    }
  });

  // If updating bus number, check for duplicates
  if (updates.busNumber && updates.busNumber !== bus.busNumber) {
    const existingBus = await Bus.findOne({
      operatorId: req.user._id,
      busNumber: updates.busNumber,
      _id: { $ne: req.params.id }
    });

    if (existingBus) {
      throw new ConflictError('Bus number already exists');
    }
  }

  const updatedBus = await Bus.findByIdAndUpdate(
    req.params.id,
    updates,
    { new: true, runValidators: true }
  );

  successResponse(res, { bus: updatedBus }, 'Bus updated successfully');
});

/**
 * @desc    Delete bus
 * @route   DELETE /api/buses/:id
 * @access  Private (Operator)
 */
export const deleteBus = asyncHandler(async (req, res) => {
  const bus = await Bus.findById(req.params.id);

  if (!bus) {
    throw new NotFoundError('Bus not found');
  }

  // Check if bus belongs to operator
  if (bus.operatorId.toString() !== req.user._id.toString()) {
    throw new AuthorizationError('You are not authorized to delete this bus');
  }

  // Soft delete - mark as inactive instead of removing
  bus.isActive = false;
  await bus.save();

  successResponse(res, null, 'Bus deleted successfully');
});

/**
 * @desc    Get all buses (Admin)
 * @route   GET /api/buses
 * @access  Private (Admin)
 */
export const getBuses = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, operatorId } = req.query;

  const query = {};
  if (operatorId) {
    query.operatorId = operatorId;
  }

  const total = await Bus.countDocuments(query);

  const buses = await Bus.find(query)
    .populate('operatorId', 'companyName email')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  paginatedResponse(res, buses, page, limit, total, 'Buses retrieved successfully');
});

/**
 * @desc    Get bus types
 * @route   GET /api/buses/types
 * @access  Public
 */
export const getBusTypes = asyncHandler(async (req, res) => {
  const busTypes = [
    {
      type: 'Ghế ngồi',
      description: 'Xe khách ghế ngồi thông thường',
      seatCapacity: '29-45 chỗ',
      icon: 'chair'
    },
    {
      type: 'Giường nằm',
      description: 'Xe khách giường nằm cao cấp',
      seatCapacity: '24-40 chỗ',
      icon: 'bed'
    },
    {
      type: 'Limousine',
      description: 'Xe limousine sang trọng',
      seatCapacity: '9-18 chỗ',
      icon: 'luxury'
    },
    {
      type: 'Ghế ngồi 2 tầng',
      description: 'Xe khách 2 tầng ghế ngồi',
      seatCapacity: '40-50 chỗ',
      icon: 'double-decker'
    },
    {
      type: 'Giường nằm 2 tầng',
      description: 'Xe khách 2 tầng giường nằm',
      seatCapacity: '34-46 chỗ',
      icon: 'double-decker-bed'
    }
  ];

  successResponse(res, { busTypes }, 'Bus types retrieved successfully');
});

/**
 * @desc    Get bus availability for date range
 * @route   GET /api/buses/:id/availability
 * @access  Private (Operator)
 */
export const getBusAvailability = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { startDate, endDate } = req.query;

  const bus = await Bus.findById(id);

  if (!bus) {
    throw new NotFoundError('Bus not found');
  }

  // Check if bus belongs to operator
  if (req.userType === 'operator' && bus.operatorId.toString() !== req.user._id.toString()) {
    throw new AuthorizationError('You can only check availability of your own buses');
  }

  // Import Trip model
  const { Trip } = await import('../models/index.js');

  // Find trips assigned to this bus in the date range
  const query = {
    busId: id,
    status: { $in: ['scheduled', 'boarding', 'in_progress'] }
  };

  if (startDate || endDate) {
    query.departureTime = {};
    if (startDate) {
      query.departureTime.$gte = new Date(startDate);
    }
    if (endDate) {
      query.departureTime.$lte = new Date(endDate);
    }
  }

  const scheduledTrips = await Trip.find(query)
    .populate('routeId', 'routeName origin destination')
    .sort({ departureTime: 1 });

  const availability = {
    bus: {
      id: bus._id,
      busNumber: bus.busNumber,
      busType: bus.busType,
      totalSeats: bus.totalSeats
    },
    scheduledTrips: scheduledTrips.map(trip => ({
      tripId: trip._id,
      tripCode: trip.tripCode,
      route: trip.routeId,
      departureTime: trip.departureTime,
      arrivalTime: trip.arrivalTime,
      status: trip.status
    })),
    totalScheduledTrips: scheduledTrips.length,
    isAvailable: scheduledTrips.length === 0
  };

  successResponse(res, availability, 'Bus availability retrieved successfully');
});
