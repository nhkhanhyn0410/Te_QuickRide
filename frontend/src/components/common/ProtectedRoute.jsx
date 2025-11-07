import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { message } from 'antd';

const ProtectedRoute = ({ children, requireAuth = true, requireRole = null }) => {
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Check authentication
  if (requireAuth && !isAuthenticated) {
    message.warning('Vui lòng đăng nhập để tiếp tục');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role if specified
  if (requireRole && user?.role !== requireRole) {
    message.error('Bạn không có quyền truy cập trang này');
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
