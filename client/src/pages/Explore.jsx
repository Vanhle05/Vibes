import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, Search, Filter, Lock, Eye, 
  ArrowRight, Crown, Zap, Palette, Layers, Layout
} from 'lucide-react';
import Navbar from '../components/Navbar';
import './Explore.css';

// Design Engine: Generating 100+ unique templates
const CATEGORIES = ['Tất cả', 'Modern', 'Minimal', 'Cyberpunk', 'Luxury', 'Creative', 'Business'];

const PALETTES = [
  { name: 'Cyber Neon', from: '#0f172a', to: '#1e293b', accent: '#38bdf8', glow: 'rgba(56, 189, 248, 0.4)' },
  { name: 'Royal Gold', from: '#1a1a1a', to: '#0a0a0a', accent: '#fbbf24', glow: 'rgba(251, 191, 36, 0.4)' },
  { name: 'Deep Sea', from: '#0c4a6e', to: '#082f49', accent: '#0ea5e9', glow: 'rgba(14, 165, 233, 0.4)' },
  { name: 'Midnight Rose', from: '#4c0519', to: '#881337', accent: '#f43f5e', glow: 'rgba(244, 63, 94, 0.4)' },
  { name: 'Emerald Forest', from: '#064e3b', to: '#065f46', accent: '#10b981', glow: 'rgba(16, 185, 129, 0.4)' },
  { name: 'Violet Vision', from: '#2e1065', to: '#4c1d95', accent: '#a855f7', glow: 'rgba(168, 85, 247, 0.4)' },
  { name: 'Slate Gray', from: '#1e293b', to: '#0f172a', accent: '#94a3b8', glow: 'rgba(148, 163, 184, 0.4)' },
  { name: 'Sunburst', from: '#7c2d12', to: '#9a3412', accent: '#f97316', glow: 'rgba(249, 115, 22, 0.4)' }
];

const LAYOUTS = ['Centered', 'Grid-Heavy', 'Split-Vertical', 'Minimalist-Line', 'Dynamic-Shape'];

const Explore = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('Tất cả');
  const [search, setSearch] = useState('');

  // Generate 100 unique templates
  const templates = useMemo(() => {
    const list = [];
    for (let i = 1; i <= 100; i++) {
      const palette = PALETTES[i % PALETTES.length];
      const layout = LAYOUTS[i % LAYOUTS.length];
      const category = CATEGORIES[1 + (i % (CATEGORIES.length - 1))];
      list.push({
        id: i,
        name: `${palette.name} ${layout} #${i}`,
        category,
        palette,
        layout,
        isPremium: true
      });
    }
    return list;
  }, []);

  const filteredTemplates = templates.filter(t => 
    (filter === 'Tất cả' || t.category === filter) &&
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleUseTemplate = (template) => {
    if (!user || !user.isPaid) {
      alert('Bạn cần đăng ký tài khoản Vibes và thanh toán 100k để sử dụng các mẫu thiết kế này!');
      navigate('/register');
      return;
    }
    navigate('/dashboard', { state: { templateId: template.id } });
  };

  return (
    <div className="explore-page">
      <Navbar />
      
      <div className="explore-hero">
        <div className="container">
          <div className="hero-content animate-slide-up">
            <span className="badge-premium"><Crown size={14} /> Premium Templates</span>
            <h1>Khám phá <span className="text-gradient">Bản sắc số</span></h1>
            <p>Hàng trăm mẫu thiết kế độc bản dành cho cộng đồng Vibes vươn xa.</p>
          </div>
        </div>
      </div>

      <div className="explore-toolbar sticky-toolbar">
        <div className="container toolbar-wrapper">
          <div className="search-box">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Tìm kiếm mẫu thiết kế..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="filter-chips">
            {CATEGORIES.map(cat => (
              <button 
                key={cat} 
                className={`chip ${filter === cat ? 'active' : ''}`}
                onClick={() => setFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container explore-grid-container">
        <div className="template-grid">
          {filteredTemplates.map(t => (
            <div key={t.id} className="template-card glass-card">
              <div className="card-preview" style={{ background: `linear-gradient(135deg, ${t.palette.from}, ${t.palette.to})` }}>
                <div className="preview-overlay">
                  <div className="preview-shape" style={{ borderColor: t.palette.accent }}></div>
                  <div className="preview-dot" style={{ background: t.palette.accent, boxShadow: `0 0 15px ${t.palette.glow}` }}></div>
                  <div className="preview-line" style={{ background: t.palette.accent, opacity: 0.3 }}></div>
                </div>
                <div className="card-tag">{t.category}</div>
              </div>
              
              <div className="card-info">
                <h3>{t.name}</h3>
                <div className="card-meta">
                   <span><Layout size={14} /> {t.layout}</span>
                   <span><Palette size={14} /> {t.palette.name}</span>
                </div>
                
                <div className="card-actions">
                   <button className="btn-view" onClick={() => alert('Đang xem chi tiết mẫu thiết kế...')}>
                     <Eye size={16} /> Xem
                   </button>
                   <button 
                     className={`btn-use ${(!user || !user.isPaid) ? 'locked' : ''}`}
                     onClick={() => handleUseTemplate(t)}
                   >
                     {(!user || !user.isPaid) ? <><Lock size={16} /> Dùng</> : <><Zap size={16} /> Dùng</>}
                   </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {!user?.isPaid && (
        <div className="upgrade-floating-bar animate-slide-up">
           <p>Nâng cấp Vibes Premium để mở khóa 100+ mẫu thiết kế này!</p>
           <Link to="/register" className="btn-upgrade">Nâng cấp ngay 100k <ArrowRight size={18} /></Link>
        </div>
      )}
    </div>
  );
};

export default Explore;
