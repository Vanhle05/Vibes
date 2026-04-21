import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';
import ParticleCanvas from '../components/ParticleCanvas';
import DynamicLogo from '../components/DynamicLogo';
import {
  Phone, Mail, MapPin, Globe,
  Eye, Sparkles
} from 'lucide-react';
import './PublicProfile.css';

const THEME_STYLES = {
  dark:   { bg: '#030712', card: 'rgba(255,255,255,0.04)', text: '#f1f5f9' },
  neon:   { bg: '#0f0a1e', card: 'rgba(139,92,246,0.08)',  text: '#ede9fe' },
  ocean:  { bg: '#0c1a2e', card: 'rgba(14,165,233,0.08)',  text: '#e0f2fe' },
  sunset: { bg: '#1a0a0a', card: 'rgba(239,68,68,0.08)',   text: '#fef2f2' },
  light:  { bg: '#f8fafc', card: 'rgba(0,0,0,0.04)',       text: '#0f172a' },
};

const SOCIAL_ICONS = {
  facebook: { 
    label: 'Facebook', 
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ) 
  },
  instagram: { 
    label: 'Instagram', 
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
      </svg>
    ) 
  },
  tiktok: { 
    label: 'TikTok', 
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.525.02c1.31 0 2.591.21 3.795.602V7.06c-.76-.46-1.551-.76-2.451-.76-2.521 0-4.582 1.832-4.582 4.102 0 2.27 2.062 4.102 4.582 4.102 2.52 0 4.582-1.832 4.582-4.102V0h2.951c.01 1.62.61 3.12 1.601 4.29 1 1.17 2.392 1.95 3.992 2.19V11.2c-1.14-.15-2.2-.49-3.13-1.01-.13 5.4-3.66 9.8-8.8 11.81l-.34.13c-.32.12-.66.21-1.02.26-1.08.18-2.23-.1-3.23-.42-1-.32-1.92-.81-2.73-1.44-1.63-1.28-2.71-3.2-2.71-5.42 0-3.32 2.17-6.14 5.16-7.14V.02h4.512z"/>
      </svg>
    ) 
  },
  twitter: { 
    label: 'X (Twitter)', 
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ) 
  },
  website: { icon: <Globe size={20} />, label: 'Website' },
};

const PublicProfile = () => {
  const { username } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/profile/${username}`)
      .then(r => setData(r.data))
      .catch(err => setError(err.response?.data?.message || 'Trang không tồn tại'))
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) return (
    <div className="profile-loading">
      <div className="spinner" />
    </div>
  );

  if (error) return (
    <div className="profile-error">
      <ParticleCanvas />
      <div className="error-box glass-card">
        <Sparkles size={40} />
        <h2>Không tìm thấy trang</h2>
        <p>{error}</p>
        <Link to="/" className="btn btn-primary">Về trang chủ</Link>
      </div>
    </div>
  );

  const { profile } = data;
  const theme = THEME_STYLES[profile.theme] || THEME_STYLES.dark;
  const activeSocials = Object.entries(profile.socials || {}).filter(([, v]) => v);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="public-profile" style={{ '--profile-bg': theme.bg, '--profile-card': theme.card, '--profile-text': theme.text, '--accent-color': profile.coverColor || '#6366f1' }}>
      {profile.theme !== 'light' && <ParticleCanvas />}
      <div className="profile-bg-gradient" />

      <div className="profile-container">
        <motion.div className="profile-card glass-card" variants={fadeIn} initial="hidden" animate="visible">
          {/* Glow top bar */}
          <div className="profile-bar" style={{ background: `linear-gradient(135deg, ${profile.coverColor || '#6366f1'}, #ec4899)` }} />

          {/* Avatar/Logo */}
          <div className="profile-avatar-wrap">
            <div className="profile-logo-container">
              {profile.avatar
                ? <img src={profile.avatar} alt={profile.displayName} className="profile-avatar-img" />
                : <DynamicLogo seed={profile.displayName || username} size={120} className="profile-logo-dynamic" />
              }
            </div>
          </div>

          {/* Info */}
          <div className="profile-info">
            <h1 className="profile-name">{profile.displayName || username}</h1>
            {profile.tagline && <p className="profile-tagline">{profile.tagline}</p>}
            {profile.bio && <p className="profile-bio">{profile.bio}</p>}
          </div>

          {/* Contact chips */}
          <div className="profile-contacts">
            {profile.phone && (
              <a href={`tel:${profile.phone}`} className="profile-chip">
                <Phone size={15} /> {profile.phone}
              </a>
            )}
            {profile.email && (
              <a href={`mailto:${profile.email}`} className="profile-chip">
                <Mail size={15} /> {profile.email}
              </a>
            )}
            {profile.location && (
              <span className="profile-chip">
                <MapPin size={15} /> {profile.location}
              </span>
            )}
          </div>

          {/* Socials */}
          {activeSocials.length > 0 && (
            <div className="profile-socials">
              {activeSocials.map(([key, url]) => {
                const s = SOCIAL_ICONS[key];
                if (!s) return null;
                return (
                  <a key={key} href={url} target="_blank" rel="noreferrer"
                    className="profile-social-btn" title={s.label}
                    style={{ '--btn-color': profile.coverColor || '#6366f1' }}>
                    {s.icon}
                    <span>{s.label}</span>
                  </a>
                );
              })}
            </div>
          )}

          {/* Footer */}
          <div className="profile-footer">
            <Eye size={14} />
            <span>{(profile.viewCount || 1).toLocaleString()} lượt xem</span>
            <span className="profile-footer-sep">·</span>
            <Link to="/" className="profile-powered">
              <Sparkles size={13} /> Tạo trang riêng với Vibes
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PublicProfile;
