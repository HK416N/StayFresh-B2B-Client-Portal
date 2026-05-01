import jwt from 'jsonwebtoken';

export const requireStaff = (req, res, next) => {
  // verifyToken already ran and set req.user
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required.',
      code: 'NO_TOKEN',
    });
  }

  if (req.user.role !== 'Staff') {
    return res.status(403).json({
      success: false,
      error: 'Access denied. Staff only.',
      code: 'NOT_STAFF',
    });
  }

  next();
};