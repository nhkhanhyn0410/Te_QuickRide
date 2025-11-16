import { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Tag,
  Input,
  Select,
  DatePicker,
  Space,
  Modal,
  Descriptions,
  Row,
  Col,
  Statistic,
  Badge,
  Drawer,
  Form,
  message,
  Popconfirm,
  Avatar,
  Divider
} from 'antd';
import {
  SearchOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  PhoneOutlined,
  MailOutlined,
  UserOutlined,
  FilterOutlined,
  DownloadOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Title, Text } = Typography;
import { Typography } from 'antd';

const Bookings = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [dateRange, setDateRange] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState('all');
  const [detailDrawer, setDetailDrawer] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(false);

  // Mock statistics
  const stats = {
    total: 1567,
    confirmed: 1234,
    pending: 145,
    cancelled: 188,
    revenue: 425000000
  };

  // Mock bookings data
  const bookingsData = [
    {
      key: 1,
      bookingCode: 'BK2024011501',
      customerName: 'Nguyễn Văn An',
      customerPhone: '0901234567',
      customerEmail: 'nguyenvanan@email.com',
      route: 'TP.HCM → Đà Lạt',
      departureTime: '2024-01-20 06:00',
      busType: 'Giường nằm',
      busPlate: '51B-12345',
      seats: ['A1', 'A2'],
      seatCount: 2,
      totalAmount: 540000,
      status: 'confirmed',
      paymentStatus: 'paid',
      bookingDate: '2024-01-15 14:30',
      pickupPoint: 'Bến xe Miền Đông',
      dropoffPoint: 'Bến xe Đà Lạt',
      specialRequests: 'Cần chỗ để hành lý nhiều'
    },
    {
      key: 2,
      bookingCode: 'BK2024011502',
      customerName: 'Trần Thị Bình',
      customerPhone: '0912345678',
      customerEmail: 'tranbinhtt@email.com',
      route: 'TP.HCM → Cần Thơ',
      departureTime: '2024-01-20 08:30',
      busType: 'Ghế ngồi',
      busPlate: '51B-67890',
      seats: ['B5'],
      seatCount: 1,
      totalAmount: 150000,
      status: 'confirmed',
      paymentStatus: 'paid',
      bookingDate: '2024-01-15 16:45',
      pickupPoint: 'Bến xe Miền Tây',
      dropoffPoint: 'Bến xe Cần Thơ',
      specialRequests: null
    },
    {
      key: 3,
      bookingCode: 'BK2024011503',
      customerName: 'Lê Hoàng Cường',
      customerPhone: '0923456789',
      customerEmail: 'lehoangcuong@email.com',
      route: 'TP.HCM → Đà Lạt',
      departureTime: '2024-01-21 14:00',
      busType: 'Limousine',
      busPlate: '51B-11111',
      seats: ['L1', 'L2', 'L3'],
      seatCount: 3,
      totalAmount: 1350000,
      status: 'pending',
      paymentStatus: 'pending',
      bookingDate: '2024-01-15 18:20',
      pickupPoint: 'Sân bay Tân Sơn Nhất',
      dropoffPoint: 'Khách sạn Palace',
      specialRequests: 'Đón tại sân bay, cần WiFi'
    },
    {
      key: 4,
      bookingCode: 'BK2024011504',
      customerName: 'Phạm Thu Dung',
      customerPhone: '0934567890',
      customerEmail: 'phamthudung@email.com',
      route: 'TP.HCM → Vũng Tàu',
      departureTime: '2024-01-19 07:00',
      busType: 'Giường nằm',
      busPlate: '51B-22222',
      seats: ['C3'],
      seatCount: 1,
      totalAmount: 180000,
      status: 'cancelled',
      paymentStatus: 'refunded',
      bookingDate: '2024-01-14 10:15',
      pickupPoint: 'Bến xe Miền Đông',
      dropoffPoint: 'Bến xe Vũng Tàu',
      specialRequests: null,
      cancellationReason: 'Khách hủy do thay đổi lịch trình',
      cancelledAt: '2024-01-16 09:30'
    },
    {
      key: 5,
      bookingCode: 'BK2024011505',
      customerName: 'Võ Minh Tuấn',
      customerPhone: '0945678901',
      customerEmail: 'vominhtuan@email.com',
      route: 'TP.HCM → Nha Trang',
      departureTime: '2024-01-22 20:00',
      busType: 'Giường nằm',
      busPlate: '51B-33333',
      seats: ['D1', 'D2'],
      seatCount: 2,
      totalAmount: 720000,
      status: 'confirmed',
      paymentStatus: 'paid',
      bookingDate: '2024-01-15 20:00',
      pickupPoint: 'Bến xe Miền Đông',
      dropoffPoint: 'Bến xe Nha Trang',
      specialRequests: 'Chỗ ngồi gần cửa sổ'
    },
    {
      key: 6,
      bookingCode: 'BK2024011506',
      customerName: 'Đặng Thị Em',
      customerPhone: '0956789012',
      customerEmail: 'dangthiem@email.com',
      route: 'TP.HCM → Cần Thơ',
      departureTime: '2024-01-20 10:00',
      busType: 'Ghế ngồi',
      busPlate: '51B-44444',
      seats: ['E10', 'E11'],
      seatCount: 2,
      totalAmount: 300000,
      status: 'confirmed',
      paymentStatus: 'paid',
      bookingDate: '2024-01-15 21:30',
      pickupPoint: 'Bến xe Miền Tây',
      dropoffPoint: 'Chợ Cần Thơ',
      specialRequests: null
    }
  ];

  const getStatusTag = (status) => {
    const statusConfig = {
      confirmed: { color: 'green', text: 'Đã xác nhận', icon: <CheckCircleOutlined /> },
      pending: { color: 'orange', text: 'Chờ xác nhận', icon: <CloseCircleOutlined /> },
      cancelled: { color: 'red', text: 'Đã hủy', icon: <CloseCircleOutlined /> },
      completed: { color: 'blue', text: 'Hoàn thành', icon: <CheckCircleOutlined /> }
    };
    const config = statusConfig[status] || statusConfig.pending;
    return <Tag color={config.color} icon={config.icon}>{config.text}</Tag>;
  };

  const getPaymentStatusTag = (status) => {
    const statusConfig = {
      paid: { color: 'green', text: 'Đã thanh toán' },
      pending: { color: 'orange', text: 'Chờ thanh toán' },
      refunded: { color: 'purple', text: 'Đã hoàn tiền' }
    };
    const config = statusConfig[status] || statusConfig.pending;
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const columns = [
    {
      title: 'Mã booking',
      dataIndex: 'bookingCode',
      key: 'bookingCode',
      fixed: 'left',
      width: 140,
      render: (text) => <Text strong className="text-blue-600">{text}</Text>
    },
    {
      title: 'Khách hàng',
      key: 'customer',
      width: 200,
      render: (_, record) => (
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Avatar size="small" icon={<UserOutlined />} />
            <Text strong>{record.customerName}</Text>
          </div>
          <Text type="secondary" className="text-xs block">
            <PhoneOutlined /> {record.customerPhone}
          </Text>
        </div>
      )
    },
    {
      title: 'Tuyến đường',
      dataIndex: 'route',
      key: 'route',
      width: 180,
      render: (text) => <Text>{text}</Text>
    },
    {
      title: 'Thời gian',
      dataIndex: 'departureTime',
      key: 'departureTime',
      width: 150,
      render: (text) => (
        <div>
          <Text className="block">{dayjs(text).format('DD/MM/YYYY')}</Text>
          <Text type="secondary" className="text-xs">{dayjs(text).format('HH:mm')}</Text>
        </div>
      ),
      sorter: (a, b) => dayjs(a.departureTime).unix() - dayjs(b.departureTime).unix()
    },
    {
      title: 'Loại xe / Biển số',
      key: 'bus',
      width: 150,
      render: (_, record) => (
        <div>
          <Text className="block">{record.busType}</Text>
          <Text type="secondary" className="text-xs">{record.busPlate}</Text>
        </div>
      )
    },
    {
      title: 'Ghế',
      dataIndex: 'seats',
      key: 'seats',
      width: 100,
      render: (seats) => (
        <Tag color="blue">{seats.join(', ')}</Tag>
      )
    },
    {
      title: 'Số tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 120,
      render: (amount) => (
        <Text strong className="text-green-600">
          {amount.toLocaleString('vi-VN')}đ
        </Text>
      ),
      sorter: (a, b) => a.totalAmount - b.totalAmount
    },
    {
      title: 'Trạng thái',
      key: 'status',
      width: 140,
      render: (_, record) => (
        <div>
          {getStatusTag(record.status)}
          <div className="mt-1">
            {getPaymentStatusTag(record.paymentStatus)}
          </div>
        </div>
      ),
      filters: [
        { text: 'Đã xác nhận', value: 'confirmed' },
        { text: 'Chờ xác nhận', value: 'pending' },
        { text: 'Đã hủy', value: 'cancelled' }
      ],
      onFilter: (value, record) => record.status === value
    },
    {
      title: 'Thao tác',
      key: 'action',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            Chi tiết
          </Button>
        </Space>
      )
    }
  ];

  const handleViewDetail = (booking) => {
    setSelectedBooking(booking);
    setDetailDrawer(true);
  };

  const handleConfirmBooking = async (bookingCode) => {
    setLoading(true);
    // TODO: Integrate with API
    setTimeout(() => {
      message.success(`Đã xác nhận booking ${bookingCode}`);
      setLoading(false);
      setDetailDrawer(false);
    }, 1000);
  };

  const handleCancelBooking = async (bookingCode) => {
    setLoading(true);
    // TODO: Integrate with API
    setTimeout(() => {
      message.success(`Đã hủy booking ${bookingCode}`);
      setLoading(false);
      setDetailDrawer(false);
    }, 1000);
  };

  const handleExport = () => {
    // TODO: Implement export to Excel
    message.success('Đang xuất dữ liệu...');
  };

  const handleRefresh = () => {
    setLoading(true);
    // TODO: Fetch fresh data from API
    setTimeout(() => {
      message.success('Đã làm mới dữ liệu');
      setLoading(false);
    }, 1000);
  };

  const filteredData = bookingsData.filter(booking => {
    const matchesSearch =
      booking.bookingCode.toLowerCase().includes(searchText.toLowerCase()) ||
      booking.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
      booking.customerPhone.includes(searchText);

    const matchesStatus = selectedStatus === 'all' || booking.status === selectedStatus;
    const matchesRoute = selectedRoute === 'all' || booking.route === selectedRoute;

    let matchesDate = true;
    if (dateRange && dateRange.length === 2) {
      const bookingDate = dayjs(booking.departureTime);
      matchesDate = bookingDate.isAfter(dateRange[0]) && bookingDate.isBefore(dateRange[1]);
    }

    return matchesSearch && matchesStatus && matchesRoute && matchesDate;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Title level={2}>Quản lý Booking</Title>
          <Text type="secondary">
            Quản lý và theo dõi tất cả các booking của nhà xe
          </Text>
        </div>

        {/* Statistics */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Tổng booking"
                value={stats.total}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Đã xác nhận"
                value={stats.confirmed}
                valueStyle={{ color: '#52c41a' }}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Badge count={stats.pending} offset={[10, 0]}>
                <Statistic
                  title="Chờ xác nhận"
                  value={stats.pending}
                  valueStyle={{ color: '#faad14' }}
                />
              </Badge>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Doanh thu"
                value={stats.revenue}
                precision={0}
                valueStyle={{ color: '#3f8600' }}
                formatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                suffix="đ"
              />
            </Card>
          </Col>
        </Row>

        {/* Filters */}
        <Card className="mb-4">
          <div className="flex flex-wrap gap-3">
            <Input
              placeholder="Tìm theo mã, tên, SĐT..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 250 }}
              allowClear
            />
            <Select
              value={selectedStatus}
              onChange={setSelectedStatus}
              style={{ width: 150 }}
            >
              <Option value="all">Tất cả trạng thái</Option>
              <Option value="confirmed">Đã xác nhận</Option>
              <Option value="pending">Chờ xác nhận</Option>
              <Option value="cancelled">Đã hủy</Option>
            </Select>
            <Select
              value={selectedRoute}
              onChange={setSelectedRoute}
              style={{ width: 200 }}
            >
              <Option value="all">Tất cả tuyến</Option>
              <Option value="TP.HCM → Đà Lạt">TP.HCM → Đà Lạt</Option>
              <Option value="TP.HCM → Cần Thơ">TP.HCM → Cần Thơ</Option>
              <Option value="TP.HCM → Vũng Tàu">TP.HCM → Vũng Tàu</Option>
            </Select>
            <RangePicker
              value={dateRange}
              onChange={setDateRange}
              format="DD/MM/YYYY"
              placeholder={['Từ ngày', 'Đến ngày']}
            />
            <Button
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              loading={loading}
            >
              Làm mới
            </Button>
            <Button
              icon={<DownloadOutlined />}
              onClick={handleExport}
            >
              Xuất Excel
            </Button>
          </div>
        </Card>

        {/* Bookings Table */}
        <Card>
          <Table
            columns={columns}
            dataSource={filteredData}
            scroll={{ x: 1400 }}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Tổng ${total} booking`
            }}
            loading={loading}
          />
        </Card>

        {/* Detail Drawer */}
        <Drawer
          title={`Chi tiết Booking: ${selectedBooking?.bookingCode}`}
          placement="right"
          width={600}
          open={detailDrawer}
          onClose={() => setDetailDrawer(false)}
        >
          {selectedBooking && (
            <div className="space-y-6">
              {/* Status */}
              <div className="flex justify-between items-center">
                <div className="space-x-2">
                  {getStatusTag(selectedBooking.status)}
                  {getPaymentStatusTag(selectedBooking.paymentStatus)}
                </div>
                {selectedBooking.status === 'pending' && (
                  <Space>
                    <Popconfirm
                      title="Xác nhận booking này?"
                      onConfirm={() => handleConfirmBooking(selectedBooking.bookingCode)}
                      okText="Xác nhận"
                      cancelText="Hủy"
                    >
                      <Button type="primary" icon={<CheckCircleOutlined />}>
                        Xác nhận
                      </Button>
                    </Popconfirm>
                    <Popconfirm
                      title="Hủy booking này?"
                      onConfirm={() => handleCancelBooking(selectedBooking.bookingCode)}
                      okText="Hủy booking"
                      cancelText="Đóng"
                    >
                      <Button danger icon={<CloseCircleOutlined />}>
                        Hủy booking
                      </Button>
                    </Popconfirm>
                  </Space>
                )}
              </div>

              <Divider />

              {/* Customer Info */}
              <div>
                <Title level={5}>Thông tin khách hàng</Title>
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="Họ tên">
                    {selectedBooking.customerName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Số điện thoại">
                    <Space>
                      <PhoneOutlined />
                      {selectedBooking.customerPhone}
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label="Email">
                    <Space>
                      <MailOutlined />
                      {selectedBooking.customerEmail}
                    </Space>
                  </Descriptions.Item>
                </Descriptions>
              </div>

              <Divider />

              {/* Trip Info */}
              <div>
                <Title level={5}>Thông tin chuyến đi</Title>
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="Tuyến đường">
                    <Text strong>{selectedBooking.route}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Thời gian khởi hành">
                    {dayjs(selectedBooking.departureTime).format('DD/MM/YYYY HH:mm')}
                  </Descriptions.Item>
                  <Descriptions.Item label="Loại xe">
                    {selectedBooking.busType}
                  </Descriptions.Item>
                  <Descriptions.Item label="Biển số xe">
                    {selectedBooking.busPlate}
                  </Descriptions.Item>
                  <Descriptions.Item label="Điểm đón">
                    {selectedBooking.pickupPoint}
                  </Descriptions.Item>
                  <Descriptions.Item label="Điểm trả">
                    {selectedBooking.dropoffPoint}
                  </Descriptions.Item>
                  <Descriptions.Item label="Số ghế">
                    <Space>
                      {selectedBooking.seats.map(seat => (
                        <Tag key={seat} color="blue">{seat}</Tag>
                      ))}
                    </Space>
                  </Descriptions.Item>
                </Descriptions>
              </div>

              <Divider />

              {/* Payment Info */}
              <div>
                <Title level={5}>Thông tin thanh toán</Title>
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="Tổng tiền">
                    <Text strong className="text-green-600 text-lg">
                      {selectedBooking.totalAmount.toLocaleString('vi-VN')}đ
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Số lượng ghế">
                    {selectedBooking.seatCount} ghế
                  </Descriptions.Item>
                  <Descriptions.Item label="Thời gian đặt">
                    {dayjs(selectedBooking.bookingDate).format('DD/MM/YYYY HH:mm')}
                  </Descriptions.Item>
                </Descriptions>
              </div>

              {selectedBooking.specialRequests && (
                <>
                  <Divider />
                  <div>
                    <Title level={5}>Yêu cầu đặc biệt</Title>
                    <Text>{selectedBooking.specialRequests}</Text>
                  </div>
                </>
              )}

              {selectedBooking.status === 'cancelled' && (
                <>
                  <Divider />
                  <div>
                    <Title level={5}>Thông tin hủy</Title>
                    <Descriptions column={1} size="small">
                      <Descriptions.Item label="Lý do hủy">
                        {selectedBooking.cancellationReason}
                      </Descriptions.Item>
                      <Descriptions.Item label="Thời gian hủy">
                        {dayjs(selectedBooking.cancelledAt).format('DD/MM/YYYY HH:mm')}
                      </Descriptions.Item>
                    </Descriptions>
                  </div>
                </>
              )}
            </div>
          )}
        </Drawer>
      </div>
    </div>
  );
};

export default Bookings;
