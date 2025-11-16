import { body, query, param } from 'express-validator';

/**
 * Validation rules for searching trips
 */
export const searchTripsValidator = [
  query('origin')
    .trim()
    .notEmpty()
    .withMessage('Origin city is required'),

  query('destination')
    .trim()
    .notEmpty()
    .withMessage('Destination city is required'),

  query('departureDate')
    .notEmpty()
    .withMessage('Departure date is required')
    .isISO8601()
    .withMessage('Invalid date format')
    .custom((value) => {
      const date = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (date < today) {
        throw new Error('Departure date cannot be in the past');
      }
      return true;
    }),

  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
];

/**
 * Validation rules for creating a trip
 */
export const createTripValidator = [
  body('routeId')
    .notEmpty()
    .withMessage('Route ID is required')
    .isMongoId()
    .withMessage('Invalid route ID'),

  body('busId')
    .notEmpty()
    .withMessage('Bus ID is required')
    .isMongoId()
    .withMessage('Invalid bus ID'),

  body('departureTime')
    .notEmpty()
    .withMessage('Departure time is required')
    .isISO8601()
    .withMessage('Invalid departure time format')
    .custom((value) => {
      const date = new Date(value);
      const now = new Date();

      if (date <= now) {
        throw new Error('Departure time must be in the future');
      }
      return true;
    }),

  body('arrivalTime')
    .notEmpty()
    .withMessage('Arrival time is required')
    .isISO8601()
    .withMessage('Invalid arrival time format')
    .custom((value, { req }) => {
      const arrival = new Date(value);
      const departure = new Date(req.body.departureTime);

      if (arrival <= departure) {
        throw new Error('Arrival time must be after departure time');
      }
      return true;
    }),

  body('basePrice')
    .notEmpty()
    .withMessage('Base price is required')
    .isFloat({ min: 0 })
    .withMessage('Base price must be a positive number'),

  body('driverId')
    .optional()
    .isMongoId()
    .withMessage('Invalid driver ID'),

  body('tripManagerId')
    .optional()
    .isMongoId()
    .withMessage('Invalid trip manager ID')
];

/**
 * Validation rules for updating trip
 */
export const updateTripValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid trip ID'),

  body('departureTime')
    .optional()
    .isISO8601()
    .withMessage('Invalid departure time format'),

  body('arrivalTime')
    .optional()
    .isISO8601()
    .withMessage('Invalid arrival time format'),

  body('basePrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Base price must be a positive number'),

  body('status')
    .optional()
    .isIn(['scheduled', 'boarding', 'in_progress', 'completed', 'cancelled'])
    .withMessage('Invalid trip status')
];

/**
 * Validation rules for getting trip by ID
 */
export const getTripValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid trip ID')
];
