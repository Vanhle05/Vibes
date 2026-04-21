import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, MapPin, Globe, 
  Eye, Edit3, Save, X, Upload, Sparkles, ExternalLink, Lock,
  CheckCircle, AlertCircle, Plus, Trash2, BarChart2, Camera, Settings, ArrowRight, Zap, Copy, Layout, Palette
} from 'lucide-react';
import DynamicLogo from '../components/DynamicLogo';
import Navbar from '../components/Navbar';
import './Dashboard.css';

const THEMES = [
  { id: 'dark', label: 'Dark', color: '#030712' },
  { id: 'neon', label: 'Neon', color: '#0f0a1e' },
  { id: 'ocean', label: 'Ocean', color: '#0c1a2e' },
  { id: 'sunset', label: 'Sunset', color: '#1a0a0a' },
  { id: 'light', label: 'Light', color: '#f8fafc' },
];

const SOCIAL_FIELDS = [
  { key: 'facebook', label: 'Facebook', icon: <Globe size={16} />, placeholder: 'https://www.facebook.com/username' },
  { key: 'instagram', label: 'Instagram', icon: <Globe size={16} />, placeholder: 'https://www.instagram.com/username' },
  { key: 'tiktok', label: 'TikTok', icon: <Globe size={16} />, placeholder: 'https://www.tiktok.com/@username' },
  { key: 'twitter', label: 'X (Twitter)', icon: <Globe size={16} />, placeholder: 'https://x.com/username' },
  { key: 'website', label: 'Website', icon: <Globe size={16} />, placeholder: 'https://yourwebsite.com' },
];

