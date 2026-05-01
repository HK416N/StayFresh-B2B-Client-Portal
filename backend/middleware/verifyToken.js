import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({
      success: false, 
      error: 'No token provided.',
      code: 'NO_TOKEN',
    });
  }

  // Extract token after Bearer 
  const token = authHeader.split(' ')[1];  

  if (!token) {
    return res.status(401).json({
      success: false, 
      error: 'No token provided.',
      code: 'NO_TOKEN',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      error: 'Invalid token.',
      code: 'INVALID_TOKEN',
    });
  }
};