import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const AuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      localStorage.setItem('vibes_token', token);
      // Wait a bit to ensure context updates or just redirect
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1000);
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
