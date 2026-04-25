import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import './PrivacyPolicy.css';

const PrivacyPolicy = () => {
  return (
    <div className="privacy-page">
      <div className="privacy-container animate-fade-in">
        <header className="privacy-header">
          <Link to="/" className="btn-back">
            <ArrowLeft size={18} /> Quay lại
          </Link>
          <div className="privacy-logo">
            <Shield size={32} color="var(--vibe-accent)" />
            <h1>Chính sách Bảo mật</h1>
          </div>
        </header>

        <section className="privacy-content glass-card">
          <div className="policy-section">
            <h2>1. Thu thập thông tin</h2>
            <p>
              Chúng tôi thu thập các thông tin cơ bản khi bạn sử dụng tính năng Đăng nhập qua Google hoặc Facebook, bao gồm:
              <strong> Tên hiển thị, Địa chỉ Email và Ảnh đại diện (nếu có).</strong>
            </p>
          </div>

          <div className="policy-section">
            <h2>2. Mục đích sử dụng</h2>
            <p>
              Thông tin của bạn được sử dụng để:
            </p>
            <ul>
              <li>Xác thực danh tính và quản lý tài khoản trên Vibes.</li>
              <li>Cung cấp và duy trì các tính năng của dịch vụ.</li>
              <li>Cải thiện trải nghiệm người dùng và hỗ trợ kỹ thuật.</li>
            </ul>
          </div>

          <div className="policy-section">
            <h2>3. Bảo vệ dữ liệu</h2>
            <p>
              Vibes cam kết bảo mật tuyệt đối thông tin cá nhân của bạn. Chúng tôi không chia sẻ, bán hoặc cho thuê dữ liệu của bạn cho bất kỳ bên thứ ba nào vì mục đích thương mại.
            </p>
          </div>

          <div className="policy-section">
            <h2>4. Xóa dữ liệu</h2>
            <p>
              Người dùng có quyền yêu cầu xóa dữ liệu cá nhân của mình bất kỳ lúc nào bằng cách liên hệ với chúng tôi qua email: <strong>Vanhlenorthside@gmail.com</strong>.
            </p>
          </div>

          <div className="policy-section">
            <h2>5. Liên hệ</h2>
            <p>
              Nếu có bất kỳ câu hỏi nào về chính sách này, vui lòng liên hệ:
              <br />
              Email: Vanhlenorthside@gmail.com
              <br />
              Website: vibes-woad-one.vercel.app
            </p>
          </div>

          <div className="policy-footer">
            <p>Cập nhật lần cuối: 25/04/2026</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
