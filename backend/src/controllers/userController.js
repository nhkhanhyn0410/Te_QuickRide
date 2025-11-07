import asyncHandler from '../utils/asyncHandler.js';
import { successResponse } from '../utils/response.js';
import { BadRequestError, AuthenticationError } from '../utils/errors.js';
import { User } from '../models/index.js';

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  successResponse(res, { user }, 'Profile retrieved successfully');
});

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const allowedUpdates = ['fullName', 'dateOfBirth', 'gender', 'avatar'];
  const updates = {};

  Object.keys(req.body).forEach(key => {
    if (allowedUpdates.includes(key)) {
      updates[key] = req.body[key];
    }
  });

  const user = await User.findByIdAndUpdate(
    req.user._id,
    updates,
    { new: true, runValidators: true }
  );

  successResponse(res, { user }, 'Profile updated successfully');
});

/**
 * @desc    Change password
 * @route   PUT /api/users/change-password
 * @access  Private
 */
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');

  // Verify current password
  const isPasswordValid = await user.comparePassword(currentPassword);

  if (!isPasswordValid) {
    throw new AuthenticationError('Current password is incorrect');
  }

  // Update password
  user.password = newPassword;
  await user.save();

  successResponse(res, null, 'Password changed successfully');
});

/**
 * @desc    Add saved passenger
 * @route   POST /api/users/saved-passengers
 * @access  Private
 */
export const addSavedPassenger = asyncHandler(async (req, res) => {
  const { fullName, phone, idCard } = req.body;

  const user = await User.findById(req.user._id);

  user.savedPassengers.push({ fullName, phone, idCard });
  await user.save();

  successResponse(res, { savedPassengers: user.savedPassengers }, 'Passenger saved successfully');
});

/**
 * @desc    Remove saved passenger
 * @route   DELETE /api/users/saved-passengers/:id
 * @access  Private
 */
export const removeSavedPassenger = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  user.savedPassengers = user.savedPassengers.filter(
    p => p._id.toString() !== req.params.id
  );

  await user.save();

  successResponse(res, { savedPassengers: user.savedPassengers }, 'Passenger removed successfully');
});
