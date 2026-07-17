const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Sanitize Mongoose validation errors so passwords/sensitive values aren't leaked in the error message
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed: Please ensure all conditions are met (e.g., password must be at least 6 characters).';
  }

  res.status(statusCode);
  res.json({
    message: message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };
