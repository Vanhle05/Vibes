import React from 'react';
import './PremiumBackground.css';

const PremiumBackground = ({ id = 0, intensity = 1 }) => {
  // 10 unique premium background variants
  const renderBackground = () => {
    switch (id) {
      case 1: // Cosmic Nebula
        return (
          <div className="bg-nebula">
            <div className="orb orb-1"></div>
            <div className="orb orb-2"></div>
            <div className="orb orb-3"></div>
          </div>
        );
      case 2: // Golden Grid
        return (
          <div className="bg-gold-grid">
            <div className="grid-lines"></div>
            <div className="glow-spot"></div>
          </div>
        );
      case 3: // Aurora Flow
        return (
          <div className="bg-aurora">
            <div className="aurora-wave wave-1"></div>
            <div className="aurora-wave wave-2"></div>
            <div className="aurora-wave wave-3"></div>
          </div>
        );
      case 4: // Deep Sea Pulse
        return (
          <div className="bg-deep-sea">
            <div className="pulse-circle c-1"></div>
            <div className="pulse-circle c-2"></div>
          </div>
        );
      case 5: // Cyberpunk Mesh
        return (
          <div className="bg-cyber-mesh">
            <div className="mesh-gradient"></div>
            <div className="scan-line"></div>
          </div>
        );
      case 6: // Amethyst Crystal
        return (
          <div className="bg-amethyst">
            <div className="crystal-facet f-1"></div>
            <div className="crystal-facet f-2"></div>
          </div>
        );
      case 7: // Blood Moon
        return (
          <div className="bg-blood-moon">
            <div className="moon-glow"></div>
            <div className="blood-mist"></div>
          </div>
        );
      case 8: // Emerald Forest
        return (
          <div className="bg-emerald">
            <div className="leaf-particle l-1"></div>
            <div className="leaf-particle l-2"></div>
          </div>
        );
      case 9: // Platinum Shine
        return (
          <div className="bg-platinum">
            <div className="shine-streak s-1"></div>
            <div className="shine-streak s-2"></div>
          </div>
        );
      case 10: // Midnight Void
        return (
          <div className="bg-void">
            <div className="void-particle p-1"></div>
            <div className="void-particle p-2"></div>
            <div className="void-particle p-3"></div>
          </div>
        );
      case 11: // Deep Night
        return (
          <div className="bg-deep-night">
            <div className="star-field"></div>
            <div className="night-glow"></div>
          </div>
        );
      default: // Default static/minimal
        return <div className="bg-standard-vibe"></div>;
    }
  };

  return (
    <div className={`premium-bg-engine v-${id}`} style={{ opacity: intensity }}>
      <div className="bg-grain"></div>
      {renderBackground()}
      <div className="bg-overlay-glass"></div>
    </div>
  );
};

export default PremiumBackground;
