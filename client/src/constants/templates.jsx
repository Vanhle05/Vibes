import React from 'react';
import { Sparkles, Zap, Cpu, Diamond, Layout, Wand2 } from 'lucide-react';

export const CATEGORIES = [
  { id: 'Tất cả', name: 'Tất cả', icon: <Sparkles size={16} /> },
  { id: 'Modern', name: 'Modern', icon: <Zap size={16} /> },
  { id: 'Cyberpunk', name: 'Cyberpunk', icon: <Cpu size={16} /> },
  { id: 'Luxury', name: 'Luxury', icon: <Diamond size={16} /> },
  { id: 'Minimal', name: 'Minimal', icon: <Layout size={16} /> },
  { id: 'Creative', name: 'Creative', icon: <Wand2 size={16} /> },
  { id: 'Zodiac', name: 'Zodiac', icon: <Sparkles size={16} /> }
];

export const PALETTES = [
  { name: 'Nebula', from: '#020617', to: '#1e1b4b', accent: '#818cf8', glow: 'rgba(129, 140, 248, 0.5)' },
  { name: 'Gold Obsidian', from: '#0a0a0a', to: '#171717', accent: '#fbbf24', glow: 'rgba(251, 191, 36, 0.5)' },
  { name: 'Aurora', from: '#064e3b', to: '#022c22', accent: '#34d399', glow: 'rgba(52, 211, 153, 0.5)' },
  { name: 'Blood Moon', from: '#450a0a', to: '#7f1d1d', accent: '#f87171', glow: 'rgba(248, 113, 113, 0.5)' },
  { name: 'Deep Space', from: '#0f172a', to: '#020617', accent: '#38bdf8', glow: 'rgba(56, 189, 248, 0.5)' },
  { name: 'Amethyst', from: '#2e1065', to: '#4c1d95', accent: '#a78bfa', glow: 'rgba(167, 139, 250, 0.5)' },
  { name: 'Rose Quartz', from: '#451a03', to: '#78350f', accent: '#fb7185', glow: 'rgba(251, 113, 133, 0.5)' },
  { name: 'Emerald', from: '#064e3b', to: '#065f46', accent: '#10b981', glow: 'rgba(16, 185, 129, 0.5)' },
  { name: 'Midnight', from: '#000000', to: '#0f172a', accent: '#6366f1', glow: 'rgba(99, 102, 241, 0.5)' },
  { name: 'Sunset', from: '#450a0a', to: '#92400e', accent: '#f59e0b', glow: 'rgba(245, 158, 11, 0.5)' }
];

/**
 * ZODIAC_SYMBOLS
 * Data mapped from real astronomical coordinates (RA/DEC normalized to 200x200)
 */
export const ZODIAC_SYMBOLS = [
  { 
    id: 'Ari', name: 'Aries', 
    stars: [[175, 45], [120, 65], [95, 85], [105, 120]], 
    lines: [[0,1], [1,2], [2,3]] 
  },
  { 
    id: 'Tau', name: 'Taurus', 
    stars: [[180, 25], [145, 60], [120, 100], [85, 130], [50, 160], [30, 70], [170, 70], [130, 40]], 
    lines: [[0,1], [1,2], [2,3], [3,4], [1,5], [1,6], [6,7]] 
  },
  { 
    id: 'Gem', name: 'Gemini', 
    stars: [[160, 40], [165, 160], [120, 35], [125, 155], [140, 95], [100, 90], [145, 130], [105, 125]], 
    lines: [[0,1], [2,3], [0,2], [4,5], [6,7]] 
  },
  { 
    id: 'Can', name: 'Cancer', 
    stars: [[100, 35], [105, 100], [60, 145], [145, 135], [120, 175]], 
    lines: [[0,1], [1,2], [1,3], [2,4]] 
  },
  { 
    id: 'Leo', name: 'Leo', 
    stars: [[175, 150], [120, 155], [65, 110], [75, 50], [115, 35], [150, 75], [165, 115], [120, 100]], 
    lines: [[0,1], [1,2], [2,3], [3,4], [4,5], [5,6], [6,0], [1,7]] 
  },
  { 
    id: 'Vir', name: 'Virgo', 
    stars: [[45, 40], [50, 145], [90, 150], [95, 55], [135, 45], [140, 140], [175, 170], [160, 95], [120, 90]], 
    lines: [[0,1], [1,2], [2,3], [3,4], [4,5], [5,6], [5,7], [2,8]] 
  },
  { 
    id: 'Lib', name: 'Libra', 
    stars: [[50, 155], [165, 145], [110, 45], [75, 105], [145, 95], [110, 125]], 
    lines: [[0,1], [2,3], [2,4], [3,5], [4,5]] 
  },
  { 
    id: 'Sco', name: 'Scorpio', 
    stars: [[170, 45], [145, 75], [115, 115], [85, 150], [55, 165], [35, 155], [25, 120], [55, 90], [170, 25]], 
    lines: [[0,1], [1,2], [2,3], [3,4], [4,5], [5,6], [6,7], [0,8]] 
  },
  { 
    id: 'Sag', name: 'Sagittarius', 
    stars: [[45, 175], [100, 120], [165, 55], [115, 45], [165, 115], [140, 165], [75, 55], [55, 110]], 
    lines: [[0,1], [1,2], [1,3], [1,4], [4,5], [1,6], [6,7]] 
  },
  { 
    id: 'Cap', name: 'Capricorn', 
    stars: [[35, 50], [100, 175], [175, 60], [140, 110], [60, 110]], 
    lines: [[0,1], [1,2], [2,3], [3,4], [4,0]] 
  },
  { 
    id: 'Aqu', name: 'Aquarius', 
    stars: [[45, 75], [85, 45], [125, 75], [165, 45], [45, 125], [85, 95], [125, 125], [165, 95], [185, 125]], 
    lines: [[0,1], [1,2], [2,3], [4,5], [5,6], [6,7], [7,8], [0,4], [1,5], [2,6], [3,7]] 
  },
  { 
    id: 'Pis', name: 'Pisces', 
    stars: [[45, 45], [105, 110], [175, 175], [45, 175], [175, 45], [115, 155], [160, 110]], 
    lines: [[0,1], [1,2], [3,5], [5,1], [1,6], [6,4]] 
  }
];
