import asyncHandler from '../utils/asyncHandler.js';
import { successResponse } from '../utils/response.js';
import { AuthorizationError } from '../utils/errors.js';
import Settings from '../models/Settings.js';
import nodemailer from 'nodemailer';

/**
 * @desc    Get system settings
 * @route   GET /api/settings
 * @access  Private (Admin)
 */
export const getSettings = asyncHandler(async (req, res) => {
  if (req.userType !== 'admin') {
    throw new AuthorizationError('Only administrators can access settings');
  }

  const settings = await Settings.getSettings();

  // Don't send sensitive data to frontend
  const sanitizedSettings = {
    ...settings.toObject(),
    smtpPassword: settings.smtpPassword ? '********' : '',
    vnpayHashSecret: settings.vnpayHashSecret ? '********' : '',
    momoAccessKey: settings.momoAccessKey ? '********' : '',
    momoSecretKey: settings.momoSecretKey ? '********' : ''
  };

  successResponse(res, { settings: sanitizedSettings }, 'Settings retrieved');
});

/**
 * @desc    Update system settings
 * @route   PUT /api/settings
 * @access  Private (Admin)
 */
export const updateSettings = asyncHandler(async (req, res) => {
  if (req.userType !== 'admin') {
    throw new AuthorizationError('Only administrators can update settings');
  }

  const settings = await Settings.getSettings();

  // Update fields
  Object.keys(req.body).forEach(key => {
    if (req.body[key] !== undefined && req.body[key] !== '********') {
      settings[key] = req.body[key];
    }
  });

  await settings.save();

  // Sanitize response
  const sanitizedSettings = {
    ...settings.toObject(),
    smtpPassword: settings.smtpPassword ? '********' : '',
    vnpayHashSecret: settings.vnpayHashSecret ? '********' : '',
    momoAccessKey: settings.momoAccessKey ? '********' : '',
    momoSecretKey: settings.momoSecretKey ? '********' : ''
  };

  successResponse(res, { settings: sanitizedSettings }, 'Settings updated successfully');
});

/**
 * @desc    Test email configuration
 * @route   POST /api/settings/test-email
 * @access  Private (Admin)
 */
export const testEmailSettings = asyncHandler(async (req, res) => {
  if (req.userType !== 'admin') {
    throw new AuthorizationError('Only administrators can test email settings');
  }

  const { testEmail } = req.body;
  const settings = await Settings.getSettings();

  if (!testEmail) {
    throw new BadRequestError('Please provide a test email address');
  }

  // Create transporter
  const transporter = nodemailer.createTransport({
    host: settings.smtpHost,
    port: settings.smtpPort,
    secure: settings.smtpSecure,
    auth: {
      user: settings.smtpUser,
      pass: settings.smtpPassword
    }
  });

  try {
    // Send test email
    await transporter.sendMail({
      from: `${settings.emailFromName} <${settings.emailFrom}>`,
      to: testEmail,
      subject: 'Test Email - Te_QuickRide',
      html: `
        <h1>Email Configuration Test</h1>
        <p>This is a test email from Te_QuickRide system.</p>
        <p>If you received this email, your email configuration is working correctly.</p>
        <p>Time: ${new Date().toLocaleString()}</p>
      `
    });

    successResponse(res, null, 'Test email sent successfully');
  } catch (error) {
    throw new Error(`Failed to send test email: ${error.message}`);
  }
});

/**
 * @desc    Get public settings (non-sensitive)
 * @route   GET /api/settings/public
 * @access  Public
 */
export const getPublicSettings = asyncHandler(async (req, res) => {
  const settings = await Settings.getSettings();

  const publicSettings = {
    siteName: settings.siteName,
    siteUrl: settings.siteUrl,
    maintenanceMode: settings.maintenanceMode,
    maintenanceMessage: settings.maintenanceMessage,
    bookingTimeout: settings.bookingTimeout,
    cancellationDeadline: settings.cancellationDeadline,
    refundPercentage: settings.refundPercentage,
    defaultLanguage: settings.defaultLanguage,
    defaultCurrency: settings.defaultCurrency
  };

  successResponse(res, { settings: publicSettings }, 'Public settings retrieved');
});
