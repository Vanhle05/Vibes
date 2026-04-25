const rateLimit = require('express-rate-limit');

// Disable limiting by setting extremely high values and short windows
const authLimiter = rateLimit({
  windowMs: 1, // 1ms
  max: 0, // unlimited (express-rate-limit doesn't support 0 for unlimited directly, usually handled by skipping or setting high)
  skip: () => true // Skip the limiter entirely
});

const apiLimiter = rateLimit({
  windowMs: 1,
  max: 0,
  skip: () => true // Skip the limiter entirely
});

module.exports = { authLimiter, apiLimiter };
