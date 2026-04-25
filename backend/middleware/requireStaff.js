import jwt from 'jsonwebtoken';

export const requireStaff = (req, res, next) => {

  const token = req.headers['authorization'];

  //exit early if no token
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'No token provided.',
      code: 'NO_TOKEN',
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {

    //error - return the erorr
    if (err) {
      return res.status(403).json({
        success: false,
        error: 'Failed to authenticate token.',
        code: 'INVALID_TOKEN',
      });
    }

    const client = await db.connect();

    try {
      const result = await client.query('SELECT * FROM staff WHERE user_id = $1', [decoded._id]);

      if (result.rows.length === 0) {
        return res.status(403).json({
          success: false,
          error: 'Access denied. User is not a staff member.',
          code: 'NOT_STAFF',
        });
      }

      req.user = decoded;

      next();

    } catch (error) {
      if (client) await client.query('ROLLBACK');
      res.status(500).json({
        success: false,
        error: error.message,
        code: 'SERVER_ERROR',
      });
    } finally {
      client.release();
    }
  });
};