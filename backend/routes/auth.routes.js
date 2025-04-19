// const express = require('express');
// const router = express.Router();
// const verifyToken = require('../middlewares/auth.middleware');
// const { register, login } = require('../controllers/auth.controller');
// router.get('/protected', verifyToken, (req, res) => {
//     res.status(200).json({
//       message: 'You have accessed a protected route!',
//       user: req.user // Contains id and email from token
//     });
//   });
// router.post('/register', register);
// router.post('/login', login);

// module.exports = router;
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const auth = require('../controllers/auth.controller');

router.post('/register', auth.register);
router.get('/verify-email/:token', auth.verifyEmail);
router.post('/login', auth.login);

router.post('/request-reset', auth.requestPasswordReset);
router.post('/reset-password/:token', auth.resetPassword);

router.post('/request-otp', auth.requestOtp);
router.post('/verify-otp', auth.verifyOtp);
// inside routes/auth.routes.js
// const jwt = require('jsonwebtoken');
const verifyToken = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return res.sendStatus(401);
  const token = header.split(' ')[1];
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.sendStatus(403);
  }
};

router.get('/protected', verifyToken, (req, res) => {
  res.json({ message: 'Secure data', user: req.user });
});

module.exports = router;
