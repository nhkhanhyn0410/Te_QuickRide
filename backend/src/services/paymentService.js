import crypto from 'crypto';
import { generateTransactionId } from '../utils/generateCode.js';

/**
 * DEMO Payment Gateway Services
 * These are mock implementations for development/testing
 */

// Base Payment Gateway Class
class PaymentGateway {
  constructor(name) {
    this.name = name;
  }

  generatePaymentUrl(bookingData) {
    throw new Error('Method not implemented');
  }

  verifyCallback(data) {
    throw new Error('Method not implemented');
  }
}

// VNPay Demo Implementation
class VNPayGateway extends PaymentGateway {
  constructor() {
    super('VNPay');
  }

  generatePaymentUrl(bookingData) {
    const { bookingId, amount, bookingCode, returnUrl } = bookingData;

    // Demo implementation - generate fake payment URL
    const transactionId = generateTransactionId();
    const vnpTxnRef = `VNPAY_${transactionId}`;

    // In real implementation, you would:
    // 1. Create secure hash using VNPay secret
    // 2. Construct proper VNPay URL with all parameters
    // 3. Return the actual payment URL

    // DEMO: Return mock payment URL
    const demoUrl = `${process.env.FRONTEND_URL}/payment/vnpay/demo?` +
      `vnp_TxnRef=${vnpTxnRef}&` +
      `vnp_Amount=${amount * 100}&` +
      `bookingId=${bookingId}&` +
      `bookingCode=${bookingCode}&` +
      `returnUrl=${encodeURIComponent(returnUrl)}`;

    return {
      paymentUrl: demoUrl,
      transactionId: vnpTxnRef,
      gateway: 'vnpay'
    };
  }

  verifyCallback(queryParams) {
    // DEMO: Always return success for testing
    // In real implementation, verify signature with VNPay secret

    const { vnp_TxnRef, vnp_ResponseCode, vnp_Amount } = queryParams;

    return {
      success: vnp_ResponseCode === '00',
      transactionId: vnp_TxnRef,
      amount: parseInt(vnp_Amount) / 100,
      message: vnp_ResponseCode === '00' ? 'Payment successful' : 'Payment failed',
      responseCode: vnp_ResponseCode
    };
  }
}

// MoMo Demo Implementation
class MoMoGateway extends PaymentGateway {
  constructor() {
    super('MoMo');
  }

  generatePaymentUrl(bookingData) {
    const { bookingId, amount, bookingCode, returnUrl } = bookingData;

    const transactionId = generateTransactionId();
    const orderId = `MOMO_${transactionId}`;

    // DEMO: Return mock payment URL
    const demoUrl = `${process.env.FRONTEND_URL}/payment/momo/demo?` +
      `orderId=${orderId}&` +
      `amount=${amount}&` +
      `bookingId=${bookingId}&` +
      `bookingCode=${bookingCode}&` +
      `returnUrl=${encodeURIComponent(returnUrl)}`;

    return {
      paymentUrl: demoUrl,
      transactionId: orderId,
      gateway: 'momo'
    };
  }

  verifyCallback(requestBody) {
    // DEMO: Always return success for testing
    const { orderId, resultCode, amount } = requestBody;

    return {
      success: resultCode === 0,
      transactionId: orderId,
      amount: parseInt(amount),
      message: resultCode === 0 ? 'Payment successful' : 'Payment failed',
      resultCode
    };
  }
}

// ZaloPay Demo Implementation
class ZaloPayGateway extends PaymentGateway {
  constructor() {
    super('ZaloPay');
  }

  generatePaymentUrl(bookingData) {
    const { bookingId, amount, bookingCode, returnUrl } = bookingData;

    const transactionId = generateTransactionId();
    const appTransId = `ZALOPAY_${transactionId}`;

    // DEMO: Return mock payment URL
    const demoUrl = `${process.env.FRONTEND_URL}/payment/zalopay/demo?` +
      `app_trans_id=${appTransId}&` +
      `amount=${amount}&` +
      `bookingId=${bookingId}&` +
      `bookingCode=${bookingCode}&` +
      `returnUrl=${encodeURIComponent(returnUrl)}`;

    return {
      paymentUrl: demoUrl,
      transactionId: appTransId,
      gateway: 'zalopay'
    };
  }

  verifyCallback(requestBody) {
    // DEMO: Always return success for testing
    const { app_trans_id, status, amount } = requestBody;

    return {
      success: status === 1,
      transactionId: app_trans_id,
      amount: parseInt(amount),
      message: status === 1 ? 'Payment successful' : 'Payment failed',
      status
    };
  }
}

// Factory function to get payment gateway
export const getPaymentGateway = (gatewayName) => {
  switch (gatewayName.toLowerCase()) {
    case 'vnpay':
      return new VNPayGateway();
    case 'momo':
      return new MoMoGateway();
    case 'zalopay':
      return new ZaloPayGateway();
    default:
      throw new Error(`Unsupported payment gateway: ${gatewayName}`);
  }
};

// Process demo payment (for COD or test payments)
export const processDemoPayment = async (bookingData) => {
  const transactionId = generateTransactionId();

  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // DEMO: Always succeed
  return {
    success: true,
    transactionId,
    amount: bookingData.amount,
    method: bookingData.method || 'demo',
    message: 'Payment processed successfully (DEMO)',
    timestamp: new Date()
  };
};

// Verify payment signature (demo)
export const verifyPaymentSignature = (data, signature, secret) => {
  // DEMO: Always return true
  // In real implementation:
  // const hash = crypto.createHmac('sha256', secret).update(data).digest('hex');
  // return hash === signature;

  return true;
};

// Generate payment signature (demo)
export const generatePaymentSignature = (data, secret) => {
  // DEMO: Generate simple hash
  const hash = crypto
    .createHmac('sha256', secret || 'demo-secret')
    .update(JSON.stringify(data))
    .digest('hex');

  return hash;
};

export default {
  getPaymentGateway,
  processDemoPayment,
  verifyPaymentSignature,
  generatePaymentSignature
};
