import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Crown, X, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './UpgradeNotification.css';

const UpgradeNotification = () => {
  const { user, loading } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Không hiện nếu đang tải, chưa đăng nhập, hoặc đã là premium/admin
    if (loading || !user) return;
    if (user.isPaid || user.role === 'admin') return;

    // Kiểm tra xem user đã tắt thông báo trong phiên này chưa
    const hasDismissed = sessionStorage.getItem('dismissedUpgradeNotification');
    if (hasDismissed) return;

    // Hiện sau 5 giây
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 5000);

    // Ẩn sau 60 giây kể từ lúc hiện (tổng 65s)
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 65000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [user, loading]);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('dismissedUpgradeNotification', 'true');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="upgrade-notification-wrapper"
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <div className="upgrade-notification-content glass-card">
            <button className="btn-close-notification" onClick={handleDismiss}>
              <X size={16} />
            </button>
            <div className="notification-icon-wrap">
              <Crown size={24} fill="#fbbf24" color="#fbbf24" />
            </div>
            <div className="notification-text">
              <h4>Nâng cấp trải nghiệm</h4>
              <p>Mở khóa toàn bộ giao diện độc quyền và trò chuyện cùng cộng đồng Premium!</p>
            </div>
            <Link to="/register" className="btn-upgrade-now" onClick={handleDismiss}>
              Nâng cấp ngay <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UpgradeNotification;
