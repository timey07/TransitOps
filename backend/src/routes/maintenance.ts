import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();

// Validation schema for maintenance logs
const maintenanceSchema = z.object({
  vehicleId: z.string().uuid(),
  serviceType: z.string().min(2),
  cost: z.number().positive(),
  date: z.string().transform((str) => new Date(str)),
  status: z.enum(['ACTIVE', 'COMPLETED']).optional()
});

// GET all maintenance logs
router.get('/', async (req, res) => {
  try {
    const logs = await prisma.maintenanceLog.findMany({
      include: { vehicle: true },
      orderBy: { date: 'desc' }
    });
    res.json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

// POST log new maintenance activity
// When adding a log, vehicle status automatically switches to "IN_SHOP"
router.post('/', async (req, res) => {
  try {
    const data = maintenanceSchema.parse(req.body);

    const vehicle = await prisma.vehicle.findUnique({
      where: { id: data.vehicleId }
    });

    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    // Business Logic: If vehicle is already on a trip, block maintenance
    if (vehicle.status === 'ON_TRIP') {
      return res.status(400).json({ error: 'Vehicle is currently on an active trip' });
    }

    const log = await prisma.$transaction(async (tx) => {
      // 1. Create log
      const createdLog = await tx.maintenanceLog.create({
        data
      });

      // 2. Set vehicle status to IN_SHOP if the log status is ACTIVE
      if (data.status !== 'COMPLETED') {
        await tx.vehicle.update({
          where: { id: data.vehicleId },
          data: { status: 'IN_SHOP' }
        });
      }

      return createdLog;
    });

    res.status(201).json(log);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid data', details: error.issues });
    }
    console.error(error);
    res.status(500).json({ error: 'Failed to log maintenance' });
  }
});

// PATCH complete maintenance
// When completing a log, vehicle status automatically switches back to "AVAILABLE"
router.patch('/:id/complete', async (req, res) => {
  try {
    const { id } = req.params;

    const log = await prisma.$transaction(async (tx) => {
      // 1. Find the log
      const existingLog = await tx.maintenanceLog.findUnique({
        where: { id }
      });

      if (!existingLog) {
        throw new Error('Log not found');
      }

      if (existingLog.status === 'COMPLETED') {
        return existingLog;
      }

      // 2. Update log to COMPLETED
      const updatedLog = await tx.maintenanceLog.update({
        where: { id },
        data: { status: 'COMPLETED' }
      });

      // 3. Update vehicle status to AVAILABLE
      await tx.vehicle.update({
        where: { id: existingLog.vehicleId },
        data: { status: 'AVAILABLE' }
      });

      return updatedLog;
    });

    res.json(log);
  } catch (error: any) {
    if (error.message === 'Log not found') {
      return res.status(404).json({ error: error.message });
    }
    console.error(error);
    res.status(500).json({ error: 'Failed to complete maintenance' });
  }
});

export default router;
