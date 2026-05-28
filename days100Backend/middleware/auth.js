import jwt from 'jsonwebtoken';

export function verifyAdminToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied. Token missing.' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.adminSession = verified;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Session expired or invalid token.' });
  }
}
