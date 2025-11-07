import { useState, useEffect } from 'react';
import { Tabs, Select, Empty, Button } from 'antd';
import { BookOutlined, ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { BookingCard } from '../../components/customer';
import { Loading, ErrorMessage } from '../../components/common';
import bookingService from '../../services/bookingService';

const { Option } = Select;

const MyBookings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    filterAndSortBookings();
  }, [bookings, activeTab, sortBy]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await bookingService.getMyBookings();

      if (response.success) {
        setBookings(response.data.bookings || []);
      } else {
        setError(response.message || 'Không thể tải danh sách đặt vé');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Đã có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortBookings = () => {
    let filtered = [...bookings];

    // Filter by status
    if (activeTab !== 'all') {
      filtered = filtered.filter(booking => booking.bookingStatus === activeTab);
    }

    // Sort bookings
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'departure':
          return new Date(a.trip?.departureTime) - new Date(b.trip?.departureTime);
        case 'price-high':
          return b.totalAmount - a.totalAmount;
        case 'price-low':
          return a.totalAmount - b.totalAmount;
        default:
          return 0;
      }
    });

    setFilteredBookings(filtered);
  };

  const tabItems = [
    {
      key: 'all',
      label: (
        <span>
          <BookOutlined />
          Tất cả
        </span>
      ),
    },
    {
      key: 'pending',
      label: (
        <span>
          <ClockCircleOutlined />
          Chờ thanh toán
        </span>
      ),
    },
    {
      key: 'confirmed',
      label: (
        <span>
          <CheckCircleOutlined />
          Đã xác nhận
        </span>
      ),
    },
    {
      key: 'cancelled',
      label: (
        <span>
          <CloseCircleOutlined />
          Đã hủy
        </span>
      ),
    },
  ];

  if (loading) {
    return <Loading tip="Đang tải danh sách đặt vé..." fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Vé của tôi</h1>
          <p className="text-gray-600">Quản lý và theo dõi các chuyến đi của bạn</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Tabs
              activeKey={activeTab}
              items={tabItems}
              onChange={setActiveTab}
              className="flex-1"
            />

            <div className="flex items-center gap-2">
              <span className="text-gray-600 text-sm">Sắp xếp:</span>
              <Select
                value={sortBy}
                onChange={setSortBy}
                style={{ width: 200 }}
              >
                <Option value="newest">Mới nhất</Option>
                <Option value="oldest">Cũ nhất</Option>
                <Option value="departure">Ngày khởi hành</Option>
                <Option value="price-high">Giá cao nhất</Option>
                <Option value="price-low">Giá thấp nhất</Option>
              </Select>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        {error ? (
          <ErrorMessage
            message="Không thể tải danh sách đặt vé"
            description={error}
            showRetry
            onRetry={fetchBookings}
          />
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12">
            <Empty
              description={
                <div className="text-center">
                  <p className="text-gray-600 mb-2">
                    {activeTab === 'all'
                      ? 'Bạn chưa có đặt vé nào'
                      : `Không có đặt vé nào ở trạng thái ${
                          activeTab === 'pending' ? 'chờ thanh toán' :
                          activeTab === 'confirmed' ? 'đã xác nhận' : 'đã hủy'
                        }`
                    }
                  </p>
                  {activeTab === 'all' && (
                    <Button
                      type="primary"
                      size="large"
                      onClick={() => navigate('/')}
                      className="bg-blue-600 hover:bg-blue-700 mt-4"
                    >
                      Đặt vé ngay
                    </Button>
                  )}
                </div>
              }
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <BookingCard key={booking._id} booking={booking} showActions />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
