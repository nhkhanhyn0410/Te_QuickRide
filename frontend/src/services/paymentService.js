import api from './api';

export const paymentService = {
  // Create payment
  createPayment: async (bookingId, paymentMethod) => {
    const response = await api.post('/payments/create', {
      bookingId,
      paymentMethod,
    });
    return response.data;
  },

  // Get payment status
  getPaymentStatus: async (paymentId) => {
    const response = await api.get(`/payments/${paymentId}/status`);
    return response.data;
  },

  // Get payment history
  getMyPayments: async (params) => {
    const response = await api.get('/payments/my-payments', { params });
    return response.data;
  },
};

export default paymentService;
