import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, Button, Alert, Divider, Steps, message } from 'antd';
import {
  MobileOutlined,
  QrcodeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
  WalletOutlined,
} from '@ant-design/icons';
import axios from 'axios';

const MoMoDemo = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [processing, setProcessing] = useState(false);

  // Get params from URL
  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');
  const bookingId = searchParams.get('bookingId');
  const bookingCode = searchParams.get('bookingCode');

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

    try {
      // Call backend to process payment
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/payments/momo/callback`, {
        orderId,
        amount,
        resultCode: success ? 0 : 1,
        message: success ? 'Success' : 'Failed',
        bookingId,
      });

      if (success) {
        message.success('Thanh toán MoMo thành công!');
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
    <div className="min-h-screen bg-gradient-to-br from-pink-600 to-pink-800 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* MoMo Header */}
        <div className="bg-white rounded-t-2xl p-6 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-pink-600 rounded-full flex items-center justify-center">
              <WalletOutlined className="text-3xl text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Ví điện tử MoMo
          </h1>
          <p className="text-gray-600">Thanh toán nhanh chóng & tiện lợi</p>
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
          <div className="bg-pink-50 p-4 rounded-lg mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Mã giao dịch:</span>
              <span className="font-mono font-semibold">{orderId}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Mã đơn hàng:</span>
              <span className="font-semibold">{bookingCode}</span>
            </div>
            <Divider className="my-3" />
            <div className="flex justify-between items-center">
              <span className="text-lg text-gray-700">Số tiền thanh toán:</span>
              <span className="text-2xl font-bold text-pink-600">
                {formatPrice(amount)}
              </span>
            </div>
          </div>

          {/* Payment Steps */}
          <Steps
            current={1}
            className="mb-6"
            items={[
              { title: 'Đăng nhập MoMo', icon: <MobileOutlined /> },
              { title: 'Xác nhận thanh toán', icon: <LoadingOutlined /> },
              { title: 'Hoàn tất', icon: <CheckCircleOutlined /> },
            ]}
          />

          {/* Demo QR Code */}
          <div className="bg-gray-50 p-6 rounded-lg mb-6 text-center">
            <div className="mb-4">
              <QrcodeOutlined className="text-8xl text-pink-600" />
            </div>
            <p className="font-semibold text-lg mb-2">Quét mã QR bằng ứng dụng MoMo</p>
            <p className="text-gray-600 mb-2">
              Mở ứng dụng MoMo → Quét mã QR → Xác nhận thanh toán
            </p>
            <p className="text-sm text-gray-500">
              (Đây là mã QR giả lập cho mục đích demo)
            </p>
          </div>

          {/* Wallet Info */}
          <div className="bg-pink-50 p-4 rounded-lg mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <WalletOutlined className="text-2xl text-pink-600 mr-3" />
                <div>
                  <div className="font-semibold">Số dư ví MoMo (Demo)</div>
                  <div className="text-sm text-gray-600">demo@momo.vn</div>
                </div>
              </div>
              <div className="text-xl font-bold text-pink-600">
                {formatPrice(10000000)}
              </div>
            </div>
          </div>

          {/* Security Info */}
          <Alert
            message="Giao dịch được bảo mật bởi MoMo"
            description="Mọi giao dịch đều được mã hóa và bảo vệ theo tiêu chuẩn quốc tế"
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
              className="bg-pink-600 hover:bg-pink-700 h-12 text-lg font-semibold"
              icon={<CheckCircleOutlined />}
            >
              {processing ? 'Đang xử lý...' : 'Xác nhận thanh toán (DEMO)'}
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
              Hủy giao dịch
            </Button>
          </div>

          {/* Demo Instructions */}
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold mb-2">Hướng dẫn Demo:</h4>
            <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1">
              <li><strong>Xác nhận thanh toán</strong>: Mô phỏng thanh toán MoMo thành công</li>
              <li><strong>Hủy giao dịch</strong>: Mô phỏng người dùng hủy thanh toán</li>
              <li>Trong thực tế, bạn sẽ sử dụng app MoMo để quét mã QR hoặc nhập mã PIN</li>
              <li>Hệ thống sẽ tự động xác nhận và cập nhật trạng thái đặt vé</li>
            </ul>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-white text-sm">
          <p>© 2025 QuickRide - Powered by MoMo Demo</p>
        </div>
      </div>
    </div>
  );
};

export default MoMoDemo;
