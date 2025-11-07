import QRCode from 'qrcode';
import crypto from 'crypto';
import { Ticket } from '../models/index.js';

/**
 * Generate QR Code for ticket
 */
export const generateQRCode = async (data) => {
  try {
    // Convert data to string
    const qrData = typeof data === 'string' ? data : JSON.stringify(data);

    // Generate QR code as data URL
    const qrCodeDataURL = await QRCode.toDataURL(qrData, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.95,
      margin: 1,
      width: 300
    });

    return qrCodeDataURL;
  } catch (error) {
    throw new Error(`Failed to generate QR code: ${error.message}`);
  }
};

/**
 * Encrypt ticket data for QR code
 */
export const encryptTicketData = (ticketData) => {
  // DEMO: Simple base64 encoding
  // In production, use proper encryption (AES-256-GCM)

  const data = JSON.stringify(ticketData);
  const encrypted = Buffer.from(data).toString('base64');

  return encrypted;
};

/**
 * Decrypt ticket data from QR code
 */
export const decryptTicketData = (encryptedData) => {
  try {
    // DEMO: Simple base64 decoding
    const decrypted = Buffer.from(encryptedData, 'base64').toString('utf-8');
    return JSON.parse(decrypted);
  } catch (error) {
    throw new Error('Invalid or corrupted ticket data');
  }
};

/**
 * Generate e-ticket for a booking seat
 */
export const generateTicket = async (bookingData, seatData, tripData) => {
  // Generate unique ticket code
  const ticketCode = await Ticket.generateTicketCode();

  // Prepare ticket data for QR code
  const ticketData = {
    ticketCode,
    bookingId: bookingData._id.toString(),
    tripId: tripData._id.toString(),
    seatNumber: seatData.seatNumber,
    passengerName: seatData.passenger.fullName,
    passengerPhone: seatData.passenger.phone,
    departureTime: tripData.departureTime,
    issuedAt: new Date().toISOString()
  };

  // Encrypt ticket data
  const encryptedData = encryptTicketData(ticketData);

  // Generate QR code
  const qrCode = await generateQRCode(encryptedData);

  // Create ticket in database
  const ticket = await Ticket.create({
    ticketCode,
    bookingId: bookingData._id,
    customerId: bookingData.customerId,
    tripId: tripData._id,
    seatNumber: seatData.seatNumber,
    passenger: seatData.passenger,
    qrCode,
    qrData: encryptedData,
    tripDetails: {
      routeName: tripData.routeId.routeName,
      origin: `${tripData.routeId.origin.city}, ${tripData.routeId.origin.province}`,
      destination: `${tripData.routeId.destination.city}, ${tripData.routeId.destination.province}`,
      departureTime: tripData.departureTime,
      busNumber: tripData.busId.busNumber,
      operatorName: tripData.operatorId.companyName
    }
  });

  return ticket;
};

/**
 * Generate tickets for all seats in a booking
 */
export const generateTicketsForBooking = async (booking) => {
  // Populate booking with trip details
  await booking.populate([
    {
      path: 'tripId',
      populate: [
        { path: 'routeId' },
        { path: 'busId' },
        { path: 'operatorId', select: 'companyName' }
      ]
    }
  ]);

  const tickets = [];

  // Generate ticket for each seat
  for (const seat of booking.seats) {
    const ticket = await generateTicket(booking, seat, booking.tripId);
    tickets.push(ticket);
  }

  return tickets;
};

/**
 * Validate ticket by QR code data
 */
