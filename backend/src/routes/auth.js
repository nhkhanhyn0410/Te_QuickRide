import express from 'express';
import {
  register,
  login,
  operatorLogin,
  refreshToken,
  getMe,
  logout,
  forgotPassword,
  resetPassword,
  verifyPhone,
  resendOTP
} from '../controllers/authController.js';
import {
  registerValidator,
  loginValidator,
  changePasswordValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  refreshTokenValidator
} from '../middlewares/validators/authValidators.js';
import { validate } from '../middlewares/validate.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

// Public routes
router.post('/register', registerValidator, validate, register);
router.post('/login', loginValidator, validate, login);
router.post('/operator/login', loginValidator, validate, operatorLogin);
router.post('/refresh-token', refreshTokenValidator, validate, refreshToken);
router.post('/forgot-password', forgotPasswordValidator, validate, forgotPassword);
router.post('/reset-password', resetPasswordValidator, validate, resetPassword);

// Protected routes
router.use(protect);
router.get('/me', getMe);
router.post('/logout', logout);
router.post('/verify-phone', verifyPhone);
router.post('/resend-otp', resendOTP);

export default router;
