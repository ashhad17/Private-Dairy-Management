// const User = require('../models/user.model');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// exports.register = async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const existing = await User.findOne({ email });
//     if (existing) return res.status(400).json({ message: 'User already exists' });

//     const hashed = await bcrypt.hash(password, 10);
//     const user = await User.create({ email, password: hashed });

//     res.status(201).json({ message: 'User registered successfully' });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// exports.login = async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: 'Invalid credentials' });

//     const match = await bcrypt.compare(password, user.password);
//     if (!match) return res.status(400).json({ message: 'Invalid credentials' });

//     const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
//       expiresIn: '1h'
//     });

//     res.status(200).json({ token });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendMail } = require('../utils/mailer');
const crypto = require('crypto');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'A user with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');

    const user = new User({
      name,
      email,
      password: hashedPassword,
      emailVerificationToken
    });

    await user.save();

    await sendMail(email, 'Verify Your Email', `
      <h2>Email Verification</h2>
      <p>Click the link below to verify your email:</p>
      <a href="${process.env.CLIENT_URL}/verify-email/${emailVerificationToken}">
        Verify Email
      </a>
    `);

    res.status(201).json({ message: 'Registered successfully. Please check your email to verify your account.' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Failed to register user', error: err.message });
  }
};

exports.verifyEmail = async (req, res) => {
  const user = await User.findOne({ emailVerificationToken: req.params.token });
  if (!user) return res.status(400).json({ message: 'Invalid token' });

  user.isVerified = true;
  user.emailVerificationToken = undefined;
  await user.save();

  res.json({ message: 'Email verified!' });
};

exports.requestPasswordReset = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const token = crypto.randomBytes(32).toString('hex');
  user.resetToken = token;
  user.resetTokenExpiry = Date.now() + 15 * 60 * 1000;
  await user.save();

  await sendMail(user.email, 'Reset Password', `
    <a href="${process.env.CLIENT_URL}/reset-password/${token}">Reset your password</a>
  `);

  res.json({ message: 'Password reset link sent.' });
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({ resetToken: token, resetTokenExpiry: { $gt: Date.now() } });
  if (!user) return res.status(400).json({ message: 'Token expired or invalid' });

  user.password = await bcrypt.hash(password, 10);
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;
  await user.save();

  res.json({ message: 'Password updated!' });
};

exports.requestOtp = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user || !user.isVerified) return res.status(400).json({ message: 'Invalid or unverified email' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = otp;
  user.otpExpiry = Date.now() + 10 * 60 * 1000;
  await user.save();

  await sendMail(user.email, 'Your OTP', `Your OTP is: <b>${otp}</b>`);

  res.json({ message: 'OTP sent' });
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });

  if (!user || user.otp !== otp || Date.now() > user.otpExpiry)
    return res.status(400).json({ message: 'Invalid or expired OTP' });

  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();

  const token = jwt.sign({ id: user._id ,name:user.name,email:user.email}, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
};
exports.login = async (req, res) => {
    const { email, password } = req.body;
  
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });
    if (!user.isVerified) return res.status(403).json({ message: 'Please verify your email first' });
  
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });
  
    const token = jwt.sign({ id: user._id,name:user.name ,email:user.email}, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  };
  
