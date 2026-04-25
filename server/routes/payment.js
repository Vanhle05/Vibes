const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Payment = require('../models/Payment');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const PayOS = require('@payos/node');

const router = express.Router();
const payos = new PayOS(
  process.env.PAYOS_CLIENT_ID, 
  process.env.PAYOS_API_KEY, 
  process.env.PAYOS_CHECKSUM_KEY
);

// Multer for bill images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads/bills');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `bill-${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Chỉ upload hình ảnh'));
  }
});

// GET /api/payment/info — trả về thông tin thanh toán
router.get('/info', async (req, res) => {
  try {
    const paymentCount = await Payment.countDocuments();
    res.json({
      bankName: process.env.BANK_NAME,
      bankAccount: process.env.BANK_ACCOUNT,
      bankOwner: process.env.BANK_OWNER,
      bankBin: process.env.BANK_BIN,
      momo: process.env.MOMO,
      price: Number(process.env.PRICE_VND),
      nextOrderNumber: paymentCount + 1,
      currency: 'VNĐ'
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/payment/submit — gửi yêu cầu thanh toán kèm bill
router.post('/submit', protect, upload.single('bill'), async (req, res) => {
  try {
    const { method, transferContent } = req.body;
    const user = await User.findById(req.user._id);
    if (user.isPaid) return res.status(400).json({ message: 'Bạn đã thanh toán rồi' });

    const existing = await Payment.findOne({ user: req.user._id, status: 'pending' });
    if (existing) return res.status(400).json({ message: 'Bạn đã có yêu cầu đang chờ xử lý' });

    const billImageUrl = req.file ? `/uploads/bills/${req.file.filename}` : null;
    const payment = await Payment.create({
      user: req.user._id,
      amount: Number(process.env.PRICE_VND) || 199000,
      method: method || 'bank',
      transferContent,
      billImageUrl,
      status: 'pending'
    });

    // Update user paymentStatus
    await User.findByIdAndUpdate(req.user._id, { paymentStatus: 'pending' });
    res.status(201).json({ message: 'Đã gửi yêu cầu thanh toán, admin sẽ xác nhận sớm!', payment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/payment/create-link (PayOS Automated)
router.post('/create-link', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.isPaid) return res.status(400).json({ message: 'Bạn đã kích hoạt Premium rồi' });

    const orderCode = Number(Date.now().toString().slice(-9)); // PayOS prefers smaller integers for some plans
    const amount = Number(process.env.PRICE_VND) || 100000;
    
    // Tự động lấy URL nếu biến môi trường bị thiếu trên Vercel
    const clientUrl = process.env.CLIENT_URL || `https://${req.get('host')}`;
    
    const body = {
      orderCode,
      amount,
      description: 'Vibes Premium',
      returnUrl: `${clientUrl}/dashboard?status=success`,
      cancelUrl: `${clientUrl}/dashboard?status=cancelled`,
    };

    const paymentLinkRes = await payos.createPaymentLink(body);

    // Lưu giao dịch vào DB ở trạng thái chờ
    await Payment.create({
      user: req.user._id,
      amount,
      orderCode,
      method: 'PayOS',
      status: 'pending'
    });

    res.json(paymentLinkRes);
  } catch (err) {
    console.error('[PayOS Error]', err);
    res.status(500).json({ message: 'Không thể tạo mã thanh toán. Vui lòng thử lại sau.' });
  }
});

// GET /api/payment/check/:orderCode — kiểm tra trạng thái thanh toán trực tiếp từ PayOS
router.get('/check/:orderCode', protect, async (req, res) => {
  try {
    const { orderCode } = req.params;
    const payment = await Payment.findOne({ orderCode: Number(orderCode) });
    
    if (!payment) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    if (payment.status === 'confirmed') return res.json({ status: 'PAID', message: 'Đã thanh toán' });

    // Gọi trực tiếp PayOS để check (Dùng làm fallback cho Webhook)
    const paymentInfo = await payos.getPaymentLinkInformation(orderCode);
    
    if (paymentInfo.status === 'PAID') {
      const FulfillmentService = require('../services/FulfillmentService');
      await FulfillmentService.execute(payment.user, payment._id);
      
      // Đảm bảo cập nhật DB nếu Webhook chưa kịp chạy
      payment.status = 'confirmed';
      payment.confirmedAt = new Date();
      await payment.save();

      return res.json({ status: 'PAID', message: 'Kích hoạt thành công!' });
    }

    res.json({ status: paymentInfo.status, message: 'Chưa nhận được thanh toán' });
  } catch (err) {
    console.error('[Check Payment Error]', err);
    res.status(500).json({ message: 'Lỗi kiểm tra trạng thái' });
  }
});

// GET /api/payment/my — lịch sử thanh toán của user
router.get('/my', protect, async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id }).sort('-createdAt');
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
