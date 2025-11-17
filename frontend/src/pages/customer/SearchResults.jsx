import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Form, Input, DatePicker, Button, Card, Row, Col, Select, Slider, Checkbox, Empty, message, Pagination } from 'antd';
import {
  SearchOutlined,
  EnvironmentOutlined,
  FilterOutlined,
  SortAscendingOutlined,
} from '@ant-design/icons';
import { TripCard } from '../../components/customer';
import { Loading, ErrorMessage } from '../../components/common';
import tripService from '../../services/tripService';
import dayjs from 'dayjs';

const { Option } = Select;

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [error, setError] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50); // Tăng lên 50 để hiển thị nhiều chuyến hơn
  const [totalTrips, setTotalTrips] = useState(0);

  // Filter states
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [selectedBusTypes, setSelectedBusTypes] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [sortBy, setSortBy] = useState('departureTime');

  // Parse search params
  const origin = searchParams.get('from');
  const destination = searchParams.get('to');
  const departureDate = searchParams.get('date');

  useEffect(() => {
    if (origin && destination && departureDate) {
      form.setFieldsValue({
        origin,
        destination,
        departureDate: dayjs(departureDate),
      });
      setCurrentPage(1); // Reset về trang 1 khi tìm kiếm mới
      searchTrips();
    }
  }, [origin, destination, departureDate]);

  // Gọi API khi chuyển trang
  useEffect(() => {
    if (origin && destination && departureDate && currentPage > 1) {
      searchTrips();
    }
  }, [currentPage]);

  useEffect(() => {
    applyFilters();
  }, [trips, priceRange, selectedBusTypes, selectedAmenities, sortBy]);

  const searchTrips = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await tripService.searchTrips({
        origin,
        destination,
        departureDate,
        page: currentPage,
        limit: pageSize,
      });

      if (response.success) {
        setTrips(response.data || []);

        // Lưu tổng số chuyến từ pagination
        if (response.pagination) {
          setTotalTrips(response.pagination.total || 0);
        }

        // Set initial price range based on results (chỉ ở trang đầu)
        if (currentPage === 1 && response.data && response.data.length > 0) {
          const prices = response.data.map(t => t.basePrice || t.baseFare || 0);
          if (prices.length > 0) {
            setPriceRange([Math.min(...prices), Math.max(...prices)]);
          }
        }
      } else {
        setError(response.message || 'Không tìm thấy chuyến xe phù hợp');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Đã có lỗi xảy ra khi tìm kiếm');
      message.error('Đã có lỗi xảy ra khi tìm kiếm');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...trips];

    // Filter by price range
    filtered = filtered.filter(
      trip => {
        const price = trip.basePrice || trip.baseFare || 0;
        return price >= priceRange[0] && price <= priceRange[1];
      }
    );

    // Filter by bus type
    if (selectedBusTypes.length > 0) {
      filtered = filtered.filter(trip =>
        selectedBusTypes.includes(trip.bus?.type || trip.bus?.busType)
      );
    }

    // Filter by amenities
    if (selectedAmenities.length > 0) {
      filtered = filtered.filter(trip =>
        selectedAmenities.every(amenity =>
          trip.bus?.amenities?.includes(amenity) || trip.amenities?.includes(amenity)
        )
      );
    }

    // Sort trips
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return (a.basePrice || a.baseFare || 0) - (b.basePrice || b.baseFare || 0);
        case 'price-desc':
          return (b.basePrice || b.baseFare || 0) - (a.basePrice || a.baseFare || 0);
        case 'departureTime':
          return new Date(a.departureTime) - new Date(b.departureTime);
        case 'duration':
          return a.duration - b.duration;
        case 'rating':
          return (b.operator?.rating || 0) - (a.operator?.rating || 0);
        default:
          return 0;
      }
    });

    setFilteredTrips(filtered);
  };

  const handleSearch = (values) => {
    const params = new URLSearchParams({
      from: values.origin,
      to: values.destination,
      date: values.departureDate.format('YYYY-MM-DD'),
    });
    navigate(`/search?${params.toString()}`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const busTypes = ['Giường nằm', 'Ghế ngồi', 'Limousine', 'VIP'];
  const amenities = ['Wi-Fi', 'Điều hòa', 'Nước uống', 'Chăn gối', 'TV', 'USB sạc'];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Form */}
        <Card className="mb-6 shadow-md">
          <Form
            form={form}
            onFinish={handleSearch}
            layout="inline"
            className="w-full"
          >
            <Row gutter={16} className="w-full">
              <Col xs={24} md={6}>
                <Form.Item
                  name="origin"
                  rules={[{ required: true, message: 'Nhập điểm đi!' }]}
                  className="w-full"
                >
                  <Input
                    prefix={<EnvironmentOutlined />}
                    placeholder="Điểm đi"
                    size="large"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={6}>
                <Form.Item
                  name="destination"
                  rules={[{ required: true, message: 'Nhập điểm đến!' }]}
                  className="w-full"
                >
                  <Input
                    prefix={<EnvironmentOutlined />}
                    placeholder="Điểm đến"
                    size="large"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={6}>
                <Form.Item
                  name="departureDate"
                  rules={[{ required: true, message: 'Chọn ngày!' }]}
                  className="w-full"
                >
                  <DatePicker
                    placeholder="Ngày đi"
                    size="large"
                    format="DD/MM/YYYY"
                    disabledDate={(current) => current && current < dayjs().startOf('day')}
                    className="w-full"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={6}>
                <Form.Item className="w-full">
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SearchOutlined />}
                    size="large"
                    block
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Tìm kiếm
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>

        <Row gutter={16}>
          {/* Filters Sidebar */}
          <Col xs={24} md={6}>
            <Card title={<><FilterOutlined /> Bộ lọc</>} className="sticky top-24">
              {/* Sort */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3 flex items-center">
                  <SortAscendingOutlined className="mr-2" />
                  Sắp xếp theo
                </h4>
                <Select
                  value={sortBy}
                  onChange={setSortBy}
                  size="large"
                  className="w-full"
                >
                  <Option value="departureTime">Giờ khởi hành</Option>
                  <Option value="price-asc">Giá tăng dần</Option>
                  <Option value="price-desc">Giá giảm dần</Option>
                  <Option value="duration">Thời gian</Option>
                  <Option value="rating">Đánh giá</Option>
                </Select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Khoảng giá</h4>
                <Slider
                  range
                  value={priceRange}
                  onChange={setPriceRange}
                  min={0}
                  max={2000000}
                  step={50000}
                  tooltip={{
                    formatter: (value) => formatPrice(value),
                  }}
                />
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>{formatPrice(priceRange[0])}</span>
                  <span>{formatPrice(priceRange[1])}</span>
                </div>
              </div>

              {/* Bus Type */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Loại xe</h4>
                <Checkbox.Group
                  options={busTypes}
                  value={selectedBusTypes}
                  onChange={setSelectedBusTypes}
                  className="flex flex-col space-y-2"
                />
              </div>

              {/* Amenities */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Tiện ích</h4>
                <Checkbox.Group
                  options={amenities}
                  value={selectedAmenities}
                  onChange={setSelectedAmenities}
                  className="flex flex-col space-y-2"
                />
              </div>

              <Button
                block
                onClick={() => {
                  setPriceRange([0, 2000000]);
                  setSelectedBusTypes([]);
                  setSelectedAmenities([]);
                  setSortBy('departureTime');
                }}
              >
                Xóa bộ lọc
              </Button>
            </Card>
          </Col>

          {/* Results */}
          <Col xs={24} md={18}>
            {loading ? (
              <Loading tip="Đang tìm kiếm chuyến xe..." />
            ) : error ? (
              <ErrorMessage
                message="Không tìm thấy chuyến xe"
                description={error}
                showRetry
                onRetry={searchTrips}
                showHome
              />
            ) : filteredTrips.length === 0 ? (
              <Card>
                <Empty
                  description="Không tìm thấy chuyến xe phù hợp"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                >
                  <Button type="primary" onClick={() => navigate('/')}>
                    Về trang chủ
                  </Button>
                </Empty>
              </Card>
            ) : (
              <>
                <div className="mb-4 text-gray-600">
                  Tìm thấy <span className="font-semibold text-blue-600">{totalTrips}</span> chuyến xe
                  {filteredTrips.length < totalTrips && (
                    <span className="ml-2 text-sm">
                      (Hiển thị {filteredTrips.length} chuyến sau khi lọc)
                    </span>
                  )}
                </div>
                {filteredTrips.map((trip) => (
                  <TripCard key={trip._id || trip.id} trip={trip} />
                ))}

                {/* Pagination */}
                {totalTrips > pageSize && (
                  <div className="mt-8 flex justify-center">
                    <Pagination
                      current={currentPage}
                      pageSize={pageSize}
                      total={totalTrips}
                      onChange={(page) => {
                        setCurrentPage(page);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      showSizeChanger={false}
                      showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} chuyến`}
                    />
                  </div>
                )}
              </>
            )}
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default SearchResults;
