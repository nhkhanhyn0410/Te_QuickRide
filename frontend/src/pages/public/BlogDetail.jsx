import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
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
  List
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
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const BlogDetail = () => {
  const { slug } = useParams();
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(125);
  const [form] = Form.useForm();

  // Mock blog post data - would be fetched from API
  const post = {
    id: 1,
    slug: 'kinh-nghiem-du-lich-da-lat-tu-tuc',
    title: 'Kinh nghiệm du lịch Đà Lạt tự túc - Tiết kiệm chi phí',
    excerpt: 'Chia sẻ kinh nghiệm du lịch Đà Lạt tự túc với budget tiết kiệm, những địa điểm check-in đẹp và cách di chuyển thuận tiện nhất từ TP.HCM.',
    image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=1200',
    category: 'travel-tips',
    author: {
      name: 'Nguyễn Minh Anh',
      avatar: null,
      bio: 'Travel blogger, yêu thích khám phá những điểm đến mới'
    },
    publishDate: '2024-01-18',
    views: 1250,
    tags: ['Đà Lạt', 'Du lịch tự túc', 'Tiết kiệm'],
    content: `
## Giới thiệu

Đà Lạt - thành phố ngàn hoa luôn là điểm đến được yêu thích hàng đầu của du khách Việt Nam. Với khí hậu mát mẻ quanh năm, phong cảnh thơ mộng và nhiều địa điểm check-in đẹp, Đà Lạt thu hút hàng triệu lượt khách mỗi năm.

Trong bài viết này, mình sẽ chia sẻ kinh nghiệm du lịch Đà Lạt tự túc với budget tiết kiệm nhưng vẫn đầy đủ trải nghiệm.

## 1. Chi phí di chuyển

### Đi xe khách từ TP.HCM

- **Loại xe**: Giường nằm chất lượng cao
- **Giá vé**: Khoảng 250.000 - 300.000đ/chiều
- **Thời gian**: 6-7 tiếng
- **Mẹo tiết kiệm**: Đặt vé sớm qua Te_QuickRide để được giá tốt nhất

### Di chuyển tại Đà Lạt

- Thuê xe máy: 100.000 - 150.000đ/ngày
- Grab/xe ôm công nghệ: Tiện lợi cho những chuyến đi ngắn
- Đi bộ: Nhiều điểm tham quan ở trung tâm gần nhau

## 2. Chỗ ở giá rẻ

### Homestay/Hostel

- **Giá**: 100.000 - 200.000đ/người/đêm
- **Ưu điểm**: Giá rẻ, gặp gỡ nhiều bạn mới
- **Gợi ý**: Khu vực gần chợ Đà Lạt, phố đi bộ

### Khách sạn 2-3 sao

- **Giá**: 300.000 - 500.000đ/phòng/đêm
- **Ưu điểm**: Tiện nghi đầy đủ, vị trí trung tâm

## 3. Địa điểm tham quan miễn phí

1. **Hồ Xuân Hương**: Đi dạo quanh hồ, ngắm hoàng hôn
2. **Chợ Đà Lạt**: Khám phá văn hóa địa phương
3. **Ga Đà Lạt**: Kiến trúc cổ kính, check-in đẹp
4. **Đồi Con Gà**: View nhìn toàn cảnh thành phố
5. **Phố đi bộ**: Cuối tuần sôi động

## 4. Ẩm thực Đà Lạt

### Món ăn phải thử:

- Bánh tráng nướng
- Bánh ướt lòng gà
- Lẩu gà lá é
- Sữa đậu nành
- Dâu tây tươi

**Chi phí ăn uống**: Khoảng 100.000 - 150.000đ/người/ngày

## 5. Lịch trình 3 ngày 2 đêm

### Ngày 1:
- Sáng: Đi xe từ TP.HCM, đến Đà Lạt trưa
- Chiều: Check-in, nghỉ ngơi, dạo chợ Đà Lạt
- Tối: Ăn tối, khám phá chợ đêm

### Ngày 2:
- Sáng: Thác Datanla, Cầu Đất Farm
- Trưa: Ăn trưa tại trung tâm
- Chiều: Ga Đà Lạt, Hồ Xuân Hương
- Tối: Phố đi bộ, thưởng thức ẩm thực đường phố

### Ngày 3:
- Sáng: Đồi chè Cầu Đất, chợ Đà Lạt mua đặc sản
- Trưa: Ăn trưa, chuẩn bị về
- Chiều: Xe về TP.HCM

## 6. Tổng kết chi phí

**Ước tính cho 1 người (3 ngày 2 đêm):**

- Xe khách khứ hồi: 500.000đ
- Chỗ ở (2 đêm): 400.000đ
- Ăn uống: 300.000đ
- Đi lại trong thành phố: 200.000đ
- Vé tham quan: 200.000đ
- Mua sắm, khác: 400.000đ

**Tổng cộng: Khoảng 2.000.000đ/người**

## 7. Mẹo tiết kiệm

1. Đặt vé xe sớm để được giá tốt
2. Đi nhóm để chia sẻ chi phí thuê xe, phòng
3. Ăn ở quán địa phương thay vì nhà hàng du lịch
4. Chọn homestay/hostel thay vì khách sạn
5. Tham quan các địa điểm miễn phí
6. Mua đặc sản tại chợ thay vì cửa hàng du lịch

## Kết luận

Đà Lạt là điểm đến lý tưởng cho chuyến du lịch tự túc với budget tiết kiệm. Với 2 triệu đồng, bạn đã có thể có một chuyến đi trọn vẹn, đầy đủ trải nghiệm.

Chúc bạn có chuyến đi vui vẻ! Đừng quên đặt vé xe sớm qua Te_QuickRide để được giá tốt nhất nhé! 🚌
    `
  };

  // Mock related posts
  const relatedPosts = [
    {
      id: 2,
      slug: 'top-5-tuyen-xe-pho-bien-tet-2024',
      title: 'Top 5 tuyến xe phổ biến dịp Tết 2024',
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400'
    },
    {
      id: 3,
      slug: 'huong-dan-dat-ve-xe-online',
      title: 'Hướng dẫn đặt vé xe online cho người mới',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400'
    },
    {
      id: 4,
      slug: 'an-toan-khi-di-xe-khach',
      title: 'Những lưu ý an toàn khi đi xe khách đường dài',
      image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400'
    }
  ];

  // Mock comments
  const comments = [
    {
      id: 1,
      author: 'Trần Văn A',
      avatar: null,
      content: 'Bài viết rất hữu ích! Mình sẽ áp dụng ngay cho chuyến đi tháng sau. Cảm ơn tác giả!',
      datetime: '2024-01-19 10:30'
    },
    {
      id: 2,
      author: 'Nguyễn Thị B',
      avatar: null,
      content: 'Chi phí rất hợp lý, mình đi nhóm 4 người thì sẽ tiết kiệm hơn nữa. Thanks!',
      datetime: '2024-01-19 14:20'
    }
  ];

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

  const handleLike = () => {
    if (liked) {
      setLikes(likes - 1);
      setLiked(false);
    } else {
      setLikes(likes + 1);
      setLiked(true);
    }
  };

  const handleShare = (platform) => {
    // TODO: Implement actual sharing
    message.success(`Đã chia sẻ lên ${platform}`);
  };

  const handleCommentSubmit = async (values) => {
    // TODO: Integrate with API
    console.log('Comment:', values);
    message.success('Đã gửi bình luận');
    form.resetFields();
  };

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
