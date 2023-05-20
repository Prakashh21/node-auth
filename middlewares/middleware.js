const rateLimit = require('express-rate-limit');

const generateOtpRateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 1,
});


module.exports = generateOtpRateLimiter

