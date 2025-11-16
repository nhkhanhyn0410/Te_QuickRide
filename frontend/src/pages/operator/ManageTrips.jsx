import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Table,
  Button,
  Tag,
  Space,
  Input,
  Select,
  DatePicker,
  Modal,
  message,
  Typography,
  Row,
  Col,
  Statistic
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import tripService from '../../services/tripService';

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const ManageTrips = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    dateRange: null
  });

  useEffect(() => {
    fetchTrips();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, trips]);

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const response = await tripService.getMyTrips();
      setTrips(response.data || []);
    } catch (error) {
      message.error('Không thể tải danh sách chuyến đi');
      console.error('Error fetching trips:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...trips];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(
        t =>
          t.tripCode.toLowerCase().includes(filters.search.toLowerCase()) ||
          t.route.origin.city.toLowerCase().includes(filters.search.toLowerCase()) ||
          t.route.destination.city.toLowerCase().includes(filters.search.toLowerCase()) ||
          t.bus.busNumber.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(t => t.status === filters.status);
    }

    // Date range filter
    if (filters.dateRange && filters.dateRange.length === 2) {
      const [start, end] = filters.dateRange;
      filtered = filtered.filter(t => {
        const tripDate = dayjs(t.departureTime);
        return tripDate.isAfter(start) && tripDate.isBefore(end);
      });
    }

    setFilteredTrips(filtered);
  };

  const handleSearch = (value) => {
    setFilters({ ...filters, search: value });
  };

  const handleStatusChange = (value) => {
    setFilters({ ...filters, status: value });
  };

  const handleDateRangeChange = (dates) => {
    setFilters({ ...filters, dateRange: dates });
  };

  const handleCreateTrip = () => {
    navigate('/operator/trips/create');
  };

  const handleEditTrip = (trip) => {
    navigate(`/operator/trips/${trip.id}/edit`);
  };

  const handleDeleteTrip = (trip) => {
    Modal.confirm({
      title: 'Xác nhận hủy chuyến đi',
      content: `Bạn có chắc muốn hủy chuyến ${trip.tripCode}?`,
      okText: 'Hủy chuyến',
      cancelText: 'Đóng',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await tripService.cancelTrip(trip._id || trip.id, 'Hủy bởi nhà xe');
          message.success('Đã hủy chuyến đi');
          fetchTrips(); // Reload trips
        } catch (error) {
          message.error(error.response?.data?.message || 'Không thể hủy chuyến đi');
        }
      }
    });
  };

  const handleViewBookings = (trip) => {
    navigate(`/operator/trips/${trip.id}/bookings`);
  };

  const getStatusColor = (status) => {
    const colors = {
      scheduled: 'blue',
      boarding: 'orange',
      in_progress: 'green',
      completed: 'default',
      cancelled: 'red'
    };
    return colors[status] || 'default';
  };

  const getStatusText = (status) => {
    const texts = {
      scheduled: 'Đã lên lịch',
      boarding: 'Đang lên xe',
      in_progress: 'Đang chạy',
      completed: 'Hoàn thành',
      cancelled: 'Đã hủy'
    };
    return texts[status] || status;
  };

  const columns = [
    {
      title: 'Mã chuyến',
      dataIndex: 'tripCode',
      key: 'tripCode',
      render: (text) => <span className="font-medium text-blue-600">{text}</span>
    },
    {
      title: 'Tuyến đường',
      key: 'route',
      render: (_, record) => (
        <span>
          {record.routeId?.origin?.city || record.route?.origin?.city} → {record.routeId?.destination?.city || record.route?.destination?.city}
        </span>
      )
    },
    {
      title: 'Xe',
      key: 'bus',
      render: (_, record) => (
        <div>
          <div className="font-medium">{record.busId?.busNumber || record.bus?.busNumber}</div>
          <div className="text-sm text-gray-500">{record.busId?.busType || record.bus?.type}</div>
        </div>
      )
    },
    {
      title: 'Thời gian',
      dataIndex: 'departureTime',
      key: 'departureTime',
      render: (time) => (
        <div>
          <div>{dayjs(time).format('HH:mm')}</div>
          <div className="text-sm text-gray-500">{dayjs(time).format('DD/MM/YYYY')}</div>
        </div>
      ),
      sorter: (a, b) => dayjs(a.departureTime).unix() - dayjs(b.departureTime).unix()
    },
    {
      title: 'Ghế',
      key: 'seats',
      render: (_, record) => {
        const totalSeats = record.busId?.totalSeats || record.bus?.totalSeats || 0;
        const bookedSeats = totalSeats - (record.availableSeats || 0);
        return (
          <div>
            <div className="font-medium">
              {bookedSeats}/{totalSeats}
            </div>
            <div className="text-sm text-gray-500">
              Còn: {record.availableSeats || 0}
            </div>
          </div>
        );
      }
    },
    {
      title: 'Giá',
      dataIndex: 'basePrice',
      key: 'basePrice',
      render: (price) => <span className="font-medium">{price.toLocaleString('vi-VN')}đ</span>
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
      filters: [
        { text: 'Đã lên lịch', value: 'scheduled' },
        { text: 'Đang lên xe', value: 'boarding' },
        { text: 'Đang chạy', value: 'in_progress' },
        { text: 'Hoàn thành', value: 'completed' },
        { text: 'Đã hủy', value: 'cancelled' }
      ],
      onFilter: (value, record) => record.status === value
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewBookings(record)}
          >
            Xem
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEditTrip(record)}
          >
            Sửa
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteTrip(record)}
          >
            Xóa
          </Button>
        </Space>
      )
    }
  ];

  // Calculate statistics
  const stats = {
    total: trips.length,
    scheduled: trips.filter(t => t.status === 'scheduled').length,
    inProgress: trips.filter(t => t.status === 'in_progress' || t.status === 'boarding').length,
    completed: trips.filter(t => t.status === 'completed').length,
    totalRevenue: trips.reduce((sum, t) => sum + (t.basePrice * t.bookedSeats), 0)
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <Title level={2} className="!mb-0">Quản lý chuyến đi</Title>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="large"
              onClick={handleCreateTrip}
            >
              Tạo chuyến mới
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={12} sm={6}>
            <Card>
              <Statistic
                title="Tổng chuyến"
                value={stats.total}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card>
              <Statistic
                title="Đã lên lịch"
                value={stats.scheduled}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card>
              <Statistic
                title="Đang chạy"
                value={stats.inProgress}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card>
              <Statistic
                title="Doanh thu"
                value={stats.totalRevenue}
                suffix="đ"
                valueStyle={{ color: '#722ed1' }}
                formatter={(value) => `${value.toLocaleString('vi-VN')}`}
              />
            </Card>
          </Col>
        </Row>

        {/* Filters */}
        <Card className="mb-6 shadow-md">
          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <Input
                placeholder="Tìm theo mã, tuyến đường, xe..."
                prefix={<SearchOutlined />}
                size="large"
                onChange={(e) => handleSearch(e.target.value)}
                allowClear
              />
            </Col>
            <Col xs={24} md={8}>
              <Select
                size="large"
                placeholder="Lọc theo trạng thái"
                onChange={handleStatusChange}
                defaultValue="all"
                className="w-full"
              >
                <Option value="all">Tất cả trạng thái</Option>
                <Option value="scheduled">Đã lên lịch</Option>
                <Option value="boarding">Đang lên xe</Option>
                <Option value="in_progress">Đang chạy</Option>
                <Option value="completed">Hoàn thành</Option>
                <Option value="cancelled">Đã hủy</Option>
              </Select>
            </Col>
            <Col xs={24} md={8}>
              <RangePicker
                size="large"
                format="DD/MM/YYYY"
                placeholder={['Từ ngày', 'Đến ngày']}
                onChange={handleDateRangeChange}
                className="w-full"
                suffixIcon={<CalendarOutlined />}
              />
            </Col>
          </Row>
        </Card>

        {/* Table */}
        <Card className="shadow-md">
          <Table
            columns={columns}
            dataSource={filteredTrips}
            rowKey={(record) => record._id || record.id}
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Tổng ${total} chuyến`
            }}
            scroll={{ x: 1200 }}
          />
        </Card>
      </div>
    </div>
  );
};

export default ManageTrips;
