import bcrypt from 'bcryptjs';

// Pre-hashed passwords for demo users
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 12);
};

// Demo users with hashed passwords
export const users = [
  {
    id: 'tourist-001',
    identifier: 'tourist001',
    email: 'tourist@example.com',
    name: 'Demo Tourist',
    role: 'tourist',
    blockchainId: 'BLK-NE-TOUR-001',
    hashedPassword: await hashPassword('1234'),
    createdAt: '2025-01-01T00:00:00.000Z',
    lastLogin: null,
    isActive: true
  },
  {
    id: 'police-001',
    identifier: 'police001',
    email: 'police@example.com',
    name: 'Demo Police Officer',
    role: 'police',
    blockchainId: 'BLK-NE-POLI-001',
    hashedPassword: await hashPassword('demo123'),
    createdAt: '2025-01-01T00:00:00.000Z',
    lastLogin: null,
    isActive: true
  },
  {
    id: 'transport-001',
    identifier: 'transport001',
    email: 'transport@example.com',
    name: 'Demo Transport Operator',
    role: 'transport',
    blockchainId: 'BLK-NE-TRAN-001',
    hashedPassword: await hashPassword('demo123'),
    createdAt: '2025-01-01T00:00:00.000Z',
    lastLogin: null,
    isActive: true
  },
  {
    id: 'superadmin-001',
    identifier: 'superadmin',
    email: 'admin@example.com',
    name: 'System Administrator',
    role: 'superadmin',
    blockchainId: 'BLK-NE-ADMN-001',
    hashedPassword: await hashPassword('demo123'),
    createdAt: '2025-01-01T00:00:00.000Z',
    lastLogin: null,
    isActive: true
  }
];