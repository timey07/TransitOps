"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// Validation schema for creating/updating a driver
const driverSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    licenseNo: zod_1.z.string().min(5),
    category: zod_1.z.enum(['LMV', 'HMV']),
    licenseExpiry: zod_1.z.string().transform((str) => new Date(str)),
    contact: zod_1.z.string().min(10),
    safetyScore: zod_1.z.number().min(0).max(100).optional(),
    status: zod_1.z.enum(['AVAILABLE', 'ON_TRIP', 'OFF_DUTY', 'SUSPENDED']).optional()
});
// GET all drivers
router.get('/', async (req, res) => {
    try {
        const drivers = await prisma.driver.findMany({
            orderBy: { name: 'asc' }
        });
        res.json(drivers);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch drivers' });
    }
});
// POST create new driver
router.post('/', async (req, res) => {
    try {
        const data = driverSchema.parse(req.body);
        // Check if license exists
        const existing = await prisma.driver.findUnique({
            where: { licenseNo: data.licenseNo }
        });
        if (existing) {
            return res.status(400).json({ error: 'Driver with this license number already exists' });
        }
        const driver = await prisma.driver.create({
            data
        });
        res.status(201).json(driver);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: 'Invalid data', details: error.issues });
        }
        console.error(error);
        res.status(500).json({ error: 'Failed to create driver' });
    }
});
// PATCH update driver status
router.patch('/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const statusSchema = zod_1.z.object({
            status: zod_1.z.enum(['AVAILABLE', 'ON_TRIP', 'OFF_DUTY', 'SUSPENDED'])
        });
        const { status } = statusSchema.parse(req.body);
        const driver = await prisma.driver.update({
            where: { id },
            data: { status }
        });
        res.json(driver);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: 'Invalid status', details: error.issues });
        }
        console.error(error);
        res.status(500).json({ error: 'Failed to update driver status' });
    }
});
exports.default = router;
