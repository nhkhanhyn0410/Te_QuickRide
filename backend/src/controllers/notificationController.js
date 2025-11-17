import asyncHandler from '../utils/asyncHandler.js';
import { successResponse, paginatedResponse } from '../utils/response.js';
import {
  NotFoundError,
  AuthorizationError
} from '../utils/errors.js';
import { Notification } from '../models/index.js';

/**
 * @desc    Get my notifications
 * @route   GET /api/notifications
 * @access  Private
 */
export const getMyNotifications = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, isRead } = req.query;

  const query = {
    recipientId: req.user._id,
    recipientType: req.userType,
    $or: [
      { expiresAt: { $exists: false } },
      { expiresAt: { $gt: new Date() } }
    ]
  };

  if (isRead !== undefined) {
    query.isRead = isRead === 'true';
  }

  const total = await Notification.countDocuments(query);

  const notifications = await Notification.find(query)
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  // Get unread count
  const unreadCount = await Notification.getUnreadCount(req.user._id, req.userType);

  paginatedResponse(
    res,
    notifications,
    page,
    limit,
    total,
    'Notifications retrieved successfully',
    { unreadCount }
  );
});

/**
 * @desc    Get unread notifications count
 * @route   GET /api/notifications/unread-count
 * @access  Private
 */
export const getUnreadCount = asyncHandler(async (req, res) => {
  const count = await Notification.getUnreadCount(req.user._id, req.userType);

  successResponse(res, { count }, 'Unread count retrieved successfully');
});

/**
 * @desc    Mark notification as read
 * @route   PUT /api/notifications/:id/read
 * @access  Private
 */
export const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    throw new NotFoundError('Notification not found');
  }

  // Check if notification belongs to user
  if (
    notification.recipientId.toString() !== req.user._id.toString() ||
    notification.recipientType !== req.userType
  ) {
    throw new AuthorizationError('You can only mark your own notifications as read');
  }

  await notification.markAsRead();

  successResponse(res, { notification }, 'Notification marked as read');
});

/**
 * @desc    Mark all notifications as read
 * @route   PUT /api/notifications/read-all
 * @access  Private
 */
export const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.markAllAsRead(req.user._id, req.userType);

  successResponse(res, null, 'All notifications marked as read');
});

/**
 * @desc    Delete notification
 * @route   DELETE /api/notifications/:id
 * @access  Private
 */
export const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    throw new NotFoundError('Notification not found');
  }

  // Check if notification belongs to user
  if (
    notification.recipientId.toString() !== req.user._id.toString() ||
    notification.recipientType !== req.userType
  ) {
    throw new AuthorizationError('You can only delete your own notifications');
  }

  await notification.remove();

  successResponse(res, null, 'Notification deleted successfully');
});

/**
 * @desc    Delete all notifications
 * @route   DELETE /api/notifications
 * @access  Private
 */
export const deleteAllNotifications = asyncHandler(async (req, res) => {
  await Notification.deleteMany({
    recipientId: req.user._id,
    recipientType: req.userType
  });

  successResponse(res, null, 'All notifications deleted successfully');
});

/**
 * @desc    Get user notification settings
 * @route   GET /api/notifications/settings
 * @access  Private
 */
export const getNotificationSettings = asyncHandler(async (req, res) => {
  // Get user or operator model based on userType
  let user;
  if (req.userType === 'customer') {
    const { User } = await import('../models/index.js');
    user = await User.findById(req.user._id).select('notificationSettings');
  } else if (req.userType === 'operator') {
    const { BusOperator } = await import('../models/index.js');
    user = await BusOperator.findById(req.user._id).select('notificationSettings');
  }

  const settings = user?.notificationSettings || {
    email: true,
    sms: false,
    push: true,
    bookingUpdates: true,
    promotions: true,
    newsletters: false
  };

  successResponse(res, { settings }, 'Notification settings retrieved');
});

/**
 * @desc    Update user notification settings
 * @route   PUT /api/notifications/settings
 * @access  Private
 */
export const updateNotificationSettings = asyncHandler(async (req, res) => {
  const { email, sms, push, bookingUpdates, promotions, newsletters } = req.body;

  // Get user or operator model based on userType
  let user;
  if (req.userType === 'customer') {
    const { User } = await import('../models/index.js');
    user = await User.findById(req.user._id);
  } else if (req.userType === 'operator') {
    const { BusOperator } = await import('../models/index.js');
    user = await BusOperator.findById(req.user._id);
  }

  if (!user) {
    throw new NotFoundError('User not found');
  }

  // Update notification settings
  if (!user.notificationSettings) {
    user.notificationSettings = {};
  }

  if (email !== undefined) user.notificationSettings.email = email;
  if (sms !== undefined) user.notificationSettings.sms = sms;
  if (push !== undefined) user.notificationSettings.push = push;
  if (bookingUpdates !== undefined) user.notificationSettings.bookingUpdates = bookingUpdates;
  if (promotions !== undefined) user.notificationSettings.promotions = promotions;
  if (newsletters !== undefined) user.notificationSettings.newsletters = newsletters;

  await user.save();

  successResponse(res, { settings: user.notificationSettings }, 'Notification settings updated');
});
