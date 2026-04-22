const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Profile = require('../models/Profile');
const passport = require('passport');
const { authLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// POST /api/auth/register
router.post('/register', authLimiter, async (req, res) => {
  try {
    const { name, email, password, phone, cccd, gender, birthYear, desire } = req.body;
    
    if (!name || !email || !password || !phone || !cccd || !gender || !birthYear)
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ các trường bắt buộc' });

    // --- CCCD Logic Validation ---
    const cccdClean = cccd.trim();
    if (!/^[0-9]{12}$/.test(cccdClean))
      return res.status(400).json({ message: 'CCCD phải bao gồm đúng 12 chữ số' });

    // 1. Mã tỉnh (001-096) - Whitelist basic check
    const provinceCode = cccdClean.substring(0, 3);
    const validProvinces = [
      '001', '002', '004', '006', '008', '010', '011', '012', '014', '015', '017', '019', '020', '022', '024', '025', '026', '027', '030', '031', '033', '034', '035', '036', '037', '038', '040', '042', '044', '045', '046', '048', '049', '051', '052', '054', '056', '058', '060', '062', '064', '066', '067', '068', '070', '072', '074', '075', '077', '079', '080', '082', '083', '084', '086', '087', '089', '091', '092', '093', '094', '095', '096'
    ];
    if (!validProvinces.includes(provinceCode))
      return res.status(400).json({ message: 'Mã tỉnh/thành phố trên CCCD không hợp lệ' });

    // 2. Mã thế kỷ & Giới tính (Số thứ 4)
    const genderCode = parseInt(cccdClean[3]);
    // 0: Nam 19xx, 1: Nữ 19xx, 2: Nam 20xx, 3: Nữ 20xx, etc.
    const century = Math.floor(genderCode / 2); // 0: 1900, 1: 2000, 2: 2100...
    const cccdGender = genderCode % 2 === 0 ? 'Nam' : 'Nữ';
    
    if (cccdGender !== gender)
      return res.status(400).json({ message: 'Giới tính không khớp với mã trên CCCD' });

    // 3. Mã năm sinh (Số thứ 5-6)
    const yearCode = parseInt(cccdClean.substring(4, 6));
    const fullYear = (19 + century) * 100 + yearCode;
    
    if (fullYear !== parseInt(birthYear))
      return res.status(400).json({ message: 'Năm sinh không khớp với mã trên CCCD' });

    // Checking existence
    const emailExists = await User.findOne({ email: email.toLowerCase() });
    if (emailExists) return res.status(409).json({ message: 'Email đã được sử dụng' });
    
    const cccdExists = await User.findOne({ cccd: cccdClean });
    if (cccdExists) return res.status(409).json({ message: 'Số CCCD này đã được đăng ký' });

    const user = await User.create({ 
      name, email: email.toLowerCase(), password, 
      phone, cccd: cccdClean, gender, birthYear, desire 
    });

    // Auto-create empty profile
    await Profile.create({ user: user._id, email: user.email, displayName: user.name });

    res.status(201).json({
      message: 'Đăng ký thành công! Vui lòng hoàn tất thanh toán 100.000đ để kích hoạt tài khoản.',
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: 'Email hoặc username đã tồn tại' });
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

// POST /api/auth/login
router.post('/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Vui lòng nhập email và mật khẩu' });

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });

    const token = signToken(user._id);
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, isPaid: user.isPaid, username: user.username }
    });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

// GET /api/auth/me
router.get('/me', require('../middleware/auth').protect, async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({ id: user._id, name: user.name, email: user.email, role: user.role, isPaid: user.isPaid, username: user.username, paymentStatus: user.paymentStatus });
});

// --- Google OAuth ---
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
  const token = signToken(req.user._id);
  res.redirect(`${process.env.CLIENT_URL}/auth/success?token=${token}`);
});

// --- Facebook OAuth ---
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), (req, res) => {
  const token = signToken(req.user._id);
  res.redirect(`${process.env.CLIENT_URL}/auth/success?token=${token}`);
});

router.post('/social-login', async (req, res) => {
  try {
    const { name, email, platform } = req.body;
    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Tạo user mới nếu chưa tồn tại (mặc định chưa thanh toán)
      user = await User.create({
        name,
        email: email.toLowerCase(),
        password: require('crypto').randomBytes(8).toString('hex'), // Random pass
        loginMethod: platform,
        isActive: true, // Cho phép vào Explore
        isPaid: false
      });
      await Profile.create({ user: user._id, email: user.email, displayName: user.name });
    }

    const token = signToken(user._id);
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, isPaid: user.isPaid, loginMethod: user.loginMethod }
    });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

module.exports = router;
