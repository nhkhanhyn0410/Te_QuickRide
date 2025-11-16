import asyncHandler from '../utils/asyncHandler.js';
import { successResponse, paginatedResponse } from '../utils/response.js';
import {
  NotFoundError,
  BadRequestError,
  AuthorizationError
} from '../utils/errors.js';
import { generateTripCode } from '../utils/generateCode.js';
import { Trip, Route, Bus } from '../models/index.js';

/**
 * @desc    Search trips
 * @route   GET /api/trips/search
 * @access  Public
 */
export const searchTrips = asyncHandler(async (req, res) => {
  const {
    origin,
    destination,
    departureDate,
    page = 1,
    limit = 20
  } = req.query;

  // Find routes matching origin and destination
  const routes = await Route.find({
    'origin.city': { $regex: new RegExp(origin, 'i') },
    'destination.city': { $regex: new RegExp(destination, 'i') },
    isActive: true
  });

  if (routes.length === 0) {
    return paginatedResponse(res, [], page, limit, 0, 'No routes found');
  }

  const routeIds = routes.map(route => route._id);

  // Parse departure date range (whole day)
  const startDate = new Date(departureDate);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(departureDate);
  endDate.setHours(23, 59, 59, 999);

  // Find trips
  const query = {
    routeId: { $in: routeIds },
    departureTime: {
      $gte: startDate,
      $lte: endDate
    },
    status: { $in: ['scheduled', 'boarding'] },
    availableSeats: { $gt: 0 }
  };

  const total = await Trip.countDocuments(query);

  const trips = await Trip.find(query)
    .populate('routeId', 'routeName origin destination pickupPoints dropoffPoints distance estimatedDuration')
    .populate('busId', 'busType totalSeats amenities images')
    .populate('operatorId', 'companyName logo averageRating totalReviews')
    .sort({ departureTime: 1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  // Format response
  const formattedTrips = trips.map(trip => ({
    id: trip._id,
    tripCode: trip.tripCode,
    route: {
      id: trip.routeId._id,
      name: trip.routeId.routeName,
      origin: trip.routeId.origin,
      destination: trip.routeId.destination,
      distance: trip.routeId.distance,
      estimatedDuration: trip.routeId.estimatedDuration,
      pickupPoints: trip.routeId.pickupPoints,
      dropoffPoints: trip.routeId.dropoffPoints
    },
    bus: {
      type: trip.busId.busType,
      totalSeats: trip.busId.totalSeats,
      amenities: trip.busId.amenities,
      images: trip.busId.images
    },
    operator: {
      id: trip.operatorId._id,
      name: trip.operatorId.companyName,
      logo: trip.operatorId.logo,
      rating: trip.operatorId.averageRating,
      reviews: trip.operatorId.totalReviews
    },
    departureTime: trip.departureTime,
    arrivalTime: trip.arrivalTime,
    basePrice: trip.basePrice,
    availableSeats: trip.availableSeats,
    status: trip.status
  }));

  paginatedResponse(
    res,
    formattedTrips,
    page,
    limit,
    total,
    `Found ${total} trips`
  );
});

/**
 * @desc    Get trip details
 * @route   GET /api/trips/:id
 * @access  Public
 */
export const getTripDetails = asyncHandler(async (req, res) => {
  const trip = await Trip.findById(req.params.id)
    .populate('routeId')
    .populate('busId')
    .populate('operatorId', '-password')
    .populate('driver', 'fullName phone')
    .populate('tripManager', 'fullName phone');

  if (!trip) {
    throw new NotFoundError('Trip not found');
  }

  successResponse(res, { trip }, 'Trip details retrieved');
});

/**
 * @desc    Get available seats for a trip
 * @route   GET /api/trips/:id/seats
 * @access  Public
 */
export const getAvailableSeats = asyncHandler(async (req, res) => {
  const trip = await Trip.findById(req.params.id).populate('busId');

  if (!trip) {
    throw new NotFoundError('Trip not found');
  }

  const bus = trip.busId;

  // Clean up expired locks
  const now = new Date();
  trip.lockedSeats = trip.lockedSeats.filter(ls => ls.lockedUntil > now);
  await trip.save();

  // Generate seat map
  const seatLayout = bus.seatLayout.layout;
  const seats = [];

  seatLayout.forEach((row, rowIndex) => {
    row.forEach((seatNumber, colIndex) => {
      if (seatNumber) {
        const isOccupied = trip.occupiedSeats.includes(seatNumber);
        const lockedSeat = trip.lockedSeats.find(ls => ls.seatNumber === seatNumber);
        const isLocked = lockedSeat && lockedSeat.lockedUntil > now;

        seats.push({
          seatNumber,
          row: rowIndex,
          col: colIndex,
          status: isOccupied ? 'occupied' : (isLocked ? 'locked' : 'available')
        });
      }
    });
  });

  successResponse(res, {
    tripId: trip._id,
    busType: bus.busType,
    totalSeats: bus.totalSeats,
    availableSeats: trip.availableSeats,
    seatLayout: bus.seatLayout,
    seats
  }, 'Seat information retrieved');
});

/**
 * @desc    Lock seats temporarily (15 minutes)
 * @route   POST /api/trips/:id/lock-seats
 * @access  Public
 */
export const lockSeats = asyncHandler(async (req, res) => {
  const { seatNumbers, sessionId } = req.body;

  if (!seatNumbers || !Array.isArray(seatNumbers) || seatNumbers.length === 0) {
    throw new BadRequestError('Please provide seat numbers to lock');
  }

  if (!sessionId) {
    throw new BadRequestError('Session ID is required');
  }

  const trip = await Trip.findById(req.params.id);

  if (!trip) {
    throw new NotFoundError('Trip not found');
  }

  // Check if seats are available
  const now = new Date();
  for (const seatNumber of seatNumbers) {
    if (trip.occupiedSeats.includes(seatNumber)) {
      throw new BadRequestError(`Seat ${seatNumber} is already booked`);
    }

    const lockedSeat = trip.lockedSeats.find(
      ls => ls.seatNumber === seatNumber && ls.lockedUntil > now
    );

    if (lockedSeat && lockedSeat.sessionId !== sessionId) {
      throw new BadRequestError(`Seat ${seatNumber} is currently being selected by another user`);
    }
  }

  // Lock the seats
  await trip.lockSeats(seatNumbers, sessionId, 15);

  successResponse(res, {
    lockedSeats: seatNumbers,
    lockedUntil: new Date(Date.now() + 15 * 60 * 1000),
    sessionId
  }, 'Seats locked successfully');
});

/**
 * @desc    Release locked seats
 * @route   POST /api/trips/:id/release-seats
 * @access  Public
 */
export const releaseSeats = asyncHandler(async (req, res) => {
  const { sessionId } = req.body;

  if (!sessionId) {
    throw new BadRequestError('Session ID is required');
  }

  const trip = await Trip.findById(req.params.id);

  if (!trip) {
    throw new NotFoundError('Trip not found');
  }

  await trip.releaseLocks(sessionId);

  successResponse(res, null, 'Seats released successfully');
});

/**
 * @desc    Create new trip (Bus Operator only)
 * @route   POST /api/trips
 * @access  Private (Operator)
 */
export const createTrip = asyncHandler(async (req, res) => {
  if (req.userType !== 'operator') {
    throw new AuthorizationError('Only bus operators can create trips');
  }

  const {
    routeId,
    busId,
    departureTime,
    arrivalTime,
    basePrice,
    driverId,
    tripManagerId
  } = req.body;

  // Verify route belongs to operator
  const route = await Route.findOne({
    _id: routeId,
    operatorId: req.user._id
  });

  if (!route) {
    throw new NotFoundError('Route not found or does not belong to you');
  }

  // Verify bus belongs to operator
  const bus = await Bus.findOne({
    _id: busId,
    operatorId: req.user._id
  });

  if (!bus) {
    throw new NotFoundError('Bus not found or does not belong to you');
  }

  // Generate trip code
  const tripCode = generateTripCode(route.routeCode);

  // Create trip
  const trip = await Trip.create({
    operatorId: req.user._id,
    routeId,
    busId,
    tripCode,
    departureTime,
    arrivalTime,
    basePrice,
    availableSeats: bus.totalSeats,
    driver: driverId,
    tripManager: tripManagerId,
    status: 'scheduled'
  });

  await trip.populate('routeId busId');

  successResponse(res, { trip }, 'Trip created successfully', 201);
});

/**
 * @desc    Update trip (Bus Operator only)
 * @route   PUT /api/trips/:id
 * @access  Private (Operator)
 */
export const updateTrip = asyncHandler(async (req, res) => {
  if (req.userType !== 'operator') {
    throw new AuthorizationError('Only bus operators can update trips');
  }

  const trip = await Trip.findOne({
    _id: req.params.id,
    operatorId: req.user._id
  });

  if (!trip) {
    throw new NotFoundError('Trip not found or does not belong to you');
  }

  // Only allow updates if trip is scheduled
  if (trip.status !== 'scheduled' && req.body.status !== 'cancelled') {
    throw new BadRequestError('Cannot update trip that has already started');
  }

  // Update allowed fields
  const allowedUpdates = ['departureTime', 'arrivalTime', 'basePrice', 'status', 'driver', 'tripManager'];
  Object.keys(req.body).forEach(key => {
    if (allowedUpdates.includes(key)) {
      trip[key] = req.body[key];
    }
  });

  await trip.save();

  successResponse(res, { trip }, 'Trip updated successfully');
});

/**
 * @desc    Cancel trip (Bus Operator only)
 * @route   DELETE /api/trips/:id
 * @access  Private (Operator)
 */
export const cancelTrip = asyncHandler(async (req, res) => {
  if (req.userType !== 'operator') {
    throw new AuthorizationError('Only bus operators can cancel trips');
  }

  const { cancellationReason } = req.body;

  const trip = await Trip.findOne({
    _id: req.params.id,
    operatorId: req.user._id
  });

  if (!trip) {
    throw new NotFoundError('Trip not found or does not belong to you');
  }

  if (trip.status === 'cancelled') {
    throw new BadRequestError('Trip is already cancelled');
  }

  if (trip.status === 'completed') {
    throw new BadRequestError('Cannot cancel completed trip');
  }

  trip.status = 'cancelled';
  trip.cancellationReason = cancellationReason;
  await trip.save();

  // TODO: Notify customers and process refunds

  successResponse(res, { trip }, 'Trip cancelled successfully');
});

/**
 * @desc    Get operator's trips
 * @route   GET /api/trips/my-trips
 * @access  Private (Operator)
 */
export const getMyTrips = asyncHandler(async (req, res) => {
  if (req.userType !== 'operator') {
    throw new AuthorizationError('Only bus operators can access this');
  }

  const { page = 1, limit = 20, status } = req.query;

  const query = { operatorId: req.user._id };
  if (status) {
    query.status = status;
  }

  const total = await Trip.countDocuments(query);

  const trips = await Trip.find(query)
    .populate('routeId', 'routeName origin destination')
    .populate('busId', 'busNumber busType')
    .sort({ departureTime: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  paginatedResponse(res, trips, page, limit, total, 'Trips retrieved');
});
