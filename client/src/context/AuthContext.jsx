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

  const logout = () => {
    localStorage.removeItem('vibes_token');
    localStorage.removeItem('vibes_user');
    localStorage.removeItem('vibes_last_seen');
    setUser(null);
    window.location.href = '/';
  };

  useEffect(() => {
    const token = localStorage.getItem('vibes_token');
    
    // --- 2-Minute Inactivity Logic ---
    const checkSession = () => {
      const lastSeen = localStorage.getItem('vibes_last_seen');
      const now = Date.now();
      if (token && lastSeen && (now - parseInt(lastSeen)) > 120000) {
        console.log('[AUTH] Session expired (2 min inactivity). Logging out.');
        logout();
        return true;
      }
      return false;
    };

    if (token) {
      if (checkSession()) {
        setLoading(false);
        return;
      }

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

    // --- Activity Tracking ---
    const updateActivity = () => {
      if (localStorage.getItem('vibes_token')) {
        localStorage.setItem('vibes_last_seen', Date.now().toString());
      }
    };

    const activityEvents = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
    activityEvents.forEach(event => window.addEventListener(event, updateActivity));

    // Handle tab visibility and close
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        checkSession();
      } else {
        updateActivity();
      }
    };

    window.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('beforeunload', updateActivity);
    
    return () => {
      activityEvents.forEach(event => window.removeEventListener(event, updateActivity));
      window.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('beforeunload', updateActivity);
    };
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('vibes_token', res.data.token);
    localStorage.setItem('vibes_user', JSON.stringify(res.data.user));
    localStorage.setItem('vibes_last_seen', Date.now().toString());
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
    localStorage.setItem('vibes_last_seen', Date.now().toString());
    setUser(res.data.user);
    return res.data.user;
  };

  const refreshUser = async () => {
    const res = await api.get('/auth/me');
    setUser(res.data);
    localStorage.setItem('vibes_user', JSON.stringify(res.data));
    localStorage.setItem('vibes_last_seen', Date.now().toString());
    return res.data;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
