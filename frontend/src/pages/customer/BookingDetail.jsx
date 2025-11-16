import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Card,
  Button,
  Typography,
  Row,
  Col,
  Tag,
  Divider,
  Steps,
  Modal,
  message,
  Descriptions,
  Space
} from 'antd';
import {
  ArrowLeftOutlined,
  DownloadOutlined,
  CloseCircleOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { QRCodeSVG } from 'qrcode.react';

const { Title, Text, Paragraph } = Typography;

const BookingDetail = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchBookingDetails();
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    setLoading(true);
    try {
      // TODO: Integrate with API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock data
      setBooking({
        _id: bookingId,
        bookingCode: 'BK' + Math.random().toString(36).substr(2, 8).toUpperCase(),
        status: 'confirmed',
        trip: {
          _id: 'trip123',
          tripCode: 'TR12345',
          route: {
            origin: {
              city: 'TP. Hồ Chí Minh',
              station: 'Bến xe Miền Đông',
              address: '292 Đinh Bộ Lĩnh, P.26, Q.Bình Thạnh'
            },
            destination: {
              city: 'Đà Lạt',
              station: 'Bến xe Đà Lạt',
              address: '1 Tô Hiến Thành, Phường 3, TP. Đà Lạt'
            }
          },
          departureTime: new Date(Date.now() + 86400000 * 2).toISOString(),
          arrivalTime: new Date(Date.now() + 86400000 * 2 + 3600000 * 8).toISOString(),
          bus: {
            busNumber: '51B-12345',
            type: 'Giường nằm',
            amenities: ['WiFi', 'Điều hòa', 'Nước uống']
          },
          operator: {
            name: 'Phương Trang',
            phone: '1900 6067',
            rating: 4.5
          }
        },
        seats: [
          {
            _id: 'seat1',
            seatNumber: 'A1',
            passengerName: 'Nguyễn Văn A',
            passengerPhone: '0912345678',
            passengerIdCard: '079012345678'
          },
          {
            _id: 'seat2',
            seatNumber: 'A2',
            passengerName: 'Trần Thị B',
            passengerPhone: '0987654321',
            passengerIdCard: '079087654321'
          }
        ],
        pickupPoint: {
          name: 'Bến xe Miền Đông',
          address: '292 Đinh Bộ Lĩnh, P.26, Q.Bình Thạnh',
          time: new Date(Date.now() + 86400000 * 2).toISOString()
        },
        dropoffPoint: {
          name: 'Bến xe Đà Lạt',
          address: '1 Tô Hiến Thành, Phường 3, TP. Đà Lạt',
          time: new Date(Date.now() + 86400000 * 2 + 3600000 * 8).toISOString()
        },
        payment: {
          method: 'vnpay',
          status: 'completed',
          basePrice: 400000,
          serviceFee: 20000,
          discount: 0,
          totalAmount: 420000,
          paidAt: new Date(Date.now() - 3600000).toISOString()
        },
        contactInfo: {
          email: 'example@email.com',
          phone: '0912345678'
        },
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        timeline: [
          { status: 'Đã đặt vé', time: new Date(Date.now() - 3600000).toISOString(), completed: true },
          { status: 'Đã thanh toán', time: new Date(Date.now() - 3500000).toISOString(), completed: true },
          { status: 'Đã xác nhận', time: new Date(Date.now() - 3400000).toISOString(), completed: true },
          { status: 'Sẵn sàng lên xe', time: null, completed: false },
          { status: 'Hoàn thành', time: null, completed: false }
        ]
      });
    } catch (error) {
      console.error('Error fetching booking:', error);
      message.error('Không thể tải thông tin booking');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    setCancelling(true);
    try {
      // TODO: Integrate with API
      await new Promise(resolve => setTimeout(resolve, 1500));

      message.success('Hủy booking thành công. Tiền sẽ được hoàn lại trong 3-5 ngày làm việc.');
      setCancelModalVisible(false);
      navigate('/my-bookings');
    } catch (error) {
      message.error('Không thể hủy booking. Vui lòng thử lại sau.');
    } finally {
      setCancelling(false);
    }
  };

  const handleDownloadTickets = () => {
    message.info('Tính năng tải vé đang được phát triển');
    // TODO: Implement PDF download
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'orange',
      confirmed: 'blue',
      completed: 'green',
      cancelled: 'red'
    };
    return colors[status] || 'default';
  };

  const getStatusText = (status) => {
    const texts = {
      pending: 'Chờ xác nhận',
      confirmed: 'Đã xác nhận',
      completed: 'Hoàn thành',
      cancelled: 'Đã hủy'
    };
    return texts[status] || status;
  };

  const canCancelBooking = () => {
    if (!booking) return false;
    if (booking.status === 'cancelled' || booking.status === 'completed') return false;

    // Can cancel if departure time is more than 24 hours away
    const departureTime = new Date(booking.trip.departureTime);
    const now = new Date();
    const hoursDiff = (departureTime - now) / (1000 * 60 * 60);

    return hoursDiff > 24;
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
        <Card>
          <Text>Không tìm thấy booking</Text>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/my-bookings')}
            className="mb-4"
          >
            Quay lại
          </Button>

          <div className="flex justify-between items-start flex-wrap gap-4">
            <div>
              <Title level={2} className="!mb-2">
                Chi tiết đặt vé
              </Title>
              <Space>
                <Text type="secondary">Mã đặt vé:</Text>
                <Tag color="blue" className="text-base px-3 py-1">
                  {booking.bookingCode}
                </Tag>
                <Tag color={getStatusColor(booking.status)} className="text-base px-3 py-1">
                  {getStatusText(booking.status)}
                </Tag>
              </Space>
            </div>
            <Space>
              <Button
                icon={<DownloadOutlined />}
                onClick={handleDownloadTickets}
                size="large"
              >
                Tải vé
              </Button>
              {canCancelBooking() && (
                <Button
                  danger
                  icon={<CloseCircleOutlined />}
                  onClick={() => setCancelModalVisible(true)}
                  size="large"
                >
                  Hủy vé
                </Button>
              )}
            </Space>
          </div>
        </div>

        {/* Timeline */}
        <Card className="mb-6 shadow-md">
          <Title level={4} className="mb-4">Trạng thái đơn hàng</Title>
          <Steps
            current={booking.timeline.filter(t => t.completed).length - 1}
            items={booking.timeline.map((item, index) => ({
              title: item.status,
              description: item.time ? new Date(item.time).toLocaleString('vi-VN') : null
            }))}
          />
        </Card>

        <Row gutter={[16, 16]}>
          {/* Left Column */}
          <Col xs={24} lg={16}>
            {/* Trip Info */}
            <Card title="Thông tin chuyến đi" className="mb-4 shadow-md">
              <Descriptions column={1} bordered>
                <Descriptions.Item label="Điểm đi">
                  <div>
                    <Text strong className="block">{booking.trip.route.origin.city}</Text>
                    <Text className="text-gray-600">{booking.trip.route.origin.station}</Text>
                    <Text className="block text-sm text-gray-500">{booking.trip.route.origin.address}</Text>
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="Điểm đến">
                  <div>
                    <Text strong className="block">{booking.trip.route.destination.city}</Text>
                    <Text className="text-gray-600">{booking.trip.route.destination.station}</Text>
                    <Text className="block text-sm text-gray-500">{booking.trip.route.destination.address}</Text>
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="Thời gian khởi hành">
                  <Text strong>{new Date(booking.trip.departureTime).toLocaleString('vi-VN')}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Thời gian dự kiến đến">
                  <Text>{new Date(booking.trip.arrivalTime).toLocaleString('vi-VN')}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Nhà xe">
                  <Space>
                    <Text strong>{booking.trip.operator.name}</Text>
                    <Tag color="gold">★ {booking.trip.operator.rating}</Tag>
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="Loại xe">
                  <Text>{booking.trip.bus.type} - {booking.trip.bus.busNumber}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Tiện ích">
                  <Space wrap>
                    {booking.trip.bus.amenities.map((amenity, idx) => (
                      <Tag key={idx}>{amenity}</Tag>
                    ))}
                  </Space>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Passengers */}
            <Card title="Thông tin hành khách" className="mb-4 shadow-md">
              {booking.seats.map((seat, index) => (
                <div key={seat._id} className={index > 0 ? 'mt-4 pt-4 border-t' : ''}>
                  <Row gutter={16} align="middle">
                    <Col flex="1">
                      <div className="mb-2">
                        <Tag color="blue">Ghế {seat.seatNumber}</Tag>
                      </div>
                      <Descriptions column={1} size="small">
                        <Descriptions.Item label="Họ tên">
                          <Text strong>{seat.passengerName}</Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Điện thoại">
                          {seat.passengerPhone}
                        </Descriptions.Item>
                        <Descriptions.Item label="CMND/CCCD">
                          {seat.passengerIdCard}
                        </Descriptions.Item>
                      </Descriptions>
                    </Col>
                    <Col>
                      <div className="bg-white p-2 border rounded">
                        <QRCodeSVG
                          value={`${booking.bookingCode}-${seat.seatNumber}`}
                          size={100}
                          level="H"
                        />
                        <Text className="block text-center text-xs mt-1 text-gray-500">
                          Mã vé
                        </Text>
                      </div>
                    </Col>
                  </Row>
                </div>
              ))}
            </Card>

            {/* Pickup & Dropoff Points */}
            <Card title="Điểm đón/trả" className="shadow-md">
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <div className="mb-4 md:mb-0">
                    <Text strong className="block mb-2 text-green-600">
                      <EnvironmentOutlined /> Điểm đón
                    </Text>
                    <Text strong className="block">{booking.pickupPoint.name}</Text>
                    <Text className="block text-gray-600 text-sm mb-1">
                      {booking.pickupPoint.address}
                    </Text>
                    <Text type="secondary" className="text-sm">
                      <ClockCircleOutlined /> {new Date(booking.pickupPoint.time).toLocaleString('vi-VN')}
                    </Text>
                  </div>
                </Col>
                <Col xs={24} md={12}>
                  <div>
                    <Text strong className="block mb-2 text-red-600">
                      <EnvironmentOutlined /> Điểm trả
                    </Text>
                    <Text strong className="block">{booking.dropoffPoint.name}</Text>
                    <Text className="block text-gray-600 text-sm mb-1">
                      {booking.dropoffPoint.address}
                    </Text>
                    <Text type="secondary" className="text-sm">
                      <ClockCircleOutlined /> {new Date(booking.dropoffPoint.time).toLocaleString('vi-VN')}
                    </Text>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* Right Column */}
          <Col xs={24} lg={8}>
            {/* Payment Info */}
            <Card title="Thông tin thanh toán" className="mb-4 shadow-md">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Text>Giá vé ({booking.seats.length} × {(booking.payment.basePrice / booking.seats.length).toLocaleString('vi-VN')}đ)</Text>
                  <Text>{booking.payment.basePrice.toLocaleString('vi-VN')}đ</Text>
                </div>
                <div className="flex justify-between">
                  <Text>Phí dịch vụ</Text>
                  <Text>{booking.payment.serviceFee.toLocaleString('vi-VN')}đ</Text>
                </div>
                {booking.payment.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <Text>Giảm giá</Text>
                    <Text>-{booking.payment.discount.toLocaleString('vi-VN')}đ</Text>
                  </div>
                )}
                <Divider className="my-2" />
                <div className="flex justify-between items-center">
                  <Text strong className="text-lg">Tổng tiền</Text>
                  <Text strong className="text-xl text-blue-600">
                    {booking.payment.totalAmount.toLocaleString('vi-VN')}đ
                  </Text>
                </div>
                <Divider className="my-2" />
                <div>
                  <Text type="secondary" className="block">Phương thức thanh toán</Text>
                  <Text strong>
                    {booking.payment.method === 'vnpay' ? 'VNPay' :
                     booking.payment.method === 'momo' ? 'MoMo' :
                     booking.payment.method}
                  </Text>
                </div>
                <div>
                  <Text type="secondary" className="block">Trạng thái</Text>
                  <Tag color="success">Đã thanh toán</Tag>
                </div>
                <div>
                  <Text type="secondary" className="block">Thời gian thanh toán</Text>
                  <Text>{new Date(booking.payment.paidAt).toLocaleString('vi-VN')}</Text>
                </div>
              </div>
            </Card>

            {/* Contact Info */}
            <Card title="Thông tin liên hệ" className="mb-4 shadow-md">
              <div className="space-y-3">
                <div>
                  <Text type="secondary" className="block mb-1">
                    <MailOutlined /> Email
                  </Text>
                  <Text>{booking.contactInfo.email}</Text>
                </div>
                <div>
                  <Text type="secondary" className="block mb-1">
                    <PhoneOutlined /> Số điện thoại
                  </Text>
                  <Text>{booking.contactInfo.phone}</Text>
                </div>
              </div>
            </Card>

            {/* Support */}
            <Card className="bg-blue-50 border-blue-200 shadow-md">
              <Title level={5} className="mb-3">Cần hỗ trợ?</Title>
              <Paragraph className="mb-3">
                Liên hệ với chúng tôi nếu bạn có bất kỳ thắc mắc nào
              </Paragraph>
              <Space direction="vertical" className="w-full">
                <Link to="/contact">
                  <Button block>Liên hệ hỗ trợ</Button>
                </Link>
                <a href={`tel:${booking.trip.operator.phone}`}>
                  <Button icon={<PhoneOutlined />} block>
                    Gọi nhà xe: {booking.trip.operator.phone}
                  </Button>
                </a>
              </Space>
            </Card>
          </Col>
        </Row>

        {/* Cancel Modal */}
        <Modal
          title="Xác nhận hủy vé"
          open={cancelModalVisible}
          onOk={handleCancelBooking}
          onCancel={() => setCancelModalVisible(false)}
          okText="Xác nhận hủy"
          cancelText="Đóng"
          confirmLoading={cancelling}
          okButtonProps={{ danger: true }}
        >
          <Paragraph>
            Bạn có chắc chắn muốn hủy booking này không?
          </Paragraph>
          <Paragraph strong>
            Mã đặt vé: {booking.bookingCode}
          </Paragraph>
          <Paragraph type="secondary">
            Tiền sẽ được hoàn lại vào tài khoản của bạn trong vòng 3-5 ngày làm việc.
            Phí hủy vé (nếu có) sẽ được tính theo chính sách của nhà xe.
          </Paragraph>
        </Modal>
      </div>
    </div>
  );
};

export default BookingDetail;
