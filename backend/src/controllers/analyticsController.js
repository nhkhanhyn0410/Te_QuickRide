import asyncHandler from '../utils/asyncHandler.js';
import { successResponse } from '../utils/response.js';
import { AuthorizationError } from '../utils/errors.js';
import { Booking, Trip, User, BusOperator, Payment, Route } from '../models/index.js';

/**
 * @desc    Get dashboard statistics
 * @route   GET /api/analytics/dashboard
 * @access  Private (Admin)
 */
export const getDashboardStats = asyncHandler(async (req, res) => {
  if (req.userType !== 'admin') {
    throw new AuthorizationError('Only administrators can access analytics');
  }

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  // Total counts
  const [totalUsers, totalOperators, totalBookings, totalTrips] = await Promise.all([
    User.countDocuments(),
    BusOperator.countDocuments(),
    Booking.countDocuments(),
    Trip.countDocuments()
  ]);

  // This month stats
  const [monthBookings, monthRevenue, lastMonthBookings, lastMonthRevenue] = await Promise.all([
    Booking.countDocuments({ createdAt: { $gte: startOfMonth } }),
    Payment.aggregate([
      { $match: { createdAt: { $gte: startOfMonth }, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]),
    Booking.countDocuments({ createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } }),
    Payment.aggregate([
      { $match: { createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ])
  ]);

  const currentRevenue = monthRevenue[0]?.total || 0;
  const lastRevenue = lastMonthRevenue[0]?.total || 0;

  // Calculate growth
  const bookingGrowth = lastMonthBookings > 0
    ? ((monthBookings - lastMonthBookings) / lastMonthBookings * 100).toFixed(2)
    : 0;

  const revenueGrowth = lastRevenue > 0
    ? ((currentRevenue - lastRevenue) / lastRevenue * 100).toFixed(2)
    : 0;

  // Recent bookings
  const recentBookings = await Booking.find()
    .populate('customerId', 'fullName email')
    .populate('tripId', 'tripCode')
    .sort({ createdAt: -1 })
    .limit(10);

  successResponse(res, {
    stats: {
      totalUsers,
      totalOperators,
      totalBookings,
      totalTrips,
      monthBookings,
      monthRevenue: currentRevenue,
      bookingGrowth: parseFloat(bookingGrowth),
      revenueGrowth: parseFloat(revenueGrowth)
    },
    recentBookings
  }, 'Dashboard statistics retrieved');
});

/**
 * @desc    Get revenue analytics
 * @route   GET /api/analytics/revenue
 * @access  Private (Admin)
 */
export const getRevenueAnalytics = asyncHandler(async (req, res) => {
  if (req.userType !== 'admin') {
    throw new AuthorizationError('Only administrators can access analytics');
  }

  const { startDate, endDate, groupBy = 'day' } = req.query;

  const matchStage = {
    status: 'completed',
    createdAt: {}
  };

  if (startDate) {
    matchStage.createdAt.$gte = new Date(startDate);
  }
  if (endDate) {
    matchStage.createdAt.$lte = new Date(endDate);
  }

  // Group by format
  let dateFormat;
  switch (groupBy) {
    case 'month':
      dateFormat = { $dateToString: { format: '%Y-%m', date: '$createdAt' } };
      break;
    case 'week':
      dateFormat = { $dateToString: { format: '%Y-W%V', date: '$createdAt' } };
      break;
    default:
      dateFormat = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
  }

  const revenue = await Payment.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: dateFormat,
        totalRevenue: { $sum: '$amount' },
        totalBookings: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  successResponse(res, { revenue }, 'Revenue analytics retrieved');
});

/**
 * @desc    Get booking analytics
 * @route   GET /api/analytics/bookings
 * @access  Private (Admin)
 */
export const getBookingAnalytics = asyncHandler(async (req, res) => {
  if (req.userType !== 'admin') {
    throw new AuthorizationError('Only administrators can access analytics');
  }

  // Bookings by status
  const bookingsByStatus = await Booking.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  // Bookings by date
  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 30);

  const bookingsByDate = await Booking.aggregate([
    { $match: { createdAt: { $gte: last30Days } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  successResponse(res, {
    bookingsByStatus,
    bookingsByDate
  }, 'Booking analytics retrieved');
});

/**
 * @desc    Get user growth analytics
 * @route   GET /api/analytics/user-growth
 * @access  Private (Admin)
 */
export const getUserGrowthAnalytics = asyncHandler(async (req, res) => {
  if (req.userType !== 'admin') {
    throw new AuthorizationError('Only administrators can access analytics');
  }

  const last6Months = new Date();
  last6Months.setMonth(last6Months.getMonth() - 6);

  const userGrowth = await User.aggregate([
    { $match: { createdAt: { $gte: last6Months } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  const operatorGrowth = await BusOperator.aggregate([
    { $match: { createdAt: { $gte: last6Months } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  successResponse(res, {
    userGrowth,
    operatorGrowth
  }, 'User growth analytics retrieved');
});

/**
 * @desc    Get operator performance
 * @route   GET /api/analytics/operator-performance
 * @access  Private (Admin/Operator)
 */
export const getOperatorPerformance = asyncHandler(async (req, res) => {
  const { operatorId } = req.query;
  const isAdmin = req.userType === 'admin';

  let targetOperatorId;
  if (isAdmin && operatorId) {
    targetOperatorId = operatorId;
  } else if (req.userType === 'operator') {
    targetOperatorId = req.user._id;
  } else {
    throw new AuthorizationError('Unauthorized access');
  }

  const [totalTrips, totalBookings, totalRevenue, avgRating] = await Promise.all([
    Trip.countDocuments({ operatorId: targetOperatorId }),
    Booking.countDocuments({ operatorId: targetOperatorId }),
    Payment.aggregate([
      { $match: { operatorId: targetOperatorId, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]),
    BusOperator.findById(targetOperatorId).select('averageRating totalReviews')
  ]);

  const revenue = totalRevenue[0]?.total || 0;

  successResponse(res, {
    totalTrips,
    totalBookings,
    totalRevenue: revenue,
    averageRating: avgRating?.averageRating || 0,
    totalReviews: avgRating?.totalReviews || 0
  }, 'Operator performance retrieved');
});

/**
 * @desc    Get route analytics
 * @route   GET /api/analytics/routes
 * @access  Private (Admin)
 */
export const getRouteAnalytics = asyncHandler(async (req, res) => {
  if (req.userType !== 'admin') {
    throw new AuthorizationError('Only administrators can access analytics');
  }

  const routeStats = await Trip.aggregate([
    {
      $group: {
        _id: '$routeId',
        totalTrips: { $sum: 1 },
        totalSeatsBooked: { $sum: { $size: '$occupiedSeats' } }
      }
    },
    {
      $lookup: {
        from: 'routes',
        localField: '_id',
        foreignField: '_id',
        as: 'route'
      }
    },
    { $unwind: '$route' },
    {
      $project: {
        routeName: '$route.routeName',
        origin: '$route.origin',
        destination: '$route.destination',
        totalTrips: 1,
        totalSeatsBooked: 1
      }
    },
    { $sort: { totalTrips: -1 } },
    { $limit: 10 }
  ]);

  successResponse(res, { routeStats }, 'Route analytics retrieved');
});

/**
 * @desc    Get top routes
 * @route   GET /api/analytics/top-routes
 * @access  Private (Admin)
 */
export const getTopRoutes = asyncHandler(async (req, res) => {
  if (req.userType !== 'admin') {
    throw new AuthorizationError('Only administrators can access analytics');
  }

  const { limit = 10 } = req.query;

  const topRoutes = await Booking.aggregate([
    {
      $lookup: {
        from: 'trips',
        localField: 'tripId',
        foreignField: '_id',
        as: 'trip'
      }
    },
    { $unwind: '$trip' },
    {
      $group: {
        _id: '$trip.routeId',
        totalBookings: { $sum: 1 },
        totalRevenue: { $sum: '$totalAmount' }
      }
    },
    {
      $lookup: {
        from: 'routes',
        localField: '_id',
        foreignField: '_id',
        as: 'route'
      }
    },
    { $unwind: '$route' },
    {
      $project: {
        routeName: '$route.routeName',
        origin: '$route.origin',
        destination: '$route.destination',
        totalBookings: 1,
        totalRevenue: 1
      }
    },
    { $sort: { totalBookings: -1 } },
    { $limit: parseInt(limit) }
  ]);

  successResponse(res, { topRoutes }, 'Top routes retrieved');
});

/**
 * @desc    Get commission analytics
 * @route   GET /api/analytics/commission
 * @access  Private (Admin)
 */
export const getCommissionAnalytics = asyncHandler(async (req, res) => {
  if (req.userType !== 'admin') {
    throw new AuthorizationError('Only administrators can access analytics');
  }

  const { startDate, endDate } = req.query;

  const matchStage = { status: 'completed' };
  if (startDate || endDate) {
    matchStage.createdAt = {};
    if (startDate) matchStage.createdAt.$gte = new Date(startDate);
    if (endDate) matchStage.createdAt.$lte = new Date(endDate);
  }

  const commissionData = await Payment.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$operatorId',
        totalRevenue: { $sum: '$amount' },
        totalCommission: { $sum: '$platformFee' },
        bookingCount: { $sum: 1 }
      }
    },
    {
      $lookup: {
        from: 'busoperators',
        localField: '_id',
        foreignField: '_id',
        as: 'operator'
      }
    },
    { $unwind: '$operator' },
    {
      $project: {
        operatorName: '$operator.companyName',
        totalRevenue: 1,
        totalCommission: 1,
        bookingCount: 1
      }
    },
    { $sort: { totalCommission: -1 } }
  ]);

  const totalCommission = commissionData.reduce((sum, item) => sum + item.totalCommission, 0);

  successResponse(res, {
    commissionData,
    totalCommission
  }, 'Commission analytics retrieved');
});

/**
 * @desc    Export analytics data
 * @route   GET /api/analytics/export/:type
 * @access  Private (Admin)
 */
export const exportAnalytics = asyncHandler(async (req, res) => {
  if (req.userType !== 'admin') {
    throw new AuthorizationError('Only administrators can export analytics');
  }

  const { type } = req.params;
  const { startDate, endDate } = req.query;

  // This is a simplified version - in production, you'd generate CSV/Excel files
  let data;

  switch (type) {
    case 'bookings':
      data = await Booking.find({
        createdAt: {
          ...(startDate && { $gte: new Date(startDate) }),
          ...(endDate && { $lte: new Date(endDate) })
        }
      })
        .populate('customerId', 'fullName email')
        .populate('tripId', 'tripCode')
        .lean();
      break;

    case 'revenue':
      data = await Payment.find({
        status: 'completed',
        createdAt: {
          ...(startDate && { $gte: new Date(startDate) }),
          ...(endDate && { $lte: new Date(endDate) })
        }
      }).lean();
      break;

    default:
      throw new BadRequestError('Invalid export type');
  }

  successResponse(res, { data, type }, 'Analytics data exported');
});
