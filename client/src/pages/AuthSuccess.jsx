import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const AuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      // Gọi API lấy thông tin user ngay để verify trước khi lưu
      const verifyAndRedirect = async () => {
        try {
          // Gửi token trong header tạm thời để lấy user
          const response = await fetch('/api/auth/me', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (response.ok) {
            const userData = await response.json();
            
            // Lưu cả token và user cùng lúc để trạng thái nhất quán
            localStorage.setItem('vibes_token', token);
            localStorage.setItem('vibes_user', JSON.stringify(userData));
            
            // Redirect dựa trên role/payment status
            if (userData.role === 'admin' || userData.isPaid) {
              window.location.href = '/dashboard';
            } else {
              window.location.href = '/register';
            }
          } else {
            navigate('/login');
          }
        } catch (err) {
          console.error('Auth verification failed', err);
          navigate('/login');
        }
      };

      verifyAndRedirect();
    } else {
      navigate('/login');
    }
  }, [searchParams, navigate]);

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center', 
      background: '#030712',
      color: '#fff',
      fontFamily: "'Outfit', sans-serif"
    }}>
      <Loader2 className="spinning" size={48} color="#38bdf8" />
      <h2 style={{ marginTop: '1.5rem', fontWeight: 600 }}>Đang xác thực danh tính...</h2>
      <p style={{ opacity: 0.6, fontSize: '0.9rem' }}>Vui lòng đợi trong giây lát</p>
    </div>
  );
};

export default AuthSuccess;
