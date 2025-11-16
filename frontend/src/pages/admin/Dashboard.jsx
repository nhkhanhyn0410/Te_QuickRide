import { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Tag,
  Typography,
  Button,
  Space,
  Progress,
  message
} from 'antd';
import {
  UserOutlined,
  ShopOutlined,
  CarOutlined,
  DollarOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import analyticsService from '../../services/analyticsService';
import operatorService from '../../services/operatorService';

const { Title, Text } = Typography;

const AdminDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOperators: 0,
    totalBookings: 0,
    totalRevenue: 0,
    userGrowth: 0,
    operatorGrowth: 0,
    bookingGrowth: 0,
    revenueGrowth: 0
  });

  const [pendingOperators, setPendingOperators] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [topOperators, setTopOperators] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch dashboard stats
      const dashboardData = await analyticsService.getDashboardStats();
      setStats(dashboardData);

      // Fetch pending operators
      const operatorsData = await operatorService.getAllOperators({ verificationStatus: 'pending' });
      setPendingOperators(operatorsData.data || []);

      // Fetch top operators
      const topOpsData = await analyticsService.getOperatorPerformance({ limit: 5 });
      setTopOperators(topOpsData.data || []);

      // Recent activities would come from a dedicated endpoint if available
      // For now, we can keep it as mock data or fetch from backend
    } catch (error) {
      message.error('Không thể tải dữ liệu dashboard');
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveOperator = async (operatorId) => {
    try {
      await operatorService.approveOperator(operatorId);
      message.success('Đã duyệt nhà xe thành công');
      fetchDashboardData(); // Refresh data
    } catch (error) {
      message.error('Không thể duyệt nhà xe');
      console.error('Error approving operator:', error);
    }
  };

  const operatorColumns = [
    {
      title: 'Tên nhà xe',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone'
    },
    {
      title: 'Ngày đăng ký',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => dayjs(date).format('DD/MM/YYYY')
    },
    {
      title: 'Trạng thái',
      dataIndex: 'verificationStatus',
      key: 'verificationStatus',
      render: () => <Tag color="orange">Chờ duyệt</Tag>
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="primary" size="small" onClick={() => handleApproveOperator(record._id)}>
            Duyệt
          </Button>
          <Button danger size="small">Từ chối</Button>
        </Space>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Title level={2}>Tổng quan hệ thống</Title>
          <Text type="secondary">Cập nhật lúc: {dayjs().format('HH:mm, DD/MM/YYYY')}</Text>
        </div>

        {/* Main Statistics */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Tổng người dùng"
                value={stats.totalUsers}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#3f8600' }}
                suffix={
                  <span className="text-sm">
                    <ArrowUpOutlined /> {stats.userGrowth}%
                  </span>
                }
              />
              <Text type="secondary" className="text-xs">So với tháng trước</Text>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Tổng nhà xe"
                value={stats.totalOperators}
                prefix={<ShopOutlined />}
                valueStyle={{ color: '#1890ff' }}
                suffix={
                  <span className="text-sm">
                    <ArrowUpOutlined /> {stats.operatorGrowth}%
                  </span>
                }
              />
              <Text type="secondary" className="text-xs">So với tháng trước</Text>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Tổng booking"
                value={stats.totalBookings}
                prefix={<CarOutlined />}
                valueStyle={{ color: '#faad14' }}
                suffix={
                  <span className="text-sm">
                    <ArrowUpOutlined /> {stats.bookingGrowth}%
                  </span>
                }
              />
              <Text type="secondary" className="text-xs">Tháng này</Text>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Tổng doanh thu"
                value={stats.totalRevenue}
                prefix={<DollarOutlined />}
                valueStyle={{ color: '#722ed1' }}
                formatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                suffix={
                  <span className="text-sm">
                    <ArrowUpOutlined /> {stats.revenueGrowth}%
                  </span>
                }
              />
              <Text type="secondary" className="text-xs">VNĐ - Tháng này</Text>
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          {/* Left Column */}
          <Col xs={24} lg={16}>
            {/* Pending Operators */}
            <Card
              title={
                <Space>
                  <ClockCircleOutlined />
                  <span>Nhà xe chờ duyệt ({pendingOperators.length})</span>
                </Space>
              }
              className="mb-4 shadow-md"
              extra={<Button type="link">Xem tất cả</Button>}
            >
              <Table
                columns={operatorColumns}
                dataSource={pendingOperators}
                rowKey="id"
                pagination={false}
                size="small"
              />
            </Card>

            {/* Top Operators */}
            <Card
              title="Top nhà xe theo doanh thu"
              className="shadow-md"
            >
              <div className="space-y-4">
                {topOperators.map((operator, index) => (
                  <div key={operator.id} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <Text strong>{operator.name}</Text>
                        <Text strong className="text-blue-600">
                          {(operator.revenue / 1000000).toFixed(0)}M đ
                        </Text>
                      </div>
                      <Progress
                        percent={Math.floor((operator.revenue / topOperators[0].revenue) * 100)}
                        showInfo={false}
                        strokeColor="#1890ff"
                      />
                      <div className="flex justify-between mt-1">
                        <Text type="secondary" className="text-xs">
                          {operator.bookings} chuyến
                        </Text>
                        <Text type="secondary" className="text-xs">
                          ★ {operator.rating}
                        </Text>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </Col>

          {/* Right Column */}
          <Col xs={24} lg={8}>
            {/* Quick Stats */}
            <Card title="Thống kê nhanh" className="mb-4 shadow-md">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Text>Booking hôm nay</Text>
                  <Text strong className="text-green-600">+45</Text>
                </div>
                <div className="flex justify-between">
                  <Text>Người dùng mới</Text>
                  <Text strong className="text-blue-600">+23</Text>
                </div>
                <div className="flex justify-between">
                  <Text>Nhà xe đang hoạt động</Text>
                  <Text strong>{stats.totalOperators - 5}</Text>
                </div>
                <div className="flex justify-between">
                  <Text>Doanh thu hôm nay</Text>
                  <Text strong className="text-purple-600">12.5M đ</Text>
                </div>
              </div>
            </Card>

            {/* Recent Activities */}
            <Card title="Hoạt động gần đây" className="shadow-md">
              <div className="space-y-3">
                {recentActivities.map(activity => (
                  <div key={activity.id} className="pb-3 border-b last:border-b-0 last:pb-0">
                    <Text className="block text-sm">{activity.description}</Text>
                    <Text type="secondary" className="text-xs">
                      <ClockCircleOutlined className="mr-1" />
                      {activity.time}
                    </Text>
                  </div>
                ))}
              </div>
              <Button type="link" className="mt-3 px-0">
                Xem tất cả hoạt động →
              </Button>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AdminDashboard;
