import api from './api';

export const operatorService = {
  // Get all operators (public)
  getAllOperators: async (params) => {
    const response = await api.get('/operators', { params });
    return response.data;
  },

  // Get operator details
  getOperatorDetails: async (operatorId) => {
    const response = await api.get(`/operators/${operatorId}`);
    return response.data;
  },

  // Get operator profile (authenticated)
  getMyProfile: async () => {
    const response = await api.get('/operators/profile');
    return response.data;
  },

  // Update operator profile
  updateProfile: async (operatorData) => {
    const response = await api.put('/operators/profile', operatorData);
    return response.data;
  },

  // Create operator (admin)
  createOperator: async (operatorData) => {
    const response = await api.post('/operators', operatorData);
    return response.data;
  },

  // Update operator (admin)
  updateOperator: async (operatorId, operatorData) => {
    const response = await api.put(`/operators/${operatorId}`, operatorData);
    return response.data;
  },

  // Delete operator (admin)
  deleteOperator: async (operatorId) => {
    const response = await api.delete(`/operators/${operatorId}`);
    return response.data;
  },

  // Approve/verify operator (admin)
  approveOperator: async (operatorId, status, rejectionReason = null) => {
    const response = await api.put(`/operators/${operatorId}/verify`, {
      status,
      rejectionReason
    });
    return response.data;
  },

  // Suspend operator (admin)
  suspendOperator: async (operatorId, reason) => {
    const response = await api.put(`/operators/${operatorId}/suspend`, { reason });
    return response.data;
  },

  // Get operator statistics
  getOperatorStatistics: async (operatorId) => {
    const response = await api.get(`/operators/${operatorId}/statistics`);
    return response.data;
  },

  // Get my statistics (authenticated operator)
  getMyStatistics: async () => {
    const response = await api.get('/operators/statistics');
    return response.data;
  },
};

export default operatorService;
