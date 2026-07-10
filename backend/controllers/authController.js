const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generates a short-lived access token (15 mins)
const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'securemycampus', {
    expiresIn: '15m',
  });
};

// Generates a long-lived refresh token (7 days)
const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'securemycampus', {
    expiresIn: '7d',
  });
};

// Helper to set refresh token in httpOnly cookie
const setRefreshTokenCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  const { name, email, password, phone } = req.body;

  try {
    if (!email || !password || !name) {
      res.status(400);
      return next(new Error('Please add all fields'));
    }

    // Determine user role based on email
    let role;
    if (email === 'securemycampus485164@gmail.com') {
      role = 'admin';
    } else if (!email.endsWith('@anurag.edu.in') && !email.endsWith('@securemycampus.edu')) {
      res.status(400);
      return next(new Error('Only @securemycampus.edu or @anurag.edu.in email addresses are allowed (except for admin).'));
    } else {
      const localPart = email.split('@')[0];
      if (/^[a-zA-Z]+$/.test(localPart)) {
        role = 'faculty';
      } else if (/^[a-zA-Z0-9]+$/.test(localPart)) {
        role = 'student';
      } else {
        res.status(400);
        return next(new Error('Invalid email format. Faculty emails should contain only letters, student emails can contain letters and numbers.'));
      }
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      return next(new Error('User already exists'));
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      phone,
    });

    if (user) {
      const refreshToken = generateRefreshToken(user._id);
      setRefreshTokenCookie(res, refreshToken);

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        accessToken: generateAccessToken(user._id),
      });
    } else {
      res.status(400);
      return next(new Error('Invalid user data'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get tokens
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      const refreshToken = generateRefreshToken(user._id);
      setRefreshTokenCookie(res, refreshToken);

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        accessToken: generateAccessToken(user._id),
      });
    } else {
      res.status(401);
      return next(new Error('Invalid email or password'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate with Google
// @route   POST /api/auth/google
// @access  Public
const googleAuth = async (req, res, next) => {
  const { token } = req.body;

  try {
    if (!token) {
      res.status(400);
      return next(new Error('Google token is required'));
    }

    // Verify token with Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;

    // Run same validation rules on the email
    let role;
    if (email === 'securemycampus485164@gmail.com') {
      role = 'admin';
    } else if (!email.endsWith('@anurag.edu.in') && !email.endsWith('@securemycampus.edu')) {
      res.status(400);
      return next(new Error('Only @securemycampus.edu or @anurag.edu.in email addresses are allowed (except for admin).'));
    } else {
      const localPart = email.split('@')[0];
      if (/^[a-zA-Z]+$/.test(localPart)) {
        role = 'faculty';
      } else if (/^[a-zA-Z0-9]+$/.test(localPart)) {
        role = 'student';
      } else {
        res.status(400);
        return next(new Error('Invalid email format. Faculty emails should contain only letters, student emails can contain letters and numbers.'));
      }
    }

    // Check if user already exists
    let user = await User.findOne({ email });

    if (!user) {
      // If it doesn't exist, create user with OAuth random password
      const generatedPassword = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      user = await User.create({
        name,
        email,
        password: generatedPassword,
        role,
      });
    }

    const refreshToken = generateRefreshToken(user._id);
    setRefreshTokenCookie(res, refreshToken);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      accessToken: generateAccessToken(user._id),
    });
  } catch (error) {
    res.status(401);
    next(new Error('Invalid Google token authentication'));
  }
};

// @desc    Refresh Access Token
// @route   POST /api/auth/refresh
// @access  Public
const refreshAccessToken = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    res.status(401);
    return next(new Error('No refresh token provided'));
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET || 'securemycampus');
    const user = await User.findById(decoded.id);

    if (!user) {
      res.status(401);
      return next(new Error('User matching refresh token not found'));
    }

    const newAccessToken = generateAccessToken(user._id);
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(401);
    next(new Error('Invalid or expired refresh token'));
  }
};

// @desc    Logout User / Clear Cookie
// @route   POST /api/auth/logout
// @access  Private
const logoutUser = async (req, res, next) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  res.status(200).json({ message: 'Successfully logged out' });
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      });
    } else {
      res.status(404);
      return next(new Error('User not found'));
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  googleAuth,
  refreshAccessToken,
  logoutUser,
  getUserProfile,
};
