import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import { store } from './redux/store';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';
import { Header, Footer, ProtectedRoute } from './components/common';

// Auth Pages
import { Login, Register, OperatorRegister, ForgotPassword } from './pages/auth';

// Public Pages
import { About, Contact, Help, Blog, BlogDetail, Promotions, Routes as PublicRoutesPage } from './pages/public';

// Customer Pages
import {
  Home,
  SearchResults,
  TripDetails,
  Booking,
  Payment,
  MyBookings,
  BookingSuccess,
  BookingDetail,
  MyProfile,
  MyTickets,
  TicketDetail,
  Notifications,
  MyReviews,
  WriteReview,
  MyVouchers,
} from './pages/customer';

// Payment Demo Pages
import VNPayDemo from './pages/payment/VNPayDemo';
import MoMoDemo from './pages/payment/MoMoDemo';
import ZaloPayDemo from './pages/payment/ZaloPayDemo';

// Operator Pages
import {
  Dashboard as OperatorDashboard,
  Buses,
  Routes as OperatorRoutes,
  CreateTrip,
  ManageTrips,
  OperatorProfile,
  Analytics as OperatorAnalytics,
  Bookings as OperatorBookings,
  Reviews as OperatorReviews,
  Promotions as OperatorPromotions,
} from './pages/operator';

// Admin Pages
import {
  Dashboard as AdminDashboard,
  ManageOperators,
  Analytics as AdminAnalytics,
  ManageUsers,
  ManageVouchers,
  ManageBookings,
  Settings as AdminSettings,
  AdminGuide,
} from './pages/admin';

// Layout Component
const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

// Profile Redirect Component - redirects to appropriate profile based on user role
const ProfileRedirect = () => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect based on user role
  if (user.role === 'operator') {
    return <Navigate to="/operator/profile" replace />;
  } else if (user.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  } else {
    // Default to customer profile
    return <Navigate to="/customer/profile" replace />;
  }
};

