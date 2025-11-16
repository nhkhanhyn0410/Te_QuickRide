import { useState, useEffect } from 'react';
import analyticsService from '../../services/analyticsService';
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
  message
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
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
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
  });
  const [revenueByRoute, setRevenueByRoute] = useState([]);
  const [revenueByBusType, setRevenueByBusType] = useState([]);
  const [dailyRevenue, setDailyRevenue] = useState([]);
  const [peakHours, setPeakHours] = useState([]);

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange, selectedRoute]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const params = {
        startDate: dateRange[0].toISOString(),
        endDate: dateRange[1].toISOString(),
        routeId: selectedRoute !== 'all' ? selectedRoute : undefined
      };

      const response = await analyticsService.getDashboardStats(params);
      const data = response.data || {};

      setStats(data.stats || stats);
      setRevenueByRoute(data.revenueByRoute || []);
      setRevenueByBusType(data.revenueByBusType || []);
      setDailyRevenue(data.dailyRevenue || []);
      setPeakHours(data.peakHours || []);
    } catch (error) {
      message.error('Không thể tải dữ liệu phân tích');
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Backup mock data for development
  const mockRevenueByRoute = [
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

  const handleExport = async () => {
    try {
      message.loading('Đang xuất dữ liệu...', 0);
      const params = {
        startDate: dateRange[0].toISOString(),
        endDate: dateRange[1].toISOString(),
        routeId: selectedRoute !== 'all' ? selectedRoute : undefined
      };

      const blob = await analyticsService.exportAnalytics('dashboard', params);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `analytics-${dayjs().format('YYYY-MM-DD')}.xlsx`;
      link.click();
      message.destroy();
      message.success('Đã xuất dữ liệu thành công');
    } catch (error) {
      message.destroy();
      message.error('Không thể xuất dữ liệu');
      console.error('Error exporting analytics:', error);
    }
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
