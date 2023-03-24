const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    email: String,
    otp: String,
    expireIn: Number
  },
  {
    timestamps: true
  }
);

let otpModel = mongoose.model('otps', userSchema);

module.exports = otpModel