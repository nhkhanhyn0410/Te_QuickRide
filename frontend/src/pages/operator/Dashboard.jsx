import { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Button } from 'antd';
import {
  DollarOutlined,
  CarOutlined,
  TeamOutlined,
  RiseOutlined,
  StarOutlined,
  EyeOutlined
} from '@ant-design/icons';
import axios from 'axios';

const OperatorDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [statistics, setStatistics] = useState({
    totalTrips: 0,
    totalRevenue: 0,
    averageRating: 0,
    totalReviews: 0,
    routeCount: 0,
    busCount: 0
  });
  const [upcomingTrips, setUpcomingTrips] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch statistics
      const statsResponse = await axios.get('/api/operators/statistics');
      setStatistics(statsResponse.data.data.statistics);

      // Fetch upcoming trips
      const tripsResponse = await axios.get('/api/trips/my/trips', {
        params: {
          status: 'scheduled',
          limit: 10
        }
      });
      setUpcomingTrips(tripsResponse.data.data || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const tripColumns = [
    {
      title: 'Mã chuyến',
      dataIndex: 'tripCode',
      key: 'tripCode',
      render: (code) => <Tag color="blue">{code}</Tag>
    },
    {
      title: 'Tuyến đường',
      key: 'route',
      render: (_, record) => (
        <span>
          {record.routeId?.origin?.city} → {record.routeId?.destination?.city}
        </span>
      )
    },
    {
      title: 'Thời gian',
      dataIndex: 'departureTime',
      key: 'departureTime',
      render: (date) => new Date(date).toLocaleString('vi-VN')
    },
    {
      title: 'Xe',
      key: 'bus',
      render: (_, record) => (
        <span>{record.busId?.busNumber} - {record.busId?.busType}</span>
      )
    },
    {
      title: 'Ghế còn trống',
      dataIndex: 'availableSeats',
      key: 'availableSeats',
      render: (seats) => (
        <Tag color={seats > 10 ? 'green' : seats > 5 ? 'orange' : 'red'}>
          {seats} ghế
        </Tag>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusMap = {
          scheduled: { text: 'Đã lên lịch', color: 'blue' },
          boarding: { text: 'Đang lên xe', color: 'orange' },
          in_progress: { text: 'Đang đi', color: 'processing' },
          completed: { text: 'Hoàn thành', color: 'success' },
          cancelled: { text: 'Đã hủy', color: 'error' }
        };
        return (
          <Tag color={statusMap[status]?.color || 'default'}>
            {statusMap[status]?.text || status}
          </Tag>
        );
      }
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record) => (
        <Button type="link" icon={<EyeOutlined />}>
          Xem chi tiết
        </Button>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Bảng điều khiển nhà xe</h1>

        {/* Statistics Cards */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} sm={12} lg={8}>
            <Card>
              <Statistic
                title="Tổng doanh thu"
                value={statistics.totalRevenue}
                prefix={<DollarOutlined />}
                suffix="VND"
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={8}>
            <Card>
              <Statistic
                title="Tổng chuyến đi"
                value={statistics.totalTrips}
                prefix={<RiseOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={8}>
            <Card>
              <Statistic
                title="Đánh giá trung bình"
                value={statistics.averageRating}
                prefix={<StarOutlined />}
                suffix={`/ 5 (${statistics.totalReviews} đánh giá)`}
                precision={1}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={8}>
            <Card>
              <Statistic
                title="Số tuyến đường"
                value={statistics.routeCount}
                prefix={<CarOutlined />}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={8}>
            <Card>
              <Statistic
                title="Số xe"
                value={statistics.busCount}
                prefix={<CarOutlined />}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={8}>
            <Card>
              <Statistic
                title="Số nhân viên"
                value={0}
                prefix={<TeamOutlined />}
              />
            </Card>
          </Col>
        </Row>

        {/* Upcoming Trips */}
        <Card
          title="Chuyến đi sắp tới"
          extra={
            <Button type="primary" href="/operator/trips">
              Xem tất cả
            </Button>
          }
        >
          <Table
            columns={tripColumns}
            dataSource={upcomingTrips}
            loading={loading}
            rowKey="_id"
            pagination={{ pageSize: 10 }}
          />
        </Card>
      </div>
    </div>
  );
};

export default OperatorDashboard;
