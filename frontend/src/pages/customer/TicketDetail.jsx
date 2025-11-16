import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Button,
  Typography,
  Tag,
  Divider,
  Steps,
  Row,
  Col,
  Space,
  message,
  Result
} from 'antd';
import {
  ArrowLeftOutlined,
  DownloadOutlined,
  ShareAltOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  PhoneOutlined
} from '@ant-design/icons';
import { QRCodeSVG } from 'qrcode.react';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;

const TicketDetail = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    fetchTicketDetails();
  }, [ticketId]);

  const fetchTicketDetails = async () => {
    setLoading(true);
    try {
      // TODO: Integrate with API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock data
      setTicket({
        id: ticketId,
        ticketCode: 'TK2024020101',
        bookingCode: 'BK20240201ABC',
        status: 'valid',
        passenger: {
          name: 'Nguyễn Văn A',
          phone: '0912345678',
          idCard: '079012345678'
        },
        seat: {
          number: 'A12',
          type: 'Giường nằm',
          floor: 1
        },
        trip: {
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
          departureTime: '2024-02-20T08:00:00',
          arrivalTime: '2024-02-20T16:00:00',
          bus: {
            busNumber: '51B-12345',
            type: 'Giường nằm',
            amenities: ['WiFi', 'Điều hòa', 'Nước uống', 'Chăn gối']
          },
          operator: {
            name: 'Phương Trang',
            phone: '1900 6067',
            hotline: '028 3838 3838'
          }
        },
        pickupPoint: {
          name: 'Bến xe Miền Đông',
          address: '292 Đinh Bộ Lĩnh, P.26, Q.Bình Thạnh',
          time: '2024-02-20T07:45:00'
        },
        dropoffPoint: {
          name: 'Bến xe Đà Lạt',
          address: '1 Tô Hiến Thành, Phường 3',
          time: '2024-02-20T16:00:00'
        },
        price: 250000,
        bookingDate: '2024-01-15T10:30:00',
        isUsed: false,
        usedAt: null,
        checkInTime: null
      });
    } catch (error) {
      message.error('Không thể tải thông tin vé');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    message.info('Tính năng tải vé đang được phát triển');
    // TODO: Implement PDF download
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Vé xe',
        text: `Vé ${ticket.ticketCode} - ${ticket.trip.route.origin.city} → ${ticket.trip.route.destination.city}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      message.success('Đã sao chép link vào clipboard');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      valid: 'green',
      used: 'default',
      cancelled: 'red',
      expired: 'orange'
    };
    return colors[status] || 'default';
  };

  const getStatusText = (status) => {
    const texts = {
      valid: 'Còn hạn',
      used: 'Đã sử dụng',
      cancelled: 'Đã hủy',
      expired: 'Hết hạn'
    };
    return texts[status] || status;
  };

  const getTimelineSteps = () => {
    const steps = [
      {
        title: 'Đã đặt vé',
        description: dayjs(ticket.bookingDate).format('DD/MM/YYYY HH:mm'),
        status: 'finish',
        icon: <CheckCircleOutlined />
      }
    ];

    if (ticket.checkInTime) {
      steps.push({
        title: 'Đã check-in',
        description: dayjs(ticket.checkInTime).format('DD/MM/YYYY HH:mm'),
        status: 'finish',
        icon: <CheckCircleOutlined />
      });
    } else {
      steps.push({
        title: 'Chờ check-in',
        description: 'Vui lòng đến điểm đón trước 15 phút',
        status: 'wait',
        icon: <ClockCircleOutlined />
      });
    }

    if (ticket.isUsed) {
      steps.push({
        title: 'Hoàn thành',
        description: dayjs(ticket.usedAt).format('DD/MM/YYYY HH:mm'),
        status: 'finish',
        icon: <CheckCircleOutlined />
      });
    } else {
      steps.push({
        title: 'Hoàn thành chuyến đi',
        description: dayjs(ticket.trip.arrivalTime).format('DD/MM/YYYY HH:mm'),
        status: 'wait'
      });
    }

    return steps;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <Text>Đang tải thông tin vé...</Text>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Result
          status="404"
          title="Không tìm thấy vé"
          subTitle="Vé này không tồn tại hoặc đã bị xóa"
          extra={
            <Button type="primary" onClick={() => navigate('/customer/tickets')}>
              Quay lại danh sách vé
            </Button>
          }
        />
      </div>
    );
  }

  const isPast = dayjs(ticket.trip.departureTime).isBefore(dayjs());
  const isSoon = dayjs(ticket.trip.departureTime).diff(dayjs(), 'hour') < 24;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/customer/tickets')}
            className="mb-4"
          >
            Quay lại
          </Button>

          <div className="flex justify-between items-start flex-wrap gap-4">
            <div>
              <Title level={2} className="!mb-2">Chi tiết vé</Title>
              <Space>
                <Text type="secondary">Mã vé:</Text>
                <Tag color="blue" className="text-base px-3 py-1">
                  {ticket.ticketCode}
                </Tag>
                <Tag color={getStatusColor(ticket.status)} className="text-base px-3 py-1">
                  {getStatusText(ticket.status)}
                </Tag>
              </Space>
            </div>
            <Space>
              <Button icon={<DownloadOutlined />} onClick={handleDownload} size="large">
                Tải vé
              </Button>
              <Button icon={<ShareAltOutlined />} onClick={handleShare} size="large">
                Chia sẻ
              </Button>
            </Space>
          </div>
        </div>

        {/* Warning if departure is soon */}
        {isSoon && !isPast && !ticket.isUsed && (
          <Card className="mb-6 bg-yellow-50 border-yellow-300">
            <div className="flex items-start gap-3">
              <ClockCircleOutlined className="text-yellow-600 text-xl mt-1" />
              <div>
                <Text strong className="text-yellow-900">Chuyến đi sắp khởi hành!</Text>
                <Paragraph className="mb-0 text-yellow-800">
                  Vui lòng có mặt tại điểm đón trước {dayjs(ticket.trip.departureTime).format('HH:mm, DD/MM/YYYY')}
                </Paragraph>
              </div>
            </div>
          </Card>
        )}

        {/* QR Code Card */}
        <Card className="mb-6 shadow-lg text-center">
          <Title level={4} className="mb-4">Mã QR để check-in</Title>
          <div className="inline-block bg-white p-6 border-2 border-gray-200 rounded-lg">
            <QRCodeSVG
              value={ticket.ticketCode}
              size={250}
              level="H"
              includeMargin
            />
          </div>
          <Paragraph className="mt-4 mb-2" type="secondary">
            Vui lòng xuất trình mã QR này khi lên xe
          </Paragraph>
          <Text strong className="text-lg">{ticket.ticketCode}</Text>
        </Card>

        {/* Timeline */}
        <Card className="mb-6 shadow-md">
          <Title level={4} className="mb-4">Trạng thái vé</Title>
          <Steps
            current={ticket.isUsed ? 2 : ticket.checkInTime ? 1 : 0}
            items={getTimelineSteps()}
          />
        </Card>

        <Row gutter={[16, 16]}>
          {/* Left Column */}
          <Col xs={24} lg={14}>
            {/* Trip Info */}
            <Card title="Thông tin chuyến đi" className="mb-4 shadow-md">
              <div className="space-y-4">
                <div>
                  <Text type="secondary" className="block mb-1">
                    <EnvironmentOutlined /> Điểm đi
                  </Text>
                  <Text strong className="block text-lg">{ticket.trip.route.origin.city}</Text>
                  <Text className="block text-gray-600">{ticket.trip.route.origin.station}</Text>
                  <Text className="block text-sm text-gray-500">{ticket.trip.route.origin.address}</Text>
                </div>

                <Divider className="my-3" />

                <div>
                  <Text type="secondary" className="block mb-1">
                    <EnvironmentOutlined /> Điểm đến
                  </Text>
                  <Text strong className="block text-lg">{ticket.trip.route.destination.city}</Text>
                  <Text className="block text-gray-600">{ticket.trip.route.destination.station}</Text>
                  <Text className="block text-sm text-gray-500">{ticket.trip.route.destination.address}</Text>
                </div>

                <Divider className="my-3" />

                <Row gutter={16}>
                  <Col span={12}>
                    <Text type="secondary" className="block mb-1">Khởi hành</Text>
                    <Text strong className="block">{dayjs(ticket.trip.departureTime).format('HH:mm')}</Text>
                    <Text className="text-sm">{dayjs(ticket.trip.departureTime).format('DD/MM/YYYY')}</Text>
                  </Col>
                  <Col span={12}>
                    <Text type="secondary" className="block mb-1">Dự kiến đến</Text>
                    <Text strong className="block">{dayjs(ticket.trip.arrivalTime).format('HH:mm')}</Text>
                    <Text className="text-sm">{dayjs(ticket.trip.arrivalTime).format('DD/MM/YYYY')}</Text>
                  </Col>
                </Row>

                <Divider className="my-3" />

                <div>
                  <Text type="secondary" className="block mb-1">Nhà xe</Text>
                  <Text strong className="text-lg">{ticket.trip.operator.name}</Text>
                </div>

                <div>
                  <Text type="secondary" className="block mb-1">Loại xe</Text>
                  <Text>{ticket.trip.bus.type} - {ticket.trip.bus.busNumber}</Text>
                </div>

                <div>
                  <Text type="secondary" className="block mb-1">Tiện ích</Text>
                  <Space wrap>
                    {ticket.trip.bus.amenities.map((amenity, idx) => (
                      <Tag key={idx}>{amenity}</Tag>
                    ))}
                  </Space>
                </div>
              </div>
            </Card>

            {/* Pickup & Dropoff */}
            <Card title="Điểm đón/trả" className="shadow-md">
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <div className="mb-4 md:mb-0">
                    <Text strong className="block mb-2 text-green-600">
                      <EnvironmentOutlined /> Điểm đón
                    </Text>
                    <Text strong className="block">{ticket.pickupPoint.name}</Text>
                    <Text className="block text-gray-600 text-sm mb-1">
                      {ticket.pickupPoint.address}
                    </Text>
                    <Text type="secondary" className="text-sm">
                      <ClockCircleOutlined /> {dayjs(ticket.pickupPoint.time).format('HH:mm, DD/MM/YYYY')}
                    </Text>
                  </div>
                </Col>
                <Col xs={24} md={12}>
                  <div>
                    <Text strong className="block mb-2 text-red-600">
                      <EnvironmentOutlined /> Điểm trả
                    </Text>
                    <Text strong className="block">{ticket.dropoffPoint.name}</Text>
                    <Text className="block text-gray-600 text-sm mb-1">
                      {ticket.dropoffPoint.address}
                    </Text>
                    <Text type="secondary" className="text-sm">
                      <ClockCircleOutlined /> {dayjs(ticket.dropoffPoint.time).format('HH:mm, DD/MM/YYYY')}
                    </Text>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* Right Column */}
          <Col xs={24} lg={10}>
            {/* Passenger Info */}
            <Card title="Thông tin hành khách" className="mb-4 shadow-md">
              <div className="space-y-3">
                <div>
                  <Text type="secondary" className="block mb-1">Họ tên</Text>
                  <Text strong className="text-lg">{ticket.passenger.name}</Text>
                </div>
                <div>
                  <Text type="secondary" className="block mb-1">Số điện thoại</Text>
                  <Text>{ticket.passenger.phone}</Text>
                </div>
                <div>
                  <Text type="secondary" className="block mb-1">CMND/CCCD</Text>
                  <Text>{ticket.passenger.idCard}</Text>
                </div>
                <Divider className="my-3" />
                <div>
                  <Text type="secondary" className="block mb-1">Số ghế</Text>
                  <Tag color="blue" className="text-lg px-3 py-1">
                    {ticket.seat.number}
                  </Tag>
                </div>
                <div>
                  <Text type="secondary" className="block mb-1">Loại ghế</Text>
                  <Text>{ticket.seat.type}</Text>
                </div>
              </div>
            </Card>

            {/* Price Info */}
            <Card title="Thông tin giá vé" className="mb-4 shadow-md">
              <div className="flex justify-between items-center">
                <Text>Giá vé</Text>
                <Text strong className="text-2xl text-blue-600">
                  {ticket.price.toLocaleString('vi-VN')}đ
                </Text>
              </div>
            </Card>

            {/* Contact Support */}
            <Card className="bg-blue-50 border-blue-200 shadow-md">
              <Title level={5} className="mb-3">Liên hệ hỗ trợ</Title>
              <div className="space-y-3">
                <div>
                  <Text type="secondary" className="block mb-1">Hotline nhà xe</Text>
                  <a href={`tel:${ticket.trip.operator.phone}`} className="text-blue-600 hover:text-blue-800">
                    <PhoneOutlined /> {ticket.trip.operator.phone}
                  </a>
                </div>
                <div>
                  <Text type="secondary" className="block mb-1">Hỗ trợ khẩn cấp</Text>
                  <a href="tel:1900 1234" className="text-blue-600 hover:text-blue-800">
                    <PhoneOutlined /> 1900 1234
                  </a>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default TicketDetail;
