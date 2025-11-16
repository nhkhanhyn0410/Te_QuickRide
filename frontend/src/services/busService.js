import api from './api';

export const busService = {
  // Get all buses (operator)
  getAllBuses: async (params) => {
    const response = await api.get('/buses', { params });
    return response.data;
  },

  // Get bus details
  getBusDetails: async (busId) => {
    const response = await api.get(`/buses/${busId}`);
    return response.data;
  },

  // Create bus (operator)
  createBus: async (busData) => {
    const response = await api.post('/buses', busData);
    return response.data;
  },

  // Update bus (operator)
  updateBus: async (busId, busData) => {
    const response = await api.put(`/buses/${busId}`, busData);
    return response.data;
  },

  // Delete bus (operator)
  deleteBus: async (busId) => {
    const response = await api.delete(`/buses/${busId}`);
    return response.data;
  },

  // Get bus types
  getBusTypes: async () => {
    const response = await api.get('/buses/types');
    return response.data;
  },

  // Get bus availability
  getBusAvailability: async (busId, params) => {
    const response = await api.get(`/buses/${busId}/availability`, { params });
    return response.data;
  },
};

export default busService;
