/**
 * DEMO Notification Service
 * Simulates email and SMS sending
 * In production, integrate with SendGrid, AWS SES, VNPT SMS, etc.
 */

/**
 * Send Email (DEMO)
 */
export const sendEmail = async (to, subject, htmlContent, attachments = []) => {
  // DEMO: Log email instead of actually sending
  console.log('📧 [DEMO] Sending Email:');
  console.log('  To:', to);
  console.log('  Subject:', subject);
  console.log('  Content:', htmlContent.substring(0, 100) + '...');
  if (attachments.length > 0) {
    console.log('  Attachments:', attachments.length);
  }

  // Simulate delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // DEMO: Always succeed
  return {
    success: true,
    messageId: `demo-email-${Date.now()}`,
    to,
    subject,
    sentAt: new Date()
  };
};

/**
 * Send SMS (DEMO)
 */
export const sendSMS = async (phone, message) => {
  // DEMO: Log SMS instead of actually sending
  console.log('📱 [DEMO] Sending SMS:');
  console.log('  To:', phone);
  console.log('  Message:', message);

  // Simulate delay
  await new Promise(resolve => setTimeout(resolve, 300));

  // DEMO: Always succeed
  return {
    success: true,
    messageId: `demo-sms-${Date.now()}`,
    phone,
    sentAt: new Date()
  };
};

/**
 * Send Booking Confirmation Email
 */
export const sendBookingConfirmation = async (booking, tickets) => {
  const emailContent = `
    <h1>Booking Confirmation</h1>
    <p>Dear ${booking.seats[0].passenger.fullName},</p>
    <p>Your booking has been confirmed!</p>

    <h2>Booking Details:</h2>
    <ul>
      <li><strong>Booking Code:</strong> ${booking.bookingCode}</li>
      <li><strong>Total Amount:</strong> ${booking.totalAmount.toLocaleString('vi-VN')} VNĐ</li>
      <li><strong>Seats:</strong> ${booking.seats.map(s => s.seatNumber).join(', ')}</li>
    </ul>

    <h2>Trip Information:</h2>
    <ul>
      <li><strong>Route:</strong> ${tickets[0].tripDetails.routeName}</li>
      <li><strong>Departure:</strong> ${new Date(tickets[0].tripDetails.departureTime).toLocaleString('vi-VN')}</li>
      <li><strong>Bus:</strong> ${tickets[0].tripDetails.busNumber}</li>
    </ul>

    <p>Your e-tickets are attached to this email.</p>
    <p>Please show the QR code at boarding.</p>

    <p>Thank you for choosing Te_QuickRide!</p>
  `;

  return await sendEmail(
    booking.contactEmail,
    `Booking Confirmation - ${booking.bookingCode}`,
    emailContent,
    tickets.map(t => ({ ticketCode: t.ticketCode, qrCode: t.qrCode }))
  );
};

/**
 * Send Booking Confirmation SMS
 */
export const sendBookingConfirmationSMS = async (booking) => {
  const message = `Te_QuickRide: Booking ${booking.bookingCode} confirmed! ` +
    `Seats: ${booking.seats.map(s => s.seatNumber).join(',')}. ` +
    `Check email for e-tickets.`;

  return await sendSMS(booking.contactPhone, message);
};

/**
 * Send Cancellation Notification
 */
export const sendCancellationNotification = async (booking) => {
  const emailContent = `
    <h1>Booking Cancellation</h1>
    <p>Dear Customer,</p>
    <p>Your booking ${booking.bookingCode} has been cancelled.</p>

    <h2>Refund Information:</h2>
    <ul>
      <li><strong>Refund Amount:</strong> ${booking.refundAmount.toLocaleString('vi-VN')} VNĐ</li>
      <li><strong>Status:</strong> ${booking.refundStatus}</li>
      <li><strong>Processing Time:</strong> 7-10 business days</li>
    </ul>

    <p>The refund will be processed to your original payment method.</p>
    <p>If you have any questions, please contact our support team.</p>
  `;

  await sendEmail(
    booking.contactEmail,
    `Booking Cancellation - ${booking.bookingCode}`,
    emailContent
  );

  const smsMessage = `Te_QuickRide: Booking ${booking.bookingCode} cancelled. ` +
    `Refund ${booking.refundAmount.toLocaleString()} VND in 7-10 days.`;

  await sendSMS(booking.contactPhone, smsMessage);
};

/**
 * Send Payment Success Notification
 */
export const sendPaymentSuccess = async (booking, payment) => {
  const message = `Te_QuickRide: Payment successful! ` +
    `${payment.amount.toLocaleString()} VND via ${payment.paymentMethod.toUpperCase()}. ` +
    `Booking ${booking.bookingCode} confirmed.`;

  return await sendSMS(booking.contactPhone, message);
};

