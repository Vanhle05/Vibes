import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Payment from './pages/Payment';
import PublicProfile from './pages/PublicProfile';
import Admin from './pages/Admin';
import Explore from './pages/Explore';

// Protected route — chỉ cho logged in users
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'#030712' }}><div className="spinner" /></div>;
  
  // Nếu chưa thanh toán thì bắt buộc phải qua /register (trừ admin)
  if (user && !user.isPaid && user.role !== 'admin') {
    return <Navigate to="/register" replace />;
  }
  
  return user ? children : <Navigate to="/login" replace />;
};

// Admin-only route
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'#030712' }}><div className="spinner" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
};

// Guest-only route (redirect to dashboard if logged in AND paid)
const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  
  if (user) {
    return user.isPaid ? <Navigate to="/dashboard" replace /> : children;
  }
  
  return children;
};

import AuthSuccess from './pages/AuthSuccess';
import Community from './pages/Community';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Landing />} />
    <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
    <Route path="/register" element={<Register />} /> {/* Public + Unpaid access */}
    <Route path="/auth/success" element={<AuthSuccess />} />
    <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
    <Route path="/community" element={<PrivateRoute><Community /></PrivateRoute>} />
    <Route path="/payment" element={<PrivateRoute><Payment /></PrivateRoute>} />
    <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
    <Route path="/explore" element={<Explore />} />
    <Route path="/profile/:username" element={<PublicProfile />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

import { ThemeProvider } from './context/ThemeContext';

const App = () => (
  <BrowserRouter>
    <ThemeProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
);

export default App;
