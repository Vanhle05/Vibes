import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const themes = [
  { id: 'graphite', name: 'Graphite', color: '#64748b' },
  { id: 'aurora', name: 'Aurora', color: '#c084fc' },
  { id: 'ember', name: 'Ember', color: '#fb7185' },
  { id: 'forest', name: 'Forest', color: '#34d399' },
  { id: 'ocean', name: 'Ocean', color: '#38bdf8' },
  { id: 'sakura', name: 'Sakura', color: '#f472b6' },
  { id: 'cyber', name: 'Cyber Neon', color: '#facc15' },
  { id: 'gold', name: 'Luxury Gold', color: '#fbbf24' },
  { id: 'midnight', name: 'Midnight', color: '#22d3ee' },
  { id: 'silver', name: 'Pure Silver', color: '#e2e8f0' },
];

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem('vibes-theme') || 'gold');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('vibes-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
