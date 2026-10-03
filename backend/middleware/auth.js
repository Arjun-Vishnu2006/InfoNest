const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const User = require('../models/User');

const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (
    !authHeader ||
    !authHeader.startsWith('Bearer ')
  ) {
    res.status(401);
    throw new Error(
      'Not authorized, no access token provided'
    );
  }

  const token = authHeader.split(' ')[1];

  let decoded;

  try {
    decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );
  } catch (error) {
    res.status(401);

    if (error.name === 'TokenExpiredError') {
      throw new Error('Access token expired');
    }

    throw new Error(
      'Not authorized, invalid token'
    );
  }

  const user = await User.findById(decoded.id);

  if (!user) {
    res.status(401);
    throw new Error(
      'Not authorized, user no longer exists'
    );
  }

  if (!user.isActive) {
    res.status(403);
    throw new Error(
      'Account has been deactivated'
    );
  }

  req.user = user;

  next();
});

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401);
      throw new Error(
        'Not authorized, no user context'
      );
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403);
      throw new Error(
        `Role '${req.user.role}' is not permitted to perform this action`
      );
    }

    next();
  };
};

module.exports = {
  protect,
  authorize,
};