import React from 'react';
import { Crown } from 'lucide-react';
import './PremiumHubBadge.css';

const PremiumHubBadge = ({ size = 'md', className = '' }) => {
  return (
    <div className={`premium-hub-badge size-${size} ${className} animate-glow`}>
      <div className="badge-glow-layer"></div>
      <Crown size={size === 'sm' ? 12 : 16} className="crown-icon" />
      <span>Vibes Premium Hub</span>
    </div>
  );
};

export default PremiumHubBadge;
