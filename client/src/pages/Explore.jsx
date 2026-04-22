import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, Search, Filter, Lock, Eye, 
  ArrowRight, Crown, Zap, Palette, Layers, Layout,
  Cpu, Rocket, Diamond, Wand2
} from 'lucide-react';
import Navbar from '../components/Navbar';
import './Explore.css';

// Cinematic Categories with icons
const CATEGORIES = [
  { id: 'Tất cả', name: 'Tất cả', icon: <Sparkles size={16} /> },
  { id: 'Modern', name: 'Modern', icon: <Zap size={16} /> },
  { id: 'Cyberpunk', name: 'Cyberpunk', icon: <Cpu size={16} /> },
  { id: 'Luxury', name: 'Luxury', icon: <Diamond size={16} /> },
  { id: 'Minimal', name: 'Minimal', icon: <Layout size={16} /> },
  { id: 'Creative', name: 'Creative', icon: <Wand2 size={16} /> }
];

const PALETTES = [
  { name: 'Nebula', from: '#020617', to: '#1e1b4b', accent: '#818cf8', glow: 'rgba(129, 140, 248, 0.5)' },
  { name: 'Gold Obsidian', from: '#0a0a0a', to: '#171717', accent: '#fbbf24', glow: 'rgba(251, 191, 36, 0.5)' },
  { name: 'Aurora', from: '#064e3b', to: '#022c22', accent: '#34d399', glow: 'rgba(52, 211, 153, 0.5)' },
  { name: 'Blood Moon', from: '#450a0a', to: '#7f1d1d', accent: '#f87171', glow: 'rgba(248, 113, 113, 0.5)' },
  { name: 'Deep Space', from: '#0f172a', to: '#020617', accent: '#38bdf8', glow: 'rgba(56, 189, 248, 0.5)' },
  { name: 'Amethyst', from: '#2e1065', to: '#4c1d95', accent: '#a78bfa', glow: 'rgba(167, 139, 250, 0.5)' }
];

const Explore = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('Tất cả');
  const [search, setSearch] = useState('');

  const templates = useMemo(() => {
    const list = [];
    for (let i = 1; i <= 100; i++) {
      const palette = PALETTES[i % PALETTES.length];
      const category = CATEGORIES[1 + (i % (CATEGORIES.length - 1))];
      list.push({
        id: i,
        name: `${palette.name} Edition #${i}`,
        category: category.id,
        palette,
        isPremium: true,
        previewUrl: `https://images.unsplash.com/photo-${1500000000000 + i}?auto=format&fit=crop&w=400&h=250`
      });
    }
    return list;
  }, []);

  const filteredTemplates = templates.filter(t => 
    (filter === 'Tất cả' || t.category === filter) &&
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleUseTemplate = (template) => {
    if (!user || (!user.isPaid && user.role !== 'admin')) {
      return; // Do nothing, button is visually locked
    }
    navigate('/dashboard', { state: { templateId: template.id } });
  };

  return (
    <div className="explore-page">
      <div className="explore-grain"></div>
      <Navbar />
      
      <section className="explore-hero-premium">
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="hero-inner"
          >
            <div className="premium-label">
              <Crown size={14} /> <span>100+ Exclusive Designs</span>
            </div>
            <h1>Kiến tạo <span className="text-gradient">Đẳng cấp số</span></h1>
            <p>Hệ sinh thái giao diện cao cấp dành riêng cho cộng đồng Vibes.</p>
          </motion.div>
        </div>
      </section>

      <div className="explore-nav-sticky glass-card">
        <div className="container nav-sticky-inner">
          <div className="category-scroll">
            {CATEGORIES.map(cat => (
              <button 
                key={cat.id} 
                className={`cat-btn ${filter === cat.id ? 'active' : ''}`}
                onClick={() => setFilter(cat.id)}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
          
          <div className="search-premium">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Tìm kiếm mẫu..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <main className="container explore-main">
        <div className="premium-grid">
          {filteredTemplates.map((t, idx) => (
            <motion.div 
              key={t.id} 
              className="p-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: (idx % 12) * 0.05 }}
            >
              <div className="p-card-media" style={{ background: `linear-gradient(135deg, ${t.palette.from}, ${t.palette.to})` }}>
                 <div className="p-card-overlay">
                    <button className="btn-preview-circle" onClick={() => alert('Đang xem bản xem trước siêu nét...')}>
                       <Eye size={20} />
                    </button>
                 </div>
                 <div className="p-card-tag">{t.category}</div>
                 
                 {/* Visual Template Structure Simulation */}
                 <div className="template-skeleton">
                    <div className="skel-logo" style={{ background: t.palette.accent }}></div>
                    <div className="skel-line" style={{ width: '60%' }}></div>
                    <div className="skel-line" style={{ width: '40%' }}></div>
                    <div className="skel-dots">
                       <div className="skel-dot" style={{ background: t.palette.accent }}></div>
                       <div className="skel-dot" style={{ background: t.palette.accent }}></div>
                    </div>
                 </div>
              </div>
              
              <div className="p-card-content">
                 <div className="p-card-header">
                   <h3>{t.name}</h3>
                   <div className="p-card-accent-dot" style={{ background: t.palette.accent, boxShadow: `0 0 10px ${t.palette.glow}` }}></div>
                 </div>
                 
                 <div className="p-card-footer">
                    {(!user || (!user.isPaid && user.role !== 'admin')) ? (
                      <div className="p-card-lock-msg">
                        <Lock size={14} /> <span>Premium Only</span>
                      </div>
                    ) : (
                      <button className="btn-p-use" onClick={() => handleUseTemplate(t)}>
                        <Zap size={16} /> Sử dụng
                      </button>
                    )}
                 </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {(!user || (!user.isPaid && user.role !== 'admin')) && (
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="p-upgrade-bar"
        >
           <div className="container bar-inner">
             <div className="bar-info">
               <Crown size={24} color="#fbbf24" />
               <div>
                 <h4>Nâng cấp lên Vibes Premium</h4>
                 <p>Sở hữu toàn bộ 100+ template và các tính năng đặc quyền ngay hôm nay.</p>
               </div>
             </div>
             <Link to="/register" className="btn-bar-action">
               Kích hoạt ngay <ArrowRight size={18} />
             </Link>
           </div>
        </motion.div>
      )}
    </div>
  );
};

export default Explore;
