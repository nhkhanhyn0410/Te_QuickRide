import asyncHandler from '../utils/asyncHandler.js';
import { successResponse } from '../utils/response.js';
import { NotFoundError, BadRequestError } from '../utils/errors.js';
import { Booking, Payment, Ticket } from '../models/index.js';
import { getPaymentGateway, processDemoPayment } from '../services/paymentService.js';
import { generateTicketsForBooking } from '../services/ticketService.js';
import {
  sendBookingConfirmation,
  sendBookingConfirmationSMS,
  sendPaymentSuccess
} from '../services/notificationService.js';

/**
 * @desc    Create payment for booking
 * @route   POST /api/payments/create
 * @access  Private (Customer)
 */
export const createPayment = asyncHandler(async (req, res) => {
  const { bookingId, paymentMethod } = req.body;

  // Get booking
  const booking = await Booking.findById(bookingId);

  if (!booking) {
    throw new NotFoundError('Booking not found');
  }

  // Check if booking belongs to user
  if (booking.customerId.toString() !== req.user._id.toString()) {
    throw new BadRequestError('This booking does not belong to you');
  }

  // Check booking status
  if (booking.status !== 'pending') {
    throw new BadRequestError(`Cannot pay for booking with status: ${booking.status}`);
  }

  // Generate transaction ID
  const transactionId = await Payment.generateTransactionId();

  // Handle different payment methods
  const returnUrl = `${process.env.FRONTEND_URL}/booking/${bookingId}/payment-result`;

  if (['vnpay', 'momo', 'zalopay'].includes(paymentMethod.toLowerCase())) {
    // Get payment gateway
    const gateway = getPaymentGateway(paymentMethod);

    // Generate payment URL
    const paymentData = gateway.generatePaymentUrl({
      bookingId: booking._id,
      bookingCode: booking.bookingCode,
      amount: booking.totalAmount,
      returnUrl
    });

    // Create payment record
    const payment = await Payment.create({
      transactionId: paymentData.transactionId,
      bookingId: booking._id,
      customerId: req.user._id,
      amount: booking.totalAmount,
      currency: 'VND',
      paymentMethod: paymentMethod.toLowerCase(),
      status: 'pending'
    });

    successResponse(res, {
      payment,
      paymentUrl: paymentData.paymentUrl,
      gateway: paymentData.gateway,
      message: 'Redirect user to payment URL'
    }, 'Payment initiated', 201);

  } else if (paymentMethod.toLowerCase() === 'cod') {
    // Cash on Delivery - Create payment record
    const payment = await Payment.create({
      transactionId,
      bookingId: booking._id,
      customerId: req.user._id,
      amount: booking.totalAmount,
      currency: 'VND',
      paymentMethod: 'cod',
      status: 'pending'
    });

    // Update booking status to confirmed (COD doesn't require immediate payment)
    booking.status = 'confirmed';
    await booking.save();

    // Generate tickets
    const tickets = await generateTicketsForBooking(booking);

    // Send notifications
    await sendBookingConfirmation(booking, tickets);
    await sendBookingConfirmationSMS(booking);

    successResponse(res, {
      payment,
      booking,
      tickets: tickets.map(t => ({ ticketCode: t.ticketCode, qrCode: t.qrCode })),
      message: 'Booking confirmed with COD payment'
    }, 'Payment created', 201);

  } else {
    throw new BadRequestError('Invalid payment method');
  }
});

/**
 * @desc    Handle VNPay return callback
 * @route   GET /api/payments/vnpay/return
 * @access  Public
 */
export const vnpayReturn = asyncHandler(async (req, res) => {
  const gateway = getPaymentGateway('vnpay');

  // Verify callback
  const result = gateway.verifyCallback(req.query);

  // Find payment
  const payment = await Payment.findOne({
    transactionId: result.transactionId
  });

  if (!payment) {
    throw new NotFoundError('Payment not found');
  }

  // Update payment status
  payment.status = result.success ? 'success' : 'failed';
  payment.gatewayResponse = req.query;
  await payment.save();

  if (result.success) {
    // Update booking
    const booking = await Booking.findById(payment.bookingId);
    booking.status = 'confirmed';
    await booking.save();

    // Generate tickets
    const tickets = await generateTicketsForBooking(booking);

    // Send notifications
    await sendBookingConfirmation(booking, tickets);
    await sendBookingConfirmationSMS(booking);
    await sendPaymentSuccess(booking, payment);
  }

  successResponse(res, {
    payment,
    success: result.success,
    message: result.message
  }, 'Payment processed');
});

