const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const otpSchema = new Schema({
  otp: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    expires: '5m' // OTP will expire after 5 minutes (adjust as needed)
  }
});

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  otps: [otpSchema]
});

const User = mongoose.model('User', userSchema);

module.exports = User;