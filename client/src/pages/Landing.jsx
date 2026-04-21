import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Zap, Shield, Mail, Phone, MessageSquare, X, Heart, ShieldCheck } from 'lucide-react';
import ParticleCanvas from '../components/ParticleCanvas';
import DynamicLogo from '../components/DynamicLogo';
import Navbar from '../components/Navbar';
import vanhIdentity from '../assets/vanh-identity.jpg';
import './Landing.css';

const OWNER = {
  name: 'Lê Việt Anh',
  tagline: 'Theo dõi hành trình của Vanh Lê nhe',
  email: 'Vanhlenorthside@gmail.com',
  phone: '+84 968 739 902',
  socials: {
    facebook: 'https://www.facebook.com/vanhiunhun/',
    instagram: 'https://www.instagram.com/vanhiunhun/',
    twitter: 'https://x.com/Valedunlaoy0405',
    tiktok: 'https://www.tiktok.com/@.thepastisbullshit',
    discord: 'https://discord.gg/ErA8efJU'
  }
};

const FEATURES = [
  { icon: <Zap size={24} />, title: 'Kiến tạo thần tốc', desc: 'Sở hữu trang định danh chuyên nghiệp chỉ trong 60 giây.' },
  { icon: <Shield size={24} />, title: 'Bản sắc độc bản', desc: 'Mỗi người dùng sở hữu một DNA Logo được sinh ra bằng thuật toán riêng.' },
];

const Landing = () => {
  const [showReveal, setShowReveal] = useState(false);

  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  const socialIcons = {
    facebook: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    instagram: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
      </svg>
    ),
    twitter: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.045 4.126H5.078z" />
      </svg>
    ),
    tiktok: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.525.02c1.31 0 2.591.21 3.795.602V7.06c-.76-.46-1.551-.76-2.451-.76-2.521 0-4.582 1.832-4.582 4.102 0 2.27 2.062 4.102 4.582 4.102 2.52 0 4.582-1.832 4.582-4.102V0h2.951c.01 1.62.61 3.12 1.601 4.29 1 1.17 2.392 1.95 3.992 2.19V11.2c-1.14-.15-2.2-.49-3.13-1.01-.13 5.4-3.66 9.8-8.8 11.81l-.34.13c-.32.12-.66.21-1.02.26-1.08.18-2.23-.1-3.23-.42-1-.32-1.92-.81-2.73-1.44-1.63-1.28-2.71-3.2-2.71-5.42 0-3.32 2.17-6.14 5.16-7.14V.02h4.512z" />
      </svg>
    ),
    discord: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127c-.596.345-1.192.643-1.872.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.086 2.157 2.419c0 1.334-.947 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.086 2.157 2.419c0 1.334-.946 2.419-2.157 2.419z" />
      </svg>
    )
  };

  return (
    <div className="landing">
      <ParticleCanvas density={20} color="rgba(255, 255, 255, 0.1)" />
      <Navbar />

      {/* ── CINEMATIC HERO ────────────────────────────── */}
      <section className="hero">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="hero-name-stencil">{OWNER.name}</h1>
          <p className="hero-description">{OWNER.tagline}</p>

          <div className="hero-actions">
            <Link to="/register" className="btn-vibe-primary">
              Bắt đầu hành trình <ArrowRight size={18} />
            </Link>
            <Link to="/explore" className="btn-vibe-ghost">
              Khám phá Vibes
            </Link>
          </div>
        </motion.div>
      </section>


      {/* ── IDENTITY GRID (THE HEART OF VIBES) ────────── */}
      <section className="identity-section">
        <div className="container">
          <div className="bento-layout">
            {/* Combined Social Row Card - Full Width with Discord */}
            <div className="bento-item social-row-card">
              <div className="social-row-flex">
                <a href={OWNER.socials.facebook} target="_blank" className="social-icon-box">{socialIcons.facebook}</a>
                <a href={OWNER.socials.instagram} target="_blank" className="social-icon-box">{socialIcons.instagram}</a>
                <a href={OWNER.socials.twitter} target="_blank" className="social-icon-box">{socialIcons.twitter}</a>
                <a href={OWNER.socials.tiktok} target="_blank" className="social-icon-box">{socialIcons.tiktok}</a>
                <a href={OWNER.socials.discord} target="_blank" className="social-icon-box">{socialIcons.discord}</a>
              </div>
            </div>

            {/* Centered DNA Logo Card */}
            <motion.div
              className="bento-item dna-centered-card"
              whileHover={{ scale: 0.98 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowReveal(true)}
              style={{ cursor: 'pointer' }}
            >
              <div className="dna-aura-glow"></div>
              <DynamicLogo seed={OWNER.name} size={200} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Identity Reveal Modal */}
      <AnimatePresence>
        {showReveal && (
          <motion.div
            className="reveal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowReveal(false)}
          >
            {/* Background Animation Layer 2: Rotating Rays */}
            <div className="reveal-rays">
              <div className="ray"></div>
            </div>

            <motion.div
              className="reveal-card-container"
              initial={{ scale: 0.8, opacity: 0, y: 60 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 60 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="reveal-photo-frame">
                <img src={vanhIdentity} alt="Vanh Identity" className="reveal-photo" />
              </div>

              <div className="reveal-info">
                <h2>
                  {OWNER.name}
                  <ShieldCheck className="reveal-verified-icon" size={36} fill="var(--vibe-accent)" />
                </h2>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── REFINED FOOTER ────────────────────────────── */}
      <footer className="minimalist-footer">
        <div className="container">
          <div className="footer-contact-centered">
            <a href={`mailto:${OWNER.email}`} className="contact-link">
              <Mail size={16} /> {OWNER.email}
            </a>
            <a href={`tel:${OWNER.phone}`} className="contact-link">
              <Phone size={16} /> {OWNER.phone}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
