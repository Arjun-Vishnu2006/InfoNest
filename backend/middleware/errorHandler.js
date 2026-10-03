const notFound = (req, res, next) => {
  const error = new Error(
    `Route not found - ${req.originalUrl}`
  );

  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let statusCode =
    res.statusCode && res.statusCode !== 200
      ? res.statusCode
      : 500;

  let message =
    err.message || 'Internal server error';

  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid value for field '${err.path}'`;
  }

  if (err.name === 'ValidationError') {
    statusCode = 400;

    message = Object.values(err.errors)
      .map((error) => error.message)
      .join(', ');
  }

  if (err.code === 11000) {
    statusCode = 409;

    const field = Object.keys(
      err.keyValue || {}
    )[0];

    message = field
      ? `A record with that ${field} already exists`
      : 'Duplicate record already exists';
  }

  if (
    statusCode === 500 &&
    process.env.NODE_ENV === 'production'
  ) {
    message = 'Internal server error';
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
    }),
  });
};

module.exports = {
  notFound,
  errorHandler,
};