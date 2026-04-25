import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
// --- Security Warning for Console (Self-XSS Protection) ---
if (import.meta.env.PROD) {
  console.log(
    "%c CẢNH BÁO BẢO MẬT! ",
    "color: white; background: red; font-size: 24px; font-weight: bold; padding: 10px; border-radius: 5px;"
  );
  console.log(
    "%c Đây là vùng dành cho nhà phát triển. Việc dán mã lạ vào đây có thể khiến bạn bị đánh cắp thông tin cá nhân. Chúng tôi không bao giờ yêu cầu bạn dán bất kỳ thứ gì vào đây. ",
    "color: #ff6b6b; font-size: 14px; font-weight: bold; line-height: 1.5;"
  );
  console.log(
    "%c Nếu ai đó yêu cầu bạn dán mã ở đây, hãy đóng cửa sổ này ngay lập tức để bảo vệ tài khoản của bạn. ",
    "color: #ccc; font-size: 12px;"
  );
}
