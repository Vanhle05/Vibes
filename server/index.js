require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const connectDB = require('./config/db');
const { apiLimiter } = require('./middleware/rateLimiter');

const app = express();

// Connect DB
connectDB();

// Security middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
app.use('/api', apiLimiter);

// Static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/webhook', require('./routes/webhook'));
app.use('/api/admin', require('./routes/admin'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString(), version: '1.0.0' });
});

// Owner info endpoint (public)
app.get('/api/owner', (req, res) => {
  res.json({
    name: process.env.OWNER_NAME || 'Lê Việt Anh',
    email: process.env.OWNER_EMAIL || 'Vanhlenorthside@gmail.com',
    phone: process.env.OWNER_PHONE || '+84 968 739 902',
  });
});

// 404 handler
app.use((req, res) => res.status(404).json({ message: 'Endpoint không tồn tại' }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Lỗi server' });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Vibes Server running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} đang bị chiếm. Đang thử lại sau 1 giây...`);
    setTimeout(() => {
      server.close();
      server.listen(PORT);
    }, 1000);
  } else {
    console.error('❌ Lỗi server:', err);
    process.exit(1);
  }
});

// Tắt server sạch khi process kết thúc
process.on('SIGTERM', () => { server.close(() => process.exit(0)); });
process.on('SIGINT',  () => { server.close(() => process.exit(0)); });
