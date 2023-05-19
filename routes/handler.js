const express = require('express')
const { generateOtp } = require('../controllers/otp')

const router = express.Router();

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.AUTH_EMAIL, // Replace with your Gmail email address
      pass: process.env.AUTH_PASS // Replace with your Gmail password
    }
  });


transporter.verify((error, success) => {
    if(error){
        console.log(error);
    }else{
        console.log("Ready for messages")
        console.log("success value",success)
    }
})

router.post("/generate-otp",generateOtp)


