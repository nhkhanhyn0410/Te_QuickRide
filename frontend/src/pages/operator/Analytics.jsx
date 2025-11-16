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
  Tag
} from 'antd';
import {
  DollarOutlined,
  CarOutlined,
  UserOutlined,
  RiseOutlined,
  FallOutlined,
  DownloadOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const Analytics = () => {
  const [dateRange, setDateRange] = useState([
    dayjs().subtract(30, 'day'),
    dayjs()
  ]);
  const [selectedRoute, setSelectedRoute] = useState('all');

  // Mock statistics
  const stats = {
    totalRevenue: 456789000,
    revenueGrowth: 18.5,
    totalBookings: 1234,
    bookingsGrowth: 15.2,
    totalPassengers: 2456,
    passengersGrowth: 12.8,
    avgTicketPrice: 185000,
    priceGrowth: 5.3,
    occupancyRate: 78.5,
    cancellationRate: 5.2
  };

  // Revenue by route
  const revenueByRoute = [
    {
      key: 1,
      route: 'TP.HCM → Đà Lạt',
      trips: 145,
      bookings: 456,
      revenue: 125000000,
      avgPrice: 274122,
      occupancy: 82.5,
      trend: 'up'
    },
    {
      key: 2,
      route: 'TP.HCM → Cần Thơ',
      trips: 198,
      bookings: 678,
      revenue: 98000000,
      avgPrice: 144513,
      occupancy: 75.3,
      trend: 'up'
    },
    {
      key: 3,
      route: 'Hà Nội → Hải Phòng',
      trips: 234,
      bookings: 892,
      revenue: 156000000,
      avgPrice: 174888,
      occupancy: 79.8,
      trend: 'down'
    },
    {
      key: 4,
      route: 'Đà Nẵng → Huế',
      trips: 112,
      bookings: 334,
      revenue: 45000000,
      avgPrice: 134731,
      occupancy: 68.2,
      trend: 'up'
    }
  ];

  // Revenue by bus type
  const revenueByBusType = [
    {
      type: 'Giường nằm',
      revenue: 256000000,
      percentage: 56,
      bookings: 678,
      avgPrice: 377582
    },
    {
      type: 'Ghế ngồi',
      revenue: 145000000,
      percentage: 32,
      bookings: 892,
      avgPrice: 162556
    },
    {
      type: 'Limousine',
      revenue: 55789000,
      percentage: 12,
      bookings: 123,
      avgPrice: 453577
    }
  ];

  // Daily revenue trend (last 7 days)
  const dailyRevenue = [
    { date: '15/01', revenue: 12500000, bookings: 45 },
    { date: '16/01', revenue: 15200000, bookings: 56 },
    { date: '17/01', revenue: 13800000, bookings: 48 },
    { date: '18/01', revenue: 18900000, bookings: 67 },
    { date: '19/01', revenue: 16700000, bookings: 59 },
    { date: '20/01', revenue: 21300000, bookings: 78 },
    { date: '21/01', revenue: 19600000, bookings: 71 }
  ];

  // Peak hours
  const peakHours = [
    { hour: '06:00 - 09:00', bookings: 456, percentage: 37 },
    { hour: '09:00 - 12:00', bookings: 234, percentage: 19 },
    { hour: '12:00 - 15:00', bookings: 178, percentage: 14 },
    { hour: '15:00 - 18:00', bookings: 289, percentage: 23 },
    { hour: '18:00 - 21:00', bookings: 87, percentage: 7 }
  ];

  const routeColumns = [
    {
      title: 'Tuyến đường',
      dataIndex: 'route',
      key: 'route',
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
            strokeColor={value > 70 ? '#52c41a' : '#faad14'}
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
            <Title level={2} className="!mb-0">Phân tích & Báo cáo</Title>
            <div className="flex gap-3 flex-wrap">
              <RangePicker
                value={dateRange}
                onChange={setDateRange}
                format="DD/MM/YYYY"
                size="large"
              />
              <Select
                value={selectedRoute}
                onChange={setSelectedRoute}
                size="large"
                style={{ width: 200 }}
              >
                <Option value="all">Tất cả tuyến</Option>
                <Option value="route1">TP.HCM → Đà Lạt</Option>
                <Option value="route2">TP.HCM → Cần Thơ</Option>
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
                title="Tổng doanh thu"
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
                title="Tổng hành khách"
                value={stats.totalPassengers}
                valueStyle={{ color: '#722ed1' }}
                prefix={<UserOutlined />}
                suffix={
                  <span className="text-sm">
                    <RiseOutlined /> {stats.passengersGrowth}%
                  </span>
                }
              />
              <Text type="secondary" className="text-xs block mt-1">
                Khách đã phục vụ
              </Text>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Giá vé trung bình"
                value={stats.avgTicketPrice}
                precision={0}
                valueStyle={{ color: '#faad14' }}
                suffix={
                  <span className="text-sm">
                    đ <RiseOutlined /> {stats.priceGrowth}%
                  </span>
                }
                formatter={(value) => value.toLocaleString('vi-VN')}
              />
              <Text type="secondary" className="text-xs block mt-1">
                Mỗi vé
              </Text>
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          {/* Left Column */}
          <Col xs={24} lg={16}>
            {/* Revenue by Route */}
            <Card title="Doanh thu theo tuyến đường" className="mb-4 shadow-md">
              <Table
                columns={routeColumns}
                dataSource={revenueByRoute}
                pagination={false}
                size="small"
              />
            </Card>

            {/* Daily Trend */}
            <Card title="Xu hướng 7 ngày gần nhất" className="shadow-md">
              <div className="space-y-3">
                {dailyRevenue.map((day, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <Text className="w-16">{day.date}</Text>
                    <div className="flex-1">
                      <Progress
                        percent={(day.revenue / 25000000) * 100}
                        strokeColor="#1890ff"
                        showInfo={false}
                      />
                    </div>
                    <Text strong className="w-24 text-right">
                      {(day.revenue / 1000000).toFixed(1)}M
                    </Text>
                    <Text type="secondary" className="w-20 text-right text-sm">
                      {day.bookings} booking
                    </Text>
                  </div>
                ))}
              </div>
            </Card>
          </Col>

          {/* Right Column */}
          <Col xs={24} lg={8}>
            {/* Performance Metrics */}
            <Card title="Chỉ số hiệu suất" className="mb-4 shadow-md">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <Text>Tỷ lệ lấp đầy</Text>
                    <Text strong className="text-green-600">{stats.occupancyRate}%</Text>
                  </div>
                  <Progress
                    percent={stats.occupancyRate}
                    strokeColor={{
                      '0%': '#108ee9',
                      '100%': '#87d068',
                    }}
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <Text>Tỷ lệ hủy vé</Text>
                    <Text strong className="text-orange-600">{stats.cancellationRate}%</Text>
                  </div>
                  <Progress
                    percent={stats.cancellationRate}
                    strokeColor="#faad14"
                    status="exception"
                  />
                </div>
              </div>
            </Card>

            {/* Revenue by Bus Type */}
            <Card title="Doanh thu theo loại xe" className="mb-4 shadow-md">
              <div className="space-y-3">
                {revenueByBusType.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <Text>{item.type}</Text>
                      <Text strong>{item.percentage}%</Text>
                    </div>
                    <Progress
                      percent={item.percentage}
                      strokeColor={['#1890ff', '#52c41a', '#722ed1'][index]}
                      showInfo={false}
                    />
                    <div className="flex justify-between mt-1">
                      <Text type="secondary" className="text-xs">
                        {item.bookings} booking
                      </Text>
                      <Text type="secondary" className="text-xs">
                        {(item.revenue / 1000000).toFixed(1)}M
                      </Text>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Peak Hours */}
            <Card title="Giờ cao điểm" className="shadow-md">
              <div className="space-y-3">
                {peakHours.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <Text className="text-sm">{item.hour}</Text>
                      <Text strong>{item.bookings}</Text>
                    </div>
                    <Progress
                      percent={item.percentage}
                      size="small"
                      strokeColor="#faad14"
                    />
                  </div>
                ))}
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Analytics;
