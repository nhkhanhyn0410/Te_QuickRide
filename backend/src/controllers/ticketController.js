import asyncHandler from '../utils/asyncHandler.js';
import { successResponse } from '../utils/response.js';
import { NotFoundError, BadRequestError, AuthorizationError } from '../utils/errors.js';
import { Ticket, Booking } from '../models/index.js';
import {
  validateTicket,
  useTicket,
  generateTicketPDF
} from '../services/ticketService.js';

/**
 * @desc    Get tickets for a booking
 * @route   GET /api/tickets/booking/:bookingId
 * @access  Private (Customer)
 */
export const getBookingTickets = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;

  // Get booking
  const booking = await Booking.findById(bookingId);

  if (!booking) {
    throw new NotFoundError('Booking not found');
  }

  // Check authorization
  if (req.userType === 'user' && booking.customerId.toString() !== req.user._id.toString()) {
    throw new AuthorizationError('You can only view your own tickets');
  }

  // Get tickets
  const tickets = await Ticket.find({ bookingId })
    .populate('tripId', 'departureTime arrivalTime status')
    .sort({ seatNumber: 1 });

  successResponse(res, {
    booking: {
      bookingCode: booking.bookingCode,
      status: booking.status
    },
    tickets
  }, 'Tickets retrieved successfully');
});

/**
 * @desc    Get ticket by ID
 * @route   GET /api/tickets/:id
 * @access  Private
 */
export const getTicketById = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findById(req.params.id)
    .populate('bookingId')
    .populate('tripId')
    .populate('customerId', 'fullName email phone');

  if (!ticket) {
    throw new NotFoundError('Ticket not found');
  }

  // Check authorization
  if (req.userType === 'user' && ticket.customerId._id.toString() !== req.user._id.toString()) {
    throw new AuthorizationError('You can only view your own tickets');
  }

  successResponse(res, { ticket }, 'Ticket retrieved successfully');
});

/**
 * @desc    Download ticket as PDF
 * @route   GET /api/tickets/:id/download
 * @access  Private
 */
export const downloadTicket = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findById(req.params.id)
    .populate('bookingId');

  if (!ticket) {
    throw new NotFoundError('Ticket not found');
  }

  // Check authorization
  if (req.userType === 'user' && ticket.customerId.toString() !== req.user._id.toString()) {
    throw new AuthorizationError('You can only download your own tickets');
  }

  // Check if ticket is valid
  if (!ticket.isValid) {
    throw new BadRequestError('This ticket is invalid');
  }

  // Check booking status
  if (ticket.bookingId.status !== 'confirmed') {
    throw new BadRequestError('Ticket is only available for confirmed bookings');
  }

  // Generate PDF HTML
  const pdfHTML = await generateTicketPDF(ticket);

  // Return HTML (frontend can convert to PDF using libraries like html2pdf or print)
  successResponse(res, {
    ticketCode: ticket.ticketCode,
    html: pdfHTML
  }, 'Ticket PDF generated');
});

/**
 * @desc    Validate ticket by QR code
 * @route   POST /api/tickets/validate
 * @access  Private (Staff/Trip Manager)
 */
export const validateTicketQR = asyncHandler(async (req, res) => {
  const { qrData } = req.body;

  if (!qrData) {
    throw new BadRequestError('QR code data is required');
  }

  // Validate ticket
  const validationResult = await validateTicket(qrData);

  successResponse(res, validationResult, validationResult.valid ? 'Ticket is valid' : 'Ticket validation failed');
});

/**
 * @desc    Check-in passenger (mark ticket as used)
 * @route   POST /api/tickets/:id/checkin
 * @access  Private (Staff/Trip Manager)
 */
export const checkinPassenger = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    throw new NotFoundError('Ticket not found');
  }

  if (!ticket.isValid) {
    throw new BadRequestError('This ticket is invalid');
  }

  if (ticket.isUsed) {
    throw new BadRequestError(`This ticket was already used at ${ticket.usedAt.toLocaleString('vi-VN')}`);
  }

  // Mark ticket as used
  await useTicket(ticket._id, req.user._id);

  // Also update booking check-in
  const booking = await Booking.findById(ticket.bookingId);
  if (!booking.checkedInSeats.includes(ticket.seatNumber)) {
    booking.checkedInSeats.push(ticket.seatNumber);
    if (!booking.checkedInAt) {
      booking.checkedInAt = new Date();
      booking.checkedInBy = req.user._id;
    }
    await booking.save();
  }

  successResponse(res, {
    ticket: {
      ticketCode: ticket.ticketCode,
      seatNumber: ticket.seatNumber,
      passenger: ticket.passenger,
      usedAt: new Date()
    }
  }, 'Passenger checked in successfully');
});

/**
 * @desc    Get my tickets
 * @route   GET /api/tickets/my-tickets
 * @access  Private (Customer)
 */
export const getMyTickets = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;

  const query = { customerId: req.user._id };

  // Filter by status
  if (status) {
    if (status === 'valid') {
      query.isValid = true;
      query.isUsed = false;
    } else if (status === 'used') {
      query.isUsed = true;
    } else if (status === 'invalid') {
      query.isValid = false;
    }
  }

  const total = await Ticket.countDocuments(query);

  const tickets = await Ticket.find(query)
    .populate('bookingId', 'bookingCode status')
    .populate('tripId', 'departureTime arrivalTime status')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  successResponse(res, {
    tickets,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit)
    }
  }, 'Tickets retrieved successfully');
});

/**
 * @desc    Get upcoming trips (tickets for future trips)
 * @route   GET /api/tickets/upcoming
 * @access  Private (Customer)
 */
export const getUpcomingTrips = asyncHandler(async (req, res) => {
  const tickets = await Ticket.find({
    customerId: req.user._id,
    isValid: true,
    isUsed: false,
    'tripDetails.departureTime': { $gte: new Date() }
  })
    .populate('bookingId', 'bookingCode status')
    .populate('tripId', 'departureTime arrivalTime status')
    .sort({ 'tripDetails.departureTime': 1 })
    .limit(10);

  successResponse(res, { tickets }, 'Upcoming trips retrieved successfully');
});

/**
 * @desc    Get ticket statistics (for operators)
 * @route   GET /api/tickets/statistics
 * @access  Private (Operator)
 */
export const getTicketStatistics = asyncHandler(async (req, res) => {
  if (req.userType !== 'operator') {
    throw new AuthorizationError('Only operators can access statistics');
  }

  // Get operator's trips
  const { Trip } = await import('../models/index.js');
  const trips = await Trip.find({ operatorId: req.user._id }).select('_id');
  const tripIds = trips.map(t => t._id);

  // Count tickets
  const totalTickets = await Ticket.countDocuments({ tripId: { $in: tripIds } });
  const usedTickets = await Ticket.countDocuments({ tripId: { $in: tripIds }, isUsed: true });
  const validTickets = await Ticket.countDocuments({ tripId: { $in: tripIds }, isValid: true, isUsed: false });
  const invalidTickets = await Ticket.countDocuments({ tripId: { $in: tripIds }, isValid: false });

  successResponse(res, {
    statistics: {
      totalTickets,
      usedTickets,
      validTickets,
      invalidTickets,
      usageRate: totalTickets > 0 ? ((usedTickets / totalTickets) * 100).toFixed(2) : 0
    }
  }, 'Ticket statistics retrieved');
});

export default {
  getBookingTickets,
  getTicketById,
  downloadTicket,
  validateTicketQR,
  checkinPassenger,
  getMyTickets,
  getUpcomingTrips,
  getTicketStatistics
};
