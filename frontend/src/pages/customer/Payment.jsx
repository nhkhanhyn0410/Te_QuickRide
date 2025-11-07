import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Card, Button, Row, Col, Steps, Radio, Alert, Divider, Tag, message } from 'antd';
import {
  CheckCircleOutlined,
  DollarOutlined,
  CreditCardOutlined,
  MobileOutlined,
  WalletOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  CarOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { Loading, ErrorMessage } from '../../components/common';
import bookingService from '../../services/bookingService';
import paymentService from '../../services/paymentService';
import dayjs from 'dayjs';

const Payment = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('vnpay');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookingDetails();
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await bookingService.getBookingDetails(bookingId);

      if (response.success) {
        setBooking(response.data.booking);

        // Check if already paid
        if (response.data.booking.paymentStatus === 'completed') {
          message.success('Đơn hàng đã được thanh toán!');
          navigate(`/bookings/${bookingId}`);
        }
      } else {
        setError(response.message || 'Không tìm thấy thông tin đặt vé');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Đã có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    try {
      setProcessing(true);
      setError(null);

      const response = await paymentService.createPayment(
        bookingId,
        selectedPaymentMethod
      );

      if (response.success) {
        if (response.data.payment.paymentMethod === 'cod') {
          // COD - direct success
          message.success('Đặt vé thành công! Vui lòng thanh toán khi lên xe.');
          navigate(`/bookings/${bookingId}`);
        } else {
          // Redirect to payment gateway
          message.info('Đang chuyển đến trang thanh toán...');
          window.location.href = response.data.payment.paymentUrl;
        }
      } else {
        setError(response.message || 'Thanh toán thất bại!');
        message.error(response.message || 'Thanh toán thất bại!');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Đã có lỗi xảy ra';
      setError(errorMsg);
      message.error(errorMsg);
    } finally {
      setProcessing(false);
    }
  };

  const formatTime = (date) => {
    return dayjs(date).format('HH:mm - DD/MM/YYYY');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const paymentMethods = [
    {
      value: 'vnpay',
      label: 'VNPay',
      icon: <CreditCardOutlined className="text-blue-600 text-2xl" />,
      description: 'Thanh toán qua VNPay (DEMO)',
      recommended: true,
    },
    {
      value: 'momo',
      label: 'MoMo',
      icon: <MobileOutlined className="text-pink-600 text-2xl" />,
      description: 'Thanh toán qua ví MoMo (DEMO)',
    },
    {
      value: 'zalopay',
      label: 'ZaloPay',
      icon: <WalletOutlined className="text-blue-500 text-2xl" />,
      description: 'Thanh toán qua ví ZaloPay (DEMO)',
    },
    {
      value: 'cod',
      label: 'Tiền mặt',
      icon: <DollarOutlined className="text-green-600 text-2xl" />,
      description: 'Thanh toán khi lên xe',
    },
  ];

  if (loading) {
    return <Loading tip="Đang tải thông tin thanh toán..." fullScreen />;
  }

  if (error || !booking) {
    return (
      <ErrorMessage
        message="Không tìm thấy thông tin đặt vé"
        description={error}
        showRetry
        onRetry={fetchBookingDetails}
        showHome
        fullScreen
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <Card className="mb-6 shadow-md">
          <Steps
            current={2}
            items={[
              {
                title: 'Chọn chuyến',
                icon: <CarOutlined />,
              },
              {
                title: 'Thông tin hành khách',
                icon: <CheckCircleOutlined />,
              },
              {
                title: 'Thanh toán',
                icon: <DollarOutlined />,
              },
            ]}
          />
        </Card>

        {/* Demo Mode Warning */}
        <Alert
          message="Chế độ DEMO"
          description="Đây là chế độ demo. Các cổng thanh toán VNPay, MoMo, ZaloPay chỉ mô phỏng giao diện và không thực hiện giao dịch thật."
          type="warning"
          icon={<WarningOutlined />}
          showIcon
          className="mb-6"
        />

        <Row gutter={16}>
          {/* Payment Methods */}
          <Col xs={24} md={16}>
            <Card title={<><CreditCardOutlined /> Chọn phương thức thanh toán</>}>
              <Radio.Group
                value={selectedPaymentMethod}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                className="w-full"
              >
                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <Card
                      key={method.value}
                      className={`cursor-pointer transition-all ${
                        selectedPaymentMethod === method.value
                          ? 'border-blue-500 border-2 shadow-md'
                          : 'hover:border-gray-400'
                      }`}
                      onClick={() => setSelectedPaymentMethod(method.value)}
                    >
                      <Radio value={method.value} className="w-full">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="mr-4">{method.icon}</div>
                            <div>
                              <div className="font-semibold text-lg flex items-center">
                                {method.label}
                                {method.recommended && (
                                  <Tag color="blue" className="ml-2">
                                    Khuyên dùng
                                  </Tag>
                                )}
                              </div>
                              <div className="text-sm text-gray-600">
                                {method.description}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Radio>
                    </Card>
                  ))}
                </div>
              </Radio.Group>

              {error && (
                <Alert
                  message="Lỗi thanh toán"
                  description={error}
                  type="error"
                  showIcon
                  className="mt-4"
                />
              )}

              <Divider />

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <h4 className="font-semibold mb-2 flex items-center">
                  <ClockCircleOutlined className="mr-2 text-yellow-600" />
                  Lưu ý quan trọng:
                </h4>
                <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1">
                  <li>Vui lòng hoàn tất thanh toán trong vòng 15 phút</li>
                  <li>Sau 15 phút, ghế đã chọn sẽ tự động được giải phóng</li>
                  <li>Vé điện tử sẽ được gửi qua email sau khi thanh toán thành công</li>
                  <li>Vui lòng có mặt trước 15 phút so với giờ khởi hành</li>
                </ul>
              </div>

              <Button
                type="primary"
                size="large"
                block
                onClick={handlePayment}
                loading={processing}
                className="bg-blue-600 hover:bg-blue-700 h-12 text-lg font-semibold"
              >
                Thanh toán {formatPrice(booking.totalAmount)}
              </Button>
            </Card>
          </Col>

          {/* Booking Summary */}
          <Col xs={24} md={8}>
            <Card title="Chi tiết đơn hàng" className="sticky top-24">
              <div className="mb-4">
                <div className="text-sm text-gray-600">Mã đặt vé</div>
                <div className="font-semibold text-lg">{booking.bookingCode}</div>
              </div>

              <Divider />

              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <CarOutlined className="text-blue-600 mr-2" />
                  <span className="font-semibold">
                    {booking.operator?.companyName}
                  </span>
                </div>
                <Tag color="blue">{booking.trip?.bus?.busType}</Tag>
              </div>

              <Divider />

              <div className="space-y-3 mb-4">
                <div className="flex items-start">
                  <EnvironmentOutlined className="text-green-600 mr-2 mt-1" />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {booking.trip?.route?.origin?.city}
                    </div>
                    <div className="text-xs text-gray-600">
                      {formatTime(booking.trip?.departureTime)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <div className="h-8 border-l-2 border-dashed border-gray-300"></div>
                </div>

                <div className="flex items-start">
                  <EnvironmentOutlined className="text-red-600 mr-2 mt-1" />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {booking.trip?.route?.destination?.city}
                    </div>
                    <div className="text-xs text-gray-600">
                      {formatTime(booking.trip?.arrivalTime)}
                    </div>
                  </div>
                </div>
              </div>

              <Divider />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Số ghế:</span>
                  <div>
                    {booking.seatNumbers?.map(seat => (
                      <Tag key={seat} color="blue">{seat}</Tag>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Số lượng vé:</span>
                  <span className="font-medium">{booking.seatNumbers?.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Giá vé:</span>
                  <span className="font-medium">
                    {formatPrice(booking.trip?.baseFare)}
                  </span>
                </div>
              </div>

              <Divider />

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Tổng tiền:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {formatPrice(booking.totalAmount)}
                  </span>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Payment;
