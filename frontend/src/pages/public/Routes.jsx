import { useState, useEffect } from 'react';
import { Card, Row, Col, Spin, message, Input, Select, Tag } from 'antd';
import { EnvironmentOutlined, ClockCircleOutlined, CarOutlined } from '@ant-design/icons';
import api from '../../services/api';

const { Search } = Input;
const { Option } = Select;

const PublicRoutes = () => {
  const [routes, setRoutes] = useState([]);
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProvince, setFilterProvince] = useState('all');

  useEffect(() => {
    fetchRoutes();
  }, []);

  useEffect(() => {
    filterRoutes();
  }, [searchTerm, filterProvince, routes]);

  const fetchRoutes = async () => {
    setLoading(true);
    try {
      const response = await api.get('/routes/public');
      console.log('Routes API Response:', response.data);

      // Handle both successResponse and paginatedResponse formats
      const routesData = response.data.data?.routes || response.data.data || response.data.routes || [];
      console.log('Parsed routes data:', routesData);

      setRoutes(routesData);
      setFilteredRoutes(routesData);
    } catch (error) {
      console.error('Error fetching routes:', error);
      message.error('Không thể tải danh sách tuyến đường');
    } finally {
      setLoading(false);
    }
  };

  const filterRoutes = () => {
    let filtered = routes;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(route =>
        route.routeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        route.origin?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        route.destination?.city?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by province
    if (filterProvince && filterProvince !== 'all') {
      filtered = filtered.filter(route =>
        route.origin?.province === filterProvince ||
        route.destination?.province === filterProvince
      );
    }

    setFilteredRoutes(filtered);
  };

  const getUniqueProvinces = () => {
    const provinces = new Set();
    routes.forEach(route => {
      if (route.origin?.province) provinces.add(route.origin.province);
      if (route.destination?.province) provinces.add(route.destination.province);
    });
    return Array.from(provinces).sort();
  };

  const formatDuration = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins > 0 ? mins + 'm' : ''}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Tuyến Đường</h1>
        <p className="text-gray-600">Khám phá các tuyến đường xe khách trên toàn quốc</p>
      </div>

      {/* Filters */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Search
              placeholder="Tìm kiếm theo tên tuyến, điểm đi, điểm đến..."
              allowClear
              size="large"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
          <Col xs={24} md={12}>
            <Select
              size="large"
              style={{ width: '100%' }}
              placeholder="Lọc theo tỉnh/thành phố"
              value={filterProvince}
              onChange={setFilterProvince}
            >
              <Option value="all">Tất cả tỉnh/thành phố</Option>
              {getUniqueProvinces().map(province => (
                <Option key={province} value={province}>{province}</Option>
              ))}
            </Select>
          </Col>
        </Row>
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-gray-600">
          Tìm thấy <strong>{filteredRoutes.length}</strong> tuyến đường
        </p>
      </div>

      {/* Routes List */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Spin size="large" />
        </div>
      ) : filteredRoutes.length > 0 ? (
        <Row gutter={[16, 16]}>
          {filteredRoutes.map(route => (
            <Col xs={24} md={12} lg={8} key={route._id}>
              <Card
                hoverable
                className="h-full"
                title={
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-bold text-lg mb-1">{route.routeName}</div>
                      <Tag color="blue">{route.routeCode}</Tag>
                    </div>
                  </div>
                }
              >
                {/* Origin */}
                <div className="mb-3">
                  <div className="flex items-start">
                    <EnvironmentOutlined className="text-green-600 mt-1 mr-2" />
                    <div>
                      <div className="font-semibold">Điểm đi</div>
                      <div className="text-gray-600">{route.origin?.city || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{route.origin?.address || ''}</div>
                    </div>
                  </div>
                </div>

                {/* Destination */}
                <div className="mb-3">
                  <div className="flex items-start">
                    <EnvironmentOutlined className="text-red-600 mt-1 mr-2" />
                    <div>
                      <div className="font-semibold">Điểm đến</div>
                      <div className="text-gray-600">{route.destination?.city || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{route.destination?.address || ''}</div>
                    </div>
                  </div>
                </div>

                {/* Distance & Duration */}
                <div className="flex justify-between text-sm text-gray-600 border-t pt-3">
                  <div className="flex items-center">
                    <CarOutlined className="mr-1" />
                    <span>{route.distance || 0} km</span>
                  </div>
                  <div className="flex items-center">
                    <ClockCircleOutlined className="mr-1" />
                    <span>{formatDuration(route.estimatedDuration)}</span>
                  </div>
                </div>

                {/* Pickup/Dropoff Points Count */}
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>{route.pickupPoints?.length || 0} điểm đón</span>
                  <span>{route.dropoffPoints?.length || 0} điểm trả</span>
                </div>

                {/* Search Button */}
                <div className="mt-4">
                  <a
                    href={`/search?origin=${route.origin?.city || ''}&destination=${route.destination?.city || ''}`}
                    className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
                  >
                    Tìm chuyến xe
                  </a>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">Không tìm thấy tuyến đường nào</p>
          <p className="text-gray-400 mt-2">Thử thay đổi bộ lọc hoặc tìm kiếm</p>
        </div>
      )}
    </div>
  );
};

export default PublicRoutes;
