import { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Tag,
  Input,
  Select,
  Space,
  Modal,
  Form,
  Row,
  Col,
  Statistic,
  Avatar,
  Descriptions,
  message,
  Popconfirm,
  Badge,
  DatePicker,
  Tabs
} from 'antd';
import {
  SearchOutlined,
  UserOutlined,
  EyeOutlined,
  EditOutlined,
  LockOutlined,
  UnlockOutlined,
  DeleteOutlined,
  MailOutlined,
  PhoneOutlined,
  PlusOutlined,
  ReloadOutlined,
  DownloadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import userService from '../../services/userService';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
const { Title, Text } = Typography;
import { Typography } from 'antd';

const ManageUsers = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [detailModal, setDetailModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [usersData, setUsersData] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    blocked: 0,
    newThisMonth: 0
  });

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await userService.getAllUsers();
      setUsersData(response.data || []);
    } catch (error) {
      message.error('Không thể tải danh sách người dùng');
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await userService.getUserStatistics();
      setStats(response || stats);
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const getRoleTag = (role) => {
    const roleConfig = {
      customer: { color: 'blue', text: 'Khách hàng' },
      operator: { color: 'orange', text: 'Nhà xe' },
      admin: { color: 'red', text: 'Quản trị viên' }
    };
    const config = roleConfig[role] || roleConfig.customer;
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const getStatusTag = (status) => {
    const statusConfig = {
      active: { color: 'green', text: 'Hoạt động', icon: <CheckCircleOutlined /> },
      inactive: { color: 'default', text: 'Không hoạt động', icon: <CloseCircleOutlined /> },
      blocked: { color: 'red', text: 'Bị khóa', icon: <LockOutlined /> }
    };
    const config = statusConfig[status] || statusConfig.inactive;
    return <Tag color={config.color} icon={config.icon}>{config.text}</Tag>;
  };

  const getTierBadge = (tier) => {
    const tierConfig = {
      Bronze: { color: '#cd7f32', text: 'Bronze' },
      Silver: { color: '#C0C0C0', text: 'Silver' },
      Gold: { color: '#FFD700', text: 'Gold' },
      Platinum: { color: '#E5E4E2', text: 'Platinum' }
    };
    const config = tierConfig[tier] || tierConfig.Bronze;
    return (
      <Badge
        count={config.text}
        style={{ backgroundColor: config.color }}
      />
    );
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'userId',
      key: 'userId',
      width: 100,
      fixed: 'left'
    },
    {
      title: 'Người dùng',
      key: 'user',
      width: 250,
      fixed: 'left',
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar size={40} icon={<UserOutlined />} />
          <div>
            <div className="flex items-center gap-2">
              <Text strong>{record.name}</Text>
              {record.verified && (
                <CheckCircleOutlined className="text-blue-600" />
              )}
            </div>
            <Text type="secondary" className="text-xs block">
              <MailOutlined /> {record.email}
            </Text>
          </div>
        </div>
      )
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      width: 130,
      render: (phone) => (
        <Space>
          <PhoneOutlined />
          {phone}
        </Space>
      )
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      width: 130,
      render: (role) => getRoleTag(role),
      filters: [
        { text: 'Khách hàng', value: 'customer' },
        { text: 'Nhà xe', value: 'operator' },
        { text: 'Admin', value: 'admin' }
      ],
      onFilter: (value, record) => record.role === value
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 140,
      render: (status) => getStatusTag(status),
      filters: [
        { text: 'Hoạt động', value: 'active' },
        { text: 'Không hoạt động', value: 'inactive' },
        { text: 'Bị khóa', value: 'blocked' }
      ],
      onFilter: (value, record) => record.status === value
    },
    {
      title: 'Ngày tham gia',
      dataIndex: 'joinDate',
      key: 'joinDate',
      width: 120,
      render: (date) => dayjs(date).format('DD/MM/YYYY'),
      sorter: (a, b) => dayjs(a.joinDate).unix() - dayjs(b.joinDate).unix()
    },
    {
      title: 'Đăng nhập cuối',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      width: 150,
      render: (date) => (
        <div>
          <Text className="block">{dayjs(date).format('DD/MM/YYYY')}</Text>
          <Text type="secondary" className="text-xs">{dayjs(date).format('HH:mm')}</Text>
        </div>
      )
    },
    {
      title: 'Thống kê',
      key: 'stats',
      width: 150,
      render: (_, record) => {
        if (record.role === 'customer') {
          return (
            <div>
              <Text className="block text-xs">{record.totalBookings} booking</Text>
              <Text className="block text-xs text-green-600">
                {(record.totalSpent / 1000000).toFixed(1)}M
              </Text>
              {getTierBadge(record.loyaltyTier)}
            </div>
          );
        } else if (record.role === 'operator') {
          return (
            <div>
              <Text className="block text-xs">{record.totalTrips} chuyến</Text>
              <Text className="block text-xs text-green-600">
                {(record.totalRevenue / 1000000).toFixed(0)}M
              </Text>
              <Tag color="gold">⭐ {record.rating}</Tag>
            </div>
          );
        }
        return '-';
      }
    },
    {
      title: 'Thao tác',
      key: 'action',
      fixed: 'right',
      width: 200,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            Xem
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          {record.status === 'blocked' ? (
            <Popconfirm
              title="Mở khóa người dùng này?"
              onConfirm={() => handleUnblockUser(record.userId)}
              okText="Mở khóa"
              cancelText="Hủy"
            >
              <Button
                type="link"
                size="small"
                icon={<UnlockOutlined />}
                className="text-green-600"
              >
                Mở khóa
              </Button>
            </Popconfirm>
          ) : (
            <Popconfirm
              title="Khóa người dùng này?"
              onConfirm={() => handleBlockUser(record.userId)}
              okText="Khóa"
              cancelText="Hủy"
            >
              <Button
                type="link"
                size="small"
                danger
                icon={<LockOutlined />}
              >
                Khóa
              </Button>
            </Popconfirm>
          )}
        </Space>
      )
    }
  ];

  const handleRefresh = () => {
    fetchUsers();
    fetchStats();
  };

  const handleViewDetail = (user) => {
    setSelectedUser(user);
    setDetailModal(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    form.setFieldsValue(user);
    setEditModal(true);
  };

  const handleBlockUser = async (userId) => {
    try {
      await userService.blockUser(userId, 'Khóa bởi admin');
      message.success('Đã khóa người dùng');
      fetchUsers(); // Refresh list
    } catch (error) {
      message.error('Không thể khóa người dùng');
      console.error('Error blocking user:', error);
    }
  };

  const handleUnblockUser = async (userId) => {
    try {
      await userService.unblockUser(userId);
      message.success('Đã mở khóa người dùng');
      fetchUsers(); // Refresh list
    } catch (error) {
      message.error('Không thể mở khóa người dùng');
      console.error('Error unblocking user:', error);
    }
  };

  const handleSaveEdit = async (values) => {
    setLoading(true);
    try {
      await userService.updateUser(selectedUser._id, values);
      message.success('Đã cập nhật thông tin người dùng');
      setEditModal(false);
      fetchUsers(); // Refresh list
    } catch (error) {
      message.error('Không thể cập nhật thông tin');
      console.error('Error updating user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    // TODO: Implement export to Excel
    message.success('Đang xuất dữ liệu...');
  };

  const filteredData = usersData.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase()) ||
      user.phone.includes(searchText) ||
      user.userId.toLowerCase().includes(searchText.toLowerCase());

    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Title level={2}>Quản lý Người dùng</Title>
          <Text type="secondary">
            Quản lý tất cả người dùng trong hệ thống
          </Text>
        </div>

        {/* Statistics */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Tổng người dùng"
                value={stats.total}
                valueStyle={{ color: '#1890ff' }}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Đang hoạt động"
                value={stats.active}
                valueStyle={{ color: '#52c41a' }}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Badge count={stats.blocked} offset={[10, 0]}>
                <Statistic
                  title="Bị khóa"
                  value={stats.blocked}
                  valueStyle={{ color: '#ff4d4f' }}
                  prefix={<LockOutlined />}
                />
              </Badge>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Mới tháng này"
                value={stats.newThisMonth}
                valueStyle={{ color: '#722ed1' }}
                prefix={<PlusOutlined />}
              />
            </Card>
          </Col>
        </Row>

        {/* Filters */}
        <Card className="mb-4">
          <div className="flex flex-wrap gap-3">
            <Input
              placeholder="Tìm theo tên, email, SĐT, ID..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 300 }}
              allowClear
            />
            <Select
              value={selectedRole}
              onChange={setSelectedRole}
              style={{ width: 150 }}
            >
              <Option value="all">Tất cả vai trò</Option>
              <Option value="customer">Khách hàng</Option>
              <Option value="operator">Nhà xe</Option>
              <Option value="admin">Admin</Option>
            </Select>
            <Select
              value={selectedStatus}
              onChange={setSelectedStatus}
              style={{ width: 150 }}
            >
              <Option value="all">Tất cả trạng thái</Option>
              <Option value="active">Hoạt động</Option>
              <Option value="inactive">Không hoạt động</Option>
              <Option value="blocked">Bị khóa</Option>
            </Select>
            <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
              Làm mới
            </Button>
            <Button icon={<DownloadOutlined />} onClick={handleExport}>
              Xuất Excel
            </Button>
          </div>
        </Card>

        {/* Users Table */}
        <Card>
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="_id"
            scroll={{ x: 1600 }}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Tổng ${total} người dùng`
            }}
            loading={loading}
          />
        </Card>

        {/* Detail Modal */}
        <Modal
          title={`Chi tiết người dùng: ${selectedUser?.name}`}
          open={detailModal}
          onCancel={() => setDetailModal(false)}
          width={700}
          footer={[
            <Button key="close" onClick={() => setDetailModal(false)}>
              Đóng
            </Button>
          ]}
        >
          {selectedUser && (
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="ID" span={2}>
                {selectedUser.userId}
              </Descriptions.Item>
              <Descriptions.Item label="Họ tên" span={2}>
                {selectedUser.name}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {selectedUser.email}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                {selectedUser.phone}
              </Descriptions.Item>
              <Descriptions.Item label="Vai trò">
                {getRoleTag(selectedUser.role)}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                {getStatusTag(selectedUser.status)}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tham gia">
                {dayjs(selectedUser.joinDate).format('DD/MM/YYYY')}
              </Descriptions.Item>
              <Descriptions.Item label="Đăng nhập cuối">
                {dayjs(selectedUser.lastLogin).format('DD/MM/YYYY HH:mm')}
              </Descriptions.Item>
              <Descriptions.Item label="Xác thực">
                {selectedUser.verified ? (
                  <Tag color="green" icon={<CheckCircleOutlined />}>Đã xác thực</Tag>
                ) : (
                  <Tag color="orange" icon={<CloseCircleOutlined />}>Chưa xác thực</Tag>
                )}
              </Descriptions.Item>
              {selectedUser.role === 'customer' && (
                <>
                  <Descriptions.Item label="Tổng booking">
                    {selectedUser.totalBookings}
                  </Descriptions.Item>
                  <Descriptions.Item label="Tổng chi tiêu">
                    {selectedUser.totalSpent?.toLocaleString('vi-VN')}đ
                  </Descriptions.Item>
                  <Descriptions.Item label="Hạng thành viên">
                    {getTierBadge(selectedUser.loyaltyTier)}
                  </Descriptions.Item>
                </>
              )}
              {selectedUser.role === 'operator' && (
                <>
                  <Descriptions.Item label="Tổng chuyến">
                    {selectedUser.totalTrips}
                  </Descriptions.Item>
                  <Descriptions.Item label="Doanh thu">
                    {selectedUser.totalRevenue?.toLocaleString('vi-VN')}đ
                  </Descriptions.Item>
                  <Descriptions.Item label="Đánh giá">
                    <Tag color="gold">⭐ {selectedUser.rating}</Tag>
                  </Descriptions.Item>
                </>
              )}
              {selectedUser.status === 'blocked' && selectedUser.blockReason && (
                <Descriptions.Item label="Lý do khóa" span={2}>
                  <Text type="danger">{selectedUser.blockReason}</Text>
                </Descriptions.Item>
              )}
            </Descriptions>
          )}
        </Modal>

        {/* Edit Modal */}
        <Modal
          title="Chỉnh sửa người dùng"
          open={editModal}
          onCancel={() => setEditModal(false)}
          onOk={() => form.submit()}
          confirmLoading={loading}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSaveEdit}
          >
            <Form.Item
              name="name"
              label="Họ tên"
              rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Vui lòng nhập email' },
                { type: 'email', message: 'Email không hợp lệ' }
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="phone"
              label="Số điện thoại"
              rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="role"
              label="Vai trò"
              rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
            >
              <Select>
                <Option value="customer">Khách hàng</Option>
                <Option value="operator">Nhà xe</Option>
                <Option value="admin">Admin</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="status"
              label="Trạng thái"
              rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
            >
              <Select>
                <Option value="active">Hoạt động</Option>
                <Option value="inactive">Không hoạt động</Option>
                <Option value="blocked">Bị khóa</Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default ManageUsers;
