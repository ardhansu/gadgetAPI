const errorHandler = (err, req, res, next) => {
  console.error('🚨 Mission Critical Error:', err.stack);

  // Default error
  let error = {
    message: 'Mission failed: Internal server error',
    status: 500
  };

  // Prisma errors
  if (err.code === 'P2002') {
    error = {
      message: 'Mission failed: Duplicate entry detected',
      status: 409
    };
  }

  if (err.code === 'P2025') {
    error = {
      message: 'Mission failed: Target not found',
      status: 404
    };
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    error = {
      message: 'Mission failed: Invalid data provided',
      status: 400,
      details: err.details
    };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = {
      message: 'Mission failed: Invalid security token',
      status: 401
    };
  }

  if (err.name === 'TokenExpiredError') {
    error = {
      message: 'Mission failed: Security token expired',
      status: 401
    };
  }

  res.status(error.status).json({
    error: error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    ...(error.details && { details: error.details })
  });
};

module.exports = {
  errorHandler
};