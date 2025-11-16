import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, Card, message, DatePicker, Select, Divider } from 'antd';
import { UserOutlined, LockOutlined, PhoneOutlined, MailOutlined, ManOutlined, WomanOutlined } from '@ant-design/icons';
import authService from '../../services/authService';
import dayjs from 'dayjs';

const { Option } = Select;

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleRegister = async (values) => {
    try {
      setLoading(true);

      // Format data for backend
      const { confirmPassword, phoneNumber, ...restValues } = values;
      const formattedValues = {
        ...restValues,
        phone: phoneNumber, // Rename phoneNumber to phone for backend
        dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : undefined,
      };

      const response = await authService.register(formattedValues);

      if (response.success) {
        message.success('Đăng ký thành công! Vui lòng đăng nhập.');
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
      <Card className="w-full max-w-2xl shadow-xl">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Đăng ký tài khoản</h2>
          <p className="mt-2 text-sm text-gray-600">
            Tạo tài khoản để đặt vé xe dễ dàng hơn
          </p>
        </div>

        <Form
          form={form}
          name="register"
          onFinish={handleRegister}
          layout="vertical"
          requiredMark={false}
          scrollToFirstError
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="Họ và tên"
              name="fullName"
              rules={[
                { required: true, message: 'Vui lòng nhập họ và tên!' },
                { min: 2, message: 'Họ và tên phải có ít nhất 2 ký tự!' }
              ]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="Nguyễn Văn A"
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
              placeholder="email@example.com"
              size="large"
            />
          </Form.Item>

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="Giới tính"
              name="gender"
              rules={[
                { required: true, message: 'Vui lòng chọn giới tính!' }
              ]}
            >
              <Select placeholder="Chọn giới tính" size="large">
                <Option value="male">
                  <ManOutlined /> Nam
                </Option>
                <Option value="female">
                  <WomanOutlined /> Nữ
                </Option>
                <Option value="other">Khác</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Ngày sinh"
              name="dateOfBirth"
              rules={[
                { required: true, message: 'Vui lòng chọn ngày sinh!' }
              ]}
            >
              <DatePicker
                placeholder="Chọn ngày sinh"
                size="large"
                format="DD/MM/YYYY"
                disabledDate={(current) => {
                  return current && current > dayjs().subtract(5, 'year');
                }}
                className="w-full"
              />
            </Form.Item>
          </div>

          <Form.Item
            label="Địa chỉ"
            name="address"
          >
            <Input.TextArea
              placeholder="Số nhà, đường, quận/huyện, tỉnh/thành phố"
              rows={2}
            />
          </Form.Item>

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

export default Register;
