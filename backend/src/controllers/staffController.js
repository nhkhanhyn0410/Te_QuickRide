import asyncHandler from '../utils/asyncHandler.js';
import { successResponse, paginatedResponse } from '../utils/response.js';
import {
  NotFoundError,
  BadRequestError,
  AuthorizationError,
  ConflictError
} from '../utils/errors.js';
import { Staff } from '../models/index.js';
import { Trip } from '../models/index.js';

/**
 * @desc    Create new staff member
 * @route   POST /api/staff
 * @access  Private (Operator)
 */
export const createStaff = asyncHandler(async (req, res) => {
  const {
    fullName,
    phone,
    email,
    password,
    role,
    licenseNumber,
    licenseExpiry,
    dateOfBirth,
    address
  } = req.body;

  // Check if phone already exists for this operator
  const existingStaff = await Staff.findOne({
    operatorId: req.user._id,
    phone
  });

  if (existingStaff) {
    throw new ConflictError('Phone number already registered');
  }

  // Generate employee code
  const employeeCode = await Staff.generateEmployeeCode(req.user._id);

  // Create staff
  const staff = await Staff.create({
    operatorId: req.user._id,
    employeeCode,
    fullName,
    phone,
    email,
    password,
    role,
    licenseNumber,
    licenseExpiry,
    dateOfBirth,
    address,
    status: 'active'
  });

  // Remove password from response
  const staffResponse = staff.toObject();
  delete staffResponse.password;

  successResponse(res, { staff: staffResponse }, 'Staff created successfully', 201);
});

/**
 * @desc    Get all staff for operator
 * @route   GET /api/staff/my
 * @access  Private (Operator)
 */
export const getMyStaff = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, role, status } = req.query;

  const query = { operatorId: req.user._id };

  if (role) {
    query.role = role;
  }

  if (status) {
    query.status = status;
  }

  const total = await Staff.countDocuments(query);

  const staff = await Staff.find(query)
    .select('-password')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  paginatedResponse(res, staff, page, limit, total, 'Staff retrieved successfully');
});

/**
 * @desc    Get staff by ID
 * @route   GET /api/staff/:id
 * @access  Private (Operator)
 */
export const getStaffById = asyncHandler(async (req, res) => {
  const staff = await Staff.findById(req.params.id).select('-password');

  if (!staff) {
    throw new NotFoundError('Staff not found');
  }

  // Check if staff belongs to operator
  if (staff.operatorId.toString() !== req.user._id.toString()) {
    throw new AuthorizationError('You are not authorized to access this staff');
  }

  successResponse(res, { staff }, 'Staff retrieved successfully');
});

/**
 * @desc    Update staff
 * @route   PUT /api/staff/:id
 * @access  Private (Operator)
 */
export const updateStaff = asyncHandler(async (req, res) => {
  const staff = await Staff.findById(req.params.id);

  if (!staff) {
    throw new NotFoundError('Staff not found');
  }

  // Check if staff belongs to operator
  if (staff.operatorId.toString() !== req.user._id.toString()) {
    throw new AuthorizationError('You are not authorized to update this staff');
  }

  const allowedUpdates = [
    'fullName',
    'phone',
    'email',
    'role',
    'licenseNumber',
    'licenseExpiry',
    'dateOfBirth',
    'address',
    'status',
    'avatar'
  ];

  const updates = {};
  Object.keys(req.body).forEach(key => {
    if (allowedUpdates.includes(key)) {
      updates[key] = req.body[key];
    }
  });

  // If updating phone, check for duplicates
  if (updates.phone && updates.phone !== staff.phone) {
    const existingStaff = await Staff.findOne({
      operatorId: req.user._id,
      phone: updates.phone,
      _id: { $ne: req.params.id }
    });

    if (existingStaff) {
      throw new ConflictError('Phone number already registered');
    }
  }

  const updatedStaff = await Staff.findByIdAndUpdate(
    req.params.id,
    updates,
    { new: true, runValidators: true }
  ).select('-password');

  successResponse(res, { staff: updatedStaff }, 'Staff updated successfully');
});

/**
 * @desc    Delete staff
 * @route   DELETE /api/staff/:id
 * @access  Private (Operator)
 */
export const deleteStaff = asyncHandler(async (req, res) => {
  const staff = await Staff.findById(req.params.id);

  if (!staff) {
    throw new NotFoundError('Staff not found');
  }

  // Check if staff belongs to operator
  if (staff.operatorId.toString() !== req.user._id.toString()) {
    throw new AuthorizationError('You are not authorized to delete this staff');
  }

  // Soft delete - mark as inactive
  staff.status = 'inactive';
  await staff.save();

  successResponse(res, null, 'Staff deleted successfully');
});

/**
 * @desc    Assign trip to staff
 * @route   POST /api/staff/:id/assign-trip
 * @access  Private (Operator)
 */
export const assignTripToStaff = asyncHandler(async (req, res) => {
  const { tripId } = req.body;

  const staff = await Staff.findById(req.params.id);

  if (!staff) {
    throw new NotFoundError('Staff not found');
  }

  // Check if staff belongs to operator
  if (staff.operatorId.toString() !== req.user._id.toString()) {
    throw new AuthorizationError('You are not authorized to assign trips to this staff');
  }

  const trip = await Trip.findById(tripId);

  if (!trip) {
    throw new NotFoundError('Trip not found');
  }

  // Check if trip belongs to operator
  if (trip.operatorId.toString() !== req.user._id.toString()) {
    throw new AuthorizationError('You are not authorized to assign this trip');
  }

  // Assign based on role
  if (staff.role === 'driver') {
    trip.driverId = staff._id;
  } else if (staff.role === 'trip_manager') {
    trip.managerId = staff._id;
  }

  await trip.save();

  successResponse(res, { trip }, 'Trip assigned successfully');
});

/**
 * @desc    Get staff trips
 * @route   GET /api/staff/:id/trips
 * @access  Private (Operator)
 */
export const getStaffTrips = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;

  const staff = await Staff.findById(req.params.id);

  if (!staff) {
    throw new NotFoundError('Staff not found');
  }

  // Check if staff belongs to operator
  if (staff.operatorId.toString() !== req.user._id.toString()) {
    throw new AuthorizationError('You are not authorized to access this staff trips');
  }

  const query = {
    operatorId: req.user._id
  };

  if (staff.role === 'driver') {
    query.driverId = staff._id;
  } else if (staff.role === 'trip_manager') {
    query.managerId = staff._id;
  }

  const total = await Trip.countDocuments(query);

  const trips = await Trip.find(query)
    .populate('routeId', 'routeName origin destination')
    .populate('busId', 'busNumber busType')
    .sort({ departureTime: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  paginatedResponse(res, trips, page, limit, total, 'Staff trips retrieved successfully');
});
