const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const {
  registerUser,
  loginUser,
  googleAuth,
  refreshAccessToken,
  logoutUser,
  getUserProfile
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Define rate limiter for auth routes (Max 5 requests per 15 minutes per IP)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: {
    message: 'Too many attempts from this IP, please try again after 15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/register', authLimiter, registerUser);
router.post('/login', authLimiter, loginUser);
router.post('/google', authLimiter, googleAuth);
router.post('/refresh', refreshAccessToken);
router.post('/logout', logoutUser);
router.get('/profile', protect, getUserProfile);

module.exports = router;
