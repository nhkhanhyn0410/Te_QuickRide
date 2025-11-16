// Blog Service - Mock data implementation
// TODO: Replace with real API when backend blog API is ready

const mockBlogPosts = [
  {
    id: 1,
    slug: 'kinh-nghiem-du-lich-da-lat-tu-tuc',
    title: 'Kinh nghiệm du lịch Đà Lạt tự túc - Tiết kiệm chi phí',
    excerpt: 'Chia sẻ kinh nghiệm du lịch Đà Lạt tự túc với budget tiết kiệm, những địa điểm check-in đẹp và cách di chuyển thuận tiện nhất từ TP.HCM.',
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

Chúc bạn có chuyến đi vui vẻ! Đừng quên đặt vé xe sớm qua Te_QuickRide để được giá tốt nhất nhé!
    `,
    image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800',
    category: 'travel-tips',
    author: {
      name: 'Nguyễn Minh Anh',
      avatar: null,
      bio: 'Travel blogger, yêu thích khám phá những điểm đến mới'
    },
    publishDate: '2024-01-18',
    views: 1250,
    likes: 125,
    tags: ['Đà Lạt', 'Du lịch tự túc', 'Tiết kiệm'],
    comments: [
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
    ]
  },
  {
    id: 2,
    slug: 'top-5-tuyen-xe-pho-bien-tet-2024',
    title: 'Top 5 tuyến xe phổ biến dịp Tết Nguyên Đán 2024',
    excerpt: 'Tổng hợp những tuyến xe khách được đặt nhiều nhất dịp Tết 2024 và mẹo đặt vé sớm để có giá tốt nhất.',
    content: 'Nội dung chi tiết về top 5 tuyến xe phổ biến dịp Tết...',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800',
    category: 'news',
    author: {
      name: 'Trần Văn Bình',
      avatar: null,
      bio: 'Chuyên gia tư vấn du lịch'
    },
    publishDate: '2024-01-15',
    views: 2340,
    likes: 234,
    tags: ['Tết 2024', 'Đặt vé', 'Tuyến hot'],
    comments: []
  },
  {
    id: 3,
    slug: 'huong-dan-dat-ve-xe-online-cho-nguoi-moi',
    title: 'Hướng dẫn đặt vé xe online cho người mới bắt đầu',
    excerpt: 'Hướng dẫn chi tiết từng bước đặt vé xe khách trực tuyến trên Te_QuickRide, từ tìm kiếm đến thanh toán và nhận vé.',
    content: 'Nội dung hướng dẫn đặt vé chi tiết...',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
    category: 'guide',
    author: {
      name: 'Lê Thu Hà',
      avatar: null,
      bio: 'Customer Support Manager'
    },
    publishDate: '2024-01-12',
    views: 1890,
    likes: 189,
    tags: ['Hướng dẫn', 'Đặt vé online', 'Người mới'],
    comments: []
  },
  {
    id: 4,
    slug: 'nhung-diem-dung-chan-nghi-duong-yen-tinh',
    title: 'Những điểm dừng chân nghỉ dưỡng yên tĩnh trên đường đi',
    excerpt: 'Gợi ý những quán cafe, nhà hàng và khu nghỉ dưỡng lý tưởng để dừng chân trên các tuyến đường phổ biến.',
    content: 'Nội dung về các điểm dừng chân...',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
    category: 'travel-tips',
    author: {
      name: 'Phạm Quốc Anh',
      avatar: null,
      bio: 'Travel blogger'
    },
    publishDate: '2024-01-10',
    views: 980,
    likes: 98,
    tags: ['Điểm dừng chân', 'Nghỉ ngơi', 'Cafe'],
    comments: []
  },
  {
    id: 5,
    slug: 'an-toan-khi-di-xe-khach-duong-dai',
    title: 'Những lưu ý an toàn khi đi xe khách đường dài',
    excerpt: 'Tổng hợp các mẹo và lưu ý quan trọng để đảm bảo an toàn và thoải mái trong suốt hành trình đi xe khách.',
    content: 'Nội dung về an toàn khi đi xe...',
    image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800',
    category: 'safety',
    author: {
      name: 'Võ Minh Tuấn',
      avatar: null,
      bio: 'Safety Expert'
    },
    publishDate: '2024-01-08',
    views: 1560,
    likes: 156,
    tags: ['An toàn', 'Mẹo hay', 'Hành trình'],
    comments: []
  },
  {
    id: 6,
    slug: 'khac-biet-giua-ghe-ngoi-va-giuong-nam',
    title: 'Sự khác biệt giữa xe ghế ngồi và giường nằm',
    excerpt: 'So sánh chi tiết về ưu nhược điểm của xe ghế ngồi và giường nằm để bạn lựa chọn phù hợp với nhu cầu.',
    content: 'Nội dung so sánh loại xe...',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800',
    category: 'guide',
    author: {
      name: 'Đặng Thị Mai',
      avatar: null,
      bio: 'Content Writer'
    },
    publishDate: '2024-01-05',
    views: 2150,
    likes: 215,
    tags: ['Loại xe', 'So sánh', 'Lựa chọn'],
    comments: []
  },
  {
    id: 7,
    slug: 'mon-an-dac-san-mien-tay',
    title: 'Những món ăn đặc sản không thể bỏ qua khi đến miền Tây',
    excerpt: 'Khám phá ẩm thực miền Tây với những món ăn đặc sản nổi tiếng và địa chỉ thưởng thức đáng tin cậy.',
    content: 'Nội dung về ẩm thực miền Tây...',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
    category: 'travel-tips',
    author: {
      name: 'Nguyễn Văn Long',
      avatar: null,
      bio: 'Food blogger'
    },
    publishDate: '2024-01-03',
    views: 1720,
    likes: 172,
    tags: ['Miền Tây', 'Ẩm thực', 'Đặc sản'],
    comments: []
  },
  {
    id: 8,
    slug: 'tet-2024-nhung-dieu-can-biet-khi-di-xe',
    title: 'Tết 2024: Những điều cần biết khi đi xe khách',
    excerpt: 'Thông tin quan trọng về giá vé, lịch trình và các quy định đặc biệt trong dịp Tết Nguyên Đán 2024.',
    content: 'Nội dung về đi xe dịp Tết...',
    image: 'https://images.unsplash.com/photo-1548678967-f1aec58f6fb2?w=800',
    category: 'news',
    author: {
      name: 'Trần Minh Châu',
      avatar: null,
      bio: 'Travel consultant'
    },
    publishDate: '2024-01-01',
    views: 3200,
    likes: 320,
    tags: ['Tết 2024', 'Thông tin', 'Lịch trình'],
    comments: []
  }
];

export const blogService = {
  // Get all blogs with optional filters
  getAllBlogs: async (params = {}) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    let filteredBlogs = [...mockBlogPosts];

    // Filter by category
    if (params.category && params.category !== 'all') {
      filteredBlogs = filteredBlogs.filter(blog => blog.category === params.category);
    }

    // Filter by search text
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filteredBlogs = filteredBlogs.filter(blog =>
        blog.title.toLowerCase().includes(searchLower) ||
        blog.excerpt.toLowerCase().includes(searchLower) ||
        blog.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Sort by date (newest first)
    filteredBlogs.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));

    return {
      success: true,
      data: {
        blogs: filteredBlogs,
        total: filteredBlogs.length
      }
    };
  },

  // Get blog by slug
  getBlogBySlug: async (slug) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const blog = mockBlogPosts.find(post => post.slug === slug);

    if (!blog) {
      return {
        success: false,
        message: 'Không tìm thấy bài viết'
      };
    }

    // Increment views (in real API, this would be done server-side)
    blog.views += 1;

    return {
      success: true,
      data: { blog }
    };
  },

  // Add comment to blog (mock - will be replaced with real API)
  addComment: async (blogId, comment) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const blog = mockBlogPosts.find(post => post.id === blogId);

    if (!blog) {
      return {
        success: false,
        message: 'Không tìm thấy bài viết'
      };
    }

    const newComment = {
      id: Date.now(),
      author: 'Anonymous User', // In real app, get from auth
      avatar: null,
      content: comment,
      datetime: new Date().toISOString()
    };

    blog.comments = blog.comments || [];
    blog.comments.push(newComment);

    return {
      success: true,
      data: { comment: newComment },
      message: 'Đã thêm bình luận'
    };
  },

  // Like blog (mock - will be replaced with real API)
  likeBlog: async (blogId) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));

    const blog = mockBlogPosts.find(post => post.id === blogId);

    if (!blog) {
      return {
        success: false,
        message: 'Không tìm thấy bài viết'
      };
    }

    blog.likes += 1;

    return {
      success: true,
      data: { likes: blog.likes },
      message: 'Đã thích bài viết'
    };
  },

  // Unlike blog (mock - will be replaced with real API)
  unlikeBlog: async (blogId) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));

    const blog = mockBlogPosts.find(post => post.id === blogId);

    if (!blog) {
      return {
        success: false,
        message: 'Không tìm thấy bài viết'
      };
    }

    blog.likes = Math.max(0, blog.likes - 1);

    return {
      success: true,
      data: { likes: blog.likes },
      message: 'Đã bỏ thích bài viết'
    };
  }
};

export default blogService;
