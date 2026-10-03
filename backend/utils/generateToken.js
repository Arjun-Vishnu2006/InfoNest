const jwt = require('jsonwebtoken');

const generateAccessToken = (userId, role) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }

  return jwt.sign(
    {
      id: userId,
      role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn:
        process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    }
  );
};

const generateRefreshToken = (userId) => {
  if (!process.env.JWT_REFRESH_SECRET) {
    throw new Error('JWT_REFRESH_SECRET is not defined');
  }

  return jwt.sign(
    {
      id: userId,
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn:
        process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    }
  );
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};