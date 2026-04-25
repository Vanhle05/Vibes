import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trash2 } from 'lucide-react';
import './DataDeletion.css';

const DataDeletion = () => {
  return (
    <div className="privacy-page">
      <div className="privacy-container animate-fade-in">
        <header className="privacy-header">
          <Link to="/" className="btn-back">
            <ArrowLeft size={18} /> Quay lại
          </Link>
          <div className="privacy-logo">
            <Trash2 size={32} color="#f87171" />
            <h1>Yêu cầu Xóa dữ liệu</h1>
          </div>
        </header>

        <section className="privacy-content glass-card">
          <div className="policy-section">
            <h2>Hướng dẫn xóa dữ liệu người dùng</h2>
            <p>
              Nếu bạn muốn xóa dữ liệu cá nhân của mình khỏi ứng dụng Vibes, vui lòng làm theo các hướng dẫn dưới đây. Đây là quyền lợi của bạn theo chính sách bảo mật của chúng tôi và quy định của Meta (Facebook).
            </p>
          </div>

          <div className="policy-section">
            <h2>1. Cách gửi yêu cầu</h2>
            <p>
              Vui lòng gửi email đến địa chỉ: <strong>Vanhlenorthside@gmail.com</strong>
            </p>
            <p>
              Với tiêu đề: <strong>Yêu cầu xóa dữ liệu người dùng - [Tên của bạn]</strong>
            </p>
          </div>

          <div className="policy-section">
            <h2>2. Thời gian xử lý</h2>
            <p>
              Chúng tôi sẽ tiếp nhận và xử lý yêu cầu của bạn trong vòng <strong>7 ngày làm việc</strong>. Sau khi hoàn tất, bạn sẽ nhận được email xác nhận rằng dữ liệu đã được xóa vĩnh viễn khỏi hệ thống.
            </p>
          </div>

          <div className="policy-section">
            <h2>3. Dữ liệu nào sẽ bị xóa?</h2>
            <p>
              Khi yêu cầu được thực hiện, tất cả thông tin liên quan đến tài khoản của bạn sẽ bị xóa bỏ hoàn toàn, bao gồm:
            </p>
            <ul>
              <li>Tên hiển thị và Email.</li>
              <li>Ảnh đại diện và các liên kết mạng xã hội.</li>
              <li>Lịch sử hoạt động và các cài đặt cá nhân trên hệ thống Vibes.</li>
            </ul>
          </div>

          <div className="policy-section">
            <p style={{ fontStyle: 'italic', fontSize: '0.9rem' }}>
              Lưu ý: Sau khi xóa, hành động này không thể hoàn tác. Bạn sẽ cần đăng ký lại từ đầu nếu muốn sử dụng lại dịch vụ.
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

export default DataDeletion;
