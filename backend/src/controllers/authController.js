import asyncHandler from '../utils/asyncHandler.js';
import { successResponse, errorResponse } from '../utils/response.js';
import {
  AuthenticationError,
  ConflictError,
  NotFoundError,
  BadRequestError
} from '../utils/errors.js';
import {
  generateTokenPair,
  verifyRefreshToken
} from '../utils/jwt.js';
import { generateOTP, generateRandomToken } from '../utils/generateCode.js';
import { User, BusOperator } from '../models/index.js';

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = asyncHandler(async (req, res) => {
  const { email, phone, password, fullName, gender, dateOfBirth } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ email }, { phone }]
  });

  if (existingUser) {
    if (existingUser.email === email) {
      throw new ConflictError('Email already registered');
    }
    if (existingUser.phone === phone) {
      throw new ConflictError('Phone number already registered');
    }
  }

  // Create new user
  const user = await User.create({
    email,
    phone,
    password,
    fullName,
    gender,
    dateOfBirth,
    role: 'customer'
  });

  // Generate tokens
  const tokens = generateTokenPair(user._id, user.role, 'user');

  // Generate OTP for phone verification
  const otp = generateOTP();
  user.phoneVerificationOTP = otp;
  user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  await user.save();

  // TODO: Send verification OTP via SMS
  // await sendSMS(phone, `Your Te_QuickRide verification code is: ${otp}`);

  // TODO: Send welcome email
  // await sendEmail(email, 'Welcome to Te_QuickRide', welcomeTemplate);

  successResponse(res, {
    user: {
      id: user._id,
      email: user.email,
      phone: user.phone,
      fullName: user.fullName,
      role: user.role
    },
    tokens,
    message: 'Please verify your phone number. OTP has been sent to your phone.'
  }, 'Registration successful', 201);
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = asyncHandler(async (req, res) => {
  const { emailOrPhone, password } = req.body;

  // Find user by email or phone
  const user = await User.findOne({
    $or: [
      { email: emailOrPhone },
      { phone: emailOrPhone }
    ]
  }).select('+password');

  if (!user) {
    throw new AuthenticationError('Invalid credentials');
  }

  // Check if account is active
  if (!user.isActive) {
    throw new AuthenticationError('Account is inactive');
  }

  if (user.isBlocked) {
    throw new AuthenticationError('Account is blocked. Please contact support.');
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new AuthenticationError('Invalid credentials');
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  // Generate tokens
  const tokens = generateTokenPair(user._id, user.role, 'user');

  successResponse(res, {
    user: {
      id: user._id,
      email: user.email,
      phone: user.phone,
      fullName: user.fullName,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      isPhoneVerified: user.isPhoneVerified,
      loyaltyTier: user.loyaltyTier,
      totalPoints: user.totalPoints
    },
    tokens
  }, 'Login successful');
});

/**
 * @desc    Login bus operator
 * @route   POST /api/auth/operator/login
 * @access  Public
 */
export const operatorLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find operator
  const operator = await BusOperator.findOne({ email }).select('+password');

  if (!operator) {
    throw new AuthenticationError('Invalid credentials');
  }

  // Check if account is active
  if (!operator.isActive) {
    throw new AuthenticationError('Account is inactive');
  }

  if (operator.isSuspended) {
    throw new AuthenticationError('Account is suspended. Please contact support.');
  }

  // Check password
  const isPasswordValid = await operator.comparePassword(password);

  if (!isPasswordValid) {
    throw new AuthenticationError('Invalid credentials');
  }

  // Check verification status
  if (operator.verificationStatus === 'pending') {
    throw new AuthenticationError('Your account is pending approval from admin');
  }

  if (operator.verificationStatus === 'rejected') {
    throw new AuthenticationError(`Your account was rejected. Reason: ${operator.rejectionReason}`);
  }

  // Generate tokens
  const tokens = generateTokenPair(operator._id, 'operator', 'operator');

  successResponse(res, {
    operator: {
      id: operator._id,
      companyName: operator.companyName,
      email: operator.email,
      phone: operator.phone,
      verificationStatus: operator.verificationStatus,
      averageRating: operator.averageRating
    },
    tokens
  }, 'Login successful');
});

