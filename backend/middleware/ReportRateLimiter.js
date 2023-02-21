const ratelimit = require("express-rate-limit");

const reportLimiter = ratelimit({
  windowMs: 60 * 1000,
  max:
    process.env.mode === "dev"
      ? process.env.DEV_REPORT_RATE_LIMIT
      : process.env.PROD_REPORT_RATE_LIMIT,
  message: "Too many reports in one minute",
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = reportLimiter;
