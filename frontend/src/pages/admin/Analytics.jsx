import { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  DatePicker,
  Button,
  Typography,
  Select,
  Table,
  Progress,
  Tag,
  Tabs
} from 'antd';
import {
  DollarOutlined,
  CarOutlined,
  UserOutlined,
  ShopOutlined,
  RiseOutlined,
  FallOutlined,
  DownloadOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  TeamOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;

const Analytics = () => {
  const [dateRange, setDateRange] = useState([
    dayjs().subtract(30, 'day'),
    dayjs()
  ]);
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  // System-wide statistics
  const stats = {
    totalRevenue: 1245678000,
    revenueGrowth: 24.5,
    totalBookings: 5678,
    bookingsGrowth: 18.2,
    totalUsers: 12456,
    usersGrowth: 15.8,
    totalOperators: 45,
    operatorsGrowth: 8.3,
    avgCommission: 8.5,
    systemOccupancy: 76.8
  };

  // Top operators by revenue
  const topOperators = [
    {
      key: 1,
      name: 'Phương Trang',
      trips: 456,
      bookings: 1234,
      revenue: 456000000,
      commission: 38760000,
      avgRating: 4.8,
      occupancy: 85.2,
      trend: 'up'
    },
    {
      key: 2,
      name: 'Mai Linh',
      trips: 389,
      bookings: 1089,
      revenue: 398000000,
      commission: 33830000,
      avgRating: 4.6,
      occupancy: 82.5,
      trend: 'up'
    },
    {
      key: 3,
      name: 'Kumho Samco',
      trips: 345,
      bookings: 945,
      revenue: 345000000,
      commission: 29325000,
      avgRating: 4.7,
      occupancy: 78.3,
      trend: 'up'
    },
    {
      key: 4,
      name: 'Hoàng Long',
      trips: 298,
      bookings: 812,
      revenue: 289000000,
      commission: 24565000,
      avgRating: 4.5,
      occupancy: 75.1,
      trend: 'down'
    },
    {
      key: 5,
      name: 'Thành Bưởi',
      trips: 267,
      bookings: 756,
      revenue: 234000000,
      commission: 19890000,
      avgRating: 4.4,
      occupancy: 72.8,
      trend: 'up'
    }
  ];

  // Popular routes system-wide
  const popularRoutes = [
    {
      key: 1,
      route: 'TP.HCM → Đà Lạt',
      operators: 12,
      trips: 678,
      bookings: 2345,
      revenue: 645000000,
      avgPrice: 275000,
      occupancy: 88.5
    },
    {
      key: 2,
      route: 'Hà Nội → Hải Phòng',
      operators: 15,
      trips: 892,
      bookings: 3456,
      revenue: 589000000,
      avgPrice: 170000,
      occupancy: 85.2
    },
    {
      key: 3,
      route: 'TP.HCM → Cần Thơ',
      operators: 10,
      trips: 567,
      bookings: 1987,
      revenue: 287000000,
      avgPrice: 144000,
      occupancy: 78.3
    },
    {
      key: 4,
      route: 'Hà Nội → Sapa',
      operators: 8,
      trips: 234,
      bookings: 876,
      revenue: 298000000,
      avgPrice: 340000,
      occupancy: 82.1
    },
    {
      key: 5,
      route: 'Đà Nẵng → Huế',
      operators: 9,
      trips: 445,
      bookings: 1456,
      revenue: 198000000,
      avgPrice: 136000,
      occupancy: 75.6
    }
  ];

  // Daily system revenue (last 7 days)
  const dailyRevenue = [
    { date: '15/01', revenue: 45200000, bookings: 189, operators: 42 },
    { date: '16/01', revenue: 52100000, bookings: 215, operators: 43 },
    { date: '17/01', revenue: 48900000, bookings: 198, operators: 41 },
    { date: '18/01', revenue: 61200000, bookings: 256, operators: 44 },
    { date: '19/01', revenue: 57800000, bookings: 234, operators: 43 },
    { date: '20/01', revenue: 68900000, bookings: 289, operators: 45 },
    { date: '21/01', revenue: 64500000, bookings: 267, operators: 44 }
  ];

  // User growth by month
  const userGrowth = [
    { month: 'T7', customers: 856, operators: 3 },
    { month: 'T8', customers: 1234, operators: 5 },
    { month: 'T9', customers: 1567, operators: 4 },
    { month: 'T10', customers: 1989, operators: 6 },
    { month: 'T11', customers: 2345, operators: 8 },
    { month: 'T12', customers: 2876, operators: 7 },
    { month: 'T1', customers: 3456, operators: 12 }
  ];

  // Commission breakdown
  const commissionData = [
    { operator: 'Phương Trang', amount: 38760000, percentage: 22.5 },
    { operator: 'Mai Linh', amount: 33830000, percentage: 19.6 },
    { operator: 'Kumho Samco', amount: 29325000, percentage: 17.0 },
    { operator: 'Hoàng Long', amount: 24565000, percentage: 14.2 },
    { operator: 'Thành Bưởi', amount: 19890000, percentage: 11.5 },
    { operator: 'Khác', amount: 26030000, percentage: 15.2 }
  ];

  const operatorColumns = [
    {
      title: 'Nhà xe',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <Text strong>{text}</Text>
    },
    {
      title: 'Số chuyến',
      dataIndex: 'trips',
      key: 'trips',
      align: 'center'
    },
    {
      title: 'Booking',
      dataIndex: 'bookings',
      key: 'bookings',
      align: 'center'
    },
    {
      title: 'Doanh thu',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (value) => (
        <Text strong className="text-green-600">
          {(value / 1000000).toFixed(1)}M
        </Text>
      ),
      sorter: (a, b) => a.revenue - b.revenue
    },
    {
      title: 'Hoa hồng',
      dataIndex: 'commission',
      key: 'commission',
      render: (value) => (
        <Text className="text-blue-600">
          {(value / 1000000).toFixed(1)}M
        </Text>
      )
    },
    {
      title: 'Đánh giá',
      dataIndex: 'avgRating',
      key: 'avgRating',
      render: (value) => (
        <Tag color={value >= 4.5 ? 'green' : value >= 4.0 ? 'blue' : 'orange'}>
          ⭐ {value}
        </Tag>
      )
    },
    {
      title: 'Lấp đầy',
      dataIndex: 'occupancy',
      key: 'occupancy',
      render: (value) => (
        <div>
          <Progress
            percent={value}
            size="small"
            strokeColor={value > 80 ? '#52c41a' : '#faad14'}
            showInfo={false}
          />
          <Text className="text-xs">{value}%</Text>
        </div>
      )
    },
    {
      title: 'Xu hướng',
      dataIndex: 'trend',
      key: 'trend',
      align: 'center',
      render: (trend) =>
        trend === 'up' ? (
          <Tag color="green" icon={<ArrowUpOutlined />}>Tăng</Tag>
        ) : (
          <Tag color="red" icon={<ArrowDownOutlined />}>Giảm</Tag>
        )
    }
  ];

  const routeColumns = [
    {
      title: 'Tuyến đường',
      dataIndex: 'route',
      key: 'route',
      render: (text) => <Text strong>{text}</Text>
    },
    {
      title: 'Nhà xe',
      dataIndex: 'operators',
      key: 'operators',
      align: 'center',
      render: (value) => <Tag color="purple">{value} nhà xe</Tag>
    },
    {
      title: 'Chuyến',
      dataIndex: 'trips',
      key: 'trips',
      align: 'center'
    },
    {
      title: 'Booking',
      dataIndex: 'bookings',
      key: 'bookings',
      align: 'center'
    },
    {
      title: 'Doanh thu',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (value) => (
        <Text strong className="text-green-600">
          {(value / 1000000).toFixed(0)}M
        </Text>
      ),
      sorter: (a, b) => a.revenue - b.revenue
    },
    {
      title: 'Giá TB',
      dataIndex: 'avgPrice',
      key: 'avgPrice',
      render: (value) => `${value.toLocaleString('vi-VN')}đ`
    },
    {
      title: 'Lấp đầy',
      dataIndex: 'occupancy',
      key: 'occupancy',
      render: (value) => (
        <div>
          <Progress
            percent={value}
            size="small"
            strokeColor={value > 80 ? '#52c41a' : '#faad14'}
            showInfo={false}
          />
          <Text className="text-xs">{value}%</Text>
        </div>
      )
    }
  ];

  const handleExport = () => {
    // TODO: Implement export to Excel
    console.log('Exporting data...');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <Title level={2} className="!mb-0">Phân tích Hệ thống</Title>
            <div className="flex gap-3 flex-wrap">
              <RangePicker
                value={dateRange}
                onChange={setDateRange}
                format="DD/MM/YYYY"
                size="large"
              />
              <Select
                value={selectedMetric}
                onChange={setSelectedMetric}
                size="large"
                style={{ width: 200 }}
              >
                <Option value="revenue">Theo doanh thu</Option>
                <Option value="bookings">Theo booking</Option>
                <Option value="operators">Theo nhà xe</Option>
              </Select>
              <Button
                icon={<DownloadOutlined />}
                onClick={handleExport}
                size="large"
              >
                Xuất báo cáo
              </Button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Tổng doanh thu hệ thống"
                value={stats.totalRevenue}
                precision={0}
                valueStyle={{ color: '#3f8600' }}
                prefix={<DollarOutlined />}
                suffix={
                  <span className="text-sm">
                    <RiseOutlined /> {stats.revenueGrowth}%
                  </span>
                }
                formatter={(value) => `${(value / 1000000).toFixed(0)}M`}
              />
              <Text type="secondary" className="text-xs block mt-1">
                So với kỳ trước
              </Text>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Tổng booking"
                value={stats.totalBookings}
                valueStyle={{ color: '#1890ff' }}
                prefix={<CarOutlined />}
                suffix={
                  <span className="text-sm">
                    <RiseOutlined /> {stats.bookingsGrowth}%
                  </span>
                }
              />
              <Text type="secondary" className="text-xs block mt-1">
                {dateRange[0].format('DD/MM')} - {dateRange[1].format('DD/MM')}
              </Text>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Tổng người dùng"
                value={stats.totalUsers}
                valueStyle={{ color: '#722ed1' }}
                prefix={<TeamOutlined />}
                suffix={
                  <span className="text-sm">
                    <RiseOutlined /> {stats.usersGrowth}%
                  </span>
                }
              />
              <Text type="secondary" className="text-xs block mt-1">
                Khách hàng đăng ký
              </Text>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Nhà xe hoạt động"
                value={stats.totalOperators}
                valueStyle={{ color: '#faad14' }}
                prefix={<ShopOutlined />}
                suffix={
                  <span className="text-sm">
                    <RiseOutlined /> {stats.operatorsGrowth}%
                  </span>
                }
              />
              <Text type="secondary" className="text-xs block mt-1">
                Đối tác vận chuyển
              </Text>
            </Card>
          </Col>
        </Row>

        {/* Tabs */}
        <Card>
          <Tabs defaultActiveKey="operators" size="large">
            {/* Top Operators */}
            <TabPane tab="Top Nhà xe" key="operators">
              <Table
                columns={operatorColumns}
                dataSource={topOperators}
                pagination={false}
                size="small"
              />
            </TabPane>

            {/* Popular Routes */}
            <TabPane tab="Tuyến phổ biến" key="routes">
              <Table
                columns={routeColumns}
                dataSource={popularRoutes}
                pagination={false}
                size="small"
              />
            </TabPane>

            {/* Revenue Trend */}
            <TabPane tab="Xu hướng doanh thu" key="trend">
              <div className="space-y-3">
                {dailyRevenue.map((day, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <Text className="w-16">{day.date}</Text>
                    <div className="flex-1">
                      <Progress
                        percent={(day.revenue / 70000000) * 100}
                        strokeColor="#1890ff"
                        showInfo={false}
                      />
                    </div>
                    <Text strong className="w-24 text-right">
                      {(day.revenue / 1000000).toFixed(1)}M
                    </Text>
                    <Text type="secondary" className="w-24 text-right text-sm">
                      {day.bookings} booking
                    </Text>
                    <Text type="secondary" className="w-20 text-right text-xs">
                      {day.operators} nhà xe
                    </Text>
                  </div>
                ))}
              </div>
            </TabPane>

            {/* User Growth */}
            <TabPane tab="Tăng trưởng người dùng" key="users">
              <div className="space-y-3">
                {userGrowth.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <Text>{item.month}</Text>
                      <Space>
                        <Text className="text-blue-600">
                          <UserOutlined /> {item.customers} KH
                        </Text>
                        <Text className="text-orange-600">
                          <ShopOutlined /> {item.operators} NX
                        </Text>
                      </Space>
                    </div>
                    <Progress
                      percent={(item.customers / 4000) * 100}
                      strokeColor="#1890ff"
                      showInfo={false}
                    />
                  </div>
                ))}
              </div>
            </TabPane>

            {/* Commission */}
            <TabPane tab="Hoa hồng" key="commission">
              <div className="mb-4">
                <Statistic
                  title="Tổng hoa hồng thu được"
                  value={commissionData.reduce((sum, item) => sum + item.amount, 0)}
                  precision={0}
                  valueStyle={{ color: '#3f8600', fontSize: '28px' }}
                  formatter={(value) => `${(value / 1000000).toFixed(1)}M đ`}
                />
                <Text type="secondary">
                  Tỷ lệ hoa hồng trung bình: {stats.avgCommission}%
                </Text>
              </div>
              <div className="space-y-3 mt-6">
                {commissionData.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <Text>{item.operator}</Text>
                      <Text strong>{item.percentage}%</Text>
                    </div>
                    <Progress
                      percent={item.percentage}
                      strokeColor={['#1890ff', '#52c41a', '#722ed1', '#faad14', '#eb2f96', '#13c2c2'][index]}
                      showInfo={false}
                    />
                    <div className="flex justify-between mt-1">
                      <Text type="secondary" className="text-xs">
                        {(item.amount / 1000000).toFixed(1)}M đ
                      </Text>
                    </div>
                  </div>
                ))}
              </div>
            </TabPane>
          </Tabs>
        </Card>

        {/* Additional Metrics */}
        <Row gutter={[16, 16]} className="mt-6">
          <Col xs={24} md={12}>
            <Card title="Hiệu suất hệ thống">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <Text>Tỷ lệ lấp đầy trung bình</Text>
                    <Text strong className="text-green-600">{stats.systemOccupancy}%</Text>
                  </div>
                  <Progress
                    percent={stats.systemOccupancy}
                    strokeColor={{
                      '0%': '#108ee9',
                      '100%': '#87d068',
                    }}
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <Text>Tỷ lệ hoa hồng</Text>
                    <Text strong className="text-blue-600">{stats.avgCommission}%</Text>
                  </div>
                  <Progress
                    percent={stats.avgCommission}
                    strokeColor="#1890ff"
                  />
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title="Thống kê tổng quan">
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <Text type="secondary">Doanh thu bình quân/ngày</Text>
                  <Text strong className="text-green-600">
                    {((stats.totalRevenue / 30) / 1000000).toFixed(1)}M
                  </Text>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <Text type="secondary">Booking bình quân/ngày</Text>
                  <Text strong className="text-blue-600">
                    {(stats.totalBookings / 30).toFixed(0)}
                  </Text>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <Text type="secondary">Doanh thu/nhà xe</Text>
                  <Text strong className="text-purple-600">
                    {((stats.totalRevenue / stats.totalOperators) / 1000000).toFixed(1)}M
                  </Text>
                </div>
                <div className="flex justify-between py-2">
                  <Text type="secondary">Khách hàng/nhà xe</Text>
                  <Text strong className="text-orange-600">
                    {(stats.totalUsers / stats.totalOperators).toFixed(0)}
                  </Text>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Analytics;
