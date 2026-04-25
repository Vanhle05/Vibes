import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { AuthProvider, useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Payment from './pages/Payment';
import PublicProfile from './pages/PublicProfile';
import Admin from './pages/Admin';
import Explore from './pages/Explore';
import AuthSuccess from './pages/AuthSuccess';
import Community from './pages/Community';
import PrivacyPolicy from './pages/PrivacyPolicy';
import DataDeletion from './pages/DataDeletion';
import { ThemeProvider } from './context/ThemeContext';
import UpgradeNotification from './components/UpgradeNotification';

const ErrorFallback = ({ error }) => (
  <div style={{ padding: '2rem', background: '#030712', color: '#fff', height: '100vh' }}>
    <h2>Đã có lỗi xảy ra</h2>
    <pre style={{ color: '#f87171' }}>{error.message}</pre>
    <button onClick={() => window.location.href = '/'}>Quay lại trang chủ</button>
  </div>
);

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'#030712' }}><div className="spinner" /></div>;
  if (user && !user.isPaid && user.role !== 'admin') return <Navigate to="/register" replace />;
  return user ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'#030712' }}><div className="spinner" /></div>;
  if (!user || user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
};

const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user && user.isPaid) return <Navigate to="/explore" replace />;
  return children;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<GuestRoute><Landing /></GuestRoute>} />
    <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
    <Route path="/register" element={<Register />} />
    <Route path="/auth/success" element={<AuthSuccess />} />
    <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
    <Route path="/community" element={<PrivateRoute><Community /></PrivateRoute>} />
    <Route path="/payment" element={<PrivateRoute><Payment /></PrivateRoute>} />
    <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
    <Route path="/explore" element={<Explore />} />
    <Route path="/profile/:username" element={<PublicProfile />} />
    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
    <Route path="/user-data-deletion" element={<DataDeletion />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

const App = () => (
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
          <UpgradeNotification />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </ErrorBoundary>
);

export default App;
