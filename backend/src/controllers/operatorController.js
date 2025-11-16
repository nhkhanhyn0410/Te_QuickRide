import asyncHandler from '../utils/asyncHandler.js';
import { successResponse, paginatedResponse } from '../utils/response.js';
import { ConflictError, NotFoundError, AuthorizationError, BadRequestError } from '../utils/errors.js';
import { generateTokenPair } from '../utils/jwt.js';
import { BusOperator, Route, Bus } from '../models/index.js';

/**
 * @desc    Register new bus operator
 * @route   POST /api/operators/register
 * @access  Public
 */
export const registerOperator = asyncHandler(async (req, res) => {
  const {
    companyName,
    email,
    phone,
    password,
    businessLicense,
    taxCode,
    address,
    bankAccount
  } = req.body;

  // Check if operator already exists
  const existingOperator = await BusOperator.findOne({
    $or: [{ email }, { companyName }]
  });

  if (existingOperator) {
    if (existingOperator.email === email) {
      throw new ConflictError('Email already registered');
    }
    if (existingOperator.companyName === companyName) {
      throw new ConflictError('Company name already registered');
    }
  }

  // Create operator
  const operator = await BusOperator.create({
    companyName,
    email,
    phone,
    password,
    businessLicense,
    taxCode,
    address,
    bankAccount,
    verificationStatus: 'pending'
  });

  successResponse(res, {
    operator: {
      id: operator._id,
      companyName: operator.companyName,
      email: operator.email,
      verificationStatus: operator.verificationStatus
    },
    message: 'Registration submitted. Please wait for admin approval.'
  }, 'Registration successful', 201);
});

/**
 * @desc    Get operator profile
 * @route   GET /api/operators/profile
 * @access  Private (Operator)
 */
export const getOperatorProfile = asyncHandler(async (req, res) => {
  const operator = await BusOperator.findById(req.user._id);
  successResponse(res, { operator }, 'Profile retrieved successfully');
});

/**
 * @desc    Update operator profile
 * @route   PUT /api/operators/profile
 * @access  Private (Operator)
 */
export const updateOperatorProfile = asyncHandler(async (req, res) => {
  const allowedUpdates = ['phone', 'description', 'website', 'logo', 'address', 'bankAccount'];
  const updates = {};

  Object.keys(req.body).forEach(key => {
    if (allowedUpdates.includes(key)) {
      updates[key] = req.body[key];
    }
  });

  const operator = await BusOperator.findByIdAndUpdate(
    req.user._id,
    updates,
    { new: true, runValidators: true }
  );

  successResponse(res, { operator }, 'Profile updated successfully');
});

/**
 * @desc    Get all operators (Admin)
 * @route   GET /api/operators
 * @access  Private (Admin)
 */
export const getAllOperators = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, verificationStatus } = req.query;

  const query = {};
  if (verificationStatus) {
    query.verificationStatus = verificationStatus;
  }

  const total = await BusOperator.countDocuments(query);

  const operators = await BusOperator.find(query)
    .select('-password')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  paginatedResponse(res, operators, page, limit, total, 'Operators retrieved');
});

/**
 * @desc    Approve/Reject operator (Admin)
 * @route   PUT /api/operators/:id/verify
 * @access  Private (Admin)
 */
export const verifyOperator = asyncHandler(async (req, res) => {
  if (req.userType !== 'user' || req.user.role !== 'admin') {
    throw new AuthorizationError('Only admins can verify operators');
  }

  const { status, rejectionReason } = req.body;

  if (!['approved', 'rejected'].includes(status)) {
    throw new BadRequestError('Status must be either approved or rejected');
  }

  const operator = await BusOperator.findById(req.params.id);

  if (!operator) {
    throw new NotFoundError('Operator not found');
  }

  operator.verificationStatus = status;
  operator.verifiedAt = new Date();
  operator.verifiedBy = req.user._id;

  if (status === 'rejected') {
    operator.rejectionReason = rejectionReason;
  }

  await operator.save();

  // TODO: Send notification email to operator

  successResponse(res, { operator }, `Operator ${status} successfully`);
});

/**
 * @desc    Suspend/Unsuspend operator (Admin)
 * @route   PUT /api/operators/:id/suspend
 * @access  Private (Admin)
 */
export const suspendOperator = asyncHandler(async (req, res) => {
  if (req.userType !== 'user' || req.user.role !== 'admin') {
    throw new AuthorizationError('Only admins can suspend operators');
  }

  const { isSuspended, suspensionReason } = req.body;

  const operator = await BusOperator.findById(req.params.id);

  if (!operator) {
    throw new NotFoundError('Operator not found');
  }

  operator.isSuspended = isSuspended;

  if (isSuspended) {
    operator.suspensionReason = suspensionReason;
  } else {
    operator.suspensionReason = undefined;
  }

  await operator.save();

  successResponse(res, { operator }, `Operator ${isSuspended ? 'suspended' : 'unsuspended'} successfully`);
});

/**
 * @desc    Get operator statistics
 * @route   GET /api/operators/statistics
 * @access  Private (Operator)
 */
export const getOperatorStatistics = asyncHandler(async (req, res) => {
  if (req.userType !== 'operator') {
    throw new AuthorizationError('Only operators can access this');
  }

  const operator = await BusOperator.findById(req.user._id);

  // Get route count
  const routeCount = await Route.countDocuments({ operatorId: req.user._id, isActive: true });

  // Get bus count
  const busCount = await Bus.countDocuments({ operatorId: req.user._id, isActive: true });

  successResponse(res, {
    statistics: {
      totalTrips: operator.totalTrips,
      totalRevenue: operator.totalRevenue,
      averageRating: operator.averageRating,
      totalReviews: operator.totalReviews,
      routeCount,
      busCount
    }
  }, 'Statistics retrieved successfully');
});
