import { Layout } from 'antd';
import {
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  YoutubeOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Footer: AntFooter } = Layout;

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <AntFooter className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Te_QuickRide</h3>
            <p className="text-sm mb-4">
              Hệ thống đặt vé xe khách trực tuyến hàng đầu Việt Nam,
              mang đến trải nghiệm đặt vé nhanh chóng và tiện lợi.
            </p>
            <div className="flex space-x-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-500 transition"
              >
                <FacebookOutlined className="text-xl" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition"
              >
                <TwitterOutlined className="text-xl" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-pink-500 transition"
              >
                <InstagramOutlined className="text-xl" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-red-500 transition"
              >
                <YoutubeOutlined className="text-xl" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Liên kết</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-white transition">
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link to="/routes" className="hover:text-white transition">
                  Tuyến xe
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition">
                  Điều khoản sử dụng
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition">
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition">
                  Câu hỏi thường gặp
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Hỗ trợ</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/help" className="hover:text-white transition">
                  Trung tâm trợ giúp
                </Link>
              </li>
              <li>
                <Link to="/booking-guide" className="hover:text-white transition">
                  Hướng dẫn đặt vé
                </Link>
              </li>
              <li>
                <Link to="/payment-methods" className="hover:text-white transition">
                  Phương thức thanh toán
                </Link>
              </li>
              <li>
                <Link to="/cancellation-policy" className="hover:text-white transition">
                  Chính sách hủy vé
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Liên hệ</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <EnvironmentOutlined className="mr-2 mt-1 text-blue-500" />
                <span>
                  227 Nguyễn Văn Cừ, Phường 4, Quận 5, TP.HCM
                </span>
              </li>
              <li className="flex items-center">
                <PhoneOutlined className="mr-2 text-blue-500" />
                <a href="tel:1900xxxx" className="hover:text-white transition">
                  1900 xxxx
                </a>
              </li>
              <li className="flex items-center">
                <MailOutlined className="mr-2 text-blue-500" />
                <a
                  href="mailto:support@tequickride.vn"
                  className="hover:text-white transition"
                >
                  support@tequickride.vn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm">
          <p>
            &copy; {currentYear} Te_QuickRide. All rights reserved. Developed by Team Te.
          </p>
        </div>
      </div>
    </AntFooter>
  );
};

export default Footer;
