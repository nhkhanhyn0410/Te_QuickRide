import { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Tag,
  Space,
  Input,
  Select,
  Modal,
  message,
  Typography,
  Row,
  Col,
  Descriptions,
  Rate,
  Tabs
} from 'antd';
import {
  SearchOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  StopOutlined,
  PlayCircleOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

const ManageOperators = () => {
  const [loading, setLoading] = useState(false);
  const [operators, setOperators] = useState([]);
  const [filteredOperators, setFilteredOperators] = useState([]);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedOperator, setSelectedOperator] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    verificationStatus: 'all'
  });

  useEffect(() => {
    fetchOperators();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, operators]);

  const fetchOperators = async () => {
    setLoading(true);
    try {
      // TODO: Integrate with API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock data
      const mockOperators = [
        {
          id: 'op1',
          name: 'Nhà xe Phương Trang',
          email: 'phuongtrang@example.com',
          phone: '1900 6067',
          businessLicense: 'GPKD 0123456789',
          taxCode: 'MST 0123456789',
          address: '272 Đề Thám, Q.1, TP.HCM',
          verificationStatus: 'approved',
          isActive: true,
          isSuspended: false,
          rating: 4.8,
          totalTrips: 1234,
          totalRevenue: 456789000,
          totalBookings: 5678,
          submittedAt: '2024-01-01',
          verifiedAt: '2024-01-05'
        },
        {
          id: 'op2',
          name: 'Nhà xe Hoàng Long',
          email: 'hoanglong@example.com',
          phone: '0901234567',
          businessLicense: 'GPKD 9876543210',
          taxCode: 'MST 9876543210',
          address: '123 Nguyễn Huệ, Q.1, TP.HCM',
          verificationStatus: 'pending',
          isActive: false,
          isSuspended: false,
          rating: 0,
          totalTrips: 0,
          totalRevenue: 0,
          totalBookings: 0,
          submittedAt: '2024-01-15',
          verifiedAt: null
        },
        {
          id: 'op3',
          name: 'Nhà xe Mai Linh',
          email: 'mailinh@example.com',
          phone: '0912345678',
          businessLicense: 'GPKD 1122334455',
          taxCode: 'MST 1122334455',
          address: '456 Lê Lợi, Q.1, TP.HCM',
          verificationStatus: 'approved',
          isActive: true,
          isSuspended: true,
          rating: 4.5,
          totalTrips: 567,
          totalRevenue: 234567000,
          totalBookings: 2345,
          submittedAt: '2023-12-01',
          verifiedAt: '2023-12-05'
        }
      ];

      setOperators(mockOperators);
    } catch (error) {
      message.error('Không thể tải danh sách nhà xe');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...operators];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(
        op =>
          op.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          op.email.toLowerCase().includes(filters.search.toLowerCase()) ||
          op.phone.includes(filters.search)
      );
    }

    // Status filter
    if (filters.status !== 'all') {
      if (filters.status === 'active') {
        filtered = filtered.filter(op => op.isActive && !op.isSuspended);
      } else if (filters.status === 'suspended') {
        filtered = filtered.filter(op => op.isSuspended);
      } else if (filters.status === 'inactive') {
        filtered = filtered.filter(op => !op.isActive);
      }
    }

    // Verification filter
    if (filters.verificationStatus !== 'all') {
      filtered = filtered.filter(op => op.verificationStatus === filters.verificationStatus);
    }

    setFilteredOperators(filtered);
  };

  const handleApprove = (operator) => {
    Modal.confirm({
      title: 'Xác nhận duyệt nhà xe',
      content: `Bạn có chắc muốn duyệt nhà xe "${operator.name}"?`,
      okText: 'Duyệt',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          // TODO: Integrate with API
          await new Promise(resolve => setTimeout(resolve, 500));
          setOperators(
            operators.map(op =>
              op.id === operator.id
                ? { ...op, verificationStatus: 'approved', isActive: true, verifiedAt: new Date().toISOString() }
                : op
            )
          );
          message.success('Đã duyệt nhà xe thành công');
        } catch (error) {
          message.error('Có lỗi xảy ra');
        }
      }
    });
  };

  const handleReject = (operator) => {
    Modal.confirm({
      title: 'Xác nhận từ chối nhà xe',
      content: (
        <div>
          <p>Bạn có chắc muốn từ chối nhà xe "{operator.name}"?</p>
          <Input.TextArea
            rows={3}
            placeholder="Lý do từ chối (tùy chọn)..."
            id="reject-reason"
          />
        </div>
      ),
      okText: 'Từ chối',
      okButtonProps: { danger: true },
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          setOperators(
            operators.map(op =>
              op.id === operator.id
                ? { ...op, verificationStatus: 'rejected' }
                : op
            )
          );
          message.success('Đã từ chối nhà xe');
        } catch (error) {
          message.error('Có lỗi xảy ra');
        }
      }
    });
  };

  const handleSuspend = (operator) => {
    Modal.confirm({
      title: operator.isSuspended ? 'Gỡ khóa nhà xe' : 'Khóa nhà xe',
      content: `Bạn có chắc muốn ${operator.isSuspended ? 'gỡ khóa' : 'khóa'} nhà xe "${operator.name}"?`,
      okText: operator.isSuspended ? 'Gỡ khóa' : 'Khóa',
      okButtonProps: { danger: !operator.isSuspended },
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          setOperators(
            operators.map(op =>
              op.id === operator.id
                ? { ...op, isSuspended: !op.isSuspended }
                : op
            )
          );
          message.success(`Đã ${operator.isSuspended ? 'gỡ khóa' : 'khóa'} nhà xe`);
        } catch (error) {
          message.error('Có lỗi xảy ra');
        }
      }
    });
  };

  const handleViewDetails = (operator) => {
    setSelectedOperator(operator);
    setDetailModalVisible(true);
  };

  const getVerificationStatusColor = (status) => {
    const colors = {
      pending: 'orange',
      approved: 'green',
      rejected: 'red'
    };
    return colors[status] || 'default';
  };

  const getVerificationStatusText = (status) => {
    const texts = {
      pending: 'Chờ duyệt',
      approved: 'Đã duyệt',
      rejected: 'Bị từ chối'
    };
    return texts[status] || status;
  };

  const columns = [
    {
      title: 'Tên nhà xe',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div>
          <div className="font-medium">{text}</div>
          {record.isSuspended && (
            <Tag color="red" className="mt-1">Đã khóa</Tag>
          )}
        </div>
      )
    },
    {
      title: 'Liên hệ',
      key: 'contact',
      render: (_, record) => (
        <div>
          <div className="text-sm">{record.email}</div>
          <div className="text-sm text-gray-600">{record.phone}</div>
        </div>
      )
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
      ellipsis: true
    },
    {
      title: 'Xác minh',
      dataIndex: 'verificationStatus',
      key: 'verificationStatus',
      render: (status) => (
        <Tag color={getVerificationStatusColor(status)}>
          {getVerificationStatusText(status)}
        </Tag>
      ),
      filters: [
        { text: 'Chờ duyệt', value: 'pending' },
        { text: 'Đã duyệt', value: 'approved' },
        { text: 'Bị từ chối', value: 'rejected' }
      ],
      onFilter: (value, record) => record.verificationStatus === value
    },
    {
      title: 'Thống kê',
      key: 'stats',
      render: (_, record) => (
        <div className="text-sm">
          <div>Chuyến: {record.totalTrips}</div>
          <div>Booking: {record.totalBookings}</div>
          <div className="flex items-center gap-1">
            <Rate disabled defaultValue={record.rating} style={{ fontSize: 12 }} />
            <span>({record.rating})</span>
          </div>
        </div>
      )
    },
    {
      title: 'Doanh thu',
      dataIndex: 'totalRevenue',
      key: 'totalRevenue',
      render: (revenue) => (
        <span className="font-medium">
          {(revenue / 1000000).toFixed(0)}M đ
        </span>
      ),
      sorter: (a, b) => a.totalRevenue - b.totalRevenue
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
            size="small"
          >
            Chi tiết
          </Button>
          {record.verificationStatus === 'pending' && (
            <>
              <Button
                type="link"
                icon={<CheckCircleOutlined />}
                onClick={() => handleApprove(record)}
                size="small"
              >
                Duyệt
              </Button>
              <Button
                type="link"
                danger
                icon={<CloseCircleOutlined />}
                onClick={() => handleReject(record)}
                size="small"
              >
                Từ chối
              </Button>
            </>
          )}
          {record.verificationStatus === 'approved' && (
            <Button
              type="link"
              danger={!record.isSuspended}
              icon={record.isSuspended ? <PlayCircleOutlined /> : <StopOutlined />}
              onClick={() => handleSuspend(record)}
              size="small"
            >
              {record.isSuspended ? 'Gỡ khóa' : 'Khóa'}
            </Button>
          )}
        </Space>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Title level={2}>Quản lý nhà xe</Title>
        </div>

        {/* Statistics */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={12} sm={6}>
            <Card>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{operators.length}</div>
                <div className="text-sm text-gray-600 mt-1">Tổng nhà xe</div>
              </div>
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">
                  {operators.filter(op => op.verificationStatus === 'pending').length}
                </div>
                <div className="text-sm text-gray-600 mt-1">Chờ duyệt</div>
              </div>
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {operators.filter(op => op.verificationStatus === 'approved' && op.isActive).length}
                </div>
                <div className="text-sm text-gray-600 mt-1">Đang hoạt động</div>
              </div>
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">
                  {operators.filter(op => op.isSuspended).length}
                </div>
                <div className="text-sm text-gray-600 mt-1">Bị khóa</div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Filters */}
        <Card className="mb-6 shadow-md">
          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <Input
                placeholder="Tìm theo tên, email, số điện thoại..."
                prefix={<SearchOutlined />}
                size="large"
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                allowClear
              />
            </Col>
            <Col xs={24} md={8}>
              <Select
                size="large"
                placeholder="Lọc theo xác minh"
                onChange={(value) => setFilters({ ...filters, verificationStatus: value })}
                defaultValue="all"
                className="w-full"
              >
                <Option value="all">Tất cả trạng thái xác minh</Option>
                <Option value="pending">Chờ duyệt</Option>
                <Option value="approved">Đã duyệt</Option>
                <Option value="rejected">Bị từ chối</Option>
              </Select>
            </Col>
            <Col xs={24} md={8}>
              <Select
                size="large"
                placeholder="Lọc theo hoạt động"
                onChange={(value) => setFilters({ ...filters, status: value })}
                defaultValue="all"
                className="w-full"
              >
                <Option value="all">Tất cả</Option>
                <Option value="active">Đang hoạt động</Option>
                <Option value="suspended">Đã khóa</Option>
                <Option value="inactive">Chưa kích hoạt</Option>
              </Select>
            </Col>
          </Row>
        </Card>

        {/* Table */}
        <Card className="shadow-md">
          <Table
            columns={columns}
            dataSource={filteredOperators}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Tổng ${total} nhà xe`
            }}
            scroll={{ x: 1200 }}
          />
        </Card>

        {/* Detail Modal */}
        <Modal
          title="Chi tiết nhà xe"
          open={detailModalVisible}
          onCancel={() => setDetailModalVisible(false)}
          footer={null}
          width={700}
        >
          {selectedOperator && (
            <Tabs defaultActiveKey="1">
              <TabPane tab="Thông tin cơ bản" key="1">
                <Descriptions column={1} bordered>
                  <Descriptions.Item label="Tên nhà xe">
                    <strong>{selectedOperator.name}</strong>
                  </Descriptions.Item>
                  <Descriptions.Item label="Email">{selectedOperator.email}</Descriptions.Item>
                  <Descriptions.Item label="Số điện thoại">{selectedOperator.phone}</Descriptions.Item>
                  <Descriptions.Item label="Địa chỉ">{selectedOperator.address}</Descriptions.Item>
                  <Descriptions.Item label="Giấy phép KD">{selectedOperator.businessLicense}</Descriptions.Item>
                  <Descriptions.Item label="Mã số thuế">{selectedOperator.taxCode}</Descriptions.Item>
                  <Descriptions.Item label="Trạng thái xác minh">
                    <Tag color={getVerificationStatusColor(selectedOperator.verificationStatus)}>
                      {getVerificationStatusText(selectedOperator.verificationStatus)}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Ngày đăng ký">{selectedOperator.submittedAt}</Descriptions.Item>
                  {selectedOperator.verifiedAt && (
                    <Descriptions.Item label="Ngày duyệt">{selectedOperator.verifiedAt}</Descriptions.Item>
                  )}
                </Descriptions>
              </TabPane>
              <TabPane tab="Thống kê" key="2">
                <Descriptions column={1} bordered>
                  <Descriptions.Item label="Đánh giá trung bình">
                    <Rate disabled defaultValue={selectedOperator.rating} />
                    <span className="ml-2">({selectedOperator.rating})</span>
                  </Descriptions.Item>
                  <Descriptions.Item label="Tổng số chuyến">
                    <strong>{selectedOperator.totalTrips.toLocaleString('vi-VN')}</strong>
                  </Descriptions.Item>
                  <Descriptions.Item label="Tổng booking">
                    <strong>{selectedOperator.totalBookings.toLocaleString('vi-VN')}</strong>
                  </Descriptions.Item>
                  <Descriptions.Item label="Tổng doanh thu">
                    <strong className="text-green-600">
                      {(selectedOperator.totalRevenue / 1000000).toFixed(0)}M đ
                    </strong>
                  </Descriptions.Item>
                </Descriptions>
              </TabPane>
            </Tabs>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default ManageOperators;
