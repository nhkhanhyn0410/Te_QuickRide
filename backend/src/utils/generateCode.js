/**
 * Generate unique codes for various entities
 */

/**
 * Generate booking code: BK20250107001
 */
export const generateBookingCode = () => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `BK${date}${random}`;
};

/**
 * Generate trip code: HN-DN-20250107-001
 */
export const generateTripCode = (routeCode) => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${routeCode}-${date}-${random}`;
};

/**
 * Generate ticket code: TK20250107001
 */
export const generateTicketCode = () => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `TK${date}${random}`;
};

/**
 * Generate transaction ID: TXN1704614400000001
 */
export const generateTransactionId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `TXN${timestamp}${random}`;
};

/**
 * Generate route code from cities: HN-DN
 */
export const generateRouteCode = (originCity, destinationCity) => {
  const getCityCode = (city) => {
    const cityMap = {
      'Hà Nội': 'HN',
      'Hồ Chí Minh': 'HCM',
      'Đà Nẵng': 'DN',
      'Hải Phòng': 'HP',
      'Cần Thơ': 'CT',
      'Nha Trang': 'NT',
      'Huế': 'HUE',
      'Đà Lạt': 'DL',
      'Vũng Tàu': 'VT',
      'Quy Nhơn': 'QN'
    };

    return cityMap[city] || city.substring(0, 2).toUpperCase();
  };

  const originCode = getCityCode(originCity);
  const destCode = getCityCode(destinationCity);
  const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');

  return `${originCode}-${destCode}-${random}`;
};

/**
 * Generate OTP: 6-digit number
 */
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Generate random token for email verification, password reset, etc.
 */
export const generateRandomToken = (length = 32) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
};
