import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme, themes } from '../context/ThemeContext';
import { Menu, X, Sparkles, Palette } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const location = useLocation();

  // High-performance scroll tracking
  const { scrollY } = useScroll();
  
  // Transform values smoothly based on scroll (0 to 300px)
  const capsuleWidth = useTransform(scrollY, [0, 300], ['98%', '50%']);
  const capsulePadding = useTransform(scrollY, [0, 300], ['0.4rem 2rem', '0.6rem 2rem']);

  useEffect(() => { setMenuOpen(false); setThemeOpen(false); }, [location]);

  return (
    <nav className="navbar">
      <motion.div 
        className={`navbar-floating-capsule ${menuOpen ? 'open' : ''}`}
        style={{ 
          width: capsuleWidth,
          padding: capsulePadding
        }}
      >
        <Link to="/" className="navbar-logo">
          <Sparkles size={20} className="logo-sparkle" />
          <span>Vibes</span>
        </Link>

        <div className="navbar-links-group">
          {/* Theme Selector */}
          <div className="theme-selector-container">
            <button className="nav-icon-btn" onClick={() => setThemeOpen(!themeOpen)}>
              <Palette size={20} />
            </button>
            {themeOpen && (
              <div className="theme-dropdown glass-card">
                {themes.map(t => (
                  <button 
                    key={t.id}
                    className={`theme-dot ${theme === t.id ? 'active' : ''}`}
                    style={{ backgroundColor: t.color }}
                    onClick={() => setTheme(t.id)}
                    title={t.name}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="nav-main-links">
            {user ? (
              <>
                <Link to="/explore" className="nav-link">Explore</Link>
                {(user.isPaid === true || user.role === 'admin') ? (
                  <>
                    <Link to="/dashboard" className="nav-link">Dashboard</Link>
                    <Link to="/community" className="nav-link">Community</Link>
                    {user.role === 'admin' && <Link to="/admin" className="nav-link">Admin</Link>}
                  </>
                ) : (
                  <Link to="/register" className="nav-link text-accent">Nâng cấp</Link>
                )}
                <button onClick={logout} className="btn-logout-minimal">Đăng xuất</button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">Đăng nhập</Link>
                <Link to="/register" className="btn-vibe-primary btn-sm">Bắt đầu</Link>
              </>
            )}
          </div>
        </div>

        <button className="navbar-toggle" onClick={() => setMenuOpen(v => !v)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </motion.div>
    </nav>
  );
};

export default Navbar;
