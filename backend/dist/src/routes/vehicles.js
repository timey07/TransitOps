"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// Validation schema for creating/updating a vehicle
const vehicleSchema = zod_1.z.object({
    registrationNo: zod_1.z.string().min(3),
    name: zod_1.z.string().min(2),
    type: zod_1.z.string(),
    capacityKg: zod_1.z.number().positive(),
    odometerKm: zod_1.z.number().nonnegative(),
    acquisitionCost: zod_1.z.number().nonnegative(),
    fuelStatusPct: zod_1.z.number().min(0).max(100).optional(),
    status: zod_1.z.enum(['AVAILABLE', 'ON_TRIP', 'IN_SHOP', 'RETIRED']).optional()
});
// GET all vehicles
router.get('/', async (req, res) => {
    try {
        const vehicles = await prisma.vehicle.findMany({
            orderBy: { registrationNo: 'asc' }
        });
        res.json(vehicles);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch vehicles' });
    }
});
// POST create new vehicle
router.post('/', async (req, res) => {
    try {
        const data = vehicleSchema.parse(req.body);
        // Check if registration exists
        const existing = await prisma.vehicle.findUnique({
            where: { registrationNo: data.registrationNo }
        });
        if (existing) {
            return res.status(400).json({ error: 'Vehicle with this registration number already exists' });
        }
        const vehicle = await prisma.vehicle.create({
            data
        });
        res.status(201).json(vehicle);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: 'Invalid data', details: error.issues });
        }
        console.error(error);
        res.status(500).json({ error: 'Failed to create vehicle' });
    }
});
// PATCH update vehicle status
router.patch('/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const statusSchema = zod_1.z.object({
            status: zod_1.z.enum(['AVAILABLE', 'ON_TRIP', 'IN_SHOP', 'RETIRED'])
        });
        const { status } = statusSchema.parse(req.body);
        const vehicle = await prisma.vehicle.update({
            where: { id },
            data: { status }
        });
        res.json(vehicle);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: 'Invalid status', details: error.issues });
        }
        console.error(error);
        res.status(500).json({ error: 'Failed to update vehicle status' });
    }
});
exports.default = router;
