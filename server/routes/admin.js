const express = require('express');
const Payment = require('../models/Payment');
const User = require('../models/User');
const Profile = require('../models/Profile');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Tất cả routes đều cần admin
router.use(protect, adminOnly);

// GET /api/admin/dashboard — thống kê tổng quan
router.get('/dashboard', async (req, res) => {
  try {
    const [totalUsers, paidUsers, pendingPayments, confirmedPayments, totalProfiles] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      User.countDocuments({ isPaid: true }),
      Payment.countDocuments({ status: 'pending' }),
      Payment.countDocuments({ status: 'confirmed' }),
      Profile.countDocuments({ isPublished: true }),
    ]);
    res.json({ totalUsers, paidUsers, pendingPayments, confirmedPayments, totalProfiles });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/payments — danh sách tất cả payments
router.get('/payments', async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const payments = await Payment.find(filter)
      .populate('user', 'name email')
      .sort('-createdAt');
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/admin/payments/:id/confirm — xác nhận thanh toán thủ công
router.patch('/payments/:id/confirm', async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate('user');
    if (!payment) return res.status(404).json({ message: 'Không tìm thấy payment' });

    payment.status = 'confirmed';
    payment.confirmedAt = new Date();
    payment.confirmedBy = req.user._id;
    await payment.save();

    // Activate user
    await User.findByIdAndUpdate(payment.user._id, {
      isPaid: true,
      isActive: true,
      paymentStatus: 'confirmed'
    });
    res.json({ message: `Đã xác nhận thanh toán cho ${payment.user.name}`, payment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── USER CRUD (Admin quản lý trực tiếp) ──────────────────────

// GET /api/admin/users — danh sách users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password').sort('-createdAt');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/admin/users — tạo user mới
router.post('/users', async (req, res) => {
  try {
    const { name, email, password, isPaid } = req.body;
    const user = await User.create({
      name, email, password,
      role: 'user',
      isPaid: isPaid || false,
      isActive: isPaid || false,
      paymentStatus: isPaid ? 'confirmed' : 'none'
    });
    await Profile.create({ user: user._id, email: user.email, displayName: user.name });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/admin/users/:id — cập nhật user
router.put('/users/:id', async (req, res) => {
  try {
    const { name, email, password, isPaid, isActive } = req.body;
    
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = name;
    user.email = email;
    user.isPaid = isPaid;
    user.isActive = isActive;
    user.paymentStatus = isPaid ? 'confirmed' : 'none';
    
    if (password && password.trim().length > 0) {
      user.password = password.trim();
    }
    
    await user.save();
    
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/admin/users/:id — xóa user
router.delete('/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await Profile.findOneAndDelete({ user: req.params.id });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
