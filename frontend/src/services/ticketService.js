import api from './api';

export const ticketService = {
  // Get my tickets
  getMyTickets: async (params) => {
    const response = await api.get('/tickets/my-tickets', { params });
    return response.data;
  },

  // Get booking tickets
  getBookingTickets: async (bookingId) => {
    const response = await api.get(`/tickets/booking/${bookingId}`);
    return response.data;
  },

  // Get ticket details
  getTicketDetails: async (ticketId) => {
    const response = await api.get(`/tickets/${ticketId}`);
    return response.data;
  },

  // Download ticket
  downloadTicket: async (ticketId) => {
    const response = await api.get(`/tickets/${ticketId}/download`);
    return response.data;
  },

  // Get upcoming trips
  getUpcomingTrips: async () => {
    const response = await api.get('/tickets/upcoming');
    return response.data;
  },
};

export default ticketService;
