import React from 'react';
import { ZODIAC_SYMBOLS } from '../constants/templates.jsx';
import './TemplateVisual.css';

const TemplateVisual = ({ template }) => {
  const { palette, id, category } = template;
  const nId = typeof id === 'string' ? parseInt(id.split('-')[1]) || 0 : id;
  const complexity = 1 + (nId % 10);
  const seed = nId * 133.7;
  const rnd = (s) => Math.sin(s) * 10000 - Math.floor(Math.sin(s) * 10000);

  // --- ARCHETYPE: MODERN (Premium Glassmorphism) ---
  const renderModern = () => (
    <div className="archetype-modern">
      <div className="modern-bg-glow" style={{ background: palette.accent }}></div>
      
      <div className="modern-glass-stack">
        <div className="modern-shimmer"></div>
        <div className="glass-layer layer-1" style={{ borderColor: `${palette.accent}44` }}></div>
        <div className="glass-layer layer-2" style={{ borderColor: `${palette.accent}22` }}></div>
        <div className="glass-core" style={{ background: `radial-gradient(circle at 30% 30%, ${palette.accent}22, transparent)` }}>
          <div className="glass-content" style={{ borderColor: palette.accent }}></div>
        </div>
      </div>

      <svg viewBox="0 0 200 200" className="modern-lines">
        <circle cx="100" cy="100" r="80" stroke={palette.accent} fill="none" strokeWidth="0.5" opacity="0.1" strokeDasharray="5 5" />
        <path d="M 20 100 Q 100 20 180 100" stroke={palette.accent} fill="none" strokeWidth="1" opacity="0.2" className="modern-path-anim" />
      </svg>
    </div>
  );

  // --- ARCHETYPE: CYBERPUNK (Tech, Grids & Glitch) ---
  const renderCyberpunk = () => (
    <div className="archetype-cyberpunk">
      <div className="cyber-grid" style={{ backgroundImage: `linear-gradient(${palette.accent} 1px, transparent 1px), linear-gradient(90deg, ${palette.accent} 1px, transparent 1px)` }}></div>
      <div className="cyber-bars">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="cyber-bar" style={{ height: `${rnd(seed + i) * 100}%`, background: palette.accent }}></div>
        ))}
      </div>
      <div className="cyber-core-box" style={{ border: `2px solid ${palette.accent}`, boxShadow: `0 0 20px ${palette.glow}` }}>
        <div className="cyber-glitch-line" style={{ background: palette.accent }}></div>
      </div>
    </div>
  );

  // --- ARCHETYPE: LUXURY (Symmetry & Golden Dust) ---
  const renderLuxury = () => (
    <div className="archetype-luxury">
      <div className="luxury-ring-outer" style={{ borderColor: palette.accent }}></div>
      <div className="luxury-ring-inner" style={{ borderColor: palette.accent }}></div>
      <div className="luxury-diamond" style={{ background: palette.accent, boxShadow: `0 0 30px ${palette.glow}` }}></div>
      <div className="luxury-particles">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="luxury-dust" style={{ 
            left: `${rnd(seed + i) * 100}%`, 
            top: `${rnd(seed + i + 1) * 100}%`, 
            background: palette.accent 
          }}></div>
        ))}
      </div>
    </div>
  );

  // --- ARCHETYPE: MINIMAL (Pure Focus) ---
  const renderMinimal = () => (
    <div className="archetype-minimal">
      <div className="minimal-line-v" style={{ background: palette.accent }}></div>
      <div className="minimal-dot" style={{ background: palette.accent, boxShadow: `0 0 20px ${palette.glow}` }}></div>
    </div>
  );

  // --- ARCHETYPE: CREATIVE (Organic & Fluid) ---
  const renderCreative = () => (
    <div className="archetype-creative">
      <div className="creative-blob" style={{ background: palette.accent, borderRadius: `${40 + rnd(seed) * 30}% ${30 + rnd(seed + 1) * 40}% ${50 + rnd(seed + 2) * 20}% ${20 + rnd(seed + 3) * 50}%` }}></div>
      <div className="creative-blob-alt" style={{ borderColor: palette.accent }}></div>
    </div>
  );

  // --- ARCHETYPE: ZODIAC (Celestial & Constellations) ---
  const renderZodiac = () => {
    const symbolIndex = nId % 12;
    const symbol = ZODIAC_SYMBOLS[symbolIndex];
    return (
      <div className="archetype-zodiac">
        <svg style={{ position: 'absolute', width: 0, height: 0 }}>
          <filter id="starGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </svg>

        {/* Nebula / Milky Way Effect */}
        <div className="zodiac-nebula" style={{ 
          background: `radial-gradient(circle at 50% 50%, ${palette.accent}11, transparent 80%)` 
        }}></div>

        {/* Shooting Stars */}
        <div className="zodiac-meteors">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="shooting-star" style={{ 
              top: `${rnd(seed + i) * 50}%`, 
              left: `${rnd(seed + i + 1) * 100}%`,
              animationDelay: `${i * 4}s`
            }}></div>
          ))}
        </div>

        <div className="zodiac-celestial-bg">
          {[...Array(60)].map((_, i) => {
            const sSeed = seed + i;
            const size = 0.5 + rnd(sSeed) * 1.5;
            return (
              <div key={i} className="celestial-star-tiny" style={{ 
                left: `${rnd(sSeed) * 100}%`, 
                top: `${rnd(sSeed + 1) * 100}%`,
                width: `${size}px`,
                height: `${size}px`,
                opacity: 0.2 + rnd(sSeed + 2) * 0.8,
                animationDelay: `${rnd(sSeed + 3) * 5}s`,
                background: rnd(sSeed + 4) > 0.8 ? palette.accent : '#fff'
              }}></div>
            );
          })}
        </div>

        <div className="zodiac-symbol-label" style={{ color: palette.accent }}>{symbol.name}</div>
        
        <svg viewBox="0 0 200 200" className="zodiac-constellation">
          {/* Constellation Lines (Faint & Precise) */}
          {symbol.lines.map((line, i) => {
            const start = symbol.stars[line[0]];
            const end = symbol.stars[line[1]];
            return (
              <line 
                key={`l-${i}`}
                x1={start[0]} y1={start[1]}
                x2={end[0]} y2={end[1]}
                stroke={palette.accent}
                strokeWidth="0.7"
                opacity="0.2"
                className="constellation-path-draw"
              />
            );
          })}
          {/* Constellation Nodes (Real Data Points) */}
          {symbol.stars.map((star, i) => {
            const [x, y] = star;
            const starSize = 1.8 + rnd(seed + i) * 1.5;
            return (
              <g key={`s-${i}`} filter="url(#starGlow)">
                <circle cx={x} cy={y} r={starSize * 2.5} fill={palette.accent} opacity="0.1" className="star-pulse" />
                <circle cx={x} cy={y} r={starSize} fill="#fff" style={{ filter: `drop-shadow(0 0 3px ${palette.accent})` }} />
                <line x1={x-starSize*1.5} y1={y} x2={x+starSize*1.5} y2={y} stroke="#fff" strokeWidth="0.2" opacity="0.4" />
                <line x1={x} y1={y-starSize*1.5} x2={x} y2={y+starSize*1.5} stroke="#fff" strokeWidth="0.2" opacity="0.4" />
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  const renderArchetype = () => {
    switch (category) {
      case 'Modern': return renderModern();
      case 'Cyberpunk': return renderCyberpunk();
      case 'Luxury': return renderLuxury();
      case 'Minimal': return renderMinimal();
      case 'Creative': return renderCreative();
      case 'Zodiac': return renderZodiac();
      default: return renderModern();
    }
  };

  return (
    <div className={`template-visual archetype-${category.toLowerCase()}`} style={{ background: `linear-gradient(135deg, ${palette.from}, ${palette.to})` }}>
      <div className="visual-background-fx"></div>
      
      <div className="archetype-container">
        {renderArchetype()}
      </div>

      <div className="visual-label-float" style={{ color: palette.accent }}>
        {category === 'Zodiac' ? ZODIAC_SYMBOLS[nId % 12].name : category} DNA // #{id}
      </div>
      <div className="visual-noise"></div>
    </div>
  );
};

export default TemplateVisual;
