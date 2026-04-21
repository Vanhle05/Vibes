const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 20,
  message: { message: 'Quá nhiều yêu cầu, vui lòng thử lại sau 15 phút' }
});

const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 200,
  message: { message: 'Quá nhiều yêu cầu từ IP này' }
});

module.exports = { authLimiter, apiLimiter };
