import asyncHandler from '../utils/asyncHandler.js';
import { successResponse, paginatedResponse } from '../utils/response.js';
import {
  NotFoundError,
  BadRequestError,
  AuthorizationError
} from '../utils/errors.js';
import { Booking, Trip, Payment } from '../models/index.js';

/**
 * @desc    Create new booking
 * @route   POST /api/bookings
 * @access  Private (Customer)
 */
export const createBooking = asyncHandler(async (req, res) => {
  const {
    tripId,
    seats,
    pickupPoint,
    dropoffPoint,
    contactEmail,
    contactPhone,
    voucherCode,
    notes
  } = req.body;

  // Get trip
  const trip = await Trip.findById(tripId).populate('busId routeId operatorId');

  if (!trip) {
    throw new NotFoundError('Trip not found');
  }

  if (trip.status !== 'scheduled' && trip.status !== 'boarding') {
    throw new BadRequestError('This trip is not available for booking');
  }

  // Check if seats are available
  const seatNumbers = seats.map(s => s.seatNumber);

  // Check seat availability
  for (const seatNumber of seatNumbers) {
    if (!trip.isSeatAvailable(seatNumber)) {
      // Check specific reason for unavailability
      if (trip.occupiedSeats.includes(seatNumber)) {
        throw new BadRequestError(`Seat ${seatNumber} is already booked`);
      } else {
        throw new BadRequestError(`Seat ${seatNumber} is currently being selected by another user`);
      }
    }
  }

  if (seatNumbers.length > trip.availableSeats) {
    throw new BadRequestError('Not enough seats available');
  }

  // Calculate pricing
  const subtotal = trip.basePrice * seats.length;
  let discount = 0;

  // TODO: Apply voucher if provided
  // if (voucherCode) {
  //   const voucher = await Voucher.findOne({ code: voucherCode, isActive: true });
  //   if (voucher) {
  //     discount = calculateDiscount(voucher, subtotal);
  //   }
  // }

  const totalAmount = subtotal - discount;

  // Generate booking code
  const bookingCode = await Booking.generateBookingCode();

  // Create booking
  const booking = await Booking.create({
    bookingCode,
    customerId: req.user._id,
    tripId,
    operatorId: trip.operatorId._id,
    seats,
    pickupPoint,
    dropoffPoint,
    subtotal,
    discount,
    totalAmount,
    voucherCode,
    contactEmail,
    contactPhone,
    notes,
    status: 'pending'
  });

  // Occupy seats in trip
  await trip.occupySeats(seatNumbers);

  // Populate booking details
  await booking.populate([
    {
      path: 'tripId',
      populate: [
        { path: 'routeId', select: 'routeName origin destination' },
        { path: 'busId', select: 'busNumber busType' }
      ]
    },
    { path: 'operatorId', select: 'companyName phone email' }
  ]);

  successResponse(res, {
    booking,
    message: 'Booking created successfully. Please proceed to payment.'
  }, 'Booking created', 201);
});

/**
 * @desc    Get booking details
 * @route   GET /api/bookings/:id
 * @access  Private
 */
export const getBookingDetails = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate({
      path: 'tripId',
      populate: [
        { path: 'routeId' },
        { path: 'busId' }
      ]
    })
    .populate('operatorId', 'companyName phone email logo')
    .populate('customerId', 'fullName email phone');

  if (!booking) {
    throw new NotFoundError('Booking not found');
  }

  // Authorization check
  if (req.userType === 'user' && booking.customerId._id.toString() !== req.user._id.toString()) {
    throw new AuthorizationError('You can only view your own bookings');
  }

  if (req.userType === 'operator' && booking.operatorId._id.toString() !== req.user._id.toString()) {
    throw new AuthorizationError('You can only view bookings for your trips');
  }

  successResponse(res, { booking }, 'Booking details retrieved');
});

/**
 * @desc    Get user's bookings
 * @route   GET /api/bookings/my-bookings
 * @access  Private (Customer)
 */
export const getMyBookings = asyncHandler(async (req, res) => {
  if (req.userType !== 'user') {
    throw new AuthorizationError('Only customers can access this');
  }

  const { page = 1, limit = 20, status } = req.query;

  const query = { customerId: req.user._id };

  if (status) {
    query.status = status;
  }

  const total = await Booking.countDocuments(query);

  const bookings = await Booking.find(query)
    .populate({
      path: 'tripId',
      populate: [
        { path: 'routeId', select: 'routeName origin destination' },
        { path: 'busId', select: 'busNumber busType' }
      ]
    })
    .populate('operatorId', 'companyName logo')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  paginatedResponse(res, bookings, page, limit, total, 'Bookings retrieved');
});

/**
 * @desc    Get operator's bookings
 * @route   GET /api/bookings/operator-bookings
 * @access  Private (Operator)
 */
