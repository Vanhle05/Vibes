import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, Search, Filter, Lock, Eye, 
  ArrowRight, Crown, Zap, Palette, Layers, Layout,
  Cpu, Rocket, Diamond, Wand2
} from 'lucide-react';
import Navbar from '../components/Navbar';
import PremiumBackground from '../components/PremiumBackground';
import PremiumHubBadge from '../components/PremiumHubBadge';
import TemplateVisual from '../components/TemplateVisual';
import { X, Check } from 'lucide-react';
import { CATEGORIES, PALETTES, ZODIAC_SYMBOLS } from '../constants/templates.jsx';
import './Explore.css';

const Explore = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('Tất cả');
  const [search, setSearch] = useState('');
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [visibleCount, setVisibleCount] = useState(24);

  const isPremium = user?.isPaid || user?.role === 'admin';

  const templates = useMemo(() => {
    const list = [];
    const mainCategories = CATEGORIES.filter(c => c.id !== 'Tất cả');
    
    mainCategories.forEach(cat => {
      const count = cat.id === 'Zodiac' ? 120 : 100;
      for (let i = 1; i <= count; i++) {
        const paletteIndex = (i + cat.id.length) % PALETTES.length;
        const palette = PALETTES[paletteIndex];
        
        let name = `${cat.name} ${palette.name} #${i}`;
        if (cat.id === 'Zodiac') {
          const sign = ZODIAC_SYMBOLS[(i - 1) % 12];
          name = sign.name;
        }

        list.push({
          id: `${cat.id.substring(0, 2)}-${i}`,
          numericId: i,
          name,
          category: cat.id,
          palette,
          isPremium: true
        });
      }
    });
    return list;
  }, []);

  // Reset visible count when filter changes
  useEffect(() => {
    setVisibleCount(24);
  }, [filter]);

  const filteredTemplates = templates.filter(t => 
    (filter === 'Tất cả' || t.category === filter) &&
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  const visibleTemplates = filteredTemplates.slice(0, visibleCount);

  const handleUseTemplate = (template) => {
    if (!user || (!user.isPaid && user.role !== 'admin')) {
      return; // Do nothing, button is visually locked
    }
    navigate('/dashboard', { state: { templateId: template.id } });
  };

  return (
    <div className="explore-page">
      <PremiumBackground id={11} />
      <div className="explore-grain"></div>
      <Navbar />
      
      <section className="explore-hero-premium">
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="hero-inner"
          >
            {isPremium ? (
              <PremiumHubBadge className="mb-4" />
            ) : (
              <div className="premium-label">
                <Crown size={14} /> <span>100+ Exclusive Designs</span>
              </div>
            )}
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
          {visibleTemplates.map((t, idx) => (
            <motion.div 
              key={t.id} 
              className="p-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: (idx % 12) * 0.05 }}
            >
              <div className="p-card-media">
                 <div className="p-card-overlay">
                    <button className="btn-preview-circle" onClick={() => setPreviewTemplate(t)}>
                       <Eye size={24} />
                    </button>
                 </div>
                 <div className="p-card-tag">{t.category}</div>
                 
                 <TemplateVisual template={t} />
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

      {/* Template Preview Modal */}
      <AnimatePresence>
        {previewTemplate && (
          <motion.div 
            className="preview-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewTemplate(null)}
          >
            <motion.div 
              className="preview-modal-content glass-card"
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              onClick={e => e.stopPropagation()}
            >
              <button className="btn-close-modal" onClick={() => setPreviewTemplate(null)}>
                <X size={24} />
              </button>
              
              <div className="modal-body">
                <div className="preview-image-wrap">
                  <TemplateVisual template={previewTemplate} />
                  <div className="preview-style-indicator" style={{ background: previewTemplate.palette.accent }}></div>
                </div>
                
                <div className="modal-info">
                  <div className="modal-header-text">
                    <div className="modal-cat">{previewTemplate.category}</div>
                    <h2>{previewTemplate.name}</h2>
                  </div>
                  
                  <div className="modal-features">
                    <div className="feature-item"><Check size={16} /> Bố cục đáp ứng</div>
                    <div className="feature-item"><Check size={16} /> Hiệu ứng chuyển động</div>
                    <div className="feature-item"><Check size={16} /> Tùy chỉnh màu sắc</div>
                  </div>

                  <div className="modal-actions">
                    {isPremium ? (
                      <button className="btn-vibe-primary w-full" onClick={() => handleUseTemplate(previewTemplate)}>
                        Sử dụng mẫu này <ArrowRight size={18} />
                      </button>
                    ) : (
                      <Link to="/register" className="btn-vibe-primary w-full">
                        Nâng cấp để sử dụng <Crown size={18} />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Explore;
