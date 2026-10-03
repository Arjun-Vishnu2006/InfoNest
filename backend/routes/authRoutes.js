const express = require('express');
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');

const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');

const {
  requestRegisterOtp,
  register,
  login,
  refresh,
  logout,
  getMe,
  changePassword,
} = require('../controllers/authController');

const router = express.Router();

// Login rate limiter
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message:
      'Too many login attempts, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const registerValidation = [
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^\+?[0-9]{10,15}$/)
    .withMessage('Provide a valid phone number'),

  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage(
      'Name must be between 2 and 100 characters'
    ),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Provide a valid email'),

  body('password')
    .isLength({ min: 8 })
    .withMessage(
      'Password must be at least 8 characters'
    )
    .matches(/\d/)
    .withMessage(
      'Password must contain at least one number'
    ),

  body('role')
    .optional()
    .isIn([
      'Learner',
      'ContentCreator',
    ])
    .withMessage('Invalid role selection'),
];

const loginValidation = [
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^\+?[0-9]{10,15}$/)
    .withMessage('Provide a valid phone number'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Provide a valid email'),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage(
      'Current password is required'
    ),

  body('newPassword')
    .isLength({ min: 8 })
    .withMessage(
      'New password must be at least 8 characters'
    )
    .matches(/\d/)
    .withMessage(
      'New password must contain at least one number'
    ),
];

router.post(
  '/register/request-otp',
  [
    body('phone')
      .trim()
      .notEmpty()
      .withMessage('Phone number is required')
      .matches(/^\+?[0-9]{10,15}$/)
      .withMessage('Provide a valid phone number'),
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Provide a valid email'),
  ],
  validate,
  requestRegisterOtp
);

router.post(
  '/register',
  registerValidation,
  validate,
  register
);

router.post(
  '/login',
  loginLimiter,
  loginValidation,
  validate,
  login
);

router.post('/refresh', refresh);

router.post(
  '/logout',
  protect,
  logout
);

router.get(
  '/me',
  protect,
  getMe
);

router.put(
  '/change-password',
  protect,
  changePasswordValidation,
  validate,
  changePassword
);

module.exports = router;