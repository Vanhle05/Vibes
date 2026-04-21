const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return res.status(401).json({ message: 'Không có quyền truy cập' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if (!req.user) return res.status(401).json({ message: 'Người dùng không tồn tại' });
    next();
  } catch {
    res.status(401).json({ message: 'Token không hợp lệ' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  res.status(403).json({ message: 'Chỉ admin mới có quyền truy cập' });
};

const paidOnly = (req, res, next) => {
  if (req.user && (req.user.isPaid || req.user.role === 'admin')) return next();
  res.status(403).json({ message: 'Vui lòng thanh toán để sử dụng tính năng này' });
};

module.exports = { protect, adminOnly, paidOnly };
