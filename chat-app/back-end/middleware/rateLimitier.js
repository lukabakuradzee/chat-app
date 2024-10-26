const rateLimit = require("express-rate-limit");
const User = require("../models/User");
const { rateLimiterEmail } = require("../utils/email");

const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 3,
  keyGenerator: (req) => {
    return req.ip
  },
  handler: async (req, res) => {
    const { identifier } = req.body;
    const user = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });
    
    
    if (user) {
      await rateLimiterEmail(user.email)
    }

    res.status(429).json({
      message:
        "Too many login attempts from this IP, please try again after 5 minutes",
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipFailedRequest: true,
});

module.exports = loginLimiter;
