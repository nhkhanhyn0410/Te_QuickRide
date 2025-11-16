import { useState } from 'react';
import {
  Card,
  Tabs,
  Form,
  Input,
  InputNumber,
  Switch,
  Button,
  message,
  Space,
  Divider,
  Typography,
  Select,
  Row,
  Col,
  Upload,
  Alert
} from 'antd';
import {
  SaveOutlined,
  SettingOutlined,
  DollarOutlined,
  MailOutlined,
  BellOutlined,
  SafetyOutlined,
  UploadOutlined,
  ReloadOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [generalForm] = Form.useForm();
  const [commissionForm] = Form.useForm();
  const [emailForm] = Form.useForm();
  const [notificationForm] = Form.useForm();
  const [securityForm] = Form.useForm();

  // Mock initial data
  const initialGeneralSettings = {
    systemName: 'Te_QuickRide',
    systemEmail: 'admin@tequickride.com',
    supportPhone: '1900 1234',
    supportEmail: 'support@tequickride.com',
    address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
    description: 'Hệ thống đặt vé xe khách trực tuyến hàng đầu Việt Nam',
    timezone: 'Asia/Ho_Chi_Minh',
    currency: 'VND',
    defaultLanguage: 'vi',
    maintenanceMode: false
  };

  const initialCommissionSettings = {
    defaultCommissionRate: 8.5,
    minCommission: 5.0,
    maxCommission: 15.0,
    autoApproveOperators: false,
    requireVerification: true,
    minOperatorRating: 4.0
  };

  const initialEmailSettings = {
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUser: 'noreply@tequickride.com',
    smtpPassword: '********',
    fromEmail: 'noreply@tequickride.com',
    fromName: 'Te_QuickRide',
    enableEmailNotifications: true
  };

  const initialNotificationSettings = {
    newBookingNotification: true,
    cancellationNotification: true,
    paymentNotification: true,
    reviewNotification: true,
    systemUpdateNotification: true,
    marketingEmails: false,
    smsNotifications: true
  };

  const initialSecuritySettings = {
    requireEmailVerification: true,
    requirePhoneVerification: false,
    twoFactorAuth: false,
    passwordMinLength: 8,
    sessionTimeout: 60,
    maxLoginAttempts: 5,
    enableCaptcha: true
  };

  const handleSaveGeneral = async (values) => {
    setLoading(true);
    // TODO: Integrate with API
    console.log('General settings:', values);
    setTimeout(() => {
      message.success('Đã lưu cài đặt chung');
      setLoading(false);
    }, 1000);
  };

  const handleSaveCommission = async (values) => {
    setLoading(true);
    // TODO: Integrate with API
    console.log('Commission settings:', values);
    setTimeout(() => {
      message.success('Đã lưu cài đặt hoa hồng');
      setLoading(false);
    }, 1000);
  };

  const handleSaveEmail = async (values) => {
    setLoading(true);
    // TODO: Integrate with API
    console.log('Email settings:', values);
    setTimeout(() => {
      message.success('Đã lưu cài đặt email');
      setLoading(false);
    }, 1000);
  };

  const handleSaveNotification = async (values) => {
    setLoading(true);
    // TODO: Integrate with API
    console.log('Notification settings:', values);
    setTimeout(() => {
      message.success('Đã lưu cài đặt thông báo');
      setLoading(false);
    }, 1000);
  };

  const handleSaveSecurity = async (values) => {
    setLoading(true);
    // TODO: Integrate with API
    console.log('Security settings:', values);
    setTimeout(() => {
      message.success('Đã lưu cài đặt bảo mật');
      setLoading(false);
    }, 1000);
  };

  const handleTestEmail = () => {
    message.loading('Đang gửi email test...', 2);
    setTimeout(() => {
      message.success('Đã gửi email test thành công!');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Title level={2}>
            <SettingOutlined /> Cài đặt Hệ thống
          </Title>
          <Text type="secondary">
            Quản lý cấu hình và tham số của hệ thống
          </Text>
        </div>

        {/* Settings Tabs */}
        <Card className="shadow-lg">
          <Tabs defaultActiveKey="general" size="large">
            {/* General Settings */}
            <TabPane tab="Cài đặt chung" key="general">
              <Form
                form={generalForm}
                layout="vertical"
                initialValues={initialGeneralSettings}
                onFinish={handleSaveGeneral}
              >
                <Alert
                  message="Lưu ý"
                  description="Các thay đổi sẽ ảnh hưởng đến toàn bộ hệ thống. Vui lòng kiểm tra kỹ trước khi lưu."
                  type="info"
                  showIcon
                  className="mb-6"
                />

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="systemName"
                      label="Tên hệ thống"
                      rules={[{ required: true, message: 'Vui lòng nhập tên hệ thống' }]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="systemEmail"
                      label="Email hệ thống"
                      rules={[
                        { required: true, message: 'Vui lòng nhập email' },
                        { type: 'email', message: 'Email không hợp lệ' }
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="supportPhone"
                      label="Số điện thoại hỗ trợ"
                      rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="supportEmail"
                      label="Email hỗ trợ"
                      rules={[
                        { required: true, message: 'Vui lòng nhập email' },
                        { type: 'email', message: 'Email không hợp lệ' }
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name="address"
                  label="Địa chỉ"
                  rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="description"
                  label="Mô tả hệ thống"
                >
                  <TextArea rows={3} />
                </Form.Item>

                <Row gutter={16}>
                  <Col span={8}>
                    <Form.Item name="timezone" label="Múi giờ">
                      <Select>
                        <Option value="Asia/Ho_Chi_Minh">Việt Nam (GMT+7)</Option>
                        <Option value="Asia/Bangkok">Thailand (GMT+7)</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item name="currency" label="Tiền tệ">
                      <Select>
                        <Option value="VND">VND (₫)</Option>
                        <Option value="USD">USD ($)</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item name="defaultLanguage" label="Ngôn ngữ mặc định">
                      <Select>
                        <Option value="vi">Tiếng Việt</Option>
                        <Option value="en">English</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name="maintenanceMode"
                  label="Chế độ bảo trì"
                  valuePropName="checked"
                >
                  <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
                </Form.Item>

                <Form.Item>
                  <Space>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      icon={<SaveOutlined />}
                    >
                      Lưu cài đặt
                    </Button>
                    <Button icon={<ReloadOutlined />} onClick={() => generalForm.resetFields()}>
                      Đặt lại
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </TabPane>

            {/* Commission Settings */}
            <TabPane tab={<span><DollarOutlined /> Hoa hồng</span>} key="commission">
              <Form
                form={commissionForm}
                layout="vertical"
                initialValues={initialCommissionSettings}
                onFinish={handleSaveCommission}
              >
                <Alert
                  message="Cài đặt hoa hồng"
                  description="Điều chỉnh tỷ lệ hoa hồng và chính sách duyệt nhà xe."
                  type="info"
                  showIcon
                  className="mb-6"
                />

                <Row gutter={16}>
                  <Col span={8}>
                    <Form.Item
                      name="defaultCommissionRate"
                      label="Tỷ lệ hoa hồng mặc định (%)"
                      rules={[{ required: true, message: 'Vui lòng nhập tỷ lệ' }]}
                    >
                      <InputNumber
                        min={0}
                        max={100}
                        step={0.1}
                        style={{ width: '100%' }}
                        formatter={value => `${value}%`}
                        parser={value => value.replace('%', '')}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name="minCommission"
                      label="Hoa hồng tối thiểu (%)"
                      rules={[{ required: true, message: 'Vui lòng nhập tỷ lệ' }]}
                    >
                      <InputNumber
                        min={0}
                        max={100}
                        step={0.1}
                        style={{ width: '100%' }}
                        formatter={value => `${value}%`}
                        parser={value => value.replace('%', '')}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name="maxCommission"
                      label="Hoa hồng tối đa (%)"
                      rules={[{ required: true, message: 'Vui lòng nhập tỷ lệ' }]}
                    >
                      <InputNumber
                        min={0}
                        max={100}
                        step={0.1}
                        style={{ width: '100%' }}
                        formatter={value => `${value}%`}
                        parser={value => value.replace('%', '')}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name="minOperatorRating"
                  label="Đánh giá tối thiểu của nhà xe"
                  rules={[{ required: true, message: 'Vui lòng nhập đánh giá' }]}
                >
                  <InputNumber
                    min={0}
                    max={5}
                    step={0.1}
                    style={{ width: '200px' }}
                  />
                </Form.Item>

                <Divider />

                <Form.Item
                  name="autoApproveOperators"
                  label="Tự động duyệt nhà xe mới"
                  valuePropName="checked"
                >
                  <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
                </Form.Item>

                <Form.Item
                  name="requireVerification"
                  label="Yêu cầu xác minh nhà xe"
                  valuePropName="checked"
                >
                  <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
                </Form.Item>

                <Form.Item>
                  <Space>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      icon={<SaveOutlined />}
                    >
                      Lưu cài đặt
                    </Button>
                    <Button icon={<ReloadOutlined />} onClick={() => commissionForm.resetFields()}>
                      Đặt lại
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </TabPane>

            {/* Email Settings */}
            <TabPane tab={<span><MailOutlined /> Email</span>} key="email">
              <Form
                form={emailForm}
                layout="vertical"
                initialValues={initialEmailSettings}
                onFinish={handleSaveEmail}
              >
                <Alert
                  message="Cài đặt SMTP"
                  description="Cấu hình máy chủ email để gửi thông báo cho người dùng."
                  type="info"
                  showIcon
                  className="mb-6"
                />

                <Row gutter={16}>
                  <Col span={16}>
                    <Form.Item
                      name="smtpHost"
                      label="SMTP Host"
                      rules={[{ required: true, message: 'Vui lòng nhập SMTP host' }]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name="smtpPort"
                      label="SMTP Port"
                      rules={[{ required: true, message: 'Vui lòng nhập port' }]}
                    >
                      <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="smtpUser"
                      label="SMTP Username"
                      rules={[{ required: true, message: 'Vui lòng nhập username' }]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="smtpPassword"
                      label="SMTP Password"
                      rules={[{ required: true, message: 'Vui lòng nhập password' }]}
                    >
                      <Input.Password />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="fromEmail"
                      label="From Email"
                      rules={[
                        { required: true, message: 'Vui lòng nhập email' },
                        { type: 'email', message: 'Email không hợp lệ' }
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="fromName"
                      label="From Name"
                      rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name="enableEmailNotifications"
                  label="Bật thông báo email"
                  valuePropName="checked"
                >
                  <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
                </Form.Item>

                <Form.Item>
                  <Space>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      icon={<SaveOutlined />}
                    >
                      Lưu cài đặt
                    </Button>
                    <Button onClick={handleTestEmail}>
                      Gửi email test
                    </Button>
                    <Button icon={<ReloadOutlined />} onClick={() => emailForm.resetFields()}>
                      Đặt lại
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </TabPane>

            {/* Notification Settings */}
            <TabPane tab={<span><BellOutlined /> Thông báo</span>} key="notification">
              <Form
                form={notificationForm}
                layout="vertical"
                initialValues={initialNotificationSettings}
                onFinish={handleSaveNotification}
              >
                <Alert
                  message="Cài đặt thông báo"
                  description="Tùy chỉnh các loại thông báo gửi đến người dùng."
                  type="info"
                  showIcon
                  className="mb-6"
                />

                <Title level={5}>Thông báo giao dịch</Title>
                <Form.Item
                  name="newBookingNotification"
                  label="Thông báo booking mới"
                  valuePropName="checked"
                >
                  <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
                </Form.Item>

                <Form.Item
                  name="cancellationNotification"
                  label="Thông báo hủy booking"
                  valuePropName="checked"
                >
                  <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
                </Form.Item>

                <Form.Item
                  name="paymentNotification"
                  label="Thông báo thanh toán"
                  valuePropName="checked"
                >
                  <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
                </Form.Item>

                <Divider />

                <Title level={5}>Thông báo khác</Title>
                <Form.Item
                  name="reviewNotification"
                  label="Thông báo đánh giá mới"
                  valuePropName="checked"
                >
                  <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
                </Form.Item>

                <Form.Item
                  name="systemUpdateNotification"
                  label="Thông báo cập nhật hệ thống"
                  valuePropName="checked"
                >
                  <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
                </Form.Item>

                <Form.Item
                  name="marketingEmails"
                  label="Email marketing"
                  valuePropName="checked"
                >
                  <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
                </Form.Item>

                <Form.Item
                  name="smsNotifications"
                  label="Thông báo SMS"
                  valuePropName="checked"
                >
                  <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
                </Form.Item>

                <Form.Item>
                  <Space>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      icon={<SaveOutlined />}
                    >
                      Lưu cài đặt
                    </Button>
                    <Button icon={<ReloadOutlined />} onClick={() => notificationForm.resetFields()}>
                      Đặt lại
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </TabPane>

            {/* Security Settings */}
            <TabPane tab={<span><SafetyOutlined /> Bảo mật</span>} key="security">
              <Form
                form={securityForm}
                layout="vertical"
                initialValues={initialSecuritySettings}
                onFinish={handleSaveSecurity}
              >
                <Alert
                  message="Cài đặt bảo mật"
                  description="Tăng cường bảo mật cho hệ thống và tài khoản người dùng."
                  type="warning"
                  showIcon
                  className="mb-6"
                />

                <Title level={5}>Xác thực</Title>
                <Form.Item
                  name="requireEmailVerification"
                  label="Yêu cầu xác thực email"
                  valuePropName="checked"
                >
                  <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
                </Form.Item>

                <Form.Item
                  name="requirePhoneVerification"
                  label="Yêu cầu xác thực số điện thoại"
                  valuePropName="checked"
                >
                  <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
                </Form.Item>

                <Form.Item
                  name="twoFactorAuth"
                  label="Xác thực 2 yếu tố (2FA)"
                  valuePropName="checked"
                >
                  <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
                </Form.Item>

                <Divider />

                <Title level={5}>Mật khẩu & Phiên</Title>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="passwordMinLength"
                      label="Độ dài mật khẩu tối thiểu"
                      rules={[{ required: true, message: 'Vui lòng nhập độ dài' }]}
                    >
                      <InputNumber min={6} max={32} style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="maxLoginAttempts"
                      label="Số lần đăng nhập sai tối đa"
                      rules={[{ required: true, message: 'Vui lòng nhập số lần' }]}
                    >
                      <InputNumber min={3} max={10} style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name="sessionTimeout"
                  label="Thời gian hết phiên (phút)"
                  rules={[{ required: true, message: 'Vui lòng nhập thời gian' }]}
                >
                  <InputNumber min={15} max={1440} style={{ width: '200px' }} />
                </Form.Item>

                <Form.Item
                  name="enableCaptcha"
                  label="Bật Captcha"
                  valuePropName="checked"
                >
                  <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
                </Form.Item>

                <Form.Item>
                  <Space>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      icon={<SaveOutlined />}
                    >
                      Lưu cài đặt
                    </Button>
                    <Button icon={<ReloadOutlined />} onClick={() => securityForm.resetFields()}>
                      Đặt lại
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </TabPane>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
