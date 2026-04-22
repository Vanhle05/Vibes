const express = require('express');
const { protect } = require('../middleware/auth');
const Message = require('../models/Message');
const User = require('../models/User');

const router = express.Router();

/**
 * GET /api/community/messages
 * Lấy danh sách tin nhắn mới nhất
 */
router.get('/messages', protect, async (req, res) => {
  try {
    // Chỉ cho phép user đã nạp tiền hoặc admin
    if (!req.user.isPaid && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Premium only.' });
    }

    const messages = await Message.find()
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.json(messages.reverse());
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * POST /api/community/messages
 * Gửi tin nhắn mới
 */
router.post('/messages', protect, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Content required' });

    if (!req.user.isPaid && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Premium only.' });
    }

    const newMessage = await Message.create({
      user: req.user._id,
      userName: req.user.name,
      text,
      isVibes: req.user.isPaid || req.user.role === 'admin'
    });

    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
