import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import Navbar from '../components/Navbar';
import {
  CreditCard, Building2, Smartphone, Copy, Upload,
  CheckCircle, Clock, XCircle, ArrowRight, Info
} from 'lucide-react';
import './Payment.css';

const Payment = () => {
  const { user, refreshUser } = useAuth();
  const [info, setInfo] = useState(null);
  const [method, setMethod] = useState('bank');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [myPayments, setMyPayments] = useState([]);
  const [copied, setCopied] = useState('');

  useEffect(() => {
    api.get('/payment/info').then(r => {
      setInfo(r.data);
      setContent(`VIBES ${user?.name?.toUpperCase().replace(/ /g, '') || ''}`);
    });
    api.get('/payment/my').then(r => setMyPayments(r.data));
  }, []);

  const copy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(''), 2000);
  };

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = ev => setPreview(ev.target.result);
    reader.readAsDataURL(f);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setError('Vui lòng upload ảnh bill chuyển khoản');
    setLoading(true); setError('');
    try {
      const fd = new FormData();
      fd.append('method', method);
      fd.append('transferContent', content);
      fd.append('bill', file);
      await api.post('/payment/submit', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSuccess(true);
      await refreshUser();
      const r = await api.get('/payment/my');
      setMyPayments(r.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Gửi thất bại, thử lại.');
    } finally {
      setLoading(false);
    }
  };

  if (user?.isPaid) {
    return (
      <div className="payment-page">
        <Navbar />
        <div className="payment-done">
          <CheckCircle size={64} color="#10b981" />
          <h2>Bạn đã kích hoạt tài khoản!</h2>
          <p>Tận hưởng đầy đủ tính năng của Vibes nhé 🎉</p>
          <Link to="/dashboard" className="btn btn-primary btn-lg">Vào Dashboard <ArrowRight size={18} /></Link>
        </div>
      </div>
    );
  }

  const hasPending = myPayments.some(p => p.status === 'pending');

  return (
    <div className="payment-page">
      <Navbar />
      <div className="payment-container container">
        <div className="payment-header">
          <h1>Kích hoạt tài khoản</h1>
          <p>Chuyển khoản và gửi bill để admin xác nhận trong vòng <strong>24 giờ</strong></p>
        </div>

        {hasPending && (
          <div className="payment-alert alert-pending">
            <Clock size={20} /> Yêu cầu của bạn đang chờ xác nhận. Admin sẽ xử lý sớm!
          </div>
        )}
        {success && (
          <div className="payment-alert alert-success">
            <CheckCircle size={20} /> Đã gửi thành công! Vui lòng chờ admin xác nhận.
          </div>
        )}

        <div className="payment-grid">
          {/* Left: Bank info */}
          {info && (
            <div className="payment-info glass-card">
              <h2><CreditCard size={20} /> Thông tin thanh toán</h2>

              <div className="method-tabs">
                <button className={`method-tab ${method === 'bank' ? 'active' : ''}`} onClick={() => setMethod('bank')}>
                  <Building2 size={18} /> Ngân hàng
                </button>
                <button className={`method-tab ${method === 'momo' ? 'active' : ''}`} onClick={() => setMethod('momo')}>
                  <Smartphone size={18} /> Momo
                </button>
              </div>

              {method === 'bank' ? (
                <div className="bank-details">
                  <div className="qr-section">
                    <img 
                      src={`https://img.vietqr.io/image/${info.bankBin}-${info.bankAccount}-compact2.png?amount=${info.price}&addInfo=${content}&accountName=${info.bankOwner}`} 
                      alt="VietQR" 
                      className="qr-code"
                    />
                    <div className="qr-hint">Quét mã để chuyển khoản nhanh</div>
                  </div>
                  
                  <div className="bank-row">
                    <span className="bank-label">Ngân hàng</span>
                    <span className="bank-value">{info.bankName}</span>
                  </div>
                  <div className="bank-row">
                    <span className="bank-label">Số tài khoản</span>
                    <div className="bank-copy">
                      <span className="bank-value mono">{info.bankAccount}</span>
                      <button className="copy-btn" onClick={() => copy(info.bankAccount, 'acc')}>
                        {copied === 'acc' ? <CheckCircle size={16} color="#10b981" /> : <Copy size={16} />}
                      </button>
                    </div>
                  </div>
                  <div className="bank-row">
                    <span className="bank-label">Chủ tài khoản</span>
                    <span className="bank-value">{info.bankOwner}</span>
                  </div>
                  <div className="bank-row">
                    <span className="bank-label">Số tiền</span>
                    <span className="bank-value price-tag">{info.price.toLocaleString('vi-VN')} ₫</span>
                  </div>
                </div>
              ) : (
                <div className="bank-details">
                  <div className="qr-section">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=2|99|${info.momo}|||0|0|${info.price}|${content}|transfer_myqr`} 
                      alt="Momo QR" 
                      className="qr-code"
                    />
                    <div className="qr-hint">Quét mã Momo</div>
                  </div>
                  <div className="bank-row">
                    <span className="bank-label">Số Momo</span>
                    <div className="bank-copy">
                      <span className="bank-value mono">{info.momo}</span>
                      <button className="copy-btn" onClick={() => copy(info.momo, 'momo')}>
                        {copied === 'momo' ? <CheckCircle size={16} color="#10b981" /> : <Copy size={16} />}
                      </button>
                    </div>
                  </div>
                  <div className="bank-row">
                    <span className="bank-label">Số tiền</span>
                    <span className="bank-value price-tag">{info.price.toLocaleString('vi-VN')} ₫</span>
                  </div>
                </div>
              )}

              <div className="transfer-note">
                <Info size={16} />
                <span>Nội dung chuyển khoản: <strong>{content}</strong></span>
                <button className="copy-btn" onClick={() => copy(content, 'note')}>
                  {copied === 'note' ? <CheckCircle size={16} color="#10b981" /> : <Copy size={16} />}
                </button>
              </div>
            </div>
          )}

          {/* Right: Upload form */}
          <div className="payment-form glass-card">
            <h2><Upload size={20} /> Gửi bill xác nhận</h2>
            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={handleSubmit} className="upload-form">
              <div className="form-group">
                <label>Nội dung chuyển khoản</label>
                <input className="input-field" value={content}
                  onChange={e => setContent(e.target.value)} placeholder="Nội dung CK" />
              </div>

              <div className="form-group">
                <label>Ảnh bill chuyển khoản *</label>
                <label htmlFor="bill-upload" className={`upload-area ${preview ? 'has-preview' : ''}`}>
                  {preview
                    ? <img src={preview} alt="Bill preview" />
                    : <>
                        <Upload size={32} />
                        <span>Click để chọn ảnh bill</span>
                        <span className="upload-hint">JPG, PNG, tối đa 10MB</span>
                      </>
                  }
                </label>
                <input id="bill-upload" type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
                {preview && <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setFile(null); setPreview(null); }}>Đổi ảnh</button>}
              </div>

              <button id="payment-submit" type="submit" className="btn btn-primary btn-lg"
                disabled={loading || hasPending || !file}>
                {loading ? <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> : 'Gửi yêu cầu kích hoạt'}
              </button>
            </form>
          </div>
        </div>

        {/* Payment history */}
        {myPayments.length > 0 && (
          <div className="payment-history glass-card">
            <h3>Lịch sử thanh toán</h3>
            {myPayments.map(p => (
              <div key={p._id} className="payment-row">
                <div>
                  <span className="payment-date">{new Date(p.createdAt).toLocaleDateString('vi-VN')}</span>
                  <span className="payment-amount">{p.amount?.toLocaleString('vi-VN')} ₫</span>
                </div>
                <span className={`badge ${p.status === 'confirmed' ? 'badge-success' : p.status === 'rejected' ? 'badge-danger' : 'badge-warning'}`}>
                  {p.status === 'confirmed' ? <><CheckCircle size={12} /> Đã xác nhận</> : p.status === 'rejected' ? <><XCircle size={12} /> Bị từ chối</> : <><Clock size={12} /> Đang chờ</>}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Payment;
