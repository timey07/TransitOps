"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = authenticateToken;
exports.authorizeRoles = authorizeRoles;
const express_1 = require("express");
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'transitops_secret_key_123';
const registerSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    role: zod_1.z.enum(['FLEET_MANAGER', 'DISPATCHER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST'])
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string()
});
// POST register (useful for seeding default users or creating users)
router.post('/register', async (req, res) => {
    try {
        const { email, password, role } = registerSchema.parse(req.body);
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return res.status(400).json({ error: 'User already exists' });
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role
            }
        });
        res.status(201).json({ id: user.id, email: user.email, role: user.role });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: 'Invalid data', details: error.issues });
        }
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});
// POST login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = loginSchema.parse(req.body);
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        const match = await bcrypt_1.default.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '8h' });
        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: 'Invalid data', details: error.issues });
        }
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});
// Middleware for auth verification
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token)
        return res.status(401).json({ error: 'Access denied' });
    jsonwebtoken_1.default.verify(token, JWT_SECRET, (err, user) => {
        if (err)
            return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
}
// Middleware for RBAC roles check
function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Unauthorized role' });
        }
        next();
    };
}
exports.default = router;
