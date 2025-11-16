import express from 'express';
import {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications
} from '../controllers/notificationController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Specific routes before generic routes
router.get('/unread-count', getUnreadCount);
router.put('/read-all', markAllAsRead);
router.get('/', getMyNotifications);
router.put('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);
router.delete('/', deleteAllNotifications);

export default router;
