import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Layout, Menu, Dropdown, Avatar, Button, Badge } from 'antd';
import {
  UserOutlined,
  LogoutOutlined,
  BookOutlined,
  CreditCardOutlined,
  SettingOutlined,
  DashboardOutlined,
  CarOutlined,
} from '@ant-design/icons';
import { logout } from '../../redux/slices/authSlice';

const { Header: AntHeader } = Layout;

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [current, setCurrent] = useState('home');

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Thông tin cá nhân',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'bookings',
      icon: <BookOutlined />,
      label: 'Vé của tôi',
      onClick: () => navigate('/my-bookings'),
    },
    {
      key: 'tickets',
      icon: <CreditCardOutlined />,
      label: 'Lịch sử thanh toán',
      onClick: () => navigate('/my-tickets'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      onClick: handleLogout,
      danger: true,
    },
  ];

  const operatorMenuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Bảng điều khiển',
      onClick: () => navigate('/operator/dashboard'),
    },
    {
      key: 'trips',
      icon: <CarOutlined />,
      label: 'Quản lý chuyến xe',
      onClick: () => navigate('/operator/trips'),
    },
    {
      key: 'bookings',
      icon: <BookOutlined />,
      label: 'Quản lý đặt vé',
      onClick: () => navigate('/operator/bookings'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Cài đặt',
      onClick: () => navigate('/operator/settings'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      onClick: handleLogout,
      danger: true,
    },
  ];

  const menuItems = user?.role === 'operator' ? operatorMenuItems : userMenuItems;

  const publicMenuItems = [
    {
      key: 'home',
      label: <Link to="/">Trang chủ</Link>,
    },
    {
      key: 'routes',
      label: <Link to="/routes">Tuyến xe</Link>,
    },
    {
      key: 'about',
      label: <Link to="/about">Giới thiệu</Link>,
    },
    {
      key: 'contact',
      label: <Link to="/contact">Liên hệ</Link>,
    },
  ];

  return (
    <AntHeader className="bg-white shadow-md fixed top-0 left-0 right-0 z-50 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-full">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <div className="text-2xl font-bold text-blue-600 flex items-center">
            <CarOutlined className="mr-2" />
            Te_QuickRide
          </div>
        </Link>

        {/* Navigation Menu */}
        <div className="hidden md:flex flex-1 justify-center">
          <Menu
            onClick={(e) => setCurrent(e.key)}
            selectedKeys={[current]}
            mode="horizontal"
            items={publicMenuItems}
            className="border-0 bg-transparent"
          />
        </div>

        {/* User Section */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <Dropdown
              menu={{ items: menuItems }}
              placement="bottomRight"
              trigger={['click']}
            >
              <div className="flex items-center cursor-pointer hover:bg-gray-100 px-3 py-2 rounded-lg transition">
                <Avatar
                  icon={<UserOutlined />}
                  src={user?.avatar}
                  className="bg-blue-600"
                />
                <span className="ml-2 text-gray-700 hidden md:inline-block">
                  {user?.fullName || user?.companyName}
                </span>
              </div>
            </Dropdown>
          ) : (
            <div className="flex space-x-2">
              <Button
                type="default"
                onClick={() => navigate('/login')}
              >
                Đăng nhập
              </Button>
              <Button
                type="primary"
                onClick={() => navigate('/register')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Đăng ký
              </Button>
            </div>
          )}
        </div>
      </div>
    </AntHeader>
  );
};

export default Header;