const Dashboard = () => {
  const { user, refreshUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileRef = useRef();

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    // Nếu chưa thanh toán, không cho vào Dashboard (trừ admin)
    if (user && !user.isPaid && user.role !== 'admin') {
      navigate('/register');
      return;
    }

    api.get('/profile/me').then(r => {
      setProfile(r.data);
      const initialForm = { ...r.data };
      
      // Nếu user vừa chọn template từ trang Explore
      if (location.state?.templateId) {
        initialForm.templateId = location.state.templateId;
        showToast('Đã áp dụng mẫu thiết kế mới! ✨');
      }
      
      setForm(initialForm);
      setUsername(user?.username || '');
    }).catch(() => showToast('Không thể tải thông tin', 'error'))
      .finally(() => setLoading(false));
  }, [location.state]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.put('/profile/me', form);
      setProfile(res.data);
      showToast('Đã lưu bản sắc thành công! ✨');
    } catch (err) {
      showToast(err.response?.data?.message || 'Lưu thất bại', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatar = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setAvatarPreview(ev.target.result);
    reader.readAsDataURL(file);
    const fd = new FormData();
    fd.append('avatar', file);
    try {
      const res = await api.post('/profile/avatar', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setForm(p => ({ ...p, avatar: res.data.avatarUrl }));
      showToast('Cập nhật avatar thành công!');
    } catch {
      showToast('Upload thất bại', 'error');
    }
  };

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const setSocial = (k, v) => setForm(p => ({ ...p, socials: { ...p.socials, [k]: v } }));

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <div className="dashboard">
      <Navbar />
      {toast && (
        <div className={`toast toast-${toast.type} animate-slide-up`}>
          {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {toast.msg}
        </div>
      )}

      <div className="dashboard-layout container">
        <aside className="dash-sidebar glass-card">
          <div className="dash-avatar-wrap">
            <div className="dash-avatar" onClick={() => fileRef.current?.click()}>
              {(avatarPreview || form.avatar)
                ? <img src={avatarPreview || form.avatar} alt="avatar" />
                : <DynamicLogo seed={form.displayName || user?.name || 'U'} size={80} />
              }
              <div className="avatar-edit-overlay"><Camera size={18} /></div>
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatar} style={{ display: 'none' }} />
            <div className="dash-name">{form.displayName || user?.name}</div>
            <div className="dash-tagline">{form.tagline || 'Chưa có tagline'}</div>
            
            <div className="sidebar-actions">
              <button className="btn btn-sm btn-ghost" onClick={() => navigate('/explore')}>
                <Layout size={14} /> Đổi mẫu thiết kế
              </button>
              {user?.username && (
                <a href={`/profile/${user.username}`} target="_blank" rel="noreferrer" className="btn btn-sm btn-primary">
                  <ExternalLink size={14} /> Xem trang
                </a>
              )}
            </div>
          </div>

          <nav className="dash-nav">
            <button className={`dash-nav-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
              <User size={16} /> Thông tin
            </button>
            <button className={`dash-nav-item ${activeTab === 'socials' ? 'active' : ''}`} onClick={() => setActiveTab('socials')}>
              <Globe size={16} /> Liên kết
            </button>
            <button className={`dash-nav-item ${activeTab === 'appearance' ? 'active' : ''}`} onClick={() => setActiveTab('appearance')}>
              <Palette size={16} /> Giao diện
            </button>
          </nav>
        </aside>

        <main className="dash-main">
          <div className="dash-header">
            <h1>Thiết lập <span className="gradient-text">Bản sắc</span></h1>
            <p>Tùy chỉnh trang cá nhân của bạn để tạo ấn tượng mạnh mẽ nhất.</p>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'profile' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="dash-panel glass-card">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Tên hiển thị</label>
                    <input className="input-field" value={form.displayName || ''} onChange={e => set('displayName', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Tagline (Slogan ngắn)</label>
                    <input className="input-field" value={form.tagline || ''} onChange={e => set('tagline', e.target.value)} />
                  </div>
                  <div className="form-group full-width">
                    <label>Bio / Giới thiệu chi tiết</label>
                    <textarea className="input-field" rows={4} value={form.bio || ''} onChange={e => set('bio', e.target.value)} />
                  </div>
                </div>
                <div className="panel-footer">
                  <button className="btn-vibe-primary" onClick={handleSave} disabled={saving}>
                    {saving ? <Loader2 className="spinning" /> : <><Save size={18} /> Lưu thay đổi</>}
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'socials' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="dash-panel glass-card">
                <div className="form-grid">
                  {SOCIAL_FIELDS.map(f => (
                    <div key={f.key} className="form-group">
                      <label>{f.label}</label>
                      <input className="input-field" placeholder={f.placeholder} value={form.socials?.[f.key] || ''} onChange={e => setSocial(f.key, e.target.value)} />
                    </div>
                  ))}
                </div>
                <div className="panel-footer">
                  <button className="btn-vibe-primary" onClick={handleSave} disabled={saving}>
                    <Save size={18} /> Lưu liên kết
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'appearance' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="dash-panel glass-card">
                <div className="form-group">
                  <label>Mẫu thiết kế hiện tại: <span style={{color: 'var(--accent-main)'}}>#{form.templateId || 'Cơ bản'}</span></label>
                  <button className="btn btn-ghost" style={{marginTop: '0.5rem'}} onClick={() => navigate('/explore')}>
                    <Layout size={16} /> Chọn mẫu khác từ Explore
                  </button>
                </div>
                <div className="form-group">
                  <label>Màu chủ đạo</label>
                  <div className="color-picker-wrap">
                    <input type="color" value={form.coverColor || '#38bdf8'} onChange={e => set('coverColor', e.target.value)} />
                    <span>{form.coverColor || '#38bdf8'}</span>
                  </div>
                </div>
                <div className="panel-footer">
                  <button className="btn-vibe-primary" onClick={handleSave} disabled={saving}>
                    <Save size={18} /> Lưu giao diện
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <aside className="dash-preview-panel glass-card">
          <div className="preview-label">BẢN XEM TRƯỚC</div>
          <div className="mock-phone" style={{ background: THEMES.find(t => t.id === form.theme)?.color || '#030712' }}>
            <div className="mock-screen">
              <div className={`template-preview-style t-${form.templateId || 0}`}>
                <div className="mock-avatar" style={{ border: `2px solid ${form.coverColor || '#38bdf8'}` }}>
                  {(avatarPreview || form.avatar) ? <img src={avatarPreview || form.avatar} alt="" /> : <DynamicLogo seed={form.displayName || 'U'} size={60} />}
                </div>
                <div className="mock-name">{form.displayName || 'Họ tên của bạn'}</div>
                <div className="mock-tagline" style={{ color: form.coverColor || '#38bdf8' }}>{form.tagline || 'Chuyên môn của bạn'}</div>
                <div className="mock-bio">{form.bio || 'Lời giới thiệu ấn tượng...'}</div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Dashboard;
