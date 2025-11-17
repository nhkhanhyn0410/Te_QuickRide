import express from 'express';
import {
  getSettings,
  updateSettings,
  testEmailSettings,
  getPublicSettings
} from '../controllers/settingsController.js';
import { protect, restrictTo } from '../middlewares/auth.js';

const router = express.Router();

// Public routes
router.get('/public', getPublicSettings);

// Protected routes (Admin only)
router.use(protect);
router.use(restrictTo('admin'));

router.get('/', getSettings);
router.put('/', updateSettings);
router.post('/test-email', testEmailSettings);

export default router;
