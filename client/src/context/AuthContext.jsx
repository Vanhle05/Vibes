import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('vibes_user');
    const token = localStorage.getItem('vibes_token');
    return (stored && token) ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('vibes_token');
    
    // --- Session Persistence Logic (2 Minutes Window) ---
    const lastSeen = localStorage.getItem('vibes_last_seen');
    const now = Date.now();
    
    if (token && lastSeen && (now - parseInt(lastSeen)) > 120000) {
      // More than 2 minutes inactive since last seen -> Force Logout
      localStorage.removeItem('vibes_token');
      localStorage.removeItem('vibes_user');
      localStorage.removeItem('vibes_last_seen');
      setUser(null);
      setLoading(false);
      return;
    }

    if (token) {
      api.get('/auth/me').then(res => {
        setUser(res.data);
        localStorage.setItem('vibes_user', JSON.stringify(res.data));
        localStorage.setItem('vibes_last_seen', Date.now().toString());
      }).catch(() => {
        logout();
      }).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }

    // Update lastSeen when user interacts or tab visibility changes
    const updateActivity = () => {
      if (localStorage.getItem('vibes_token')) {
        localStorage.setItem('vibes_last_seen', Date.now().toString());
      }
    };

    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        updateActivity();
      }
    });

    window.addEventListener('beforeunload', updateActivity);
    
    return () => {
      window.removeEventListener('visibilitychange', updateActivity);
      window.removeEventListener('beforeunload', updateActivity);
    };
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('vibes_token', res.data.token);
    localStorage.setItem('vibes_user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data.user;
  };

  const register = async (name, email, password, phone, cccd, gender, birthYear, desire) => {
    const res = await api.post('/auth/register', { name, email, password, phone, cccd, gender, birthYear, desire });
    return res.data.user;
  };

  const socialLogin = async (name, email, platform) => {
    const res = await api.post('/auth/social-login', { name, email, platform });
    localStorage.setItem('vibes_token', res.data.token);
    localStorage.setItem('vibes_user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = () => {
    localStorage.removeItem('vibes_token');
    localStorage.removeItem('vibes_user');
    setUser(null);
  };

  const refreshUser = async () => {
    const res = await api.get('/auth/me');
    setUser(res.data);
    localStorage.setItem('vibes_user', JSON.stringify(res.data));
    return res.data;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
