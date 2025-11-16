import api from './api';

export const staffService = {
  // Get all staff (operator)
  getAllStaff: async (params) => {
    const response = await api.get('/staff/my', { params });
    return response.data;
  },

  // Get staff details
  getStaffDetails: async (staffId) => {
    const response = await api.get(`/staff/${staffId}`);
    return response.data;
  },

  // Create staff (operator)
  createStaff: async (staffData) => {
    const response = await api.post('/staff', staffData);
    return response.data;
  },

  // Update staff (operator)
  updateStaff: async (staffId, staffData) => {
    const response = await api.put(`/staff/${staffId}`, staffData);
    return response.data;
  },

  // Delete staff (operator)
  deleteStaff: async (staffId) => {
    const response = await api.delete(`/staff/${staffId}`);
    return response.data;
  },

  // Assign staff to trip
  assignToTrip: async (staffId, tripId) => {
    const response = await api.post(`/staff/${staffId}/assign-trip`, { tripId });
    return response.data;
  },

  // Get staff trips/schedule
  getStaffSchedule: async (staffId, params) => {
    const response = await api.get(`/staff/${staffId}/trips`, { params });
    return response.data;
  },
};

export default staffService;
