import api from './api';

export const tripService = {
  // Search trips
  searchTrips: async (params) => {
    const response = await api.get('/trips/search', { params });
    return response.data;
  },

  // Get trip details
  getTripDetails: async (tripId) => {
    const response = await api.get(`/trips/${tripId}`);
    return response.data;
  },

  // Get available seats
  getAvailableSeats: async (tripId) => {
    const response = await api.get(`/trips/${tripId}/seats`);
    return response.data;
  },

  // Lock seats
  lockSeats: async (tripId, seatNumbers, sessionId) => {
    const response = await api.post(`/trips/${tripId}/lock-seats`, {
      seatNumbers,
      sessionId,
    });
    return response.data;
  },

  // Release seats
  releaseSeats: async (tripId, sessionId) => {
    const response = await api.post(`/trips/${tripId}/release-seats`, {
      sessionId,
    });
    return response.data;
  },
};

export default tripService;
