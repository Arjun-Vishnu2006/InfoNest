const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const User = require('../models/User');

const {
  generateAccessToken,
  generateRefreshToken,
} = require('../utils/generateToken');

const REFRESH_COOKIE_NAME =
  'infonest_refresh_token';

// Email OTP store. OTPs are kept in memory until verification or expiry.
const pendingOtps = new Map();
const OTP_TTL_MS = 5 * 60 * 1000;

const mailTransporter = process.env.EMAIL_USER && process.env.EMAIL_APP_PASSWORD
  ? require('nodemailer').createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    })
  : null;

const sendRegistrationOtpEmail = async (email, otp) => {
  if (!mailTransporter) {
    throw new Error(
      'Email OTP is not configured. Add EMAIL_USER and EMAIL_APP_PASSWORD to backend/.env.'
    );
  }

  await mailTransporter.sendMail({
    from: `InfoNest <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your InfoNest verification code',
    text: `Your InfoNest verification code is ${otp}. It expires in 5 minutes. If you did not request this code, you can ignore this email.`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;padding:24px;color:#2f2940">
        <h2 style="margin-bottom:8px">InfoNest Email Verification</h2>
        <p>Use the verification code below to complete your InfoNest registration.</p>
        <div style="font-size:32px;font-weight:700;letter-spacing:8px;text-align:center;padding:18px;margin:24px 0;background:#f3efff;border-radius:12px;color:#6b50df">${otp}</div>
        <p>This code expires in <strong>5 minutes</strong>.</p>
        <p style="font-size:12px;color:#777">If you did not request this code, you can ignore this email.</p>
      </div>
    `,
  });
};

const hashToken = (token) =>
  crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

const refreshCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/api/v1/auth',
});

const issueTokens = async (res, user) => {
  const accessToken = generateAccessToken(
    user._id,
    user.role
  );

  const refreshToken = generateRefreshToken(
    user._id
  );

  user.refreshTokens = user.refreshTokens || [];

  user.refreshTokens.push(
    hashToken(refreshToken)
  );

  if (user.refreshTokens.length > 5) {
    user.refreshTokens =
      user.refreshTokens.slice(-5);
  }

  await user.save({
    validateBeforeSave: false,
  });

  res.cookie(
    REFRESH_COOKIE_NAME,
    refreshToken,
    refreshCookieOptions()
  );

  return accessToken;
};

const requestRegisterOtp = asyncHandler(async (req, res) => {
  const { phone, email } = req.body;
  const normalizedPhone = phone.trim();
  const normalizedEmail = email.toLowerCase().trim();
  const existing = await User.findOne({ $or: [{ email: normalizedEmail }, { phone: normalizedPhone }] });
  if (existing) {
    res.status(409);
    throw new Error(existing.email === normalizedEmail ? 'An account with this email already exists' : 'An account with this phone number already exists');
  }

  const otp = String(Math.floor(100000 + Math.random() * 900000));
  pendingOtps.set(normalizedEmail, {
    otp,
    phone: normalizedPhone,
    expiresAt: Date.now() + OTP_TTL_MS,
  });

  try {
    await sendRegistrationOtpEmail(normalizedEmail, otp);
  } catch (error) {
    pendingOtps.delete(normalizedEmail);
    console.error('Error sending registration OTP email:', error.message);
    res.status(503);
    throw new Error('Unable to send OTP email. Check the email configuration and try again.');
  }

  res.status(200).json({
    success: true,
    message: 'OTP sent to your email address.',
    data: { expiresInSeconds: OTP_TTL_MS / 1000 },
  });
});

