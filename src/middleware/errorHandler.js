/**
 * Centralized error handling middleware.
 */
function errorHandler(err, req, res, next) {
  console.error('Unhandled Error:', err);

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    success: false,
    message,
    // Provide details in development environments
    ...(process.env.NODE_ENV === 'development' && { error: err.stack }),
  });
}

module.exports = errorHandler;
