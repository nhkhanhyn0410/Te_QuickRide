import { body, param } from 'express-validator';

/**
 * Validation rules for creating a booking
 */
export const createBookingValidator = [
  body('tripId')
    .notEmpty()
    .withMessage('Trip ID is required')
    .isMongoId()
    .withMessage('Invalid trip ID'),

  body('seats')
    .isArray({ min: 1 })
    .withMessage('At least one seat must be selected'),

  body('seats.*.seatNumber')
    .notEmpty()
    .withMessage('Seat number is required'),

  body('seats.*.passenger.fullName')
    .trim()
    .notEmpty()
    .withMessage('Passenger full name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Passenger name must be between 2 and 100 characters'),

  body('seats.*.passenger.phone')
    .matches(/^(0|\+84)[0-9]{9,10}$/)
    .withMessage('Please provide a valid Vietnamese phone number'),

  body('seats.*.passenger.idCard')
    .optional()
    .trim(),

  body('pickupPoint')
    .notEmpty()
    .withMessage('Pickup point is required'),

  body('pickupPoint.name')
    .notEmpty()
    .withMessage('Pickup point name is required'),

  body('pickupPoint.address')
    .notEmpty()
    .withMessage('Pickup point address is required'),

  body('dropoffPoint')
    .notEmpty()
    .withMessage('Dropoff point is required'),

  body('dropoffPoint.name')
    .notEmpty()
    .withMessage('Dropoff point name is required'),

  body('dropoffPoint.address')
    .notEmpty()
    .withMessage('Dropoff point address is required'),

  body('contactEmail')
    .isEmail()
    .withMessage('Please provide a valid contact email')
    .normalizeEmail(),

  body('contactPhone')
    .matches(/^(0|\+84)[0-9]{9,10}$/)
    .withMessage('Please provide a valid contact phone number'),

  body('voucherCode')
    .optional()
    .trim(),

  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes must not exceed 500 characters')
];

/**
 * Validation rules for getting booking by ID
 */
export const getBookingValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid booking ID')
];

/**
 * Validation rules for cancelling booking
 */
export const cancelBookingValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid booking ID'),

  body('cancellationReason')
    .trim()
    .notEmpty()
    .withMessage('Cancellation reason is required')
    .isLength({ min: 10, max: 500 })
    .withMessage('Cancellation reason must be between 10 and 500 characters')
];
