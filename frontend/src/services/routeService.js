import api from './api';

export const routeService = {
  // Get all routes (public)
  getAllRoutes: async (params) => {
    const response = await api.get('/routes', { params });
    return response.data;
  },

  // Get route details
  getRouteDetails: async (routeId) => {
    const response = await api.get(`/routes/${routeId}`);
    return response.data;
  },

  // Search routes
  searchRoutes: async (searchParams) => {
    const response = await api.get('/routes/search', { params: searchParams });
    return response.data;
  },

  // Create route (operator)
  createRoute: async (routeData) => {
    const response = await api.post('/routes', routeData);
    return response.data;
  },

  // Update route (operator)
  updateRoute: async (routeId, routeData) => {
    const response = await api.put(`/routes/${routeId}`, routeData);
    return response.data;
  },

  // Delete route (operator)
  deleteRoute: async (routeId) => {
    const response = await api.delete(`/routes/${routeId}`);
    return response.data;
  },

  // Get my routes (operator)
  getMyRoutes: async (params) => {
    const response = await api.get('/routes/my', { params });
    return response.data;
  },

  // Get popular routes
  getPopularRoutes: async (limit = 10) => {
    const response = await api.get('/routes/popular', { params: { limit } });
    return response.data;
  },
};

export default routeService;
