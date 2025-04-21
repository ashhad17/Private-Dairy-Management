
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
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

  // emailReminders: { type: Boolean, default: true },
  reminderEnabled: { type: Boolean, default: false }
,
reminderTime: {
  type: String,
  default: '20:00',
  validate: {
    validator: function (value) {
      return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value); // Validates 'HH:mm' format
    },
    message: 'Invalid time format. Use HH:mm.'
  }
}
,

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
