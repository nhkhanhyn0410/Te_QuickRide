import api from './api';

export const reviewService = {
  // Create review
  createReview: async (reviewData) => {
    const response = await api.post('/reviews', reviewData);
    return response.data;
  },

  // Get trip reviews
  getTripReviews: async (tripId) => {
    const response = await api.get(`/reviews/trip/${tripId}`);
    return response.data;
  },

  // Get operator reviews
  getOperatorReviews: async (operatorId, params) => {
    const response = await api.get(`/reviews/operator/${operatorId}`, { params });
    return response.data;
  },

  // Get my reviews
  getMyReviews: async (params) => {
    const response = await api.get('/reviews/my', { params });
    return response.data;
  },

  // Update review
  updateReview: async (reviewId, reviewData) => {
    const response = await api.put(`/reviews/${reviewId}`, reviewData);
    return response.data;
  },

  // Delete review
  deleteReview: async (reviewId) => {
    const response = await api.delete(`/reviews/${reviewId}`);
    return response.data;
  },

  // Respond to review (operator)
  respondToReview: async (reviewId, responseText) => {
    const response = await api.post(`/reviews/${reviewId}/respond`, { responseText });
    return response.data;
  },
};

export default reviewService;
