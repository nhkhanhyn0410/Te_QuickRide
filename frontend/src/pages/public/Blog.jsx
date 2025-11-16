import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  Row,
  Col,
  Input,
  Select,
  Tag,
  Typography,
  Button,
  Space,
  Pagination,
  Empty
} from 'antd';
import {
  SearchOutlined,
  CalendarOutlined,
  UserOutlined,
  EyeOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const Blog = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Mock blog posts
  const blogPosts = [
    {
      id: 1,
      slug: 'kinh-nghiem-du-lich-da-lat-tu-tuc',
      title: 'Kinh nghiệm du lịch Đà Lạt tự túc - Tiết kiệm chi phí',
      excerpt: 'Chia sẻ kinh nghiệm du lịch Đà Lạt tự túc với budget tiết kiệm, những địa điểm check-in đẹp và cách di chuyển thuận tiện nhất từ TP.HCM.',
      content: '...',
      image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800',
      category: 'travel-tips',
      author: 'Nguyễn Minh Anh',
      publishDate: '2024-01-18',
      views: 1250,
      tags: ['Đà Lạt', 'Du lịch tự túc', 'Tiết kiệm']
    },
    {
      id: 2,
      slug: 'top-5-tuyen-xe-pho-bien-tet-2024',
      title: 'Top 5 tuyến xe phổ biến dịp Tết Nguyên Đán 2024',
      excerpt: 'Tổng hợp những tuyến xe khách được đặt nhiều nhất dịp Tết 2024 và mẹo đặt vé sớm để có giá tốt nhất.',
      content: '...',
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800',
      category: 'news',
      author: 'Trần Văn Bình',
      publishDate: '2024-01-15',
      views: 2340,
      tags: ['Tết 2024', 'Đặt vé', 'Tuyến hot']
    },
    {
      id: 3,
      slug: 'huong-dan-dat-ve-xe-online-cho-nguoi-moi',
      title: 'Hướng dẫn đặt vé xe online cho người mới bắt đầu',
      excerpt: 'Hướng dẫn chi tiết từng bước đặt vé xe khách trực tuyến trên Te_QuickRide, từ tìm kiếm đến thanh toán và nhận vé.',
      content: '...',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
      category: 'guide',
      author: 'Lê Thu Hà',
      publishDate: '2024-01-12',
      views: 1890,
      tags: ['Hướng dẫn', 'Đặt vé online', 'Người mới']
    },
    {
      id: 4,
      slug: 'nhung-diem-dung-chan-nghi-duong-yen-tinh',
      title: 'Những điểm dừng chân nghỉ dưỡng yên tĩnh trên đường đi',
      excerpt: 'Gợi ý những quán cafe, nhà hàng và khu nghỉ dưỡng lý tưởng để dừng chân trên các tuyến đường phổ biến.',
      content: '...',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
      category: 'travel-tips',
      author: 'Phạm Quốc Anh',
      publishDate: '2024-01-10',
      views: 980,
      tags: ['Điểm dừng chân', 'Nghỉ ngơi', 'Cafe']
    },
    {
      id: 5,
      slug: 'an-toan-khi-di-xe-khach-duong-dai',
      title: 'Những lưu ý an toàn khi đi xe khách đường dài',
      excerpt: 'Tổng hợp các mẹo và lưu ý quan trọng để đảm bảo an toàn và thoải mái trong suốt hành trình đi xe khách.',
      content: '...',
      image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800',
      category: 'safety',
      author: 'Võ Minh Tuấn',
      publishDate: '2024-01-08',
      views: 1560,
      tags: ['An toàn', 'Mẹo hay', 'Hành trình']
    },
    {
      id: 6,
      slug: 'khac-biet-giua-ghe-ngoi-va-giuong-nam',
      title: 'Sự khác biệt giữa xe ghế ngồi và giường nằm',
      excerpt: 'So sánh chi tiết về ưu nhược điểm của xe ghế ngồi và giường nằm để bạn lựa chọn phù hợp với nhu cầu.',
      content: '...',
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800',
      category: 'guide',
      author: 'Đặng Thị Mai',
      publishDate: '2024-01-05',
      views: 2150,
      tags: ['Loại xe', 'So sánh', 'Lựa chọn']
    },
    {
      id: 7,
      slug: 'mon-an-dac-san-mien-tay',
      title: 'Những món ăn đặc sản không thể bỏ qua khi đến miền Tây',
      excerpt: 'Khám phá ẩm thực miền Tây với những món ăn đặc sản nổi tiếng và địa chỉ thưởng thức đáng tin cậy.',
      content: '...',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
      category: 'travel-tips',
      author: 'Nguyễn Văn Long',
      publishDate: '2024-01-03',
      views: 1720,
      tags: ['Miền Tây', 'Ẩm thực', 'Đặc sản']
    },
    {
      id: 8,
      slug: 'tet-2024-nhung-dieu-can-biet-khi-di-xe',
      title: 'Tết 2024: Những điều cần biết khi đi xe khách',
      excerpt: 'Thông tin quan trọng về giá vé, lịch trình và các quy định đặc biệt trong dịp Tết Nguyên Đán 2024.',
      content: '...',
      image: 'https://images.unsplash.com/photo-1548678967-f1aec58f6fb2?w=800',
      category: 'news',
      author: 'Trần Minh Châu',
      publishDate: '2024-01-01',
      views: 3200,
      tags: ['Tết 2024', 'Thông tin', 'Lịch trình']
    }
  ];

  const categories = [
    { value: 'all', label: 'Tất cả' },
    { value: 'news', label: 'Tin tức' },
    { value: 'travel-tips', label: 'Mẹo du lịch' },
    { value: 'guide', label: 'Hướng dẫn' },
    { value: 'safety', label: 'An toàn' }
  ];

  const getCategoryColor = (category) => {
    const colors = {
      news: 'red',
      'travel-tips': 'green',
      guide: 'blue',
      safety: 'orange'
    };
    return colors[category] || 'default';
  };

  const getCategoryLabel = (category) => {
    const labels = {
      news: 'Tin tức',
      'travel-tips': 'Mẹo du lịch',
      guide: 'Hướng dẫn',
      safety: 'An toàn'
    };
    return labels[category] || category;
  };

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchText.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchText.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchText.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Title level={1} className="!text-white !mb-4">
            Blog & Tin tức
          </Title>
          <Text className="text-lg text-blue-100">
            Chia sẻ kinh nghiệm, mẹo hay và tin tức mới nhất về du lịch
          </Text>
        </div>
      </div>

      {/* Filter Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <Card className="shadow-lg mb-6">
          <div className="flex flex-wrap gap-3">
            <Input
              size="large"
              placeholder="Tìm kiếm bài viết..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ flex: 1, minWidth: 250 }}
              allowClear
            />
            <Select
              size="large"
              value={selectedCategory}
              onChange={setSelectedCategory}
              style={{ width: 200 }}
            >
              {categories.map(cat => (
                <Option key={cat.value} value={cat.value}>
                  {cat.label}
                </Option>
              ))}
            </Select>
          </div>
        </Card>
      </div>

      {/* Blog Posts Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {paginatedPosts.length === 0 ? (
          <Card>
            <Empty description="Không tìm thấy bài viết nào" />
          </Card>
        ) : (
          <>
            <Row gutter={[24, 24]}>
              {paginatedPosts.map((post) => (
                <Col xs={24} md={12} lg={8} key={post.id}>
                  <Card
                    hoverable
                    cover={
                      <div className="h-48 overflow-hidden">
                        <img
                          alt={post.title}
                          src={post.image}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                        />
                      </div>
                    }
                    className="h-full flex flex-col shadow-md"
                  >
                    <div className="flex-1">
                      {/* Category Tag */}
                      <Tag color={getCategoryColor(post.category)} className="mb-2">
                        {getCategoryLabel(post.category)}
                      </Tag>

                      {/* Title */}
                      <Link to={`/blog/${post.slug}`}>
                        <Title
                          level={4}
                          className="!mb-2 hover:text-blue-600 transition-colors line-clamp-2"
                        >
                          {post.title}
                        </Title>
                      </Link>

                      {/* Excerpt */}
                      <Paragraph
                        className="text-gray-600 mb-3 line-clamp-3"
                        ellipsis={{ rows: 3 }}
                      >
                        {post.excerpt}
                      </Paragraph>

                      {/* Tags */}
                      <div className="mb-3">
                        <Space size={[0, 8]} wrap>
                          {post.tags.map((tag, index) => (
                            <Tag key={index} className="text-xs">
                              {tag}
                            </Tag>
                          ))}
                        </Space>
                      </div>

                      {/* Meta Info */}
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                        <Space size="middle">
                          <span>
                            <UserOutlined /> {post.author}
                          </span>
                          <span>
                            <CalendarOutlined /> {dayjs(post.publishDate).format('DD/MM/YYYY')}
                          </span>
                        </Space>
                        <span>
                          <EyeOutlined /> {post.views}
                        </span>
                      </div>

                      {/* Read More Button */}
                      <Link to={`/blog/${post.slug}`}>
                        <Button type="link" className="p-0" icon={<ArrowRightOutlined />}>
                          Đọc tiếp
                        </Button>
                      </Link>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>

            {/* Pagination */}
            {filteredPosts.length > pageSize && (
              <div className="mt-8 flex justify-center">
                <Pagination
                  current={currentPage}
                  total={filteredPosts.length}
                  pageSize={pageSize}
                  onChange={setCurrentPage}
                  showSizeChanger={false}
                  showTotal={(total) => `Tổng ${total} bài viết`}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Blog;
