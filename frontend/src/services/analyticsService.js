import api from './api';

export const analyticsService = {
  // Get dashboard stats (operator/admin)
  getDashboardStats: async (params) => {
    const response = await api.get('/analytics/dashboard', { params });
    return response.data;
  },

  // Get revenue analytics (operator/admin)
  getRevenueAnalytics: async (params) => {
    const response = await api.get('/analytics/revenue', { params });
    return response.data;
  },

  // Get booking analytics (operator/admin)
  getBookingAnalytics: async (params) => {
    const response = await api.get('/analytics/bookings', { params });
    return response.data;
  },

  // Get user growth analytics (admin)
  getUserGrowthAnalytics: async (params) => {
    const response = await api.get('/analytics/user-growth', { params });
    return response.data;
  },

  // Get operator performance (admin)
  getOperatorPerformance: async (params) => {
    const response = await api.get('/analytics/operator-performance', { params });
    return response.data;
  },

  // Get route analytics (operator/admin)
  getRouteAnalytics: async (params) => {
    const response = await api.get('/analytics/routes', { params });
    return response.data;
  },

  // Get top routes (admin)
  getTopRoutes: async (limit = 10) => {
    const response = await api.get('/analytics/top-routes', { params: { limit } });
    return response.data;
  },

  // Get commission analytics (admin)
  getCommissionAnalytics: async (params) => {
    const response = await api.get('/analytics/commission', { params });
    return response.data;
  },

  // Export analytics data
  exportAnalytics: async (type, params) => {
    const response = await api.get(`/analytics/export/${type}`, {
      params,
      responseType: 'blob',
    });
    return response.data;
  },
};

export default analyticsService;
