export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const code = err.code || 'SERVER_ERROR';
  res.status(status).json({
    success: false,
    error: err.message || 'Server error',
    code: code,
  });
};