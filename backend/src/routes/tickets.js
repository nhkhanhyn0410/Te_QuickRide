import express from 'express';
import {
  getBookingTickets,
  getTicketById,
  downloadTicket,
  validateTicketQR,
  checkinPassenger,
  getMyTickets,
  getUpcomingTrips,
  getTicketStatistics
} from '../controllers/ticketController.js';
import { protect, restrictTo } from '../middlewares/auth.js';
import { body, param } from 'express-validator';
import { validate } from '../middlewares/validate.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Customer routes
router.get('/my-tickets', restrictTo('customer'), getMyTickets);
router.get('/upcoming', restrictTo('customer'), getUpcomingTrips);
router.get('/booking/:bookingId',
  param('bookingId').isMongoId().withMessage('Invalid booking ID'),
  validate,
  getBookingTickets
);

// Ticket details and download
router.get('/:id',
  param('id').isMongoId().withMessage('Invalid ticket ID'),
  validate,
  getTicketById
);

router.get('/:id/download',
  param('id').isMongoId().withMessage('Invalid ticket ID'),
  validate,
  downloadTicket
);

// Ticket validation and check-in (Staff/Trip Manager)
router.post('/validate',
  [
    body('qrData').notEmpty().withMessage('QR code data is required')
  ],
  validate,
  validateTicketQR
);

router.post('/:id/checkin',
  param('id').isMongoId().withMessage('Invalid ticket ID'),
  validate,
  checkinPassenger
);

// Operator statistics
router.get('/statistics/operator', restrictTo('operator'), getTicketStatistics);

export default router;
