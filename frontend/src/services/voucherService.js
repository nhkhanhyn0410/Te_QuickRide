import api from './api';

export const voucherService = {
  // Get available vouchers (public)
  getAvailableVouchers: async (params) => {
    const response = await api.get('/vouchers/available', { params });
    return response.data;
  },

  // Get voucher by code
  getVoucherByCode: async (code) => {
    const response = await api.get(`/vouchers/${code}`);
    return response.data;
  },

  // Validate voucher (customer)
  validateVoucher: async (code, tripId) => {
    const response = await api.post('/vouchers/validate', { code, tripId });
    return response.data;
  },

  // Create voucher (admin/operator)
  createVoucher: async (voucherData) => {
    const response = await api.post('/vouchers', voucherData);
    return response.data;
  },

  // Get all vouchers (admin)
  getAllVouchers: async (params) => {
    const response = await api.get('/vouchers', { params });
    return response.data;
  },

  // Update voucher (admin)
  updateVoucher: async (voucherId, voucherData) => {
    const response = await api.put(`/vouchers/${voucherId}`, voucherData);
    return response.data;
  },

  // Delete voucher (admin)
  deleteVoucher: async (voucherId) => {
    const response = await api.delete(`/vouchers/${voucherId}`);
    return response.data;
  },

  // Get voucher statistics (admin)
  getVoucherStatistics: async (voucherId) => {
    const response = await api.get(`/vouchers/${voucherId}/statistics`);
    return response.data;
  },
};

export default voucherService;
