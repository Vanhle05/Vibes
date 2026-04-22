require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const MongoStoreModule = require('connect-mongo');
const MongoStore = MongoStoreModule.default || MongoStoreModule;
require('./config/passport');
const connectDB = require('./config/db');
const { apiLimiter } = require('./middleware/rateLimiter');

const app = express();

// Trust Vercel proxy
app.enable('trust proxy');

// Connect DB
connectDB();

// Security middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(session({
  secret: process.env.JWT_SECRET || 'vibes_secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions',
    ttl: 14 * 24 * 60 * 60 // 14 days
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
  }
}));
app.use(passport.initialize());
app.use(passport.session());


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

// Diagnostic route
app.get('/api/diag', async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const User = require('./models/User');
    const email = req.query.email;
    let userInfo = null;
    
    if (email) {
      const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
      if (user) {
        userInfo = {
          found: true,
          method: user.loginMethod,
          hasPass: !!user.password,
          passLen: user.password ? user.password.length : 0
        };
      } else {
        userInfo = { found: false };
      }
    }

    res.json({
      env: {
        NODE_ENV: process.env.NODE_ENV,
        BACKEND_URL: process.env.BACKEND_URL ? 'set' : 'MISSING',
        CLIENT_URL: process.env.CLIENT_URL ? 'set' : 'MISSING',
        MONGO_URI: process.env.MONGO_URI ? 'set' : 'MISSING',
        GOOGLE: process.env.GOOGLE_CLIENT_ID ? 'set' : 'MISSING',
        FACEBOOK: process.env.FACEBOOK_APP_ID ? 'set' : 'MISSING'
      },
      db: {
        readyState: mongoose.connection.readyState,
        host: mongoose.connection.host
      },
      user: userInfo
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Owner info endpoint (public)
app.get('/api/owner', (req, res) => {
  res.json({
    name: process.env.OWNER_NAME,
    email: process.env.OWNER_EMAIL,
    phone: process.env.OWNER_PHONE,
  });
});

// 404 handler
app.use((req, res) => res.status(404).json({ message: 'Endpoint không tồn tại' }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Lỗi server' });
});

// Export for Vercel serverless
module.exports = app;

// Local dev server
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  const server = app.listen(PORT, () => {
    console.log(`🚀 Vibes Server running on port ${PORT}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`❌ Port ${PORT} đang bị chiếm. Đang thử lại sau 1 giây...`);
      setTimeout(() => { server.close(); server.listen(PORT); }, 1000);
    } else {
      console.error('❌ Lỗi server:', err);
      process.exit(1);
    }
  });

  process.on('SIGTERM', () => { server.close(() => process.exit(0)); });
  process.on('SIGINT',  () => { server.close(() => process.exit(0)); });
}
