import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { 
  User, Mail, Lock, Phone, CreditCard, ArrowRight, 
  Loader2, Sparkles, Heart, Globe, ShieldCheck, Zap, Eye, EyeOff, Calendar, AlertCircle
} from 'lucide-react';
import ParticleCanvas from '../components/ParticleCanvas';
import './Auth.css';

const Register = () => {
  const { register, login, user: authUser, refreshUser } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1); 
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '',
    phone: '', 
    cccd: '',
    gender: 'Nam',
    birthYear: '2000'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderCode, setOrderCode] = useState(null);
  
  // Payment info from API
  const [paymentInfo, setPaymentInfo] = useState({
    bankBin: '',
    bankAccount: '',
    bankOwner: '',
    price: 2000,
    nextOrderNumber: 1
  });
  const [payOSData, setPayOSData] = useState(null);

  // Fetch payment info on mount
  useEffect(() => {
    api.get('/payment/info').then(res => {
      setPaymentInfo({
        bankBin: res.data.bankBin,
        bankAccount: res.data.bankAccount,
        bankOwner: res.data.bankOwner,
        price: res.data.price,
        nextOrderNumber: res.data.nextOrderNumber
      });
    }).catch(err => console.error('Lỗi tải thông tin thanh toán:', err));
  }, []);

  // If already logged in but not paid, skip to step 2
  useEffect(() => {
    if (authUser && !authUser.isPaid && step === 1 && !orderCode && !payOSData) {
      setStep(2);
      api.post('/payment/create-link').then(res => {
        setOrderCode(res.data?.orderCode);
        setPayOSData(res.data);
      }).catch(() => setOrderCode(Date.now()));
    }
  }, [authUser, step, orderCode, payOSData]);

  useEffect(() => {
    let interval;
    if (step === 2 && orderCode) {
      interval = setInterval(async () => {
        try {
          const res = await api.get(`/payment/check/${orderCode}`);
          console.log('[Payment Poll] Status:', res.data.status);
          if (res.data.status === 'PAID' || res.data.status === 'confirmed') {
            console.log('[Payment Poll] SUCCESS! Moving to success screen.');
            setStep(3);
            await refreshUser();
            clearInterval(interval);
          }
        } catch (e) {
          console.error('[Payment Poll Error]', e);
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [step, orderCode, refreshUser]);

  const handleManualCheck = async () => {
    if (!orderCode) return;
    setLoading(true);
    try {
      const res = await api.get(`/payment/check/${orderCode}`);
      console.log('[Manual Check] Status:', res.data.status);
      if (res.data.status === 'PAID' || res.data.status === 'confirmed') {
        setStep(3);
        await refreshUser();
      } else {
        alert('Hệ thống chưa nhận được thanh toán (Trạng thái: ' + res.data.status + '). Vui lòng đợi 1-2 phút để ngân hàng xử lý giao dịch hoặc kiểm tra lại nội dung chuyển khoản.');
      }
    } catch (err) {
      console.error('[Manual Check Error]', err);
      alert('Lỗi khi kiểm tra thanh toán. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitInfo = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await register(
        form.name, form.email, form.password, 
        form.phone, form.cccd, form.gender, 
        form.birthYear, 'Tạo bản sắc mới'
      );
      await login(form.email, form.password);
      
      const payRes = await api.post('/payment/create-link');
      setOrderCode(payRes.data?.orderCode || Date.now());
      setPayOSData(payRes.data);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại. Email hoặc CCCD có thể đã tồn tại.');
    } finally {
      setLoading(false);
    }
  };

  const transferNote = payOSData?.description || `VIBES ${authUser?.name?.toUpperCase().replace(/ /g, '') || ''}`;
  const qrUrl = payOSData?.qrCode 
    ? `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(payOSData.qrCode)}`
    : `https://img.vietqr.io/image/${paymentInfo.bankBin}-${paymentInfo.bankAccount}-compact2.png?amount=${paymentInfo.price}&addInfo=${transferNote}&accountName=${paymentInfo.bankOwner}`;

  if (step === 3) return (
    <div className="auth-page">
      <ParticleCanvas />
      <div className="auth-box animate-slide-up" style={{textAlign: 'center', maxWidth: '450px'}}>
        <div style={{background: 'rgba(var(--vibe-accent-rgb), 0.1)', width: '100px', height: '100px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', border: '1px solid var(--vibe-accent)'}}>
          <Zap size={48} color="var(--vibe-accent)" fill="var(--vibe-accent)" />
        </div>
        <h1 className="auth-title">Chào mừng gia nhập!</h1>
        <p style={{color: 'rgba(255,255,255,0.6)', marginBottom: '2.5rem', lineHeight: '1.6'}}>Tài khoản của bạn đã được kích hoạt vĩnh viễn. Hãy bắt đầu kiến tạo bản sắc số của riêng bạn ngay bây giờ.</p>
        <button onClick={() => navigate('/explore')} className="btn-vibe-primary" style={{width: '100%'}}>
          Khám phá Vibes ngay <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );

  if (step === 2) return (
    <div className="auth-page">
      <ParticleCanvas density={30} />
      <div className="auth-container" style={{maxWidth: '650px'}}>
        <div className="auth-box animate-slide-up">
          <div className="auth-header">
            <h1 className="auth-title">Kích hoạt Premium</h1>
            <p className="auth-subtitle-vibe">PHÍ KÍCH HOẠT DUY NHẤT: {paymentInfo.price?.toLocaleString()} VNĐ</p>
          </div>

          <div className="payment-grid">
              <div className="qr-section">
                <div className="qr-container">
                  {(payOSData?.qrCode || (paymentInfo.bankBin && paymentInfo.bankAccount)) ? (
                    <img src={qrUrl} alt="VietQR" className="qr-image" />
                  ) : (
                    <div className="qr-placeholder-vibe">
                      <Loader2 size={32} className="spinning" />
                    </div>
                  )}
                  <div className="qr-overlay-scan"></div>
                </div>
                <div className="payment-status">
                   Đang chờ chuyển khoản...
                </div>
              </div>

            <div className="payment-info-box">
              <div className="info-item">
                <span className="label">Chủ tài khoản</span>
                <span className="value uppercase">{paymentInfo.bankOwner}</span>
              </div>
              <div className="info-item">
                <span className="label">Số tài khoản</span>
                <span className="value">{paymentInfo.bankAccount}</span>
              </div>
              <div className="info-item highlight">
                <span className="label">Nội dung (Bắt buộc)</span>
                <span className="value">{transferNote}</span>
              </div>
              <div className="info-item">
                <span className="label">Số tiền</span>
                <span className="value highlight-text">{paymentInfo.price?.toLocaleString()}đ</span>
              </div>
              
              <div className="payment-help">
                <AlertCircle size={14} /> Quét mã để tự động nhập nội dung
              </div>

              <button 
                onClick={handleManualCheck} 
                className="btn-vibe-secondary" 
                style={{width: '100%', marginTop: '1.5rem'}}
                disabled={loading}
              >
                {loading ? <Loader2 size={16} className="spinning" /> : 'Tôi đã chuyển khoản'}
              </button>
            </div>
          </div>
          
          <div className="auth-footer-note">
            <ShieldCheck size={14} /> Thanh toán an toàn qua PayOS & VietQR
          </div>
        </div>
      </div>
    </div>
  );

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
            <h1 className="auth-title">Kiến tạo Bản sắc</h1>
            <p className="auth-subtitle-vibe">HÀNH TRÌNH SỐ CỦA RIÊNG BẠN</p>
          </div>

          {error && <div className="auth-error-toast">{error}</div>}

          <form onSubmit={handleSubmitInfo} className="auth-form-grid">
            <div className="input-group">
              <label><User size={14} /> Họ và tên đầy đủ</label>
              <input className="input-field" placeholder="Nguyễn Văn A" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            </div>

            <div className="form-row">
              <div className="input-group">
                <label><User size={14} /> Giới tính</label>
                <select className="input-field" value={form.gender} onChange={e => setForm({...form, gender: e.target.value})}>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>
              <div className="input-group">
                <label><Calendar size={14} /> Năm sinh</label>
                <input className="input-field" type="number" min="1950" max="2020" value={form.birthYear} onChange={e => setForm({...form, birthYear: e.target.value})} required />
              </div>
            </div>

            <div className="input-group">
              <label><CreditCard size={14} /> Căn cước công dân (12 số)</label>
              <input className="input-field" placeholder="Mã CCCD của bạn" value={form.cccd} onChange={e => setForm({...form, cccd: e.target.value})} required maxLength={12} />
            </div>

            <div className="input-group">
              <label><Mail size={14} /> Địa chỉ Email</label>
              <input className="input-field" type="email" placeholder="example@vibes.vn" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
            </div>

            <div className="input-group">
              <label><Phone size={14} /> Số điện thoại</label>
              <input className="input-field" placeholder="09xx xxx xxx" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required />
            </div>

            <div className="input-group">
              <label><Lock size={14} /> Thiết lập mật khẩu</label>
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

            <div className="input-group">
              <label><Lock size={14} /> Xác nhận mật khẩu</label>
              <div className="password-input-wrap">
                <input 
                  className="input-field" 
                  type={showConfirmPass ? 'text' : 'password'} 
                  placeholder="••••••••" 
                  value={form.confirmPassword} 
                  onChange={e => setForm({...form, confirmPassword: e.target.value})} 
                  required 
                />
                <button type="button" className="pass-toggle" onClick={() => setShowConfirmPass(!showConfirmPass)}>
                  {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-vibe-primary" disabled={loading}>
              {loading ? <Loader2 className="spinning" /> : <>Tiếp tục thanh toán <ArrowRight size={18} /></>}
            </button>
          </form>

          <p className="auth-footer">
            Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
