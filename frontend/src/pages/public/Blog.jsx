import { useState, useEffect } from 'react';
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
  Empty,
  Spin,
  message
} from 'antd';
import {
  SearchOutlined,
  CalendarOutlined,
  UserOutlined,
  EyeOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';
import blogService from '../../services/blogService';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const Blog = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const pageSize = 6;

  useEffect(() => {
    fetchBlogs();
  }, [searchText, selectedCategory]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await blogService.getAllBlogs({
        search: searchText,
        category: selectedCategory
      });

      if (response.success) {
        setBlogPosts(response.data.blogs || []);
      } else {
        message.error('Không thể tải danh sách bài viết');
        setBlogPosts([]);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
      message.error('Đã có lỗi xảy ra');
      setBlogPosts([]);
    } finally {
      setLoading(false);
    }
  };


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
        {loading ? (
          <div className="text-center py-12">
            <Spin size="large" tip="Đang tải bài viết..." />
          </div>
        ) : paginatedPosts.length === 0 ? (
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
                            <UserOutlined /> {post.author?.name || post.author}
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
