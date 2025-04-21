

const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOtp=async (email, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Your OTP for Diary App',
    html: `<p>Your OTP is: <b>${otp}</b>. It expires in 10 minutes.</p>`,
  });
};
const sendMail = async (to, subject, html) => {
  return transporter.sendMail({ from: process.env.MAIL_USER, to, subject, html });
};

exports.sendReminderEmail = async (to) => {
  await transporter.sendMail({
    from: '"Daily Diary" <no-reply@diary.com>',
    to,
    subject: 'Your daily diary reminder 📝',
    html: `<p>Don't forget to write in your diary today!</p><br><a href="http://localhost:4200">Open Diary</a>`
  });
};

const sign = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

module.exports ={sendMail,sign,sendOtp} 

