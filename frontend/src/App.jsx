import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';
import { Header, Footer, ProtectedRoute } from './components/common';

// Auth Pages
import { Login, Register, OperatorRegister } from './pages/auth';

// Customer Pages
import {
  Home,
  SearchResults,
  TripDetails,
  Booking,
  Payment,
  MyBookings,
} from './pages/customer';

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
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/operator/register" element={<OperatorRegister />} />

            {/* Customer Routes with Layout */}
            <Route
              path="/"
              element={
                <Layout>
                  <Home />
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

            {/* Protected Routes - Require Authentication */}
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
              path="/my-bookings"
              element={
                <ProtectedRoute requireAuth={true}>
                  <Layout>
                    <MyBookings />
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
