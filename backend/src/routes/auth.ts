import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'transitops_secret_key_123';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['FLEET_MANAGER', 'DISPATCHER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST'])
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

// POST register (useful for seeding default users or creating users)
router.post('/register', async (req, res) => {
  try {
    const { email, password, role } = registerSchema.parse(req.body);

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role
      }
    });

    res.status(201).json({ id: user.id, email: user.email, role: user.role });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid data', details: error.issues });
    }
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST login
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check account lockout
    if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
      return res.status(403).json({ error: 'Account locked after 5 failed attempts. Please try again later.' });
    }

    // Check role match
    if (user.role !== role) {
      // Magic bypass for testing: allow admin@transitops.com to switch roles dynamically
      if (user.email === 'admin@transitops.com') {
        user.role = role;
      } else {
        await handleFailedLogin(user);
        return res.status(400).json({ error: 'Invalid role selection' });
      }
    }

    // Check password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      await handleFailedLogin(user);
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Success! Reset failed attempts
    await prisma.user.update({
      where: { id: user.id },
      data: { failedAttempts: 0, lockedUntil: null }
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid data', details: error.issues });
    }
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Helper function to track failed logins
async function handleFailedLogin(user: any) {
  const newAttempts = user.failedAttempts + 1;
  let lockedUntil = null;
  
  if (newAttempts >= 5) {
    // Lock for 15 minutes
    lockedUntil = new Date();
    lockedUntil.setMinutes(lockedUntil.getMinutes() + 15);
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { failedAttempts: newAttempts, lockedUntil }
  });
}

// Middleware for auth verification
export function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

// Middleware for RBAC roles check
export function authorizeRoles(...allowedRoles: string[]) {
  return (req: any, res: any, next: any) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Unauthorized role' });
    }
    next();
  };
}

export default router;
