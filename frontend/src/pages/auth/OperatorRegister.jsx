import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, Card, message, Upload, Divider } from 'antd';
import { ShopOutlined, LockOutlined, PhoneOutlined, MailOutlined, FileOutlined, UploadOutlined } from '@ant-design/icons';
import authService from '../../services/authService';

const OperatorRegister = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleRegister = async (values) => {
    try {
      setLoading(true);

      // Format data for operator registration (map to backend fields)
      const { confirmPassword, phoneNumber, representativeName, representativePhone, ...restValues } = values;
      const formattedValues = {
        ...restValues,
        phone: phoneNumber, // Rename phoneNumber to phone for backend
      };

      const response = await authService.operatorRegister(formattedValues);

      if (response.success) {
        message.success('Đăng ký thành công! Vui lòng chờ xác minh từ quản trị viên.');
        navigate('/login');
      } else {
        message.error(response.message || 'Đăng ký thất bại!');
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Đăng ký thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-3xl shadow-xl">
        <div className="text-center mb-6">
          <ShopOutlined className="text-5xl text-blue-600 mb-2" />
          <h2 className="text-3xl font-bold text-gray-900">Đăng ký Nhà xe</h2>
          <p className="mt-2 text-sm text-gray-600">
            Tham gia hệ thống đặt vé trực tuyến Te_QuickRide
          </p>
        </div>

        <Form
          form={form}
          name="operator_register"
          onFinish={handleRegister}
          layout="vertical"
          requiredMark={false}
          scrollToFirstError
        >
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Thông tin doanh nghiệp</h3>

            <Form.Item
              label="Tên công ty"
              name="companyName"
              rules={[
                { required: true, message: 'Vui lòng nhập tên công ty!' },
                { min: 3, message: 'Tên công ty phải có ít nhất 3 ký tự!' }
              ]}
            >
              <Input
                prefix={<ShopOutlined className="text-gray-400" />}
                placeholder="Công ty TNHH Vận tải ABC"
                size="large"
              />
            </Form.Item>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                label="Giấy phép kinh doanh"
                name="businessLicense"
                rules={[
                  { required: true, message: 'Vui lòng nhập số giấy phép!' }
                ]}
              >
                <Input
                  prefix={<FileOutlined className="text-gray-400" />}
                  placeholder="Số GPKD"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                label="Mã số thuế"
                name="taxCode"
                rules={[
                  { required: true, message: 'Vui lòng nhập mã số thuế!' },
                  { pattern: /^[0-9]{10,13}$/, message: 'Mã số thuế không hợp lệ!' }
                ]}
              >
                <Input
                  prefix={<FileOutlined className="text-gray-400" />}
                  placeholder="1234567890"
                  size="large"
                />
              </Form.Item>
            </div>

            <Form.Item
              label="Địa chỉ trụ sở"
              name="address"
              rules={[
                { required: true, message: 'Vui lòng nhập địa chỉ!' }
              ]}
            >
              <Input.TextArea
                placeholder="Số nhà, đường, quận/huyện, tỉnh/thành phố"
                rows={2}
              />
            </Form.Item>
          </div>

          <Divider />

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Thông tin liên hệ</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email!' },
                  { type: 'email', message: 'Email không hợp lệ!' }
                ]}
              >
                <Input
                  prefix={<MailOutlined className="text-gray-400" />}
                  placeholder="contact@company.com"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                label="Số điện thoại"
                name="phoneNumber"
                rules={[
                  { required: true, message: 'Vui lòng nhập số điện thoại!' },
                  { pattern: /^(0|\+84)[0-9]{9,10}$/, message: 'Số điện thoại không hợp lệ!' }
                ]}
              >
                <Input
                  prefix={<PhoneOutlined className="text-gray-400" />}
                  placeholder="0xxx xxx xxx"
                  size="large"
                />
              </Form.Item>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                label="Người đại diện"
                name="representativeName"
              >
                <Input
                  placeholder="Họ và tên (không bắt buộc)"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                label="SĐT người đại diện"
                name="representativePhone"
                rules={[
                  { pattern: /^(0|\+84)[0-9]{9,10}$/, message: 'Số điện thoại không hợp lệ!' }
                ]}
              >
                <Input
                  prefix={<PhoneOutlined className="text-gray-400" />}
                  placeholder="0xxx xxx xxx (không bắt buộc)"
                  size="large"
                />
              </Form.Item>
            </div>
          </div>

          <Divider />

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Bảo mật</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu!' },
                  { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự!' },
                  {
                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                    message: 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số!'
                  }
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-400" />}
                  placeholder="Nhập mật khẩu (min 8 ký tự)"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                label="Xác nhận mật khẩu"
                name="confirmPassword"
                dependencies={['password']}
                rules={[
                  { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-400" />}
                  placeholder="Nhập lại mật khẩu"
                  size="large"
                />
              </Form.Item>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-yellow-800">
              <strong>Lưu ý:</strong> Sau khi đăng ký, tài khoản của bạn sẽ được quản trị viên
              xem xét và xác minh trong vòng 24-48 giờ. Bạn sẽ nhận được email thông báo khi
              tài khoản được kích hoạt.
            </p>
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              block
              className="bg-blue-600 hover:bg-blue-700"
            >
              Đăng ký
            </Button>
          </Form.Item>

          <Divider plain>Hoặc</Divider>

          <div className="text-center">
            <span className="text-gray-600">Đã có tài khoản? </span>
            <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
              Đăng nhập ngay
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default OperatorRegister;
