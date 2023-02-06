const ratelimit = require("express-rate-limit");

const postLimiter = ratelimit({
    windowMs: 2 * 60 * 1000, // two minutes
    max:
      process.env.MODE === "dev"
        ? process.env.POST_DEV_RATE_LIMIT
        : process.env.POST_PROD_RATE_LIMIT,
    message: "Too many posts this IP, try again in one minute",
    standardHeaders: true,
    legacyHeaders: false,
  });

module.exports = postLimiter;