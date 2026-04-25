import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Mail, Lock, ArrowRight, Loader2, Heart, 
  Globe, Sparkles, Eye, EyeOff
} from 'lucide-react';
import api from '../api';
import ParticleCanvas from '../components/ParticleCanvas';
import './Auth.css';

const Login = () => {
  const { login, socialLogin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await login(form.email, form.password);
      if (user.isPaid || user.role === 'admin') {
        navigate('/explore');
      } else {
        navigate('/register');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Email hoặc mật khẩu không đúng');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (platform) => {
    // URL Backend thực tế (Local là 5000, Deploy là cùng domain)
    const backendUrl = window.location.hostname === 'localhost' 
      ? 'http://localhost:5000/api' 
      : '/api';
    
    window.location.href = `${backendUrl}/auth/${platform.toLowerCase()}`;
  };

  return (
    <div className="auth-page">
      <ParticleCanvas density={40} />
      
      <div className="auth-container">
        <div className="auth-box animate-slide-up">
          {/* Back to Home Button Inside Box */}
          <Link to="/" className="btn-back-home">
            Về với vanh <Heart size={16} fill="currentColor" className="heart-shadow" />
          </Link>
          <div className="auth-header">
            <div className="auth-logo">
              <Sparkles size={24} color="var(--vibe-accent)" fill="var(--vibe-accent)" />
              <span>Vibes</span>
            </div>
            <h1 className="auth-title">Chào mừng trở lại</h1>
            <p className="auth-subtitle-vibe">HÃY TIẾP TỤC KIẾN TẠO</p>
          </div>

          {error && <div className="auth-error-toast">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <label><Mail size={14} /> Email định danh</label>
              <input 
                className="input-field" 
                type="email" 
                placeholder="vanh@vibes.vn"
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                required
              />
            </div>

            <div className="input-group">
              <label><Lock size={14} /> Mật khẩu</label>
              <div className="password-input-wrap">
                <input 
                  className="input-field" 
                  type={showPass ? 'text' : 'password'} 
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})}
                  required
                />
                <button type="button" className="pass-toggle" onClick={() => setShowPass(!showPass)}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-vibe-primary" disabled={loading}>
              {loading ? <Loader2 className="spinning" /> : <>Đăng nhập Vibes <ArrowRight size={18} /></>}
            </button>
          </form>

          <div className="social-divider">Hoặc tiếp tục với</div>

          <div className="social-grid">
            <button className="btn-social google" onClick={() => handleSocialLogin('Google')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.07-3.71 1.07-2.85 0-5.27-1.92-6.13-4.51H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.87 14.13c-.22-.67-.35-1.39-.35-2.13s.13-1.46.35-2.13V7.03H2.18C1.43 8.53 1 10.21 1 12s.43 3.47 1.18 4.97l3.69-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.03l3.69 2.84c.86-2.59 3.28-4.51 6.13-4.51z" fill="#EA4335"/>
              </svg>
              <span>Google</span>
            </button>
            <button className="btn-social facebook" onClick={() => handleSocialLogin('Facebook')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span>Facebook</span>
            </button>
          </div>

          <p className="auth-footer">
            Chưa có bản sắc? <Link to="/register">Đăng ký ngay</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