export const getOperatorBookings = asyncHandler(async (req, res) => {
  if (req.userType !== 'operator') {
    throw new AuthorizationError('Only bus operators can access this');
  }

  const { page = 1, limit = 20, status, tripId } = req.query;

  const query = { operatorId: req.user._id };

  if (status) {
    query.status = status;
  }

  if (tripId) {
    query.tripId = tripId;
  }

  const total = await Booking.countDocuments(query);

  const bookings = await Booking.find(query)
    .populate({
      path: 'tripId',
      populate: [
        { path: 'routeId', select: 'routeName origin destination' },
        { path: 'busId', select: 'busNumber busType' }
      ]
    })
    .populate('customerId', 'fullName phone email')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  paginatedResponse(res, bookings, page, limit, total, 'Bookings retrieved');
});

/**
 * @desc    Cancel booking
 * @route   PUT /api/bookings/:id/cancel
 * @access  Private (Customer)
 */
export const cancelBooking = asyncHandler(async (req, res) => {
  const { cancellationReason } = req.body;

  const booking = await Booking.findById(req.params.id).populate('tripId');

  if (!booking) {
    throw new NotFoundError('Booking not found');
  }

  // Check authorization
  if (req.userType === 'user' && booking.customerId.toString() !== req.user._id.toString()) {
    throw new AuthorizationError('You can only cancel your own bookings');
  }

  // Check if booking can be cancelled
  if (booking.status === 'cancelled') {
    throw new BadRequestError('Booking is already cancelled');
  }

  if (booking.status === 'completed') {
    throw new BadRequestError('Cannot cancel completed booking');
  }

  // Check cancellation policy (e.g., at least 24 hours before departure)
  const trip = booking.tripId;
  const hoursUntilDeparture = (trip.departureTime - new Date()) / (1000 * 60 * 60);

  if (hoursUntilDeparture < 24) {
    throw new BadRequestError('Cannot cancel booking less than 24 hours before departure');
  }

  // Update booking
  booking.status = 'cancelled';
  booking.cancellationReason = cancellationReason;
  booking.cancelledAt = new Date();

  // Calculate refund (100% if > 24 hours, otherwise based on policy)
  booking.refundAmount = booking.totalAmount;
  booking.refundStatus = 'pending';

  await booking.save();

  // Free up seats in trip (trip is already populated from line 229)
  const seatNumbers = booking.seats.map(s => s.seatNumber);

  seatNumbers.forEach(seatNumber => {
    const index = trip.occupiedSeats.indexOf(seatNumber);
    if (index > -1) {
      trip.occupiedSeats.splice(index, 1);
      trip.availableSeats++;
    }
  });

  await trip.save();

  // TODO: Process refund
  // await processRefund(booking);

  successResponse(res, {
    booking,
    message: 'Booking cancelled. Refund will be processed within 7-10 business days.'
  }, 'Booking cancelled successfully');
});

/**
 * @desc    Confirm booking payment (called after successful payment)
 * @route   PUT /api/bookings/:id/confirm
 * @access  Private
 */
export const confirmBooking = asyncHandler(async (req, res) => {
  const { paymentId } = req.body;

  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    throw new NotFoundError('Booking not found');
  }

  // Verify payment
  const payment = await Payment.findById(paymentId);

  if (!payment || payment.bookingId.toString() !== booking._id.toString()) {
    throw new BadRequestError('Invalid payment');
  }

  if (payment.status !== 'success') {
    throw new BadRequestError('Payment not successful');
  }

  // Update booking status
  booking.status = 'confirmed';
  await booking.save();

  // TODO: Generate tickets
  // await generateTickets(booking);

  // TODO: Send confirmation email/SMS
  // await sendBookingConfirmation(booking);

  successResponse(res, {
    booking,
    message: 'Booking confirmed! E-tickets have been sent to your email.'
  }, 'Booking confirmed successfully');
});

/**
 * @desc    Check-in passengers (Trip Manager)
 * @route   PUT /api/bookings/:id/checkin
 * @access  Private (Staff/Trip Manager)
 */
export const checkinBooking = asyncHandler(async (req, res) => {
  const { seatNumbers } = req.body;

  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    throw new NotFoundError('Booking not found');
  }

  if (booking.status !== 'confirmed') {
    throw new BadRequestError('Booking is not confirmed');
  }

  // Validate seat numbers
  const bookingSeatNumbers = booking.seats.map(s => s.seatNumber);
  const invalidSeats = seatNumbers.filter(s => !bookingSeatNumbers.includes(s));

  if (invalidSeats.length > 0) {
    throw new BadRequestError(`Invalid seats: ${invalidSeats.join(', ')}`);
  }

  // Add to checked-in seats
  booking.checkedInSeats = [...new Set([...booking.checkedInSeats, ...seatNumbers])];

  if (!booking.checkedInAt) {
    booking.checkedInAt = new Date();
    booking.checkedInBy = req.user._id;
  }

  await booking.save();

  successResponse(res, {
    booking,
    checkedInSeats: booking.checkedInSeats
  }, 'Passengers checked in successfully');
});
