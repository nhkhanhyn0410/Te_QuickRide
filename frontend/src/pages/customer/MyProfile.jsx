import { useState, useEffect } from 'react';
import {
  Card,
  Tabs,
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  Upload,
  Table,
  Modal,
  message,
  Avatar,
  Statistic,
  Row,
  Col,
  Divider,
  Tag,
  Space,
  Typography,
  Popconfirm,
  Spin
} from 'antd';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  LockOutlined,
  UploadOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  TrophyOutlined,
  GiftOutlined
} from '@ant-design/icons';
import userService from '../../services/userService';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

const MyProfile = () => {
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [passengerModalVisible, setPassengerModalVisible] = useState(false);
  const [editingPassenger, setEditingPassenger] = useState(null);
  const [savedPassengers, setSavedPassengers] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [profileForm] = Form.useForm();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setPageLoading(true);
      const response = await userService.getMyProfile();

      if (response.success) {
        const user = response.data.user;
        setUserInfo(user);
        setAvatarUrl(user.avatar || '');
        setSavedPassengers(user.savedPassengers || []);

        // Update form with user data
        profileForm.setFieldsValue({
          fullName: user.fullName,
          email: user.email,
          phone: user.phoneNumber,
          gender: user.gender,
          dateOfBirth: user.dateOfBirth ? dayjs(user.dateOfBirth) : null
        });
      } else {
        message.error('Không thể tải thông tin người dùng');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      message.error('Đã có lỗi xảy ra');
    } finally {
      setPageLoading(false);
    }
  };

  const [pointsHistory] = useState([
    { id: 1, date: '2024-01-15', description: 'Đặt vé thành công', points: 50, type: 'earn' },
    { id: 2, date: '2024-01-10', description: 'Sử dụng điểm đổi voucher', points: -100, type: 'redeem' },
    { id: 3, date: '2024-01-05', description: 'Đặt vé thành công', points: 50, type: 'earn' },
    { id: 4, date: '2023-12-28', description: 'Thưởng sinh nhật', points: 200, type: 'bonus' }
  ]);

  // Personal Info Tab
  const handleUpdateProfile = async (values) => {
    setLoading(true);
    try {
      const updateData = {
        fullName: values.fullName,
        phoneNumber: values.phone,
        gender: values.gender,
        dateOfBirth: values.dateOfBirth ? values.dateOfBirth.toISOString() : null
      };

      const response = await userService.updateProfile(updateData);

      if (response.success) {
        message.success('Cập nhật thông tin thành công!');
        // Refresh user profile
        await fetchUserProfile();
      } else {
        message.error(response.message || 'Không thể cập nhật thông tin');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      message.error(error.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Change Password Tab
  const handleChangePassword = async (values) => {
    setLoading(true);
    try {
      const response = await userService.changePassword(
        values.oldPassword,
        values.newPassword
      );

      if (response.success) {
        message.success('Đổi mật khẩu thành công!');
        // Reset form after successful password change
        const form = document.querySelector('form');
        if (form) form.reset();
      } else {
        message.error(response.message || 'Mật khẩu hiện tại không đúng');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      message.error(error.response?.data?.message || 'Mật khẩu hiện tại không đúng.');
    } finally {
      setLoading(false);
    }
  };

  // Avatar Upload
  const handleAvatarChange = (info) => {
    if (info.file.status === 'done') {
      setAvatarUrl(info.file.response.url);
      message.success('Cập nhật ảnh đại diện thành công!');
    }
  };

  // Saved Passengers
  const handleAddPassenger = () => {
    setEditingPassenger(null);
    setPassengerModalVisible(true);
  };

  const handleEditPassenger = (passenger) => {
    setEditingPassenger(passenger);
    setPassengerModalVisible(true);
  };

  const handleDeletePassenger = (id) => {
    setSavedPassengers(savedPassengers.filter(p => p.id !== id));
    message.success('Đã xóa hành khách');
  };

  const handleSavePassenger = (values) => {
    if (editingPassenger) {
      setSavedPassengers(
        savedPassengers.map(p => p.id === editingPassenger.id ? { ...p, ...values } : p)
      );
      message.success('Cập nhật thông tin hành khách thành công!');
    } else {
      setSavedPassengers([
        ...savedPassengers,
        { id: Date.now(), ...values, isDefault: false }
      ]);
      message.success('Thêm hành khách thành công!');
    }
    setPassengerModalVisible(false);
  };

  const passengerColumns = [
    {
      title: 'Họ tên',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (text, record) => (
        <Space>
          {text}
          {record.isDefault && <Tag color="blue">Mặc định</Tag>}
        </Space>
      )
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone'
    },
    {
      title: 'CMND/CCCD',
      dataIndex: 'idCard',
      key: 'idCard'
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEditPassenger(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa hành khách này?"
            onConfirm={() => handleDeletePassenger(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  const getLoyaltyTierColor = (tier) => {
    const colors = {
      Bronze: 'orange',
      Silver: 'default',
      Gold: 'gold',
      Platinum: 'purple'
    };
    return colors[tier] || 'default';
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-12">
          <Spin size="large" tip="Đang tải thông tin..." />
        </div>
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <div className="text-center py-12">
              <Text>Không thể tải thông tin người dùng</Text>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Title level={2} className="mb-6">Thông tin cá nhân</Title>

        {/* Loyalty Info Banner */}
        <Card className="mb-6 shadow-md bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <Row gutter={[24, 24]} align="middle">
            <Col xs={24} md={8} className="text-center">
              <Avatar
                size={100}
                icon={<UserOutlined />}
                src={avatarUrl}
                className="border-4 border-white"
              />
              <Title level={4} className="!text-white mt-3 mb-0">
                {userInfo.fullName}
              </Title>
              <Tag color={getLoyaltyTierColor(userInfo.loyaltyTier || 'Bronze')} className="mt-2">
                <TrophyOutlined /> {userInfo.loyaltyTier || 'Bronze'} Member
              </Tag>
            </Col>
            <Col xs={24} md={16}>
              <Row gutter={16}>
                <Col xs={12} sm={8}>
                  <Statistic
                    title={<span className="text-blue-100">Điểm tích lũy</span>}
                    value={userInfo.loyaltyPoints || 0}
                    suffix="pts"
                    valueStyle={{ color: '#fff', fontSize: '28px' }}
                  />
                </Col>
                <Col xs={12} sm={8}>
                  <Statistic
                    title={<span className="text-blue-100">Chuyến đi</span>}
                    value={userInfo.totalTrips || 0}
                    valueStyle={{ color: '#fff', fontSize: '28px' }}
                  />
                </Col>
                <Col xs={12} sm={8}>
                  <Statistic
                    title={<span className="text-blue-100">Hạng thành viên</span>}
                    value={userInfo.loyaltyTier || 'Bronze'}
                    valueStyle={{ color: '#ffd700', fontSize: '24px' }}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>

        {/* Tabs */}
        <Card className="shadow-md">
          <Tabs defaultActiveKey="1" size="large">
            {/* Personal Info Tab */}
            <TabPane tab={<span><UserOutlined />Thông tin cá nhân</span>} key="1">
              <Form
                form={profileForm}
                layout="vertical"
                onFinish={handleUpdateProfile}
              >
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="fullName"
                      label="Họ và tên"
                      rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                    >
                      <Input size="large" prefix={<UserOutlined />} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="email"
                      label="Email"
                      rules={[
                        { required: true, message: 'Vui lòng nhập email' },
                        { type: 'email', message: 'Email không hợp lệ' }
                      ]}
                    >
                      <Input size="large" prefix={<MailOutlined />} />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="phone"
                      label="Số điện thoại"
                      rules={[
                        { required: true, message: 'Vui lòng nhập số điện thoại' },
                        { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ' }
                      ]}
                    >
                      <Input size="large" prefix={<PhoneOutlined />} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item name="gender" label="Giới tính">
                      <Select size="large">
                        <Option value="male">Nam</Option>
                        <Option value="female">Nữ</Option>
                        <Option value="other">Khác</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item name="dateOfBirth" label="Ngày sinh">
                      <DatePicker
                        size="large"
                        format="DD/MM/YYYY"
                        className="w-full"
                        placeholder="Chọn ngày sinh"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item label="Ảnh đại diện">
                      <Upload
                        showUploadList={false}
                        onChange={handleAvatarChange}
                      >
                        <Button icon={<UploadOutlined />} size="large">
                          Tải ảnh lên
                        </Button>
                      </Upload>
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item>
                  <Button type="primary" htmlType="submit" size="large" loading={loading}>
                    Cập nhật thông tin
                  </Button>
                </Form.Item>
              </Form>
            </TabPane>

            {/* Saved Passengers Tab */}
            <TabPane tab={<span><UserOutlined />Hành khách thường dùng</span>} key="2">
              <div className="mb-4">
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleAddPassenger}
                  size="large"
                >
                  Thêm hành khách
                </Button>
              </div>
              <Table
                columns={passengerColumns}
                dataSource={savedPassengers}
                rowKey="id"
                pagination={false}
              />
            </TabPane>

            {/* Change Password Tab */}
            <TabPane tab={<span><LockOutlined />Đổi mật khẩu</span>} key="3">
              <Form layout="vertical" onFinish={handleChangePassword}>
                <Form.Item
                  name="oldPassword"
                  label="Mật khẩu hiện tại"
                  rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại' }]}
                >
                  <Input.Password size="large" prefix={<LockOutlined />} />
                </Form.Item>

                <Form.Item
                  name="newPassword"
                  label="Mật khẩu mới"
                  rules={[
                    { required: true, message: 'Vui lòng nhập mật khẩu mới' },
                    { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
                  ]}
                >
                  <Input.Password size="large" prefix={<LockOutlined />} />
                </Form.Item>

                <Form.Item
                  name="confirmPassword"
                  label="Xác nhận mật khẩu mới"
                  dependencies={['newPassword']}
                  rules={[
                    { required: true, message: 'Vui lòng xác nhận mật khẩu' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('newPassword') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Mật khẩu xác nhận không khớp'));
                      }
                    })
                  ]}
                >
                  <Input.Password size="large" prefix={<LockOutlined />} />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" size="large" loading={loading}>
                    Đổi mật khẩu
                  </Button>
                </Form.Item>
              </Form>
            </TabPane>

            {/* Loyalty Points Tab */}
            <TabPane tab={<span><GiftOutlined />Điểm thưởng</span>} key="4">
              <Card className="mb-4 bg-gradient-to-r from-yellow-50 to-orange-50">
                <Row gutter={16}>
                  <Col xs={24} md={8}>
                    <Statistic
                      title="Điểm hiện có"
                      value={userInfo.loyaltyPoints || 0}
                      suffix="điểm"
                      valueStyle={{ color: '#faad14' }}
                    />
                  </Col>
                  <Col xs={24} md={8}>
                    <Statistic
                      title="Hạng thành viên"
                      value={userInfo.loyaltyTier || 'Bronze'}
                      valueStyle={{ color: '#722ed1' }}
                    />
                  </Col>
                  <Col xs={24} md={8}>
                    <Statistic
                      title="Điểm cần để lên hạng"
                      value={250}
                      suffix="điểm"
                      valueStyle={{ color: '#1890ff' }}
                    />
                  </Col>
                </Row>
              </Card>

              <Divider>Lợi ích hạng {userInfo.loyaltyTier || 'Bronze'}</Divider>
              <ul className="list-disc pl-5 mb-6 space-y-2">
                <li>Giảm giá 10% cho mọi chuyến đi</li>
                <li>Ưu tiên chọn chỗ ngồi</li>
                <li>Tích điểm gấp đôi vào cuối tuần</li>
                <li>Quà tặng sinh nhật đặc biệt</li>
                <li>Hỗ trợ khách hàng ưu tiên 24/7</li>
              </ul>

              <Divider>Lịch sử điểm thưởng</Divider>
              <div className="space-y-3">
                {pointsHistory.map(item => (
                  <Card key={item.id} size="small" className="hover:shadow-md transition-shadow">
                    <Row justify="space-between" align="middle">
                      <Col>
                        <Text strong>{item.description}</Text>
                        <br />
                        <Text type="secondary" className="text-sm">
                          {dayjs(item.date).format('DD/MM/YYYY')}
                        </Text>
                      </Col>
                      <Col>
                        <Text
                          strong
                          className={`text-lg ${item.type === 'earn' || item.type === 'bonus' ? 'text-green-600' : 'text-red-600'}`}
                        >
                          {item.points > 0 ? '+' : ''}{item.points}
                        </Text>
                      </Col>
                    </Row>
                  </Card>
                ))}
              </div>
            </TabPane>
          </Tabs>
        </Card>

        {/* Passenger Modal */}
        <Modal
          title={editingPassenger ? 'Sửa thông tin hành khách' : 'Thêm hành khách mới'}
          open={passengerModalVisible}
          onCancel={() => setPassengerModalVisible(false)}
          footer={null}
        >
          <Form
            layout="vertical"
            initialValues={editingPassenger || {}}
            onFinish={handleSavePassenger}
          >
            <Form.Item
              name="fullName"
              label="Họ và tên"
              rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
            >
              <Input size="large" />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Số điện thoại"
              rules={[
                { required: true, message: 'Vui lòng nhập số điện thoại' },
                { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ' }
              ]}
            >
              <Input size="large" />
            </Form.Item>

            <Form.Item
              name="idCard"
              label="CMND/CCCD"
              rules={[{ required: true, message: 'Vui lòng nhập CMND/CCCD' }]}
            >
              <Input size="large" />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" size="large">
                  {editingPassenger ? 'Cập nhật' : 'Thêm'}
                </Button>
                <Button size="large" onClick={() => setPassengerModalVisible(false)}>
                  Hủy
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default MyProfile;
