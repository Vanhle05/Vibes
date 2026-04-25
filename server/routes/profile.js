const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Profile = require('../models/Profile');
const User = require('../models/User');
const { protect, paidOnly } = require('../middleware/auth');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const router = express.Router();

// Initialize Gemini
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

// Multer storage for avatars
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads/avatars');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Chỉ upload được file ảnh'));
  }
});

// GET /api/profile/me — get own profile
router.get('/me', protect, async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.user._id });
    if (!profile) profile = await Profile.create({ user: req.user._id, email: req.user.email, displayName: req.user.name });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/profile/me — update own profile (paid only)
router.put('/me', protect, paidOnly, async (req, res) => {
  try {
    const allowed = ['displayName', 'tagline', 'bio', 'phone', 'email', 'location', 'coverColor', 'theme', 'socials', 'skills', 'isPublished', 'animatedBackground', 'templateId'];
    const updates = {};
    allowed.forEach(k => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });

    const profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      updates,
      { new: true, runValidators: true }
    );
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/profile/avatar — upload avatar (paid only)
router.post('/avatar', protect, paidOnly, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Không có file nào được upload' });
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    const profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      { avatar: avatarUrl },
      { new: true }
    );
    res.json({ avatarUrl, profile });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/profile/username — set username (paid only)
router.post('/username', protect, paidOnly, async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) return res.status(400).json({ message: 'Vui lòng nhập username' });
    const exists = await User.findOne({ username: username.toLowerCase() });
    if (exists && exists._id.toString() !== req.user._id.toString())
      return res.status(409).json({ message: 'Username này đã được sử dụng' });
    const user = await User.findByIdAndUpdate(req.user._id, { username: username.toLowerCase() }, { new: true });
    res.json({ username: user.username });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: 'Username đã tồn tại' });
    res.status(500).json({ message: err.message });
  }
});

// GET /api/profile/:username — get public profile by username
router.get('/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username.toLowerCase() });
    if (!user) return res.status(404).json({ message: 'Không tìm thấy trang này' });
    const profile = await Profile.findOne({ user: user._id });
    if (!profile || !profile.isPublished)
      return res.status(404).json({ message: 'Trang này chưa được công khai' });

    // Increment view count
    await Profile.findByIdAndUpdate(profile._id, { $inc: { viewCount: 1 } });
    res.json({ profile, ownerName: user.name });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/profile/ai-bio — generate bio using AI (paid only)
router.post('/ai-bio', protect, paidOnly, async (req, res) => {
  try {
    if (!genAI) return res.status(503).json({ message: 'Tính năng AI hiện chưa được cấu hình. Vui lòng liên hệ Admin.' });
    
    const { keywords, tone } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Viết một đoạn giới thiệu bản thân (bio) ngắn gọn, ấn tượng, chuyên nghiệp cho trang cá nhân portfolio.
    Từ khóa: ${keywords || 'một lập trình viên nhiệt huyết'}
    Phong cách: ${tone || 'chuyên nghiệp'}
    Yêu cầu:
    - Độ dài khoảng 2-3 câu.
    - Ngôn ngữ: Tiếng Việt.
    - Không sử dụng hashtag.
    - Chỉ trả về nội dung Bio, không kèm lời dẫn.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    res.json({ bio: text });
  } catch (err) {
    console.error('Gemini Error:', err);
    res.status(500).json({ message: 'Lỗi khi tạo Bio bằng AI. Vui lòng thử lại sau.' });
  }
});

module.exports = router;
