import { Alert, Button } from 'antd';
import { ReloadOutlined, HomeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const ErrorMessage = ({
  message = 'Đã có lỗi xảy ra',
  description,
  showRetry = false,
  onRetry,
  showHome = false,
  type = 'error',
  fullScreen = false,
}) => {
  const navigate = useNavigate();

  const actions = (
    <div className="flex space-x-2 mt-4">
      {showRetry && onRetry && (
        <Button
          type="primary"
          icon={<ReloadOutlined />}
          onClick={onRetry}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Thử lại
        </Button>
      )}
      {showHome && (
        <Button
          icon={<HomeOutlined />}
          onClick={() => navigate('/')}
        >
          Về trang chủ
        </Button>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">😞</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{message}</h2>
            {description && (
              <p className="text-gray-600">{description}</p>
            )}
          </div>
          {(showRetry || showHome) && actions}
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4">
      <Alert
        message={message}
        description={
          <>
            {description && <p className="mb-2">{description}</p>}
            {(showRetry || showHome) && actions}
          </>
        }
        type={type}
        showIcon
        className="max-w-2xl mx-auto"
      />
    </div>
  );
};

export default ErrorMessage;