/**
 * @desc    Handle MoMo callback
 * @route   POST /api/payments/momo/callback
 * @access  Public
 */
export const momoCallback = asyncHandler(async (req, res) => {
  const gateway = getPaymentGateway('momo');

  // Verify callback
  const result = gateway.verifyCallback(req.body);

  // Find payment
  const payment = await Payment.findOne({
    transactionId: result.transactionId
  });

  if (!payment) {
    throw new NotFoundError('Payment not found');
  }

  // Update payment status
  payment.status = result.success ? 'success' : 'failed';
  payment.gatewayResponse = req.body;
  await payment.save();

  if (result.success) {
    // Update booking
    const booking = await Booking.findById(payment.bookingId);
    booking.status = 'confirmed';
    await booking.save();

    // Generate tickets
    const tickets = await generateTicketsForBooking(booking);

    // Send notifications
    await sendBookingConfirmation(booking, tickets);
    await sendBookingConfirmationSMS(booking);
    await sendPaymentSuccess(booking, payment);
  }

  // Return success to MoMo
  res.status(200).json({
    resultCode: 0,
    message: 'Success'
  });
});

/**
 * @desc    Handle ZaloPay callback
 * @route   POST /api/payments/zalopay/callback
 * @access  Public
 */
export const zaloPayCallback = asyncHandler(async (req, res) => {
  const gateway = getPaymentGateway('zalopay');

  // Verify callback
  const result = gateway.verifyCallback(req.body);

  // Find payment
  const payment = await Payment.findOne({
    transactionId: result.transactionId
  });

  if (!payment) {
    throw new NotFoundError('Payment not found');
  }

  // Update payment status
  payment.status = result.success ? 'success' : 'failed';
  payment.gatewayResponse = req.body;
  await payment.save();

  if (result.success) {
    // Update booking
    const booking = await Booking.findById(payment.bookingId);
    booking.status = 'confirmed';
    await booking.save();

    // Generate tickets
    const tickets = await generateTicketsForBooking(booking);

    // Send notifications
    await sendBookingConfirmation(booking, tickets);
    await sendBookingConfirmationSMS(booking);
    await sendPaymentSuccess(booking, payment);
  }

  // Return success to ZaloPay
  res.status(200).json({
    return_code: 1,
    return_message: 'Success'
  });
});

/**
 * @desc    Check payment status
 * @route   GET /api/payments/:id/status
 * @access  Private
 */
export const getPaymentStatus = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id)
    .populate('bookingId');

  if (!payment) {
    throw new NotFoundError('Payment not found');
  }

  // Check authorization
  if (payment.customerId.toString() !== req.user._id.toString()) {
    throw new BadRequestError('You can only view your own payments');
  }

  successResponse(res, { payment }, 'Payment status retrieved');
});

/**
 * @desc    Get payment history
 * @route   GET /api/payments/my-payments
 * @access  Private (Customer)
 */
export const getMyPayments = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;

  const payments = await Payment.find({ customerId: req.user._id })
    .populate('bookingId')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Payment.countDocuments({ customerId: req.user._id });

  successResponse(res, {
    payments,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit)
    }
  }, 'Payment history retrieved');
});

/**
 * @desc    Process refund (demo)
 * @route   POST /api/payments/:id/refund
 * @access  Private (Admin/System)
 */
export const processRefund = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id);

  if (!payment) {
    throw new NotFoundError('Payment not found');
  }

  if (payment.status !== 'success') {
    throw new BadRequestError('Can only refund successful payments');
  }

  // DEMO: Process refund
  payment.status = 'refunded';
  payment.refundAmount = payment.amount;
  payment.refundedAt = new Date();
  await payment.save();

  // Update booking
  const booking = await Booking.findById(payment.bookingId);
  booking.refundStatus = 'processed';
  await booking.save();

  successResponse(res, { payment }, 'Refund processed successfully');
});

export default {
  createPayment,
  vnpayReturn,
  momoCallback,
  zaloPayCallback,
  getPaymentStatus,
  getMyPayments,
  processRefund
};
