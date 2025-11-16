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
  message,
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
  ReloadOutlined,
  CarOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Title, Text } = Typography;
import { Typography } from 'antd';

const ManageBookings = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [dateRange, setDateRange] = useState(null);
  const [selectedOperator, setSelectedOperator] = useState('all');
  const [detailDrawer, setDetailDrawer] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(false);

  // Mock statistics
  const stats = {
    total: 12567,
    confirmed: 10234,
    pending: 1456,
    cancelled: 877,
    revenue: 3456000000
  };

  // Mock bookings data
  const bookingsData = [
    {
      key: 1,
      bookingCode: 'BK2024011501',
      customerName: 'Nguyễn Văn An',
      customerPhone: '0901234567',
      customerEmail: 'nguyenvanan@email.com',
      operator: 'Phương Trang',
      route: 'TP.HCM → Đà Lạt',
      departureTime: '2024-01-20 06:00',
      busType: 'Giường nằm',
      busPlate: '51B-12345',
      seats: ['A1', 'A2'],
      seatCount: 2,
      totalAmount: 540000,
      status: 'confirmed',
      paymentStatus: 'paid',
      paymentMethod: 'VNPay',
      bookingDate: '2024-01-15 14:30',
      pickupPoint: 'Bến xe Miền Đông',
      dropoffPoint: 'Bến xe Đà Lạt'
    },
    {
      key: 2,
      bookingCode: 'BK2024011502',
      customerName: 'Trần Thị Bình',
      customerPhone: '0912345678',
      customerEmail: 'tranbinhtt@email.com',
      operator: 'Mai Linh',
      route: 'TP.HCM → Cần Thơ',
      departureTime: '2024-01-20 08:30',
      busType: 'Ghế ngồi',
      busPlate: '51B-67890',
      seats: ['B5'],
      seatCount: 1,
      totalAmount: 150000,
      status: 'confirmed',
      paymentStatus: 'paid',
      paymentMethod: 'MoMo',
      bookingDate: '2024-01-15 16:45',
      pickupPoint: 'Bến xe Miền Tây',
      dropoffPoint: 'Bến xe Cần Thơ'
    },
    {
      key: 3,
      bookingCode: 'BK2024011503',
      customerName: 'Lê Hoàng Cường',
      customerPhone: '0923456789',
      customerEmail: 'lehoangcuong@email.com',
      operator: 'Kumho Samco',
      route: 'Hà Nội → Hải Phòng',
      departureTime: '2024-01-21 14:00',
      busType: 'Limousine',
      busPlate: '29A-11111',
      seats: ['L1', 'L2', 'L3'],
      seatCount: 3,
      totalAmount: 1350000,
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod: null,
      bookingDate: '2024-01-15 18:20',
      pickupPoint: 'Bến xe Giáp Bát',
      dropoffPoint: 'Bến xe Niệm Nghĩa'
    },
    {
      key: 4,
      bookingCode: 'BK2024011504',
      customerName: 'Phạm Thu Dung',
      customerPhone: '0934567890',
      customerEmail: 'phamthudung@email.com',
      operator: 'Hoàng Long',
      route: 'TP.HCM → Vũng Tàu',
      departureTime: '2024-01-19 07:00',
      busType: 'Giường nằm',
      busPlate: '51B-22222',
      seats: ['C3'],
      seatCount: 1,
      totalAmount: 180000,
      status: 'cancelled',
      paymentStatus: 'refunded',
      paymentMethod: 'VNPay',
      bookingDate: '2024-01-14 10:15',
      pickupPoint: 'Bến xe Miền Đông',
      dropoffPoint: 'Bến xe Vũng Tàu',
      cancellationReason: 'Khách hủy do thay đổi lịch trình',
      cancelledAt: '2024-01-16 09:30'
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
      title: 'Nhà xe',
      dataIndex: 'operator',
      key: 'operator',
      width: 130,
      render: (text) => <Tag color="orange">{text}</Tag>,
      filters: [
        { text: 'Phương Trang', value: 'Phương Trang' },
        { text: 'Mai Linh', value: 'Mai Linh' },
        { text: 'Kumho Samco', value: 'Kumho Samco' }
      ],
      onFilter: (value, record) => record.operator === value
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
      title: 'Loại xe',
      dataIndex: 'busType',
      key: 'busType',
      width: 120
    },
    {
      title: 'Số ghế',
      dataIndex: 'seatCount',
      key: 'seatCount',
      width: 80,
      align: 'center'
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
      width: 100,
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetail(record)}
        >
          Chi tiết
        </Button>
      )
    }
  ];

  const handleViewDetail = (booking) => {
    setSelectedBooking(booking);
    setDetailDrawer(true);
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
    const matchesOperator = selectedOperator === 'all' || booking.operator === selectedOperator;

    let matchesDate = true;
    if (dateRange && dateRange.length === 2) {
      const bookingDate = dayjs(booking.departureTime);
      matchesDate = bookingDate.isAfter(dateRange[0]) && bookingDate.isBefore(dateRange[1]);
    }

    return matchesSearch && matchesStatus && matchesOperator && matchesDate;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Title level={2}>Quản lý Booking Toàn Hệ Thống</Title>
          <Text type="secondary">
            Theo dõi và quản lý tất cả booking của tất cả nhà xe
          </Text>
        </div>

        {/* Statistics */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={12} sm={6}>
            <Card>
              <Statistic
                title="Tổng booking"
                value={stats.total}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card>
              <Statistic
                title="Đã xác nhận"
                value={stats.confirmed}
                valueStyle={{ color: '#52c41a' }}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
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
          <Col xs={12} sm={6}>
            <Card>
              <Statistic
                title="Tổng doanh thu"
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
              value={selectedOperator}
              onChange={setSelectedOperator}
              style={{ width: 180 }}
            >
              <Option value="all">Tất cả nhà xe</Option>
              <Option value="Phương Trang">Phương Trang</Option>
              <Option value="Mai Linh">Mai Linh</Option>
              <Option value="Kumho Samco">Kumho Samco</Option>
              <Option value="Hoàng Long">Hoàng Long</Option>
            </Select>
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
            scroll={{ x: 1600 }}
            pagination={{
              pageSize: 15,
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
                  <Descriptions.Item label="Nhà xe">
                    <Tag color="orange">{selectedBooking.operator}</Tag>
                  </Descriptions.Item>
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
                  {selectedBooking.paymentMethod && (
                    <Descriptions.Item label="Phương thức">
                      {selectedBooking.paymentMethod}
                    </Descriptions.Item>
                  )}
                  <Descriptions.Item label="Thời gian đặt">
                    {dayjs(selectedBooking.bookingDate).format('DD/MM/YYYY HH:mm')}
                  </Descriptions.Item>
                </Descriptions>
              </div>

              {selectedBooking.status === 'cancelled' && selectedBooking.cancellationReason && (
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

export default ManageBookings;
