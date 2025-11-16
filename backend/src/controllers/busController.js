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
