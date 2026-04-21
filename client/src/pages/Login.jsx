import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Mail, Lock, ArrowRight, Loader2, Heart, 
  Globe, Sparkles, Eye, EyeOff
} from 'lucide-react';
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
        navigate('/dashboard');
      } else {
        navigate('/register');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Email hoặc mật khẩu không đúng');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (platform) => {
    try {
      setLoading(true);
      // Simulating redirect or OAuth flow
      // In a real app, this would be: window.location.href = `/api/auth/${platform.toLowerCase()}`
      const dummyData = {
        name: `User ${platform}`,
        email: `guest_${platform.toLowerCase()}_${Date.now()}@example.com`,
        platform
      };
      const user = await socialLogin(dummyData.name, dummyData.email, platform);
      
      if (user.isPaid || user.role === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/register');
      }
    } catch (err) {
      setError('Đăng nhập mạng xã hội thất bại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <ParticleCanvas density={40} />
      
      <div className="auth-container">
        <div className="auth-box animate-slide-up">
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

          <div className="social-group">
            <button className="social-btn" onClick={() => handleSocialLogin('Google')}>
              <Globe size={18} /> Google
            </button>
            <button className="social-btn" onClick={() => handleSocialLogin('Facebook')}>
              <Globe size={18} /> Facebook
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
