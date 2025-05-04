const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit 5 login requests per window
  message: "Too many attempts from this IP, please try again after 15 minutes.",
  standardHeaders: true, 
  legacyHeaders: false,
  handler: (req, res, next) => {
    console.warn(`Rate limit hit: ${req.ip} on /login`);
    res.status(429).json({ error: "Too many attempts. Please try again later." });
  }
});

module.exports = limiter;