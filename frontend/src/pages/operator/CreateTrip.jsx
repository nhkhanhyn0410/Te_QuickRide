import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Form,
  Select,
  DatePicker,
  InputNumber,
  Button,
  Row,
  Col,
  Typography,
  message,
  Divider,
  Space,
  Tag
} from 'antd';
import {
  ArrowLeftOutlined,
  SaveOutlined,
  EnvironmentOutlined,
  CarOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

const CreateTrip = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [routes, setRoutes] = useState([]);
  const [buses, setBuses] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedBus, setSelectedBus] = useState(null);
  const [estimatedArrival, setEstimatedArrival] = useState(null);

  useEffect(() => {
    fetchRoutes();
    fetchBuses();
  }, []);

  const fetchRoutes = async () => {
    try {
      // TODO: Integrate with API
      // Mock data
      setRoutes([
        {
          _id: 'route1',
          routeCode: 'RT001',
          origin: { city: 'TP. Hồ Chí Minh', station: 'Bến xe Miền Đông' },
          destination: { city: 'Đà Lạt', station: 'Bến xe Đà Lạt' },
          distance: 308,
          estimatedDuration: 480, // minutes
          isActive: true
        },
        {
          _id: 'route2',
          routeCode: 'RT002',
          origin: { city: 'TP. Hồ Chí Minh', station: 'Bến xe Miền Tây' },
          destination: { city: 'Cần Thơ', station: 'Bến xe Cần Thơ' },
          distance: 169,
          estimatedDuration: 240,
          isActive: true
        },
        {
          _id: 'route3',
          routeCode: 'RT003',
          origin: { city: 'Hà Nội', station: 'Bến xe Mỹ Đình' },
          destination: { city: 'Hải Phòng', station: 'Bến xe Niệm Nghĩa' },
          distance: 120,
          estimatedDuration: 150,
          isActive: true
        }
      ]);
    } catch (error) {
      message.error('Không thể tải danh sách tuyến đường');
    }
  };

  const fetchBuses = async () => {
    try {
      // TODO: Integrate with API
      // Mock data
      setBuses([
        {
          _id: 'bus1',
          busNumber: '51B-12345',
          type: 'Giường nằm',
          totalSeats: 40,
          amenities: ['WiFi', 'Điều hòa', 'Nước uống'],
          isActive: true
        },
        {
          _id: 'bus2',
          busNumber: '51B-67890',
          type: 'Ghế ngồi',
          totalSeats: 45,
          amenities: ['Điều hòa', 'Nước uống'],
          isActive: true
        },
        {
          _id: 'bus3',
          busNumber: '51B-11111',
          type: 'Limousine',
          totalSeats: 24,
          amenities: ['WiFi', 'Điều hòa', 'Nước uống', 'TV', 'Ghế massage'],
          isActive: true
        }
      ]);
    } catch (error) {
      message.error('Không thể tải danh sách xe');
    }
  };

  const handleRouteChange = (routeId) => {
    const route = routes.find(r => r._id === routeId);
    setSelectedRoute(route);

    // Update estimated arrival time if departure time is set
    const departureTime = form.getFieldValue('departureTime');
    if (departureTime && route) {
      const arrival = dayjs(departureTime).add(route.estimatedDuration, 'minute');
      setEstimatedArrival(arrival);
      form.setFieldsValue({ arrivalTime: arrival });
    }
  };

  const handleBusChange = (busId) => {
    const bus = buses.find(b => b._id === busId);
    setSelectedBus(bus);
  };

  const handleDepartureTimeChange = (datetime) => {
    if (datetime && selectedRoute) {
      const arrival = dayjs(datetime).add(selectedRoute.estimatedDuration, 'minute');
      setEstimatedArrival(arrival);
      form.setFieldsValue({ arrivalTime: arrival });
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // TODO: Integrate with API
      console.log('Creating trip:', {
        ...values,
        departureTime: values.departureTime.toISOString(),
        arrivalTime: values.arrivalTime.toISOString()
      });

      await new Promise(resolve => setTimeout(resolve, 1500));

      message.success('Tạo chuyến đi thành công!');
      navigate('/operator/trips');
    } catch (error) {
      message.error('Không thể tạo chuyến đi. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const disabledDate = (current) => {
    // Can't select days before today
    return current && current < dayjs().startOf('day');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/operator/trips')}
            className="mb-4"
          >
            Quay lại
          </Button>
          <Title level={2}>Tạo chuyến đi mới</Title>
        </div>

        <Row gutter={[24, 24]}>
          {/* Form */}
          <Col xs={24} lg={16}>
            <Card className="shadow-md">
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                autoComplete="off"
              >
                {/* Route Selection */}
                <Form.Item
                  name="routeId"
                  label="Tuyến đường"
                  rules={[{ required: true, message: 'Vui lòng chọn tuyến đường' }]}
                >
                  <Select
                    size="large"
                    placeholder="Chọn tuyến đường"
                    onChange={handleRouteChange}
                    showSearch
                    optionFilterProp="children"
                  >
                    {routes.map(route => (
                      <Option key={route._id} value={route._id}>
                        <div>
                          <Text strong>{route.routeCode}</Text> -{' '}
                          {route.origin.city} → {route.destination.city}
                          <br />
                          <Text type="secondary" className="text-sm">
                            {route.distance}km • {Math.floor(route.estimatedDuration / 60)}h{route.estimatedDuration % 60}m
                          </Text>
                        </div>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                {/* Bus Selection */}
                <Form.Item
                  name="busId"
                  label="Xe"
                  rules={[{ required: true, message: 'Vui lòng chọn xe' }]}
                >
                  <Select
                    size="large"
                    placeholder="Chọn xe"
                    onChange={handleBusChange}
                    showSearch
                    optionFilterProp="children"
                  >
                    {buses.map(bus => (
                      <Option key={bus._id} value={bus._id}>
                        <div>
                          <Text strong>{bus.busNumber}</Text> - {bus.type}
                          <br />
                          <Text type="secondary" className="text-sm">
                            {bus.totalSeats} ghế • {bus.amenities.join(', ')}
                          </Text>
                        </div>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Divider />

                {/* Departure & Arrival Time */}
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="departureTime"
                      label="Thời gian khởi hành"
                      rules={[{ required: true, message: 'Vui lòng chọn thời gian khởi hành' }]}
                    >
                      <DatePicker
                        showTime
                        format="DD/MM/YYYY HH:mm"
                        size="large"
                        className="w-full"
                        placeholder="Chọn ngày giờ khởi hành"
                        disabledDate={disabledDate}
                        onChange={handleDepartureTimeChange}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="arrivalTime"
                      label="Thời gian dự kiến đến"
                    >
                      <DatePicker
                        showTime
                        format="DD/MM/YYYY HH:mm"
                        size="large"
                        className="w-full"
                        placeholder="Tự động tính"
                        disabled
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Divider />

                {/* Pricing */}
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="basePrice"
                      label="Giá vé cơ bản (VNĐ)"
                      rules={[
                        { required: true, message: 'Vui lòng nhập giá vé' },
                        { type: 'number', min: 10000, message: 'Giá vé tối thiểu 10,000 VNĐ' }
                      ]}
                    >
                      <InputNumber
                        size="large"
                        className="w-full"
                        placeholder="Ví dụ: 200000"
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        step={10000}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="status"
                      label="Trạng thái"
                      initialValue="scheduled"
                    >
                      <Select size="large">
                        <Option value="scheduled">Đã lên lịch</Option>
                        <Option value="boarding">Đang lên xe</Option>
                        <Option value="in_progress">Đang chạy</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                {/* Submit Buttons */}
                <Divider />
                <Form.Item>
                  <Space>
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      icon={<SaveOutlined />}
                      loading={loading}
                    >
                      Tạo chuyến đi
                    </Button>
                    <Button
                      size="large"
                      onClick={() => navigate('/operator/trips')}
                    >
                      Hủy
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </Card>
          </Col>

          {/* Preview Sidebar */}
          <Col xs={24} lg={8}>
            {/* Route Preview */}
            {selectedRoute && (
              <Card title="Thông tin tuyến đường" className="mb-4 shadow-md">
                <div className="space-y-3">
                  <div>
                    <Text type="secondary" className="block mb-1">Mã tuyến</Text>
                    <Tag color="blue">{selectedRoute.routeCode}</Tag>
                  </div>
                  <div>
                    <Text type="secondary" className="block mb-1">
                      <EnvironmentOutlined /> Điểm đi
                    </Text>
                    <Text strong className="block">{selectedRoute.origin.city}</Text>
                    <Text className="text-sm text-gray-600">{selectedRoute.origin.station}</Text>
                  </div>
                  <div>
                    <Text type="secondary" className="block mb-1">
                      <EnvironmentOutlined /> Điểm đến
                    </Text>
                    <Text strong className="block">{selectedRoute.destination.city}</Text>
                    <Text className="text-sm text-gray-600">{selectedRoute.destination.station}</Text>
                  </div>
                  <Divider className="my-2" />
                  <div className="flex justify-between">
                    <Text type="secondary">Khoảng cách</Text>
                    <Text strong>{selectedRoute.distance} km</Text>
                  </div>
                  <div className="flex justify-between">
                    <Text type="secondary">Thời gian ước tính</Text>
                    <Text strong>
                      {Math.floor(selectedRoute.estimatedDuration / 60)}h {selectedRoute.estimatedDuration % 60}m
                    </Text>
                  </div>
                </div>
              </Card>
            )}

            {/* Bus Preview */}
            {selectedBus && (
              <Card title="Thông tin xe" className="mb-4 shadow-md">
                <div className="space-y-3">
                  <div>
                    <Text type="secondary" className="block mb-1">
                      <CarOutlined /> Biển số xe
                    </Text>
                    <Text strong className="text-lg">{selectedBus.busNumber}</Text>
                  </div>
                  <div>
                    <Text type="secondary" className="block mb-1">Loại xe</Text>
                    <Tag color="green">{selectedBus.type}</Tag>
                  </div>
                  <div>
                    <Text type="secondary" className="block mb-1">Số ghế</Text>
                    <Text strong>{selectedBus.totalSeats} ghế</Text>
                  </div>
                  <div>
                    <Text type="secondary" className="block mb-1">Tiện ích</Text>
                    <Space wrap className="mt-1">
                      {selectedBus.amenities.map((amenity, idx) => (
                        <Tag key={idx}>{amenity}</Tag>
                      ))}
                    </Space>
                  </div>
                </div>
              </Card>
            )}

            {/* Tips */}
            <Card className="bg-blue-50 border-blue-200 shadow-md">
              <Title level={5} className="mb-3">Lưu ý</Title>
              <ul className="text-sm space-y-2 pl-4">
                <li>Đảm bảo xe đã sẵn sàng và tài xế đã được phân công</li>
                <li>Giá vé nên phù hợp với quãng đường và loại xe</li>
                <li>Kiểm tra kỹ thời gian khởi hành để tránh trùng lặp</li>
                <li>Có thể chỉnh sửa thông tin chuyến đi sau khi tạo</li>
              </ul>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default CreateTrip;
