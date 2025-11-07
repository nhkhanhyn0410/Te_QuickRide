import express from 'express';
import {
  getProfile,
  updateProfile,
  changePassword,
  addSavedPassenger,
  removeSavedPassenger
} from '../controllers/userController.js';
import { changePasswordValidator } from '../middlewares/validators/authValidators.js';
import { validate } from '../middlewares/validate.js';
import { protect, restrictTo } from '../middlewares/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);
router.use(restrictTo('customer', 'admin'));

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/change-password', changePasswordValidator, validate, changePassword);
router.post('/saved-passengers', addSavedPassenger);
router.delete('/saved-passengers/:id', removeSavedPassenger);

export default router;
