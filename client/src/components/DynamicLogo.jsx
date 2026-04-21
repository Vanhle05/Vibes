import React from 'react';

const DynamicLogo = ({ seed = 'vibes', size = 120, className = '' }) => {
  // Generate a robust hash from the seed
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  const h = Math.abs(hash);

  // Derived attributes from hash
  const primaryHue = h % 360;
  const secondaryHue = (primaryHue + 40 + (h % 60)) % 360;
  const rotation = h % 360;
  const shapeType = h % 4; // 0: Circles, 1: Polygons, 2: Abstract Lines, 3: Spiral/Orbit
  
  const getHSL = (hue, s = 60, l = 60) => `hsl(${hue}, ${s}%, ${l}%)`;

  const renderShape = () => {
    switch (shapeType) {
      case 0: // Concentric & Offset Orbs
        return (
          <g>
            <circle cx="50" cy="50" r={30 + (h % 15)} fill={`url(#grad-${h})`} />
            <circle cx={40 + (h%20)} cy={40 + (h%20)} r={10 + (h % 10)} fill="white" opacity="0.2" />
            <circle cx={60 - (h%20)} cy={60 - (h%20)} r={5 + (h % 5)} fill="white" opacity="0.1" />
          </g>
        );
      case 1: // Geometric Polygons
        const sides = 3 + (h % 5);
        const points = Array.from({length: sides}).map((_, i) => {
          const angle = (i / sides) * Math.PI * 2;
          const r = 35 + (h % 10);
          return `${50 + r * Math.cos(angle)},${50 + r * Math.sin(angle)}`;
        }).join(' ');
        return (
          <g>
            <polygon points={points} fill={`url(#grad-${h})`} />
            <rect x="35" y="35" width="30" height="30" rx="4" fill="white" opacity="0.1" transform={`rotate(${h%90} 50 50)`} />
          </g>
        );
      case 2: // Network Nodes
        return (
          <g>
            <line x1="20" y1="20" x2="80" y2="80" stroke="white" strokeWidth="0.5" opacity="0.3" />
            <line x1="80" y1="20" x2="20" y2="80" stroke="white" strokeWidth="0.5" opacity="0.3" />
            <circle cx="50" cy="50" r="35" fill={`url(#grad-${h})`} />
            <circle cx="30" cy="30" r="4" fill="white" />
            <circle cx="70" cy="70" r="3" fill="white" opacity="0.5" />
          </g>
        );
      case 3: // Modern Orbit
        return (
          <g>
            <circle cx="50" cy="50" r="40" stroke={`url(#grad-${h})`} strokeWidth="1" fill="none" />
            <circle cx="50" cy="50" r="25" fill={`url(#grad-${h})`} />
            <circle cx="50" cy="15" r="5" fill="white" transform={`rotate(${h % 360} 50 50)`} />
          </g>
        );
      default: return null;
    }
  };

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      className={className}
      style={{ transform: `rotate(${rotation}deg)`, transition: 'all 0.5s ease' }}
    >
      <defs>
        <linearGradient id={`grad-${h}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: getHSL(primaryHue, 70, 50), stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: getHSL(secondaryHue, 80, 60), stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      {renderShape()}
    </svg>
  );
};

export default DynamicLogo;