export const validateTicket = async (qrData) => {
  try {
    // Decrypt QR data
    const ticketData = decryptTicketData(qrData);

    // Find ticket in database
    const ticket = await Ticket.findOne({
      ticketCode: ticketData.ticketCode
    }).populate([
      { path: 'bookingId' },
      { path: 'tripId', populate: { path: 'routeId busId' } }
    ]);

    if (!ticket) {
      return {
        valid: false,
        message: 'Ticket not found'
      };
    }

    if (!ticket.isValid) {
      return {
        valid: false,
        message: 'Ticket is invalid'
      };
    }

    if (ticket.isUsed) {
      return {
        valid: false,
        message: 'Ticket already used',
        usedAt: ticket.usedAt
      };
    }

    // Check if trip matches
    if (ticket.tripId._id.toString() !== ticketData.tripId) {
      return {
        valid: false,
        message: 'Ticket does not match trip'
      };
    }

    // Check booking status
    if (ticket.bookingId.status !== 'confirmed') {
      return {
        valid: false,
        message: `Booking status is ${ticket.bookingId.status}`
      };
    }

    return {
      valid: true,
      message: 'Ticket is valid',
      ticket,
      passenger: ticket.passenger,
      seatNumber: ticket.seatNumber,
      tripDetails: ticket.tripDetails
    };
  } catch (error) {
    return {
      valid: false,
      message: 'Failed to validate ticket',
      error: error.message
    };
  }
};

/**
 * Mark ticket as used
 */
export const useTicket = async (ticketId, staffId) => {
  const ticket = await Ticket.findByIdAndUpdate(
    ticketId,
    {
      isUsed: true,
      usedAt: new Date(),
      validatedBy: staffId
    },
    { new: true }
  );

  return ticket;
};

/**
 * Invalidate ticket (for cancellations)
 */
export const invalidateTicket = async (ticketId) => {
  const ticket = await Ticket.findByIdAndUpdate(
    ticketId,
    { isValid: false },
    { new: true }
  );

  return ticket;
};

/**
 * Generate ticket PDF (demo - returns ticket data)
 * In production, use libraries like puppeteer or pdfkit
 */
export const generateTicketPDF = async (ticket) => {
  // DEMO: Return ticket HTML that can be converted to PDF on frontend
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>E-Ticket - ${ticket.ticketCode}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .ticket { border: 2px solid #268bff; padding: 20px; max-width: 600px; }
        .header { text-align: center; margin-bottom: 20px; }
        .qr-code { text-align: center; margin: 20px 0; }
        .details { margin: 10px 0; }
        .label { font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="ticket">
        <div class="header">
          <h1>🎫 E-TICKET</h1>
          <h2>Te_QuickRide</h2>
        </div>

        <div class="details">
          <p><span class="label">Ticket Code:</span> ${ticket.ticketCode}</p>
          <p><span class="label">Passenger:</span> ${ticket.passenger.fullName}</p>
          <p><span class="label">Phone:</span> ${ticket.passenger.phone}</p>
          <p><span class="label">Seat:</span> ${ticket.seatNumber}</p>
        </div>

        <div class="details">
          <p><span class="label">Route:</span> ${ticket.tripDetails.routeName}</p>
          <p><span class="label">From:</span> ${ticket.tripDetails.origin}</p>
          <p><span class="label">To:</span> ${ticket.tripDetails.destination}</p>
          <p><span class="label">Departure:</span> ${new Date(ticket.tripDetails.departureTime).toLocaleString('vi-VN')}</p>
          <p><span class="label">Bus:</span> ${ticket.tripDetails.busNumber}</p>
          <p><span class="label">Operator:</span> ${ticket.tripDetails.operatorName}</p>
        </div>

        <div class="qr-code">
          <img src="${ticket.qrCode}" alt="QR Code" width="200" height="200" />
          <p>Scan this QR code at boarding</p>
        </div>

        <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #666;">
          <p>This is a valid e-ticket. Please present this at boarding.</p>
          <p>Issued: ${new Date(ticket.createdAt).toLocaleString('vi-VN')}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return html;
};

export default {
  generateQRCode,
  encryptTicketData,
  decryptTicketData,
  generateTicket,
  generateTicketsForBooking,
  validateTicket,
  useTicket,
  invalidateTicket,
  generateTicketPDF
};