function App() {
  return (
    <Provider store={store}>
      <ConfigProvider locale={viVN}>
        <Router>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/operator/register" element={<OperatorRegister />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Public Routes with Layout */}
            <Route
              path="/"
              element={
                <Layout>
                  <Home />
                </Layout>
              }
            />

            <Route
              path="/about"
              element={
                <Layout>
                  <About />
                </Layout>
              }
            />

            <Route
              path="/contact"
              element={
                <Layout>
                  <Contact />
                </Layout>
              }
            />

            <Route
              path="/search"
              element={
                <Layout>
                  <SearchResults />
                </Layout>
              }
            />

            <Route
              path="/trips/:tripId"
              element={
                <Layout>
                  <TripDetails />
                </Layout>
              }
            />

            {/* Profile Redirect Route - redirects to role-specific profile */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute requireAuth={true}>
                  <ProfileRedirect />
                </ProtectedRoute>
              }
            />

            {/* Customer Protected Routes */}
            <Route
              path="/booking"
              element={
                <ProtectedRoute requireAuth={true}>
                  <Layout>
                    <Booking />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/payment/:bookingId"
              element={
                <ProtectedRoute requireAuth={true}>
                  <Layout>
                    <Payment />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Payment Gateway Demo Routes - No Layout (Full Page) */}
            <Route path="/payment/vnpay/demo" element={<VNPayDemo />} />
            <Route path="/payment/momo/demo" element={<MoMoDemo />} />
            <Route path="/payment/zalopay/demo" element={<ZaloPayDemo />} />

            <Route
              path="/booking/success/:bookingId"
              element={
                <ProtectedRoute requireAuth={true}>
                  <Layout>
                    <BookingSuccess />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/my-bookings"
              element={
                <ProtectedRoute requireAuth={true}>
                  <Layout>
                    <MyBookings />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/customer/bookings/:bookingId"
              element={
                <ProtectedRoute requireAuth={true}>
                  <Layout>
                    <BookingDetail />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Operator Protected Routes */}
            <Route
              path="/operator/dashboard"
              element={
                <ProtectedRoute requireAuth={true} requiredRole="operator">
                  <Layout>
                    <OperatorDashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/operator/buses"
              element={
                <ProtectedRoute requireAuth={true} requiredRole="operator">
                  <Layout>
                    <Buses />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/operator/routes"
              element={
                <ProtectedRoute requireAuth={true} requiredRole="operator">
                  <Layout>
                    <OperatorRoutes />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/operator/trips/create"
              element={
                <ProtectedRoute requireAuth={true} requiredRole="operator">
                  <Layout>
                    <CreateTrip />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/operator/trips"
              element={
                <ProtectedRoute requireAuth={true} requiredRole="operator">
                  <Layout>
                    <ManageTrips />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Customer Additional Routes */}
            <Route
              path="/customer/profile"
              element={
                <ProtectedRoute requireAuth={true}>
                  <Layout>
                    <MyProfile />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Ticket Routes */}
            <Route
              path="/my-tickets"
              element={
                <ProtectedRoute requireAuth={true}>
                  <Layout>
                    <MyTickets />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/my-tickets/:ticketId"
              element={
                <ProtectedRoute requireAuth={true}>
                  <Layout>
                    <TicketDetail />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Backward compatibility - redirect old routes */}
            <Route path="/customer/tickets" element={<Navigate to="/my-tickets" replace />} />
            <Route path="/customer/tickets/:ticketId" element={<Navigate to="/my-tickets/:ticketId" replace />} />

            {/* Operator Additional Routes */}
            <Route
              path="/operator/profile"
              element={
                <ProtectedRoute requireAuth={true} requiredRole="operator">
                  <Layout>
                    <OperatorProfile />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/operator/analytics"
              element={
                <ProtectedRoute requireAuth={true} requiredRole="operator">
                  <Layout>
                    <OperatorAnalytics />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/operator/bookings"
              element={
                <ProtectedRoute requireAuth={true} requiredRole="operator">
                  <Layout>
                    <OperatorBookings />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Customer Notifications Route */}
            <Route
              path="/notifications"
              element={
                <ProtectedRoute requireAuth={true}>
                  <Layout>
                    <Notifications />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Customer Reviews Routes */}
            <Route
              path="/customer/reviews"
              element={
                <ProtectedRoute requireAuth={true}>
                  <Layout>
                    <MyReviews />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/bookings/:bookingId/review"
              element={
                <ProtectedRoute requireAuth={true}>
                  <Layout>
                    <WriteReview />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Operator Reviews Route */}
            <Route
              path="/operator/reviews"
              element={
                <ProtectedRoute requireAuth={true} requiredRole="operator">
                  <Layout>
                    <OperatorReviews />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Help Page */}
            <Route
              path="/help"
              element={
                <Layout>
                  <Help />
                </Layout>
              }
            />

            {/* Blog Pages */}
            <Route
              path="/blog"
              element={
                <Layout>
                  <Blog />
                </Layout>
              }
            />

            <Route
              path="/blog/:slug"
              element={
                <Layout>
                  <BlogDetail />
                </Layout>
              }
            />

            {/* Promotions Page */}
            <Route
              path="/promotions"
              element={
                <Layout>
                  <Promotions />
                </Layout>
              }
            />

            {/* Routes Page */}
            <Route
              path="/routes"
              element={
                <Layout>
                  <PublicRoutesPage />
                </Layout>
              }
            />

            {/* Customer Vouchers Route */}
            <Route
              path="/customer/vouchers"
              element={
                <ProtectedRoute requireAuth={true}>
                  <Layout>
                    <MyVouchers />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Admin Protected Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute requireAuth={true} requiredRole="admin">
                  <Layout>
                    <AdminDashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/operators"
              element={
                <ProtectedRoute requireAuth={true} requiredRole="admin">
                  <Layout>
                    <ManageOperators />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/users"
              element={
                <ProtectedRoute requireAuth={true} requiredRole="admin">
                  <Layout>
                    <ManageUsers />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/analytics"
              element={
                <ProtectedRoute requireAuth={true} requiredRole="admin">
                  <Layout>
                    <AdminAnalytics />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/vouchers"
              element={
                <ProtectedRoute requireAuth={true} requiredRole="admin">
                  <Layout>
                    <ManageVouchers />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/bookings"
              element={
                <ProtectedRoute requireAuth={true} requiredRole="admin">
                  <Layout>
                    <ManageBookings />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute requireAuth={true} requiredRole="admin">
                  <Layout>
                    <AdminSettings />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/guide"
              element={
                <ProtectedRoute requireAuth={true} requiredRole="admin">
                  <Layout>
                    <AdminGuide />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Operator Promotions Route */}
            <Route
              path="/operator/promotions"
              element={
                <ProtectedRoute requireAuth={true} requiredRole="operator">
                  <Layout>
                    <OperatorPromotions />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Fallback Route */}
            <Route
              path="*"
              element={
                <Layout>
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
                      <p className="text-xl text-gray-600 mb-4">Trang không tồn tại</p>
                      <a href="/" className="text-blue-600 hover:text-blue-800">
                        Về trang chủ
                      </a>
                    </div>
                  </div>
                </Layout>
              }
            />
          </Routes>
        </Router>
      </ConfigProvider>
    </Provider>
  );
}

export default App;
