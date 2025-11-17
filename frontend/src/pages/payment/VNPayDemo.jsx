import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, Button, Alert, Spin, Divider, Tag, Steps, Radio, message } from 'antd';
import {
  CreditCardOutlined,
  BankOutlined,
  QrcodeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import axios from 'axios';

const VNPayDemo = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('qr');

  // Get params from URL
  const vnpTxnRef = searchParams.get('vnp_TxnRef');
  const vnpAmount = searchParams.get('vnp_Amount');
  const bookingId = searchParams.get('bookingId');
  const bookingCode = searchParams.get('bookingCode');
  const returnUrl = searchParams.get('returnUrl');

  const amount = parseInt(vnpAmount) / 100;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const handlePayment = async (success = true) => {
    setProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Build callback URL
    const callbackUrl = `${process.env.REACT_APP_API_URL}/payments/vnpay/return?` +
      `vnp_TxnRef=${vnpTxnRef}&` +
      `vnp_Amount=${vnpAmount}&` +
      `vnp_ResponseCode=${success ? '00' : '24'}&` +
      `vnp_TransactionStatus=${success ? '00' : '02'}&` +
      `bookingId=${bookingId}`;

    try {
      // Call backend to process payment
      const response = await axios.get(callbackUrl);

      if (response.data.success) {
        message.success('Thanh toán thành công!');

        // Redirect to booking detail after 1 second
        setTimeout(() => {
          navigate(`/bookings/${bookingId}`);
        }, 1500);
      } else {
        message.error('Thanh toán thất bại!');
        navigate(`/payment/${bookingId}/failed`);
      }
    } catch (error) {
      message.error('Đã có lỗi xảy ra khi xử lý thanh toán');
      navigate(`/payment/${bookingId}/failed`);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* VNPay Header */}
        <div className="bg-white rounded-t-2xl p-6 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <CreditCardOutlined className="text-3xl text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Cổng thanh toán VNPAY
          </h1>
          <p className="text-gray-600">Giao dịch an toàn & bảo mật</p>
        </div>

        {/* Demo Warning */}
        <Alert
          message="CHẾ ĐỘ DEMO"
          description="Đây là giao diện mô phỏng. Không có giao dịch thực tế nào được thực hiện."
          type="warning"
          showIcon
          className="rounded-none"
        />

        {/* Main Content */}
        <Card className="rounded-b-2xl border-t-0">
          {/* Transaction Info */}
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Mã giao dịch:</span>
              <span className="font-mono font-semibold">{vnpTxnRef}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Mã đơn hàng:</span>
              <span className="font-semibold">{bookingCode}</span>
            </div>
            <Divider className="my-3" />
            <div className="flex justify-between items-center">
              <span className="text-lg text-gray-700">Số tiền thanh toán:</span>
              <span className="text-2xl font-bold text-blue-600">
                {formatPrice(amount)}
              </span>
            </div>
          </div>

          {/* Payment Steps */}
          <Steps
            current={1}
            className="mb-6"
            items={[
              { title: 'Chọn phương thức', icon: <CreditCardOutlined /> },
              { title: 'Xác nhận thanh toán', icon: <LoadingOutlined /> },
              { title: 'Hoàn tất', icon: <CheckCircleOutlined /> },
            ]}
          />

          {/* Payment Methods */}
          <div className="mb-6">
            <h3 className="font-semibold mb-4">Chọn phương thức thanh toán:</h3>
            <Radio.Group
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="w-full"
            >
              <div className="space-y-3">
                <Card
                  className={`cursor-pointer ${
                    selectedMethod === 'qr' ? 'border-blue-500 border-2' : ''
                  }`}
                  onClick={() => setSelectedMethod('qr')}
                >
                  <Radio value="qr">
                    <div className="flex items-center">
                      <QrcodeOutlined className="text-2xl text-blue-600 mr-3" />
                      <div>
                        <div className="font-semibold">Quét mã QR</div>
                        <div className="text-sm text-gray-600">
                          Sử dụng app ngân hàng để quét mã
                        </div>
                      </div>
                    </div>
                  </Radio>
                </Card>

                <Card
                  className={`cursor-pointer ${
                    selectedMethod === 'atm' ? 'border-blue-500 border-2' : ''
                  }`}
                  onClick={() => setSelectedMethod('atm')}
                >
                  <Radio value="atm">
                    <div className="flex items-center">
                      <CreditCardOutlined className="text-2xl text-green-600 mr-3" />
                      <div>
                        <div className="font-semibold">Thẻ ATM/Tài khoản ngân hàng</div>
                        <div className="text-sm text-gray-600">
                          Thanh toán qua thẻ ATM nội địa
                        </div>
                      </div>
                    </div>
                  </Radio>
                </Card>

                <Card
                  className={`cursor-pointer ${
                    selectedMethod === 'cc' ? 'border-blue-500 border-2' : ''
                  }`}
                  onClick={() => setSelectedMethod('cc')}
                >
                  <Radio value="cc">
                    <div className="flex items-center">
                      <CreditCardOutlined className="text-2xl text-purple-600 mr-3" />
                      <div>
                        <div className="font-semibold">Thẻ tín dụng/Ghi nợ quốc tế</div>
                        <div className="text-sm text-gray-600">
                          Visa, MasterCard, JCB, AMEX
                        </div>
                      </div>
                    </div>
                  </Radio>
                </Card>
              </div>
            </Radio.Group>
          </div>

          {/* Demo QR Code */}
          {selectedMethod === 'qr' && (
            <div className="bg-gray-50 p-6 rounded-lg mb-6 text-center">
              <div className="mb-4">
                <QrcodeOutlined className="text-8xl text-blue-600" />
              </div>
              <p className="text-gray-600 mb-2">Quét mã QR để thanh toán</p>
              <p className="text-sm text-gray-500">
                (Đây là mã QR giả lập cho mục đích demo)
              </p>
            </div>
          )}

          {/* Security Info */}
          <Alert
            message="Giao dịch được bảo mật bởi VNPay"
            description="Thông tin thẻ của bạn được mã hóa và bảo mật theo tiêu chuẩn quốc tế"
            type="info"
            showIcon
            className="mb-6"
          />

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              type="primary"
              size="large"
              block
              onClick={() => handlePayment(true)}
              loading={processing}
              disabled={processing}
              className="bg-blue-600 hover:bg-blue-700 h-12 text-lg font-semibold"
              icon={<CheckCircleOutlined />}
            >
              {processing ? 'Đang xử lý...' : 'Thanh toán (DEMO - Thành công)'}
            </Button>

            <Button
              danger
              size="large"
              block
              onClick={() => handlePayment(false)}
              loading={processing}
              disabled={processing}
              className="h-12 text-lg font-semibold"
              icon={<CloseCircleOutlined />}
            >
              Hủy (DEMO - Thất bại)
            </Button>
          </div>

          {/* Demo Instructions */}
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold mb-2">Hướng dẫn Demo:</h4>
            <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1">
              <li><strong>Thanh toán</strong>: Click để mô phỏng thanh toán thành công</li>
              <li><strong>Hủy</strong>: Click để mô phỏng thanh toán thất bại</li>
              <li>Trong môi trường thực tế, bạn sẽ nhập thông tin thẻ hoặc quét mã QR thật</li>
              <li>Hệ thống sẽ tự động xác nhận và cập nhật trạng thái đặt vé</li>
            </ul>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-white text-sm">
          <p>© 2025 QuickRide - Powered by VNPay Demo</p>
        </div>
      </div>
    </div>
  );
};

export default VNPayDemo;
