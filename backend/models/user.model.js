// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   email: { type: String, required: true, unique: true },
//   password: String,
//   isVerified: { type: Boolean, default: false },
//   otp: String,
//   otpExpiry: Date,
//   resetToken: String,
//   resetTokenExpiry: Date,
//   emailVerificationToken: String,
// });

// module.exports = mongoose.model('User', userSchema);

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  password: {
    type: String,
    required: false // optional if OTP login is used
  },

  isVerified: {
    type: Boolean,
    default: false
  },

  otp: {
    type: String,
    default: null
  },

  otpExpiry: {
    type: Date,
    default: null
  },

  resetToken: {
    type: String,
    default: null
  },

  resetTokenExpiry: {
    type: Date,
    default: null
  },

  emailVerificationToken: {
    type: String,
    default: null
  },

  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },

  emailReminders: { type: Boolean, default: true },
reminderTime: { type: String, default: '08:00' },

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
