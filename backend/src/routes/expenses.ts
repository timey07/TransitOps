import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();

// Schemas
const fuelLogSchema = z.object({
  vehicleId: z.string().uuid(),
  date: z.string().transform((str) => new Date(str)),
  liters: z.number().positive(),
  cost: z.number().nonnegative(),
});

const expenseSchema = z.object({
  vehicleId: z.string().uuid(),
  tripId: z.string().uuid().optional(),
  tollCost: z.number().nonnegative().default(0),
  otherCost: z.number().nonnegative().default(0),
});

// GET combined logs
router.get('/', async (req, res) => {
  try {
    const fuelLogs = await prisma.fuelLog.findMany({
      include: { vehicle: true },
      orderBy: { date: 'desc' }
    });
    const expenses = await prisma.expense.findMany({
      include: { vehicle: true, trip: true }
    });

    res.json({
      fuelLogs,
      expenses
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch expense records' });
  }
});

// POST new fuel log
router.post('/fuel', async (req, res) => {
  try {
    const data = fuelLogSchema.parse(req.body);
    
    // Validate vehicle exists
    const vehicle = await prisma.vehicle.findUnique({ where: { id: data.vehicleId } });
    if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });

    const log = await prisma.fuelLog.create({
      data: {
        ...data,
      },
      include: {
        vehicle: true
      }
    });

    res.status(201).json(log);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid fuel log data', details: error.issues });
    } else {
      res.status(500).json({ error: 'Failed to create fuel log' });
    }
  }
});

// POST new expense
router.post('/expense', async (req, res) => {
  try {
    const data = expenseSchema.parse(req.body);

    const vehicle = await prisma.vehicle.findUnique({ where: { id: data.vehicleId } });
    if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });

    if (data.tripId) {
      const trip = await prisma.trip.findUnique({ where: { id: data.tripId } });
      if (!trip) return res.status(404).json({ error: 'Trip not found' });
      if (trip.vehicleId !== data.vehicleId) {
        return res.status(400).json({ error: 'The selected trip belongs to a different vehicle' });
      }
    }

    const expense = await prisma.expense.create({
      data: {
        ...data,
      },
      include: {
        vehicle: true,
        trip: true
      }
    });

    res.status(201).json(expense);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid expense data', details: error.issues });
    } else {
      res.status(500).json({ error: 'Failed to create expense' });
    }
  }
});

export default router;
