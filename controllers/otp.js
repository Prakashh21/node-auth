const User = require("../models/User");

async function generateOtp(req , res){
    return res.json("generate OTP")
}




module.exports = {
    generateOtp
}