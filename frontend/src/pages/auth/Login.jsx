import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, Card, Tabs, message, Divider } from 'antd';
import { UserOutlined, LockOutlined, PhoneOutlined, ShopOutlined } from '@ant-design/icons';
import { loginStart, loginSuccess, loginFailure } from '../../redux/slices/authSlice';
import authService from '../../services/authService';

const { TabPane } = Tabs;

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('customer');

  const handleCustomerLogin = async (values) => {
    try {
      dispatch(loginStart());
      const response = await authService.login(values);

      if (response.success) {
        dispatch(loginSuccess({
          user: response.data.user,
          tokens: response.data.tokens,
        }));
        message.success('Đăng nhập thành công!');
        navigate('/');
      } else {
        dispatch(loginFailure(response.message));
        message.error(response.message || 'Đăng nhập thất bại!');
      }
    } catch (error) {
      dispatch(loginFailure(error.response?.data?.message || 'Đăng nhập thất bại!'));
      message.error(error.response?.data?.message || 'Đăng nhập thất bại!');
    }
  };

  const handleOperatorLogin = async (values) => {
    try {
      dispatch(loginStart());
      const response = await authService.operatorLogin(values);

      if (response.success) {
        dispatch(loginSuccess({
          user: response.data.operator,
          tokens: response.data.tokens,
        }));
        message.success('Đăng nhập thành công!');
        navigate('/operator/dashboard');
      } else {
        dispatch(loginFailure(response.message));
        message.error(response.message || 'Đăng nhập thất bại!');
      }
    } catch (error) {
      dispatch(loginFailure(error.response?.data?.message || 'Đăng nhập thất bại!'));
      message.error(error.response?.data?.message || 'Đăng nhập thất bại!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-xl">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Đăng nhập</h2>
          <p className="mt-2 text-sm text-gray-600">
            Chào mừng bạn đến với Te_QuickRide
          </p>
        </div>

        <Tabs activeKey={activeTab} onChange={setActiveTab} centered>
          <TabPane
            tab={
              <span>
                <UserOutlined />
                Khách hàng
              </span>
            }
            key="customer"
          >
            <Form
              name="customer_login"
              onFinish={handleCustomerLogin}
              layout="vertical"
              requiredMark={false}
            >
              <Form.Item
                label="Số điện thoại"
                name="phoneNumber"
                rules={[
                  { required: true, message: 'Vui lòng nhập số điện thoại!' },
                  { pattern: /^(0|\+84)[0-9]{9}$/, message: 'Số điện thoại không hợp lệ!' }
                ]}
              >
                <Input
                  prefix={<PhoneOutlined className="text-gray-400" />}
                  placeholder="0xxx xxx xxx"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu!' },
                  { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-400" />}
                  placeholder="Nhập mật khẩu"
                  size="large"
                />
              </Form.Item>

              <div className="flex justify-between items-center mb-4">
                <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">
                  Quên mật khẩu?
                </Link>
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
                  Đăng nhập
                </Button>
              </Form.Item>

              <Divider plain>Hoặc</Divider>

              <div className="text-center">
                <span className="text-gray-600">Chưa có tài khoản? </span>
                <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium">
                  Đăng ký ngay
                </Link>
              </div>
            </Form>
          </TabPane>

          <TabPane
            tab={
              <span>
                <ShopOutlined />
                Nhà xe
              </span>
            }
            key="operator"
          >
            <Form
              name="operator_login"
              onFinish={handleOperatorLogin}
              layout="vertical"
              requiredMark={false}
            >
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email!' },
                  { type: 'email', message: 'Email không hợp lệ!' }
                ]}
              >
                <Input
                  prefix={<UserOutlined className="text-gray-400" />}
                  placeholder="email@example.com"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu!' },
                  { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-400" />}
                  placeholder="Nhập mật khẩu"
                  size="large"
                />
              </Form.Item>

              <div className="flex justify-between items-center mb-4">
                <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">
                  Quên mật khẩu?
                </Link>
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
                  Đăng nhập
                </Button>
              </Form.Item>

              <Divider plain>Hoặc</Divider>

              <div className="text-center">
                <span className="text-gray-600">Chưa đăng ký? </span>
                <Link to="/operator/register" className="text-blue-600 hover:text-blue-800 font-medium">
                  Đăng ký nhà xe
                </Link>
              </div>
            </Form>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default Login;
