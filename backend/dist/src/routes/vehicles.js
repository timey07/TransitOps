"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
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
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const upload = (0, multer_1.default)({ dest: 'uploads/' });
// POST upload CSV for bulk import
router.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    const results = [];
    const errors = [];
    fs_1.default.createReadStream(req.file.path)
        .pipe((0, csv_parser_1.default)())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
        // Clean up the uploaded file
        fs_1.default.unlinkSync(req.file.path);
        let createdCount = 0;
        for (const row of results) {
            try {
                const parsedData = vehicleSchema.parse({
                    registrationNo: row.registrationNo,
                    name: row.name,
                    type: row.type,
                    capacityKg: parseFloat(row.capacityKg),
                    odometerKm: parseFloat(row.odometerKm),
                    acquisitionCost: parseFloat(row.acquisitionCost),
                    fuelStatusPct: row.fuelStatusPct ? parseFloat(row.fuelStatusPct) : undefined,
                    status: row.status || undefined
                });
                const existing = await prisma.vehicle.findUnique({
                    where: { registrationNo: parsedData.registrationNo }
                });
                if (!existing) {
                    await prisma.vehicle.create({ data: parsedData });
                    createdCount++;
                }
                else {
                    errors.push({ registrationNo: parsedData.registrationNo, error: 'Already exists' });
                }
            }
            catch (err) {
                errors.push({ row, error: 'Validation failed' });
            }
        }
        res.status(200).json({
            message: `Successfully imported ${createdCount} vehicles.`,
            errors: errors.length > 0 ? errors : undefined
        });
    });
});
exports.default = router;
