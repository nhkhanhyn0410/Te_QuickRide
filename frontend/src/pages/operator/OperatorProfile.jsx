import { useState } from 'react';
import {
  Card,
  Tabs,
  Form,
  Input,
  Button,
  Upload,
  message,
  Typography,
  Row,
  Col,
  Tag,
  Divider,
  Select
} from 'antd';
import {
  ShopOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  BankOutlined,
  UploadOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  LockOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

const OperatorProfile = () => {
  const [loading, setLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');
  const [companyInfo] = useState({
    name: 'Nhà xe Phương Trang',
    email: 'phuongtrang@example.com',
    phone: '1900 6067',
    website: 'https://phuongtrang.com',
    description: 'Nhà xe uy tín với hơn 20 năm kinh nghiệm trong lĩnh vực vận tải hành khách',
    businessLicense: 'GPKD số 0123456789',
    taxCode: 'MST 0123456789',
    address: {
      street: '272 Đề Thám',
      ward: 'Phường Phạm Ngũ Lão',
      district: 'Quận 1',
      city: 'TP. Hồ Chí Minh'
    },
    bankAccount: {
      bankName: 'Vietcombank',
      accountNumber: '0123456789',
      accountHolder: 'CÔNG TY TNHH PHƯƠNG TRANG'
    },
    verificationStatus: 'approved',
    verifiedAt: '2024-01-01',
    rating: 4.8,
    totalTrips: 1234,
    totalRevenue: 456789000
  });

  const handleUpdateCompanyInfo = async (values) => {
    setLoading(true);
    try {
      // TODO: Integrate with API
      console.log('Update company info:', values);
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success('Cập nhật thông tin thành công!');
    } catch (error) {
      message.error('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAddress = async (values) => {
    setLoading(true);
    try {
      console.log('Update address:', values);
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success('Cập nhật địa chỉ thành công!');
    } catch (error) {
      message.error('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBankAccount = async (values) => {
    setLoading(true);
    try {
      console.log('Update bank account:', values);
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success('Cập nhật tài khoản ngân hàng thành công!');
    } catch (error) {
      message.error('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (values) => {
    setLoading(true);
    try {
      console.log('Change password:', values);
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success('Đổi mật khẩu thành công!');
    } catch (error) {
      message.error('Mật khẩu hiện tại không đúng.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoChange = (info) => {
    if (info.file.status === 'done') {
      setLogoUrl(info.file.response.url);
      message.success('Cập nhật logo thành công!');
    }
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
      approved: 'Đã xác minh',
      rejected: 'Bị từ chối'
    };
    return texts[status] || status;
  };

  const getVerificationStatusIcon = (status) => {
    const icons = {
      pending: <ClockCircleOutlined />,
      approved: <CheckCircleOutlined />,
      rejected: <CloseCircleOutlined />
    };
    return icons[status] || null;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Title level={2} className="mb-6">Thông tin nhà xe</Title>

        {/* Verification Status Banner */}
        <Card className={`mb-6 shadow-md ${
          companyInfo.verificationStatus === 'approved' ? 'bg-green-50 border-green-200' :
          companyInfo.verificationStatus === 'pending' ? 'bg-orange-50 border-orange-200' :
          'bg-red-50 border-red-200'
        }`}>
          <Row gutter={16} align="middle">
            <Col flex="auto">
              <div className="flex items-center gap-3">
                <div className="text-2xl">
                  {getVerificationStatusIcon(companyInfo.verificationStatus)}
                </div>
                <div>
                  <Title level={4} className="!mb-1">
                    Trạng thái xác minh:{' '}
                    <Tag color={getVerificationStatusColor(companyInfo.verificationStatus)} className="text-base">
                      {getVerificationStatusText(companyInfo.verificationStatus)}
                    </Tag>
                  </Title>
                  {companyInfo.verificationStatus === 'approved' && (
                    <Text type="secondary">
                      Đã xác minh vào ngày {companyInfo.verifiedAt}
                    </Text>
                  )}
                  {companyInfo.verificationStatus === 'pending' && (
                    <Text type="secondary">
                      Hồ sơ của bạn đang được xem xét. Quá trình này có thể mất 1-3 ngày làm việc.
                    </Text>
                  )}
                </div>
              </div>
            </Col>
            <Col>
              <div className="text-right">
                <div className="text-sm text-gray-600 mb-1">Đánh giá</div>
                <div className="text-2xl font-bold text-yellow-600">★ {companyInfo.rating}</div>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Tabs */}
        <Card className="shadow-md">
          <Tabs defaultActiveKey="1" size="large">
            {/* Company Info Tab */}
            <TabPane tab={<span><ShopOutlined />Thông tin công ty</span>} key="1">
              <Form
                layout="vertical"
                initialValues={companyInfo}
                onFinish={handleUpdateCompanyInfo}
              >
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="name"
                      label="Tên nhà xe"
                      rules={[{ required: true, message: 'Vui lòng nhập tên nhà xe' }]}
                    >
                      <Input size="large" prefix={<ShopOutlined />} />
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
                      rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                    >
                      <Input size="large" prefix={<PhoneOutlined />} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item name="website" label="Website">
                      <Input size="large" placeholder="https://example.com" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item name="description" label="Mô tả">
                  <TextArea
                    rows={4}
                    placeholder="Giới thiệu về nhà xe của bạn..."
                    maxLength={500}
                    showCount
                  />
                </Form.Item>

                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item name="businessLicense" label="Giấy phép kinh doanh">
                      <Input size="large" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item name="taxCode" label="Mã số thuế">
                      <Input size="large" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item label="Logo">
                  <Upload
                    showUploadList={false}
                    onChange={handleLogoChange}
                  >
                    <Button icon={<UploadOutlined />} size="large">
                      Tải logo lên
                    </Button>
                  </Upload>
                  <Text type="secondary" className="block mt-2">
                    Định dạng: JPG, PNG. Kích thước tối đa: 2MB
                  </Text>
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" size="large" loading={loading}>
                    Cập nhật thông tin
                  </Button>
                </Form.Item>
              </Form>
            </TabPane>

            {/* Address Tab */}
            <TabPane tab={<span><EnvironmentOutlined />Địa chỉ</span>} key="2">
              <Form
                layout="vertical"
                initialValues={companyInfo.address}
                onFinish={handleUpdateAddress}
              >
                <Form.Item
                  name="street"
                  label="Số nhà, đường"
                  rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                >
                  <Input size="large" placeholder="272 Đề Thám" />
                </Form.Item>

                <Row gutter={16}>
                  <Col xs={24} md={8}>
                    <Form.Item
                      name="ward"
                      label="Phường/Xã"
                      rules={[{ required: true, message: 'Vui lòng nhập phường/xã' }]}
                    >
                      <Input size="large" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item
                      name="district"
                      label="Quận/Huyện"
                      rules={[{ required: true, message: 'Vui lòng nhập quận/huyện' }]}
                    >
                      <Input size="large" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item
                      name="city"
                      label="Tỉnh/Thành phố"
                      rules={[{ required: true, message: 'Vui lòng chọn tỉnh/thành phố' }]}
                    >
                      <Select size="large" showSearch>
                        <Option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</Option>
                        <Option value="Hà Nội">Hà Nội</Option>
                        <Option value="Đà Nẵng">Đà Nẵng</Option>
                        <Option value="Cần Thơ">Cần Thơ</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item>
                  <Button type="primary" htmlType="submit" size="large" loading={loading}>
                    Cập nhật địa chỉ
                  </Button>
                </Form.Item>
              </Form>
            </TabPane>

            {/* Bank Account Tab */}
            <TabPane tab={<span><BankOutlined />Tài khoản ngân hàng</span>} key="3">
              <Form
                layout="vertical"
                initialValues={companyInfo.bankAccount}
                onFinish={handleUpdateBankAccount}
              >
                <Form.Item
                  name="bankName"
                  label="Ngân hàng"
                  rules={[{ required: true, message: 'Vui lòng chọn ngân hàng' }]}
                >
                  <Select size="large" showSearch>
                    <Option value="Vietcombank">Vietcombank</Option>
                    <Option value="VietinBank">VietinBank</Option>
                    <Option value="BIDV">BIDV</Option>
                    <Option value="Techcombank">Techcombank</Option>
                    <Option value="MB Bank">MB Bank</Option>
                    <Option value="ACB">ACB</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  name="accountNumber"
                  label="Số tài khoản"
                  rules={[{ required: true, message: 'Vui lòng nhập số tài khoản' }]}
                >
                  <Input size="large" placeholder="0123456789" />
                </Form.Item>

                <Form.Item
                  name="accountHolder"
                  label="Tên chủ tài khoản"
                  rules={[{ required: true, message: 'Vui lòng nhập tên chủ tài khoản' }]}
                >
                  <Input size="large" placeholder="CÔNG TY TNHH..." />
                </Form.Item>

                <Paragraph type="secondary" className="bg-blue-50 p-4 rounded">
                  <strong>Lưu ý:</strong> Tài khoản ngân hàng được sử dụng để nhận thanh toán từ khách hàng.
                  Vui lòng đảm bảo thông tin chính xác.
                </Paragraph>

                <Form.Item>
                  <Button type="primary" htmlType="submit" size="large" loading={loading}>
                    Cập nhật tài khoản
                  </Button>
                </Form.Item>
              </Form>
            </TabPane>

            {/* Change Password Tab */}
            <TabPane tab={<span><LockOutlined />Đổi mật khẩu</span>} key="4">
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

            {/* Verification Status Tab */}
            <TabPane tab={<span><CheckCircleOutlined />Trạng thái xác minh</span>} key="5">
              <Card className="bg-gray-50">
                <Title level={4} className="mb-4">Thông tin xác minh</Title>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Text>Trạng thái</Text>
                    <Tag color={getVerificationStatusColor(companyInfo.verificationStatus)} className="text-base px-3 py-1">
                      {getVerificationStatusIcon(companyInfo.verificationStatus)}
                      {' '}{getVerificationStatusText(companyInfo.verificationStatus)}
                    </Tag>
                  </div>

                  {companyInfo.verificationStatus === 'approved' && (
                    <div className="flex justify-between">
                      <Text>Ngày xác minh</Text>
                      <Text strong>{companyInfo.verifiedAt}</Text>
                    </div>
                  )}

                  <Divider />

                  <div className="flex justify-between">
                    <Text>Tổng số chuyến</Text>
                    <Text strong>{companyInfo.totalTrips.toLocaleString('vi-VN')}</Text>
                  </div>

                  <div className="flex justify-between">
                    <Text>Tổng doanh thu</Text>
                    <Text strong className="text-green-600">
                      {(companyInfo.totalRevenue / 1000000).toFixed(0)}M đ
                    </Text>
                  </div>

                  <div className="flex justify-between">
                    <Text>Đánh giá trung bình</Text>
                    <Text strong className="text-yellow-600">★ {companyInfo.rating}</Text>
                  </div>
                </div>

                <Divider />

                {companyInfo.verificationStatus === 'pending' && (
                  <Paragraph className="bg-orange-50 p-4 rounded">
                    <strong>Hồ sơ đang chờ duyệt</strong><br />
                    Vui lòng đảm bảo tất cả thông tin đã được điền đầy đủ và chính xác.
                    Quá trình xác minh có thể mất 1-3 ngày làm việc.
                  </Paragraph>
                )}

                {companyInfo.verificationStatus === 'approved' && (
                  <Paragraph className="bg-green-50 p-4 rounded">
                    <strong>Tài khoản đã được xác minh</strong><br />
                    Bạn có thể tạo chuyến đi và nhận booking từ khách hàng.
                  </Paragraph>
                )}
              </Card>
            </TabPane>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default OperatorProfile;
