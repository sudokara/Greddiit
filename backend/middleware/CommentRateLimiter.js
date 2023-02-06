const ratelimit = require("express-rate-limit");

const commentLimiter = ratelimit({
    windowMs: 60 * 1000, // one minute
    max:
      process.env.MODE === "dev"
        ? process.env.DEV_RATE_LIMIT
        : process.env.PROD_RATE_LIMIT,
    message: "Too many comments this IP, try again in one minute",
    standardHeaders: true,
    legacyHeaders: false,
  });

module.exports = commentLimiter;