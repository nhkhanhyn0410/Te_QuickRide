import api from './api';

export const bookingService = {
  // Create booking
  createBooking: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  // Get booking details
  getBookingDetails: async (bookingId) => {
    const response = await api.get(`/bookings/${bookingId}`);
    return response.data;
  },

  // Get my bookings
  getMyBookings: async (params) => {
    const response = await api.get('/bookings/my-bookings', { params });
    return response.data;
  },

  // Cancel booking
  cancelBooking: async (bookingId, cancellationReason) => {
    const response = await api.put(`/bookings/${bookingId}/cancel`, {
      cancellationReason,
    });
    return response.data;
  },

  // Get operator bookings
  getOperatorBookings: async (params) => {
    const response = await api.get('/bookings/operator', { params });
    return response.data;
  },

  // Update booking (operator)
  updateBooking: async (bookingId, bookingData) => {
    const response = await api.put(`/bookings/${bookingId}`, bookingData);
    return response.data;
  },

  // Confirm booking (operator)
  confirmBooking: async (bookingId) => {
    const response = await api.put(`/bookings/${bookingId}/confirm`);
    return response.data;
  },

  // Get all bookings (admin)
  getAllBookings: async (params) => {
    const response = await api.get('/bookings', { params });
    return response.data;
  },
};

export default bookingService;
