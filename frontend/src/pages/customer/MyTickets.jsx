import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Tabs,
  Row,
  Col,
  Tag,
  Button,
  Typography,
  Space,
  Input,
  Empty,
  message
} from 'antd';
import {
  QrcodeOutlined,
  DownloadOutlined,
  MailOutlined,
  SearchOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { QRCodeSVG } from 'qrcode.react';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Search } = Input;

const MyTickets = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [tickets] = useState([
    {
      id: 'ticket1',
      ticketCode: 'TK2024011501',
      bookingCode: 'BK20240115',
      passengerName: 'Nguyễn Văn A',
      seatNumber: 'A12',
      status: 'valid',
      trip: {
        route: {
          origin: { city: 'TP. Hồ Chí Minh' },
          destination: { city: 'Đà Lạt' }
        },
        departureTime: '2024-02-20T08:00:00',
        bus: {
          busNumber: '51B-12345',
          type: 'Giường nằm'
        }
      },
      price: 250000,
      isUsed: false
    },
    {
      id: 'ticket2',
      ticketCode: 'TK2024011502',
      bookingCode: 'BK20240115',
      passengerName: 'Trần Thị B',
      seatNumber: 'A13',
      status: 'valid',
      trip: {
        route: {
          origin: { city: 'TP. Hồ Chí Minh' },
          destination: { city: 'Đà Lạt' }
        },
        departureTime: '2024-02-20T08:00:00',
        bus: {
          busNumber: '51B-12345',
          type: 'Giường nằm'
        }
      },
      price: 250000,
      isUsed: false
    },
    {
      id: 'ticket3',
      ticketCode: 'TK2024010801',
      bookingCode: 'BK20240108',
      passengerName: 'Nguyễn Văn A',
      seatNumber: 'B5',
      status: 'used',
      trip: {
        route: {
          origin: { city: 'Hà Nội' },
          destination: { city: 'Hải Phòng' }
        },
        departureTime: '2024-01-10T14:00:00',
        bus: {
          busNumber: '29A-54321',
          type: 'Ghế ngồi'
        }
      },
      price: 120000,
      isUsed: true,
      usedAt: '2024-01-10T14:15:00'
    }
  ]);

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

  const filterTickets = (tickets, status) => {
    let filtered = tickets;

    if (status === 'valid') {
      filtered = tickets.filter(t => t.status === 'valid' && !t.isUsed);
    } else if (status === 'used') {
      filtered = tickets.filter(t => t.isUsed);
    }

    if (searchText) {
      filtered = filtered.filter(
        t =>
          t.ticketCode.toLowerCase().includes(searchText.toLowerCase()) ||
          t.bookingCode.toLowerCase().includes(searchText.toLowerCase()) ||
          t.passengerName.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    return filtered;
  };

  const handleDownloadTicket = (ticket) => {
    message.info(`Tính năng tải vé ${ticket.ticketCode} đang được phát triển`);
    // TODO: Implement PDF download
  };

  const handleSendEmail = (ticket) => {
    message.success(`Vé ${ticket.ticketCode} đã được gửi đến email của bạn`);
    // TODO: Implement email sending
  };

  const handleViewDetails = (ticket) => {
    navigate(`/customer/tickets/${ticket.id}`);
  };

  const TicketCard = ({ ticket }) => {
    const isPast = dayjs(ticket.trip.departureTime).isBefore(dayjs());

    return (
      <Card className="mb-4 hover:shadow-lg transition-shadow" size="small">
        <Row gutter={[16, 16]} align="middle">
          {/* QR Code */}
          <Col xs={24} sm={6} md={4} className="text-center">
            <div className="bg-white p-2 border rounded inline-block">
              <QRCodeSVG
                value={ticket.ticketCode}
                size={80}
                level="H"
              />
            </div>
            <Text className="block mt-2 text-xs text-gray-500">
              {ticket.ticketCode}
            </Text>
          </Col>

          {/* Ticket Info */}
          <Col xs={24} sm={18} md={14}>
            <div className="mb-2">
              <Space wrap>
                <Tag color={getStatusColor(ticket.status)}>
                  {getStatusText(ticket.status)}
                </Tag>
                <Tag color="blue">Ghế {ticket.seatNumber}</Tag>
                {ticket.isUsed && (
                  <Tag icon={<ClockCircleOutlined />}>
                    Đã sử dụng {dayjs(ticket.usedAt).format('DD/MM/YYYY HH:mm')}
                  </Tag>
                )}
              </Space>
            </div>

            <Title level={5} className="!mb-2">
              {ticket.trip.route.origin.city} → {ticket.trip.route.destination.city}
            </Title>

            <div className="space-y-1">
              <div>
                <Text type="secondary">Hành khách: </Text>
                <Text strong>{ticket.passengerName}</Text>
              </div>
              <div>
                <Text type="secondary">Thời gian: </Text>
                <Text>{dayjs(ticket.trip.departureTime).format('DD/MM/YYYY HH:mm')}</Text>
              </div>
              <div>
                <Text type="secondary">Xe: </Text>
                <Text>{ticket.trip.bus.type} - {ticket.trip.bus.busNumber}</Text>
              </div>
              <div>
                <Text type="secondary">Giá vé: </Text>
                <Text strong className="text-blue-600">
                  {ticket.price.toLocaleString('vi-VN')}đ
                </Text>
              </div>
            </div>
          </Col>

          {/* Actions */}
          <Col xs={24} md={6} className="text-right">
            <Space direction="vertical" className="w-full">
              <Button
                type="primary"
                icon={<QrcodeOutlined />}
                onClick={() => handleViewDetails(ticket)}
                block
              >
                Xem chi tiết
              </Button>
              <Button
                icon={<DownloadOutlined />}
                onClick={() => handleDownloadTicket(ticket)}
                block
              >
                Tải vé
              </Button>
              <Button
                icon={<MailOutlined />}
                onClick={() => handleSendEmail(ticket)}
                block
              >
                Gửi email
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Title level={2}>Vé của tôi</Title>
          <Text type="secondary">
            Quản lý tất cả các vé xe bạn đã đặt
          </Text>
        </div>

        {/* Search */}
        <Card className="mb-6 shadow-md">
          <Search
            placeholder="Tìm theo mã vé, mã booking, hoặc tên hành khách..."
            allowClear
            size="large"
            prefix={<SearchOutlined />}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </Card>

        {/* Tabs */}
        <Card className="shadow-md">
          <Tabs defaultActiveKey="all" size="large">
            <TabPane tab="Tất cả vé" key="all">
              {filterTickets(tickets, 'all').length === 0 ? (
                <Empty
                  description="Không tìm thấy vé nào"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ) : (
                filterTickets(tickets, 'all').map(ticket => (
                  <TicketCard key={ticket.id} ticket={ticket} />
                ))
              )}
            </TabPane>

            <TabPane tab={`Vé còn hạn (${filterTickets(tickets, 'valid').length})`} key="valid">
              {filterTickets(tickets, 'valid').length === 0 ? (
                <Empty
                  description="Không có vé còn hạn"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ) : (
                filterTickets(tickets, 'valid').map(ticket => (
                  <TicketCard key={ticket.id} ticket={ticket} />
                ))
              )}
            </TabPane>

            <TabPane tab={`Đã sử dụng (${filterTickets(tickets, 'used').length})`} key="used">
              {filterTickets(tickets, 'used').length === 0 ? (
                <Empty
                  description="Không có vé đã sử dụng"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ) : (
                filterTickets(tickets, 'used').map(ticket => (
                  <TicketCard key={ticket.id} ticket={ticket} />
                ))
              )}
            </TabPane>
          </Tabs>
        </Card>

        {/* Info Banner */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <Title level={5}>Lưu ý khi sử dụng vé</Title>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Vui lòng xuất trình mã QR khi lên xe</li>
            <li>Có mặt tại điểm đón trước giờ khởi hành ít nhất 15 phút</li>
            <li>Mang theo giấy tờ tùy thân để kiểm tra khi cần</li>
            <li>Vé chỉ có giá trị cho chuyến đi đã đặt, không hoàn lại</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default MyTickets;
