import api from './api';

export const settingsService = {
  // Get system settings (admin)
  getSettings: async () => {
    const response = await api.get('/settings');
    return response.data;
  },

  // Update system settings (admin)
  updateSettings: async (settingsData) => {
    const response = await api.put('/settings', settingsData);
    return response.data;
  },

  // Test email configuration
  testEmail: async (email) => {
    const response = await api.post('/settings/test-email', { email });
    return response.data;
  },
};

export default settingsService;
