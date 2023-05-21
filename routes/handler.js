const express = require('express')
const { generateOtp, loginHandler } = require('../controllers/otp');
const generateOtpRateLimiter = require('../middlewares/middleware');

const router = express.Router();




router.post("/generateOtp",generateOtp)
      .post("/login", loginHandler)


module.exports = router