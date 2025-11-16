import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';
import { Header, Footer, ProtectedRoute } from './components/common';

// Auth Pages
import { Login, Register, OperatorRegister, ForgotPassword } from './pages/auth';

// Public Pages
import { About, Contact } from './pages/public';

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
} from './pages/customer';

// Operator Pages
import {
  Dashboard as OperatorDashboard,
  Buses,
  Routes as OperatorRoutes,
  CreateTrip,
  ManageTrips,
} from './pages/operator';

// Admin Pages
import {
  Dashboard as AdminDashboard,
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

            <Route
              path="/customer/tickets"
              element={
                <ProtectedRoute requireAuth={true}>
                  <Layout>
                    <MyTickets />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/customer/tickets/:ticketId"
              element={
                <ProtectedRoute requireAuth={true}>
                  <Layout>
                    <TicketDetail />
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
