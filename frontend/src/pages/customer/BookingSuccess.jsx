import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Result,
  Button,
  Card,
  Typography,
  Row,
  Col,
  Divider,
  Tag,
  Space,
  message
} from 'antd';
import {
  CheckCircleOutlined,
  DownloadOutlined,
  MailOutlined,
  HomeOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { QRCodeSVG } from 'qrcode.react';

const { Title, Text, Paragraph } = Typography;

const BookingSuccess = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookingDetails();
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    setLoading(true);
    try {
      // TODO: Integrate with API
      // const response = await api.get(`/bookings/${bookingId}`);
      // setBooking(response.data);

      // Mock data for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      setBooking({
        bookingCode: 'BK' + Math.random().toString(36).substr(2, 8).toUpperCase(),
        status: 'confirmed',
        trip: {
          route: {
            origin: { city: 'TP. Hồ Chí Minh', station: 'Bến xe Miền Đông' },
            destination: { city: 'Đà Lạt', station: 'Bến xe Đà Lạt' }
          },
          departureTime: new Date(Date.now() + 86400000 * 2).toISOString(),
          bus: {
            busNumber: '51B-12345',
            type: 'Giường nằm'
          }
        },
        seats: [
          { seatNumber: 'A1', passengerName: 'Nguyễn Văn A' },
          { seatNumber: 'A2', passengerName: 'Trần Thị B' }
        ],
        totalAmount: 450000,
        payment: {
          method: 'vnpay',
          status: 'completed',
          paidAt: new Date().toISOString()
        },
        contactInfo: {
          email: 'example@email.com',
          phone: '0912345678'
        }
      });
    } catch (error) {
      console.error('Error fetching booking:', error);
      message.error('Không thể tải thông tin booking');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTickets = () => {
    message.info('Tính năng tải vé đang được phát triển');
    // TODO: Implement PDF download
  };

  const handleSendEmail = () => {
    message.success('Vé đã được gửi đến email của bạn');
    // TODO: Implement email sending
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <Text>Đang tải thông tin...</Text>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Result
          status="404"
          title="Không tìm thấy booking"
          subTitle="Booking này không tồn tại hoặc đã bị xóa"
          extra={
            <Button type="primary" onClick={() => navigate('/')}>
              Về trang chủ
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <Result
          status="success"
          icon={<CheckCircleOutlined className="text-green-500" />}
          title={
            <Title level={2} className="!mb-2">
              Đặt vé thành công!
            </Title>
          }
          subTitle={
            <div>
              <Paragraph className="text-lg mb-2">
                Cảm ơn bạn đã sử dụng dịch vụ của Te_QuickRide
              </Paragraph>
              <Space>
                <Text strong>Mã đặt vé:</Text>
                <Tag color="blue" className="text-lg px-3 py-1">
                  {booking.bookingCode}
                </Tag>
              </Space>
            </div>
          }
        />

        {/* Action Buttons */}
        <Card className="mb-6 shadow-md">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                onClick={handleDownloadTickets}
                block
                size="large"
              >
                Tải vé (PDF)
              </Button>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Button
                icon={<MailOutlined />}
                onClick={handleSendEmail}
                block
                size="large"
              >
                Gửi email
              </Button>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Link to={`/customer/bookings/${bookingId}`}>
                <Button
                  icon={<FileTextOutlined />}
                  block
                  size="large"
                >
                  Xem chi tiết
                </Button>
              </Link>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Link to="/">
                <Button
                  icon={<HomeOutlined />}
                  block
                  size="large"
                >
                  Đặt vé mới
                </Button>
              </Link>
            </Col>
          </Row>
        </Card>

        {/* Booking Details */}
        <Card title="Thông tin chuyến đi" className="mb-6 shadow-md">
          <Row gutter={[24, 16]}>
            <Col xs={24} md={12}>
              <div className="mb-4">
                <Text type="secondary" className="block mb-1">Điểm đi</Text>
                <Text strong className="text-lg">
                  {booking.trip.route.origin.city}
                </Text>
                <Text className="block text-gray-600">
                  {booking.trip.route.origin.station}
                </Text>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div className="mb-4">
                <Text type="secondary" className="block mb-1">Điểm đến</Text>
                <Text strong className="text-lg">
                  {booking.trip.route.destination.city}
                </Text>
                <Text className="block text-gray-600">
                  {booking.trip.route.destination.station}
                </Text>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div className="mb-4">
                <Text type="secondary" className="block mb-1">Thời gian khởi hành</Text>
                <Text strong className="text-lg">
                  {new Date(booking.trip.departureTime).toLocaleString('vi-VN')}
                </Text>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div className="mb-4">
                <Text type="secondary" className="block mb-1">Loại xe</Text>
                <Text strong className="text-lg">
                  {booking.trip.bus.type} - {booking.trip.bus.busNumber}
                </Text>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Passengers & QR Codes */}
        <Card title="Thông tin hành khách" className="mb-6 shadow-md">
          <Row gutter={[16, 16]}>
            {booking.seats.map((seat, index) => (
              <Col xs={24} sm={12} key={index}>
                <Card className="bg-gray-50">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="mb-2">
                        <Tag color="blue" className="mb-2">Ghế {seat.seatNumber}</Tag>
                      </div>
                      <Text strong className="block mb-1 text-lg">
                        {seat.passengerName}
                      </Text>
                      <Text type="secondary" className="text-sm">
                        Mã vé: {booking.bookingCode}-{seat.seatNumber}
                      </Text>
                    </div>
                    <div className="bg-white p-2 rounded">
                      <QRCodeSVG
                        value={`${booking.bookingCode}-${seat.seatNumber}`}
                        size={80}
                        level="H"
                      />
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>

        {/* Payment Info */}
        <Card title="Thông tin thanh toán" className="mb-6 shadow-md">
          <Row gutter={[24, 16]}>
            <Col xs={24} md={12}>
              <div className="mb-3">
                <Text type="secondary">Phương thức thanh toán</Text>
                <br />
                <Text strong className="text-lg">
                  {booking.payment.method === 'vnpay' ? 'VNPay' :
                   booking.payment.method === 'momo' ? 'MoMo' :
                   booking.payment.method}
                </Text>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div className="mb-3">
                <Text type="secondary">Trạng thái thanh toán</Text>
                <br />
                <Tag color="success" className="mt-1">
                  Đã thanh toán
                </Tag>
              </div>
            </Col>
            <Col xs={24}>
              <Divider className="my-3" />
              <div className="flex justify-between items-center">
                <Text strong className="text-lg">Tổng tiền</Text>
                <Text strong className="text-2xl text-blue-600">
                  {booking.totalAmount.toLocaleString('vi-VN')} đ
                </Text>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Contact Info */}
        <Card className="shadow-md bg-blue-50 border-blue-200">
          <Title level={5} className="mb-3">Thông tin liên hệ</Title>
          <Paragraph className="mb-2">
            Vé điện tử đã được gửi đến email: <Text strong>{booking.contactInfo.email}</Text>
          </Paragraph>
          <Paragraph className="mb-4">
            Số điện thoại: <Text strong>{booking.contactInfo.phone}</Text>
          </Paragraph>
          <Divider className="my-4" />
          <Paragraph className="text-sm text-gray-600 mb-2">
            <strong>Lưu ý:</strong>
          </Paragraph>
          <ul className="text-sm text-gray-600 space-y-1 pl-5">
            <li>Vui lòng có mặt tại bến xe trước giờ khởi hành ít nhất 15 phút</li>
            <li>Xuất trình mã QR hoặc mã đặt vé khi lên xe</li>
            <li>Mang theo giấy tờ tùy thân để kiểm tra khi cần thiết</li>
            <li>Liên hệ hotline 1900 1234 nếu cần hỗ trợ</li>
          </ul>
        </Card>

        {/* Additional Actions */}
        <div className="mt-6 text-center">
          <Link to="/my-bookings" className="text-blue-600 hover:text-blue-800 mr-4">
            Xem tất cả booking của tôi
          </Link>
          <Link to="/contact" className="text-blue-600 hover:text-blue-800">
            Cần hỗ trợ?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;
