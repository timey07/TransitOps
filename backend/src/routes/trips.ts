import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();

// Schemas
const createTripSchema = z.object({
  source: z.string().min(2),
  destination: z.string().min(2),
  vehicleId: z.string().uuid(),
  driverId: z.string().uuid(),
  cargoWeightKg: z.number().positive(),
  plannedDistanceKm: z.number().positive(),
});

const completeTripSchema = z.object({
  finalOdometerKm: z.number().positive(),
  revenue: z.number().nonnegative().optional(),
  fuelLiters: z.number().positive().optional(),
  fuelCost: z.number().nonnegative().optional(),
  fuelDate: z.coerce.date().optional()
}).superRefine((data, context) => {
  if ((data.fuelLiters === undefined) !== (data.fuelCost === undefined)) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Fuel liters and fuel cost must be recorded together',
      path: ['fuelCost']
    });
  }
});

// GET all trips
router.get('/', async (req, res) => {
  try {
    const trips = await prisma.trip.findMany({
      include: {
        vehicle: true,
        driver: true,
        expenses: true
      },
      orderBy: { id: 'desc' }
    });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trips' });
  }
});

// POST new trip
router.post('/', async (req, res) => {
  try {
    const data = createTripSchema.parse(req.body);

    // Business Rule: Vehicle must exist and be AVAILABLE
    const vehicle = await prisma.vehicle.findUnique({ where: { id: data.vehicleId } });
    if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
    if (vehicle.status !== 'AVAILABLE') return res.status(400).json({ error: 'Vehicle is not available for dispatch' });

    // Business Rule: Driver must exist and be AVAILABLE
    const driver = await prisma.driver.findUnique({ where: { id: data.driverId } });
    if (!driver) return res.status(404).json({ error: 'Driver not found' });
    if (driver.status !== 'AVAILABLE') return res.status(400).json({ error: 'Driver is not available for dispatch' });

    // Business Rule: Driver license must not be expired
    if (new Date(driver.licenseExpiry) < new Date()) {
      return res.status(400).json({ error: 'Driver license is expired' });
    }

    // Business Rule: Cargo Weight must not exceed vehicle capacity
    if (data.cargoWeightKg > vehicle.capacityKg) {
      return res.status(400).json({ error: `Cargo weight exceeds vehicle capacity of ${vehicle.capacityKg} kg` });
    }

    const trip = await prisma.trip.create({
      data: {
        ...data,
        status: 'DRAFT',
      },
      include: {
        vehicle: true,
        driver: true
      }
    });

    res.status(201).json(trip);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid trip data', details: error.issues });
    } else {
      res.status(500).json({ error: 'Failed to create trip' });
    }
  }
});

// PATCH /:id/dispatch - Transition to DISPATCHED
router.patch('/:id/dispatch', async (req, res) => {
  try {
    const tripId = req.params.id;
    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    if (trip.status !== 'DRAFT') return res.status(400).json({ error: 'Only DRAFT trips can be dispatched' });

    // Transaction to update trip, vehicle, and driver atomically
    const result = await prisma.$transaction(async (tx) => {
      // Re-verify availability
      const v = await tx.vehicle.findUnique({ where: { id: trip.vehicleId } });
      const d = await tx.driver.findUnique({ where: { id: trip.driverId } });
      if (v?.status !== 'AVAILABLE' || d?.status !== 'AVAILABLE') {
        throw new Error('Vehicle or Driver became unavailable');
      }
      if (new Date(d.licenseExpiry) < new Date()) {
        throw new Error('Driver license is expired');
      }

      const updatedTrip = await tx.trip.update({
        where: { id: tripId },
        data: { status: 'DISPATCHED' }
      });

      await tx.vehicle.update({
        where: { id: trip.vehicleId },
        data: { status: 'ON_TRIP' }
      });

      await tx.driver.update({
        where: { id: trip.driverId },
        data: { status: 'ON_TRIP' }
      });

      return updatedTrip;
    });

    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to dispatch trip' });
  }
});

// PATCH /:id/complete - Transition to COMPLETED
router.patch('/:id/complete', async (req, res) => {
  try {
    const tripId = req.params.id;
    const data = completeTripSchema.parse(req.body);

    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    if (trip.status !== 'DISPATCHED') return res.status(400).json({ error: 'Only DISPATCHED trips can be completed' });

    const result = await prisma.$transaction(async (tx) => {
      const vehicle = await tx.vehicle.findUnique({ where: { id: trip.vehicleId } });
      if (!vehicle) throw new Error('Vehicle not found');
      if (data.finalOdometerKm < vehicle.odometerKm) {
        throw new Error('Final odometer cannot be lower than the current odometer');
      }

      const updatedTrip = await tx.trip.update({
        where: { id: tripId },
        data: { 
          status: 'COMPLETED',
          revenue: data.revenue || 0
        }
      });

      await tx.vehicle.update({
        where: { id: trip.vehicleId },
        data: { 
          status: 'AVAILABLE',
          odometerKm: data.finalOdometerKm
        }
      });

      await tx.driver.update({
        where: { id: trip.driverId },
        data: { status: 'AVAILABLE' }
      });

      if (data.fuelLiters !== undefined && data.fuelCost !== undefined) {
        await tx.fuelLog.create({
          data: {
            vehicleId: trip.vehicleId,
            liters: data.fuelLiters,
            cost: data.fuelCost,
            date: data.fuelDate ?? new Date()
          }
        });
      }

      return updatedTrip;
    });

    res.json(result);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid completion data', details: error.issues });
    } else {
      res.status(400).json({ error: error.message || 'Failed to complete trip' });
    }
  }
});

// PATCH /:id/cancel - Transition to CANCELLED
router.patch('/:id/cancel', async (req, res) => {
  try {
    const tripId = req.params.id;
    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip) return res.status(404).json({ error: 'Trip not found' });

    if (trip.status === 'COMPLETED' || trip.status === 'CANCELLED') {
      return res.status(400).json({ error: 'Trip cannot be cancelled from its current state' });
    }

    const result = await prisma.$transaction(async (tx) => {
      const updatedTrip = await tx.trip.update({
        where: { id: tripId },
        data: { status: 'CANCELLED' }
      });

      // Only restore status if it was dispatched
      if (trip.status === 'DISPATCHED') {
        await tx.vehicle.update({
          where: { id: trip.vehicleId },
          data: { status: 'AVAILABLE' }
        });

        await tx.driver.update({
          where: { id: trip.driverId },
          data: { status: 'AVAILABLE' }
        });
      }

      return updatedTrip;
    });

    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to cancel trip' });
  }
});

export default router;
