const express = require('express');
const { protect } = require('../middleware/auth');
const Message = require('../models/Message');
const PrivateMessage = require('../models/PrivateMessage');
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
 * GET /api/community/stats
 * Thống kê cộng đồng
 */
router.get('/stats', protect, async (req, res) => {
  try {
    const [totalMembers, onlineCount, topUsers] = await Promise.all([
      User.countDocuments({ role: 'user', isPaid: true }),
      User.countDocuments({ role: 'user', isPaid: true, isActive: true }),
      User.find({ isPaid: true }).limit(5).select('name role')
    ]);
    
    res.json({ totalMembers, onlineCount, topUsers });
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
      isVibes: req.user.isPaid || req.user.role === 'admin',
      userRole: req.user.role
    });

    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * GET /api/community/private/conversations
 * Lấy danh sách những người đã nhắn tin riêng
 */
router.get('/private/conversations', protect, async (req, res) => {
  try {
    if (!req.user.isPaid && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Premium only.' });
    }

    // Tìm tất cả tin nhắn gửi HOẶC nhận bởi user hiện tại
    const messages = await PrivateMessage.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }]
    })
    .sort({ createdAt: -1 })
    .populate('sender', 'name role')
    .populate('receiver', 'name role');

    // Lọc ra danh sách user độc nhất
    const userMap = new Map();
    messages.forEach(msg => {
      const otherUser = msg.sender._id.toString() === req.user._id.toString() ? msg.receiver : msg.sender;
      if (!userMap.has(otherUser._id.toString())) {
        userMap.set(otherUser._id.toString(), {
          _id: otherUser._id,
          name: otherUser.name,
          role: otherUser.role,
          lastMessage: msg.text,
          lastMessageAt: msg.createdAt
        });
      }
    });

    res.json(Array.from(userMap.values()));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * GET /api/community/private/messages/:userId
 * Lấy lịch sử chat với 1 người cụ thể
 */
router.get('/private/messages/:userId', protect, async (req, res) => {
  try {
    if (!req.user.isPaid && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Premium only.' });
    }

    const { userId } = req.params;
    const messages = await PrivateMessage.find({
      $or: [
        { sender: req.user._id, receiver: userId },
        { sender: userId, receiver: req.user._id }
      ]
    })
    .sort({ createdAt: 1 })
    .populate('sender', 'name role');

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * POST /api/community/private/messages/:userId
 * Gửi tin nhắn riêng
 */
router.post('/private/messages/:userId', protect, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Content required' });

    if (!req.user.isPaid && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Premium only.' });
    }

    const { userId } = req.params;
    
    // Đảm bảo user nhận tồn tại
    const receiver = await User.findById(userId);
    if (!receiver) return res.status(404).json({ message: 'User not found' });

    const newMessage = await PrivateMessage.create({
      sender: req.user._id,
      receiver: userId,
      text
    });

    const populatedMsg = await PrivateMessage.findById(newMessage._id).populate('sender', 'name role');

    res.status(201).json(populatedMsg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
