import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Card,
  Typography,
  Tag,
  Space,
  Divider,
  Avatar,
  Button,
  Row,
  Col,
  Form,
  Input,
  message,
  List,
  Spin
} from 'antd';
import {
  CalendarOutlined,
  UserOutlined,
  EyeOutlined,
  ShareAltOutlined,
  HeartOutlined,
  HeartFilled,
  ArrowLeftOutlined,
  FacebookOutlined,
  TwitterOutlined,
  LinkOutlined
} from '@ant-design/icons';
import blogService from '../../services/blogService';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const BlogDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [form] = Form.useForm();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetchBlogDetail();
  }, [slug]);

  const fetchBlogDetail = async () => {
    try {
      setLoading(true);
      const response = await blogService.getBlogBySlug(slug);

      if (response.success) {
        setPost(response.data.blog);
        setLikes(response.data.blog.likes || 0);
        setComments(response.data.blog.comments || []);
      } else {
        message.error('Không tìm thấy bài viết');
        navigate('/blog');
      }
    } catch (error) {
      console.error('Error fetching blog detail:', error);
      message.error('Đã có lỗi xảy ra');
      navigate('/blog');
    } finally {
      setLoading(false);
    }
  };

  // Related posts - TODO: Implement related posts in blogService later
  const relatedPosts = [];

  const getCategoryLabel = (category) => {
    const labels = {
      news: 'Tin tức',
      'travel-tips': 'Mẹo du lịch',
      guide: 'Hướng dẫn',
      safety: 'An toàn'
    };
    return labels[category] || category;
  };

  const getCategoryColor = (category) => {
    const colors = {
      news: 'red',
      'travel-tips': 'green',
      guide: 'blue',
      safety: 'orange'
    };
    return colors[category] || 'default';
  };

  const handleLike = async () => {
    if (!post) return;

    try {
      if (liked) {
        const response = await blogService.unlikeBlog(post.id);
        if (response.success) {
          setLikes(response.data.likes);
          setLiked(false);
        }
      } else {
        const response = await blogService.likeBlog(post.id);
        if (response.success) {
          setLikes(response.data.likes);
          setLiked(true);
          message.success('Đã thích bài viết!');
        }
      }
    } catch (error) {
      message.error('Không thể thực hiện thao tác');
    }
  };

  const handleShare = (platform) => {
    message.success(`Đã chia sẻ lên ${platform}`);
  };

  const handleCommentSubmit = async (values) => {
    if (!post) return;

    try {
      const response = await blogService.addComment(post.id, values.comment);
      if (response.success) {
        message.success('Đã gửi bình luận!');
        form.resetFields();
        // Add new comment to list
        setComments([...comments, response.data.comment]);
      }
    } catch (error) {
      message.error('Không thể gửi bình luận');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-12">
          <Spin size="large" tip="Đang tải bài viết..." />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <div className="text-center py-12">
              <Text>Không tìm thấy bài viết</Text>
              <br />
              <Link to="/blog">
                <Button type="primary" className="mt-4">
                  Quay lại danh sách
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link to="/blog">
          <Button icon={<ArrowLeftOutlined />} className="mb-4">
            Quay lại danh sách
          </Button>
        </Link>

        {/* Main Article */}
        <Card className="shadow-lg mb-6">
          {/* Category Tag */}
          <Tag color={getCategoryColor(post.category)} className="mb-3">
            {getCategoryLabel(post.category)}
          </Tag>

          {/* Title */}
          <Title level={1} className="!mb-4">
            {post.title}
          </Title>

          {/* Meta Info */}
          <Space size="large" className="mb-6" wrap>
            <Space>
              <Avatar icon={<UserOutlined />} src={post.author.avatar} />
              <Text strong>{post.author.name}</Text>
            </Space>
            <Space>
              <CalendarOutlined />
              <Text type="secondary">
                {dayjs(post.publishDate).format('DD/MM/YYYY')}
              </Text>
            </Space>
            <Space>
              <EyeOutlined />
              <Text type="secondary">{post.views} lượt xem</Text>
            </Space>
          </Space>

          {/* Featured Image */}
          <div className="mb-6 rounded-lg overflow-hidden">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-auto"
            />
          </div>

          {/* Excerpt */}
          <Paragraph className="text-lg text-gray-600 mb-6">
            {post.excerpt}
          </Paragraph>

          <Divider />

          {/* Content */}
          <div className="prose prose-lg max-w-none mb-6">
            <div dangerouslySetInnerHTML={{
              __html: post.content
                .split('\n')
                .map(line => {
                  if (line.startsWith('## ')) {
                    return `<h2 class="text-2xl font-bold mt-8 mb-4">${line.slice(3)}</h2>`;
                  } else if (line.startsWith('### ')) {
                    return `<h3 class="text-xl font-semibold mt-6 mb-3">${line.slice(4)}</h3>`;
                  } else if (line.startsWith('- ')) {
                    return `<li class="ml-6">${line.slice(2)}</li>`;
                  } else if (line.match(/^\d+\./)) {
                    return `<li class="ml-6">${line}</li>`;
                  } else if (line.startsWith('**') && line.endsWith('**')) {
                    return `<p class="font-bold mt-4 mb-2">${line.slice(2, -2)}</p>`;
                  } else if (line.trim() === '') {
                    return '<br />';
                  } else {
                    return `<p class="mb-3">${line}</p>`;
                  }
                })
                .join('')
            }} />
          </div>

          <Divider />

          {/* Tags */}
          <div className="mb-6">
            <Text strong className="mr-2">Tags:</Text>
            <Space size={[0, 8]} wrap>
              {post.tags.map((tag, index) => (
                <Tag key={index}>{tag}</Tag>
              ))}
            </Space>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between py-4 border-t border-b">
            <Button
              type={liked ? 'primary' : 'default'}
              icon={liked ? <HeartFilled /> : <HeartOutlined />}
              onClick={handleLike}
              size="large"
            >
              {likes} Thích
            </Button>

            <Space size="middle">
              <Text strong>Chia sẻ:</Text>
              <Button
                icon={<FacebookOutlined />}
                onClick={() => handleShare('Facebook')}
              />
              <Button
                icon={<TwitterOutlined />}
                onClick={() => handleShare('Twitter')}
              />
              <Button
                icon={<LinkOutlined />}
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  message.success('Đã sao chép link');
                }}
              />
            </Space>
          </div>

          {/* Author Bio */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <Space align="start">
              <Avatar size={64} icon={<UserOutlined />} src={post.author.avatar} />
              <div>
                <Text strong className="block text-lg mb-1">
                  {post.author.name}
                </Text>
                <Text type="secondary">{post.author.bio}</Text>
              </div>
            </Space>
          </div>
        </Card>

        {/* Comments Section */}
        <Card title={`Bình luận (${comments.length})`} className="shadow-lg mb-6">
          {/* Comment Form */}
          <Form
            form={form}
            onFinish={handleCommentSubmit}
            className="mb-6"
          >
            <Form.Item
              name="comment"
              rules={[
                { required: true, message: 'Vui lòng nhập bình luận' },
                { min: 10, message: 'Bình luận phải có ít nhất 10 ký tự' }
              ]}
            >
              <TextArea
                rows={4}
                placeholder="Chia sẻ suy nghĩ của bạn về bài viết..."
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Gửi bình luận
              </Button>
            </Form.Item>
          </Form>

          {/* Comments List */}
          <List
            dataSource={comments}
            renderItem={(comment) => (
              <div className="py-4 border-b last:border-b-0">
                <div className="flex items-start gap-3">
                  <Avatar size={40} icon={<UserOutlined />} src={comment.avatar} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Text strong>{comment.author}</Text>
                      <Text type="secondary" className="text-xs">
                        {dayjs(comment.datetime).format('DD/MM/YYYY HH:mm')}
                      </Text>
                    </div>
                    <Paragraph className="mb-0">{comment.content}</Paragraph>
                  </div>
                </div>
              </div>
            )}
          />
        </Card>

        {/* Related Posts */}
        <Card title="Bài viết liên quan" className="shadow-lg">
          <Row gutter={[16, 16]}>
            {relatedPosts.map((relatedPost) => (
              <Col xs={24} sm={8} key={relatedPost.id}>
                <Link to={`/blog/${relatedPost.slug}`}>
                  <Card
                    hoverable
                    cover={
                      <img
                        alt={relatedPost.title}
                        src={relatedPost.image}
                        className="h-32 object-cover"
                      />
                    }
                  >
                    <Card.Meta
                      title={
                        <Text className="line-clamp-2 text-sm">
                          {relatedPost.title}
                        </Text>
                      }
                    />
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        </Card>
      </div>
    </div>
  );
};

export default BlogDetail;
