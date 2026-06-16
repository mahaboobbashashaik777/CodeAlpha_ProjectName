const rateLimit = require('express-rate-limit');
const { config } = require('../config/translation');

const translateRateLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: {
    error: {
      message: 'Too many translation requests from this IP, please try again later.',
      status: 429
    }
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

module.exports = {
  translateRateLimiter
};
