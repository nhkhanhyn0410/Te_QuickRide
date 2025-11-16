import asyncHandler from '../utils/asyncHandler.js';
import { successResponse, paginatedResponse } from '../utils/response.js';
import {
  NotFoundError,
  BadRequestError,
  AuthorizationError
} from '../utils/errors.js';
import { Voucher } from '../models/index.js';

/**
 * @desc    Create voucher
 * @route   POST /api/vouchers
 * @access  Private (Admin)
 */
export const createVoucher = asyncHandler(async (req, res) => {
  if (req.userType !== 'user' || req.user.role !== 'admin') {
    throw new AuthorizationError('Only admins can create vouchers');
  }

  const voucher = await Voucher.create({
    ...req.body,
    createdBy: req.user._id
  });

  successResponse(res, { voucher }, 'Voucher created successfully', 201);
});

/**
 * @desc    Get all vouchers (Admin)
 * @route   GET /api/vouchers
 * @access  Private (Admin)
 */
export const getAllVouchers = asyncHandler(async (req, res) => {
  if (req.userType !== 'user' || req.user.role !== 'admin') {
    throw new AuthorizationError('Only admins can view all vouchers');
  }

  const { page = 1, limit = 20, isActive } = req.query;

  const query = {};
  if (isActive !== undefined) {
    query.isActive = isActive === 'true';
  }

  const total = await Voucher.countDocuments(query);

  const vouchers = await Voucher.find(query)
    .populate('createdBy', 'fullName email')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  paginatedResponse(res, vouchers, page, limit, total, 'Vouchers retrieved successfully');
});

/**
 * @desc    Get available vouchers for customer
 * @route   GET /api/vouchers/available
 * @access  Public
 */
export const getAvailableVouchers = asyncHandler(async (req, res) => {
  const now = new Date();

  const query = {
    isActive: true,
    startDate: { $lte: now },
    endDate: { $gte: now },
    $or: [
      { maxUsage: { $exists: false } },
      { $expr: { $lt: ['$currentUsage', '$maxUsage'] } }
    ]
  };

  // If user is logged in, filter by user targeting
  if (req.user) {
    query.$or = [
      { targetUsers: 'all' },
      { targetUsers: 'new' },
      { targetUsers: 'loyalty_tier', loyaltyTiers: req.user.loyaltyTier }
    ];
  } else {
    query.targetUsers = 'all';
  }

  const vouchers = await Voucher.find(query)
    .select('-createdBy -__v')
    .sort({ discountValue: -1 });

  successResponse(res, { vouchers }, 'Available vouchers retrieved successfully');
});

/**
 * @desc    Validate voucher
 * @route   POST /api/vouchers/validate
 * @access  Private (Customer)
 */
export const validateVoucher = asyncHandler(async (req, res) => {
  const { code, orderValue } = req.body;

  const voucher = await Voucher.findOne({ code: code.toUpperCase() });

  if (!voucher) {
    throw new NotFoundError('Voucher not found');
  }

  // Check if voucher can be used by user
  const canUse = await voucher.canBeUsedBy(req.user._id, orderValue);

  if (!canUse.valid) {
    throw new BadRequestError(canUse.reason);
  }

  // Calculate discount
  const discount = voucher.calculateDiscount(orderValue);

  successResponse(res, {
    voucher: {
      code: voucher.code,
      name: voucher.name,
      description: voucher.description,
      discountType: voucher.discountType,
      discountValue: voucher.discountValue
    },
    discount,
    finalAmount: orderValue - discount
  }, 'Voucher is valid');
});

/**
 * @desc    Get voucher by code (public info)
 * @route   GET /api/vouchers/:code
 * @access  Public
 */
export const getVoucherByCode = asyncHandler(async (req, res) => {
  const voucher = await Voucher.findOne({ code: req.params.code.toUpperCase() })
    .select('-createdBy -__v');

  if (!voucher) {
    throw new NotFoundError('Voucher not found');
  }

  successResponse(res, { voucher }, 'Voucher retrieved successfully');
});

/**
 * @desc    Update voucher
 * @route   PUT /api/vouchers/:id
 * @access  Private (Admin)
 */
export const updateVoucher = asyncHandler(async (req, res) => {
  if (req.userType !== 'user' || req.user.role !== 'admin') {
    throw new AuthorizationError('Only admins can update vouchers');
  }

  const voucher = await Voucher.findById(req.params.id);

  if (!voucher) {
    throw new NotFoundError('Voucher not found');
  }

  const allowedUpdates = [
    'name',
    'description',
    'discountType',
    'discountValue',
    'maxDiscount',
    'minOrderValue',
    'startDate',
    'endDate',
    'maxUsage',
    'maxUsagePerUser',
    'applicableTo',
    'operators',
    'routes',
    'targetUsers',
    'loyaltyTiers',
    'isActive'
  ];

  const updates = {};
  Object.keys(req.body).forEach(key => {
    if (allowedUpdates.includes(key)) {
      updates[key] = req.body[key];
    }
  });

  const updatedVoucher = await Voucher.findByIdAndUpdate(
    req.params.id,
    updates,
    { new: true, runValidators: true }
  );

  successResponse(res, { voucher: updatedVoucher }, 'Voucher updated successfully');
});

/**
 * @desc    Delete voucher
 * @route   DELETE /api/vouchers/:id
 * @access  Private (Admin)
 */
export const deleteVoucher = asyncHandler(async (req, res) => {
  if (req.userType !== 'user' || req.user.role !== 'admin') {
    throw new AuthorizationError('Only admins can delete vouchers');
  }

  const voucher = await Voucher.findById(req.params.id);

  if (!voucher) {
    throw new NotFoundError('Voucher not found');
  }

  // Soft delete - deactivate instead of removing
  voucher.isActive = false;
  await voucher.save();

  successResponse(res, null, 'Voucher deleted successfully');
});

/**
 * @desc    Get voucher usage statistics
 * @route   GET /api/vouchers/:id/statistics
 * @access  Private (Admin)
 */
export const getVoucherStatistics = asyncHandler(async (req, res) => {
  if (req.userType !== 'user' || req.user.role !== 'admin') {
    throw new AuthorizationError('Only admins can view voucher statistics');
  }

  const voucher = await Voucher.findById(req.params.id);

  if (!voucher) {
    throw new NotFoundError('Voucher not found');
  }

  const Booking = mongoose.model('Booking');

  // Get usage statistics
  const usageStats = await Booking.aggregate([
    {
      $match: {
        voucherCode: voucher.code,
        status: { $in: ['confirmed', 'completed'] }
      }
    },
    {
      $group: {
        _id: null,
        totalUsage: { $sum: 1 },
        totalDiscount: { $sum: '$discount' },
        totalRevenue: { $sum: '$totalAmount' },
        uniqueUsers: { $addToSet: '$customerId' }
      }
    }
  ]);

  const stats = usageStats.length > 0 ? {
    totalUsage: usageStats[0].totalUsage,
    totalDiscount: usageStats[0].totalDiscount,
    totalRevenue: usageStats[0].totalRevenue,
    uniqueUsers: usageStats[0].uniqueUsers.length,
    remainingUsage: voucher.maxUsage ? voucher.maxUsage - voucher.currentUsage : 'Unlimited'
  } : {
    totalUsage: 0,
    totalDiscount: 0,
    totalRevenue: 0,
    uniqueUsers: 0,
    remainingUsage: voucher.maxUsage || 'Unlimited'
  };

  successResponse(res, {
    voucher,
    statistics: stats
  }, 'Voucher statistics retrieved successfully');
});