/**
 * @desc    Refresh access token
 * @route   POST /api/auth/refresh-token
 * @access  Public
 */
export const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new BadRequestError('Refresh token is required');
  }

  // Verify refresh token
  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch (error) {
    throw new AuthenticationError('Invalid or expired refresh token');
  }

  // Generate new token pair
  const tokens = generateTokenPair(decoded.id, decoded.role, decoded.type);

  successResponse(res, {
    tokens
  }, 'Token refreshed successfully');
});

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = asyncHandler(async (req, res) => {
  successResponse(res, {
    user: req.user,
    userType: req.userType
  }, 'Profile retrieved successfully');
});

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logout = asyncHandler(async (req, res) => {
  // In a production app, you might want to blacklist the token
  // or store refresh tokens in DB and remove them on logout

  successResponse(res, null, 'Logout successful');
});

/**
 * @desc    Forgot password - send reset token
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    // Don't reveal if user exists or not for security
    successResponse(res, null, 'If email exists, a reset link has been sent');
    return;
  }

  // Generate reset token
  const resetToken = generateRandomToken(32);
  user.passwordResetToken = resetToken;
  user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  await user.save();

  // TODO: Send reset email
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  // await sendEmail(email, 'Password Reset', resetPasswordTemplate(resetUrl));

  successResponse(res, {
    message: 'Password reset link sent to your email',
    // Only include in development
    ...(process.env.NODE_ENV === 'development' && { resetToken, resetUrl })
  }, 'Password reset email sent');
});

/**
 * @desc    Reset password with token
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
export const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetExpires: { $gt: Date.now() }
  });

  if (!user) {
    throw new BadRequestError('Invalid or expired reset token');
  }

  // Set new password
  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // Generate new tokens
  const tokens = generateTokenPair(user._id, user.role, 'user');

  successResponse(res, {
    tokens
  }, 'Password reset successful');
});

/**
 * @desc    Verify phone with OTP
 * @route   POST /api/auth/verify-phone
 * @access  Private
 */
export const verifyPhone = asyncHandler(async (req, res) => {
  const { otp } = req.body;

  if (req.userType !== 'user') {
    throw new BadRequestError('Only users can verify phone');
  }

  const user = await User.findById(req.user._id);

  if (user.isPhoneVerified) {
    throw new BadRequestError('Phone already verified');
  }

  if (!user.phoneVerificationOTP || user.otpExpires < Date.now()) {
    throw new BadRequestError('OTP expired. Please request a new one.');
  }

  if (user.phoneVerificationOTP !== otp) {
    throw new BadRequestError('Invalid OTP');
  }

  user.isPhoneVerified = true;
  user.phoneVerificationOTP = undefined;
  user.otpExpires = undefined;
  await user.save();

  successResponse(res, {
    user: {
      id: user._id,
      phone: user.phone,
      isPhoneVerified: user.isPhoneVerified
    }
  }, 'Phone verified successfully');
});

/**
 * @desc    Resend verification OTP
 * @route   POST /api/auth/resend-otp
 * @access  Private
 */
export const resendOTP = asyncHandler(async (req, res) => {
  if (req.userType !== 'user') {
    throw new BadRequestError('Only users can request OTP');
  }

  const user = await User.findById(req.user._id);

  if (user.isPhoneVerified) {
    throw new BadRequestError('Phone already verified');
  }

  const otp = generateOTP();
  user.phoneVerificationOTP = otp;
  user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  await user.save();

  // TODO: Send OTP via SMS
  // await sendSMS(user.phone, `Your Te_QuickRide verification code is: ${otp}`);

  successResponse(res, {
    message: 'OTP sent to your phone',
    // Only include in development
    ...(process.env.NODE_ENV === 'development' && { otp })
  }, 'OTP sent successfully');
});
