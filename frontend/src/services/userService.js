import api from './api';

export const userService = {
  // Get all users (admin)
  getAllUsers: async (params) => {
    const response = await api.get('/users', { params });
    return response.data;
  },

  // Get user details
  getUserDetails: async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  // Get my profile
  getMyProfile: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },

  // Update profile
  updateProfile: async (userData) => {
    const response = await api.put('/users/me', userData);
    return response.data;
  },

  // Update user (admin)
  updateUser: async (userId, userData) => {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
  },

  // Delete user (admin)
  deleteUser: async (userId) => {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  },

  // Block user (admin)
  blockUser: async (userId, reason) => {
    const response = await api.put(`/users/${userId}/block`, { reason });
    return response.data;
  },

  // Unblock user (admin)
  unblockUser: async (userId) => {
    const response = await api.put(`/users/${userId}/unblock`);
    return response.data;
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    const response = await api.put('/users/me/password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  // Get user statistics (admin)
  getUserStatistics: async () => {
    const response = await api.get('/users/statistics');
    return response.data;
  },
};

export default userService;
