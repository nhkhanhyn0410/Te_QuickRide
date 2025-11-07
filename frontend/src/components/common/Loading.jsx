import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const Loading = ({ tip = 'Đang tải...', fullScreen = false, size = 'large' }) => {
  const antIcon = <LoadingOutlined style={{ fontSize: size === 'large' ? 48 : 24 }} spin />;

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
        <div className="text-center">
          <Spin indicator={antIcon} />
          <p className="mt-4 text-gray-600 text-lg">{tip}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <Spin indicator={antIcon} tip={tip} size={size} />
    </div>
  );
};

export default Loading;
