const express = require('express')
const { generateOtp } = require('../controllers/otp');
const generateOtpRateLimiter = require('../middlewares/middleware');

const router = express.Router();




router.post("/generateOtp",generateOtpRateLimiter,generateOtp)


module.exports = router