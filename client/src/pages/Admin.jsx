import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Navbar from '../components/Navbar';
import {
  Users, CreditCard, CheckCircle, Clock, XCircle,
  Trash2, RefreshCw, Eye, Plus, Edit2, X, Save, User as UserIcon, Mail, Lock, Zap
} from 'lucide-react';
import './Admin.css';
import ToggleSwitch from '../components/ToggleSwitch';

const Admin = () => {
  const { user: authUser } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [tab, setTab] = useState('users');
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // 'create' | 'edit'
  const [formData, setFormData] = useState({ name: '', email: '', password: '', isPaid: false, isActive: false });
  const [selectedId, setSelectedId] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [s, u, p] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/admin/users'),
        api.get('/admin/payments')
      ]);
      setStats(s.data);
      setUsers(u.data);
      setPayments(p.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (authUser?.role !== 'admin') navigate('/dashboard');
    else fetchData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/users', formData);
      setModal(null);
      fetchData();
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/admin/users/${selectedId}`, formData);
      setModal(null);
      fetchData();
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Xóa người dùng này?')) {
      await api.delete(`/admin/users/${id}`);
      fetchData();
    }
  };

  const handleQuickActive = async (u) => {
    try {
      await api.put(`/admin/users/${u._id}`, { ...u, isPaid: true, isActive: true });
      fetchData();
    } catch (err) { console.error(err); }
  };

  const openEdit = (u) => {
    setFormData({ name: u.name, email: u.email, password: '', isPaid: u.isPaid, isActive: u.isActive });
    setSelectedId(u._id);
    setModal('edit');
  };

  return (
    <div className="admin-page">
      <Navbar />
      <div className="admin-container container">
        <div className="admin-header">
          <h1>Quản trị hệ thống</h1>
          <button className="btn-vibe-primary" onClick={() => { setFormData({ name: '', email: '', password: '', isPaid: false, isActive: false }); setModal('create'); }}>
            <Plus size={18} /> Thêm người dùng
          </button>
        </div>

        {stats && (
          <div className="admin-stats">
            <div className="admin-stat-card glass-card">
              <div className="stat-number">{stats.totalUsers}</div>
              <div className="stat-label">Tổng Users</div>
            </div>
            <div className="admin-stat-card glass-card">
              <div className="stat-number">{stats.paidUsers}</div>
              <div className="stat-label">Đã thanh toán</div>
            </div>
            <div className="admin-stat-card glass-card">
              <div className="stat-number">{stats.pendingPayments}</div>
              <div className="stat-label">Thanh toán chờ</div>
            </div>
          </div>
        )}

        <div className="admin-tabs">
          <button className={`admin-tab ${tab === 'users' ? 'active' : ''}`} onClick={() => setTab('users')}>Người dùng</button>
          <button className={`admin-tab ${tab === 'payments' ? 'active' : ''}`} onClick={() => setTab('payments')}>Giao dịch</button>
        </div>

        {tab === 'users' ? (
          <div className="users-table glass-card">
             <div className="table-head">
                <span>Họ tên</span>
                <span>Email</span>
                <span>Premium</span>
                <span>Active</span>
                <span>Thao tác</span>
             </div>
             {users.map(u => (
                <div key={u._id} className="user-row">
                  <span>{u.name}</span>
                  <span>{u.email}</span>
                  <span>{u.isPaid ? '✅' : '❌'}</span>
                  <span>{u.isActive ? '✅' : '❌'}</span>
                  <div className="row-actions">
                    <button title="Kích hoạt nhanh" onClick={() => handleQuickActive(u)} style={{ color: (u.isPaid && u.isActive) ? 'var(--vibe-accent)' : 'inherit' }}>
                      <Zap size={14} fill={(u.isPaid && u.isActive) ? "currentColor" : "none"}/>
                    </button>
                    <button onClick={() => openEdit(u)}><Edit2 size={14}/></button>
                    <button onClick={() => handleDelete(u._id)}><Trash2 size={14}/></button>
                  </div>
                </div>
             ))}
          </div>
        ) : (
          <div className="payment-table glass-card">
            {payments.map(p => (
              <div key={p._id} className="payment-item">
                <span>{p.user?.name}</span>
                <span>{Number(p.amount).toLocaleString()}đ</span>
                <span>{p.status}</span>
                <span>{new Date(p.createdAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {modal && (
        <div className="modal-overlay">
          <div className="modal-box glass-card">
             <h2>{modal === 'create' ? 'Tạo User' : 'Sửa User'}</h2>
             <form onSubmit={modal === 'create' ? handleCreate : handleUpdate}>
                <input className="input-field" placeholder="Tên" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                <input className="input-field" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                {modal === 'create' && <input className="input-field" type="password" placeholder="Mật khẩu" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', margin: '0.5rem 0' }}>
                  <ToggleSwitch 
                    label="Đã thanh toán" 
                    checked={formData.isPaid} 
                    onChange={v => setFormData({...formData, isPaid: v})} 
                  />
                  <ToggleSwitch 
                    label="Kích hoạt" 
                    checked={formData.isActive} 
                    onChange={v => setFormData({...formData, isActive: v})} 
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" onClick={() => setModal(null)}>Hủy</button>
                  <button type="submit">Lưu</button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