const register = asyncHandler(async (req, res) => {
  const {
    name,
    phone,
    email,
    password,
    role,
    otp,
  } = req.body;

  const normalizedPhone = phone.trim();

  const normalizedEmail =
    email.toLowerCase().trim();

  const pending = pendingOtps.get(normalizedEmail);
  if (!pending || pending.phone !== normalizedPhone) {
    res.status(400);
    throw new Error('Please request a new OTP for this phone number and email');
  }
  if (Date.now() > pending.expiresAt) {
    pendingOtps.delete(normalizedEmail);
    res.status(400);
    throw new Error('OTP has expired. Please request a new OTP.');
  }
  if (String(otp || '') !== pending.otp) {
    res.status(400);
    throw new Error('Invalid OTP. Please check the 6-digit code and try again.');
  }

  const existingUser = await User.findOne({
    $or: [{ email: normalizedEmail }, { phone: normalizedPhone }],
  });

  if (existingUser) {
    res.status(409);
    throw new Error(
      'An account with this email already exists'
    );
  }

  const allowedRoles = [
    'Learner',
    'ContentCreator',
  ];

  const assignedRole =
    allowedRoles.includes(role)
      ? role
      : 'Learner';

  const user = await User.create({
    name,
    phone: normalizedPhone,
    email: normalizedEmail,
    password,
    role: assignedRole,
    isVerified: true,
  });

  const accessToken = await issueTokens(
    res,
    user
  );

  pendingOtps.delete(normalizedEmail);

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    data: {
      user,
      accessToken,
    },
  });
});

const login = asyncHandler(async (req, res) => {
  const {
    email,
    phone,
    password,
  } = req.body;

  const normalizedEmail =
    email.toLowerCase().trim();

  const normalizedPhone = phone.trim();

  const user = await User.findOne({
    email: normalizedEmail,
    phone: normalizedPhone,
  }).select(
    '+password +refreshTokens'
  );

  if (
    !user ||
    !(await user.comparePassword(password))
  ) {
    res.status(401);
    throw new Error(
      'Invalid email, phone number, or password'
    );
  }

  if (!user.isActive) {
    res.status(403);
    throw new Error(
      'This account has been deactivated. Contact an administrator.'
    );
  }

  user.lastLogin = new Date();

  const accessToken = await issueTokens(
    res,
    user
  );

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      user,
      accessToken,
      redirectTo:
        `/dashboard/${user.role.toLowerCase()}`,
    },
  });
});

const refresh = asyncHandler(async (req, res) => {
  const token =
    req.cookies?.[REFRESH_COOKIE_NAME];

  if (!token) {
    res.status(401);
    throw new Error(
      'No refresh token provided'
    );
  }

  let decoded;

  try {
    decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET
    );
  } catch (error) {
    res.status(401);
    throw new Error(
      'Refresh token is invalid or expired, please log in again'
    );
  }

  const user = await User.findById(
    decoded.id
  ).select('+refreshTokens');

  const tokenHash = hashToken(token);

  if (
    !user ||
    !user.refreshTokens.includes(tokenHash)
  ) {
    res.status(401);
    throw new Error(
      'Refresh token was not recognized, please log in again'
    );
  }

  if (!user.isActive) {
    res.status(403);
    throw new Error(
      'Account has been deactivated'
    );
  }

  // Refresh-token rotation
  user.refreshTokens =
    user.refreshTokens.filter(
      (storedToken) =>
        storedToken !== tokenHash
    );

  const accessToken = await issueTokens(
    res,
    user
  );

  res.status(200).json({
    success: true,
    data: {
      accessToken,
    },
  });
});

const logout = asyncHandler(async (req, res) => {
  const token =
    req.cookies?.[REFRESH_COOKIE_NAME];

  if (token && req.user) {
    const tokenHash = hashToken(token);

    req.user.refreshTokens = (
      req.user.refreshTokens || []
    ).filter(
      (storedToken) =>
        storedToken !== tokenHash
    );

    await req.user.save({
      validateBeforeSave: false,
    });
  }

  res.clearCookie(
    REFRESH_COOKIE_NAME,
    {
      path: '/api/v1/auth',
    }
  );

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});

const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      user: req.user,
    },
  });
});

const changePassword = asyncHandler(
  async (req, res) => {
    const {
      currentPassword,
      newPassword,
    } = req.body;

    const user = await User.findById(
      req.user._id
    ).select(
      '+password +refreshTokens'
    );

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    const passwordMatches =
      await user.comparePassword(
        currentPassword
      );

    if (!passwordMatches) {
      res.status(401);
      throw new Error(
        'Current password is incorrect'
      );
    }

    user.password = newPassword;
    user.refreshTokens = [];

    await user.save();

    res.clearCookie(
      REFRESH_COOKIE_NAME,
      {
        path: '/api/v1/auth',
      }
    );

    res.status(200).json({
      success: true,
      message:
        'Password changed successfully. Please log in again.',
    });
  }
);

module.exports = {
  requestRegisterOtp,
  register,
  login,
  refresh,
  logout,
  getMe,
  changePassword,
};