import express from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { users } from '../data/users.js';
import { generateToken } from '../middleware/auth.js';

const router = express.Router();

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { identifier, password, userType } = req.body;

    if (!identifier || !password || !userType) {
      return res.status(400).json({ 
        error: 'Missing required fields: identifier, password, userType' 
      });
    }

    // Find user by identifier and role
    const user = users.find(u => 
      u.identifier === identifier && 
      u.role === userType
    );

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.hashedPassword);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = generateToken(user);

    // Update last login
    user.lastLogin = new Date().toISOString();

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        role: user.role,
        blockchainId: user.blockchainId,
        lastLogin: user.lastLogin
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// Register endpoint (for demo purposes)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, userType = 'tourist' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ 
        error: 'Missing required fields: name, email, password' 
      });
    }

    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate blockchain ID
    const blockchainId = `BLK-NE-${userType.toUpperCase().substring(0, 4)}-${Date.now()}`;

    // Create new user
    const newUser = {
      id: uuidv4(),
      identifier: email,
      email,
      name,
      role: userType,
      blockchainId,
      hashedPassword,
      createdAt: new Date().toISOString(),
      lastLogin: null,
      isActive: true
    };

    users.push(newUser);

    res.status(201).json({
      message: 'Registration successful',
      user: {
        id: newUser.id,
        role: newUser.role,
        blockchainId: newUser.blockchainId,
        email: newUser.email,
        name: newUser.name
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Verify token endpoint
router.get('/verify', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ne-tourist-safety-secret-key-2025');
    const user = users.find(u => u.id === decoded.id);
    
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    res.json({
      valid: true,
      user: {
        id: user.id,
        role: user.role,
        blockchainId: user.blockchainId
      }
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;