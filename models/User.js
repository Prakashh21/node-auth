// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const otpSchema = new Schema({
//   otp: {
//     type: String,
//     required: true
//   },
//   // timestamp: {
//   //   type: Date,
//   //   default: Date.now,
//   //   expires: '5m' // OTP will expire after 5 minutes (adjust as needed)
//   // }
//   createdAt: { type: Date, expires: '5m', default: Date.now }
// });

// const userSchema = new Schema({
//   email: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   otps: [otpSchema]
// });

// const User = mongoose.model('User', userSchema);

// module.exports = {User};


const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  otp: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  }
});

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  otps: [otpSchema],
});

const User = mongoose.model('User', userSchema);

module.exports = {User};


