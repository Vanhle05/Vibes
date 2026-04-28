import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const AuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      // Xóa token khỏi URL NGAY LẬP TỨC để không lộ qua browser history / referrer
      window.history.replaceState({}, document.title, '/auth/success');

      const verifyAndRedirect = async () => {
        try {
          const response = await fetch('/api/auth/me', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (response.ok) {
            const userData = await response.json();
            localStorage.setItem('vibes_token', token);
            localStorage.setItem('vibes_user', JSON.stringify(userData));
            window.location.href = '/explore';
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
