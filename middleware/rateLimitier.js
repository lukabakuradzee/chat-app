const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 3,
  message: JSON.stringify({
    message:
      "Too many login attempts from this IP, please try again after 5 minutes",
  }),
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = loginLimiter;
