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
