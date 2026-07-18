const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const sendEmail = require('../utils/email');

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
      isVerified: false,
    });

    if (user) {
      // Generate Verification Token
      const verificationToken = crypto.randomBytes(32).toString('hex');
      
      // Hash it before saving to DB for security
      user.verificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex');
      user.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
      await user.save({ validateBeforeSave: false });

      // Create Verification URL
      const verifyUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/verify-email/${verificationToken}`;
      
      const message = `Welcome to Secure My Campus! Please verify your email address by clicking the link below:\n\n${verifyUrl}\n\nThis link is valid for 24 hours.`;
      const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #0d47a1;">Welcome to Secure My Campus!</h2>
          <p>Please verify your email address by clicking the button below:</p>
          <a href="${verifyUrl}" style="display: inline-block; padding: 12px 24px; background-color: #0d47a1; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 10px; margin-bottom: 10px;">Verify Email</a>
          <p style="margin-top: 20px; color: #666; font-size: 14px;">This link is valid for 24 hours.</p>
        </div>
      `;
      
      try {
        await sendEmail({
          email: user.email,
          subject: 'Verify your email - Secure My Campus',
          message,
          html,
        });

        res.status(201).json({
          message: 'A verification link has been sent to your email. Please check your inbox.',
          requiresVerification: true
        });
      } catch (err) {
        // If email fails, delete the user so they can try again with correct email/credentials
        await User.findByIdAndDelete(user._id);
        
        console.error('Email could not be sent', err);
        res.status(500);
        return next(new Error('There was an error sending the verification email. Try again later.'));
      }
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
      if (!user.isVerified) {
        res.status(401);
        return next(new Error('Please verify your email to log in'));
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
        isVerified: false,
      });

      // Generate Verification Token
      const verificationToken = crypto.randomBytes(32).toString('hex');
      user.verificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex');
      user.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000;
      await user.save({ validateBeforeSave: false });

      // Create Verification URL
      const verifyUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/verify-email/${verificationToken}`;
      const message = `Welcome to Secure My Campus! Please verify your email address by clicking the link below:\n\n${verifyUrl}\n\nThis link is valid for 24 hours.`;
      const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #0d47a1;">Welcome to Secure My Campus!</h2>
          <p>Please verify your email address by clicking the button below:</p>
          <a href="${verifyUrl}" style="display: inline-block; padding: 12px 24px; background-color: #0d47a1; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 10px; margin-bottom: 10px;">Verify Email</a>
          <p style="margin-top: 20px; color: #666; font-size: 14px;">This link is valid for 24 hours.</p>
        </div>
      `;
      
      try {
        await sendEmail({
          email: user.email,
          subject: 'Verify your email - Secure My Campus',
          message,
          html,
        });

        return res.status(201).json({
          message: 'A verification link has been sent to your email. Please check your inbox.',
          requiresVerification: true
        });
      } catch (err) {
        // If email fails, delete the user so they can try again
        await User.findByIdAndDelete(user._id);
        console.error('Email could not be sent', err);
        res.status(500);
        return next(new Error('There was an error sending the verification email. Try again later.'));
      }
    }

    if (!user.isVerified) {
      res.status(401);
      return next(new Error('Please verify your email to log in'));
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

// @desc    Verify user email
// @route   GET /api/auth/verify/:token
// @access  Public
const verifyEmail = async (req, res, next) => {
  try {
    // Get hashed token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      verificationToken: hashedToken,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      res.status(400);
      return next(new Error('Invalid or expired verification token'));
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      message: 'Email successfully verified! You can now log in.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  googleAuth,
  verifyEmail,
  refreshAccessToken,
  logoutUser,
  getUserProfile,
};
