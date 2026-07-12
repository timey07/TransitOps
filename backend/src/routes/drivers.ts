import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();

// Validation schema for creating/updating a driver
const driverSchema = z.object({
  name: z.string().min(2),
  licenseNo: z.string().min(5),
  category: z.enum(['LMV', 'HMV']),
  licenseExpiry: z.string().transform((str) => new Date(str)),
  contact: z.string().min(10),
  safetyScore: z.number().min(0).max(100).optional(),
  status: z.enum(['AVAILABLE', 'ON_TRIP', 'OFF_DUTY', 'SUSPENDED']).optional()
});

// GET all drivers
router.get('/', async (req, res) => {
  try {
    const drivers = await prisma.driver.findMany({
      include: {
        _count: {
          select: { trips: { where: { status: 'COMPLETED' } } }
        }
      },
      orderBy: { name: 'asc' }
    });
    
    // Map the response to flatten the count for the frontend
    const formattedDrivers = drivers.map(d => ({
      ...d,
      tripsCompleted: d._count.trips,
      _count: undefined // Optional: remove the raw _count object
    }));
    
    res.json(formattedDrivers);
  } catch (error) {
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
  } catch (error) {
    if (error instanceof z.ZodError) {
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
    const statusSchema = z.object({
      status: z.enum(['AVAILABLE', 'ON_TRIP', 'OFF_DUTY', 'SUSPENDED'])
    });
    const { status } = statusSchema.parse(req.body);

    const driver = await prisma.driver.update({
      where: { id },
      data: { status }
    });

    res.json(driver);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid status', details: error.issues });
    }
    console.error(error);
    res.status(500).json({ error: 'Failed to update driver status' });
  }
});

export default router;
