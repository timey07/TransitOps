import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();

// Validation schema for creating/updating a vehicle
const vehicleSchema = z.object({
  registrationNo: z.string().min(3),
  name: z.string().min(2),
  type: z.string(),
  capacityKg: z.number().positive(),
  odometerKm: z.number().nonnegative(),
  acquisitionCost: z.number().nonnegative(),
  fuelStatusPct: z.number().min(0).max(100).optional(),
  status: z.enum(['AVAILABLE', 'ON_TRIP', 'IN_SHOP', 'RETIRED']).optional()
});

// GET all vehicles
router.get('/', async (req, res) => {
  try {
    const vehicles = await prisma.vehicle.findMany({
      orderBy: { registrationNo: 'asc' }
    });
    res.json(vehicles);
  } catch (error) {
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
  } catch (error) {
    if (error instanceof z.ZodError) {
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
    const statusSchema = z.object({
      status: z.enum(['AVAILABLE', 'ON_TRIP', 'IN_SHOP', 'RETIRED'])
    });
    const { status } = statusSchema.parse(req.body);

    const vehicle = await prisma.vehicle.update({
      where: { id },
      data: { status }
    });
    
    res.json(vehicle);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid status', details: error.issues });
    }
    console.error(error);
    res.status(500).json({ error: 'Failed to update vehicle status' });
  }
});

import multer from 'multer';
import fs from 'fs';
import csv from 'csv-parser';

const upload = multer({ dest: 'uploads/' });

// POST upload CSV for bulk import
router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const results: any[] = [];
  const errors: any[] = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      // Clean up the uploaded file
      fs.unlinkSync(req.file!.path);

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
          } else {
            errors.push({ registrationNo: parsedData.registrationNo, error: 'Already exists' });
          }
        } catch (err) {
          errors.push({ row, error: 'Validation failed' });
        }
      }

      res.status(200).json({
        message: `Successfully imported ${createdCount} vehicles.`,
        errors: errors.length > 0 ? errors : undefined
      });
    });
});

export default router;