/**
 * Send OTP for Phone Verification
 */
export const sendOTP = async (phone, otp) => {
  const message = `Te_QuickRide: Your verification code is ${otp}. ` +
    `Valid for 10 minutes. Do not share this code.`;

  return await sendSMS(phone, message);
};

/**
 * Send Password Reset Email
 */
export const sendPasswordResetEmail = async (email, resetUrl) => {
  const emailContent = `
    <h1>Password Reset Request</h1>
    <p>You have requested to reset your password.</p>
    <p>Click the link below to reset your password:</p>
    <p><a href="${resetUrl}">${resetUrl}</a></p>
    <p>This link will expire in 1 hour.</p>
    <p>If you didn't request this, please ignore this email.</p>
  `;

  return await sendEmail(
    email,
    'Password Reset - Te_QuickRide',
    emailContent
  );
};

/**
 * Send Trip Reminder (24 hours before departure)
 */
export const sendTripReminder = async (booking, tickets) => {
  const emailContent = `
    <h1>Trip Reminder</h1>
    <p>Dear ${booking.seats[0].passenger.fullName},</p>
    <p>This is a reminder that your trip is scheduled for tomorrow!</p>

    <h2>Trip Details:</h2>
    <ul>
      <li><strong>Booking Code:</strong> ${booking.bookingCode}</li>
      <li><strong>Route:</strong> ${tickets[0].tripDetails.routeName}</li>
      <li><strong>Departure:</strong> ${new Date(tickets[0].tripDetails.departureTime).toLocaleString('vi-VN')}</li>
      <li><strong>Seats:</strong> ${booking.seats.map(s => s.seatNumber).join(', ')}</li>
    </ul>

    <p>Please arrive at the pickup point 15 minutes early.</p>
    <p>Have your e-ticket QR code ready for scanning.</p>
    <p>Have a safe journey!</p>
  `;

  await sendEmail(
    booking.contactEmail,
    `Trip Reminder - ${booking.bookingCode}`,
    emailContent
  );

  const smsMessage = `Te_QuickRide: Trip reminder! ` +
    `${tickets[0].tripDetails.routeName} tomorrow at ` +
    `${new Date(tickets[0].tripDetails.departureTime).toLocaleTimeString('vi-VN')}. ` +
    `Seats: ${booking.seats.map(s => s.seatNumber).join(',')}`;

  await sendSMS(booking.contactPhone, smsMessage);
};

/**
 * Send Welcome Email (after registration)
 */
export const sendWelcomeEmail = async (user) => {
  const emailContent = `
    <h1>Welcome to Te_QuickRide! 🚌</h1>
    <p>Dear ${user.fullName},</p>
    <p>Thank you for registering with Te_QuickRide - Vietnam's leading online bus booking platform.</p>

    <h2>Get Started:</h2>
    <ul>
      <li>Search for your destination</li>
      <li>Choose your preferred bus and seat</li>
      <li>Pay securely online</li>
      <li>Receive your e-ticket instantly</li>
    </ul>

    <p>Enjoy special discounts and earn loyalty points with every booking!</p>
    <p>Happy traveling!</p>
  `;

  return await sendEmail(
    user.email,
    'Welcome to Te_QuickRide! 🚌',
    emailContent
  );
};

/**
 * Send Operator Approval Notification
 */
export const sendOperatorApproval = async (operator, status, reason = null) => {
  const isApproved = status === 'approved';

  const emailContent = isApproved ? `
    <h1>Congratulations! Your Account is Approved ✅</h1>
    <p>Dear ${operator.companyName},</p>
    <p>Your bus operator account has been approved by Te_QuickRide admin.</p>
    <p>You can now start adding routes, buses, and trips to your dashboard.</p>
    <p>Login to your account to get started.</p>
  ` : `
    <h1>Account Registration Update</h1>
    <p>Dear ${operator.companyName},</p>
    <p>We regret to inform you that your bus operator registration has been rejected.</p>
    <p><strong>Reason:</strong> ${reason}</p>
    <p>Please contact our support team if you have any questions.</p>
  `;

  return await sendEmail(
    operator.email,
    isApproved ? 'Account Approved - Te_QuickRide' : 'Registration Update - Te_QuickRide',
    emailContent
  );
};

export default {
  sendEmail,
  sendSMS,
  sendBookingConfirmation,
  sendBookingConfirmationSMS,
  sendCancellationNotification,
  sendPaymentSuccess,
  sendOTP,
  sendPasswordResetEmail,
  sendTripReminder,
  sendWelcomeEmail,
  sendOperatorApproval
};
