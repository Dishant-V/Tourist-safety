import jwt from 'jsonwebtoken';
import { users } from '../data/users.js';

const JWT_SECRET = process.env.JWT_SECRET || 'ne-tourist-safety-secret-key-2025';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};

export const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      role: user.role, 
      blockchainId: user.blockchainId 
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};