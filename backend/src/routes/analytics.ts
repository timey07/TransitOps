import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET /api/analytics/dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const { type, status } = req.query;

    // Build the where clause for vehicles based on query filters
    const vehicleWhere: any = {};
    if (type) vehicleWhere.type = String(type);
    if (status) vehicleWhere.status = String(status);

    // Vehicles counts (with filters applied)
    const totalVehicles = await prisma.vehicle.count({ where: vehicleWhere });
    const availableVehicles = await prisma.vehicle.count({ where: { ...vehicleWhere, status: 'AVAILABLE' } });
    const inShopVehicles = await prisma.vehicle.count({ where: { ...vehicleWhere, status: 'IN_SHOP' } });
    const onTripVehicles = await prisma.vehicle.count({ where: { ...vehicleWhere, status: 'ON_TRIP' } });
    const retiredVehicles = await prisma.vehicle.count({ where: { ...vehicleWhere, status: 'RETIRED' } });
    const activeVehicles = totalVehicles - retiredVehicles;

    // Drivers counts
    const totalDrivers = await prisma.driver.count();
    const availableDrivers = await prisma.driver.count({ where: { status: 'AVAILABLE' } });
    const onDutyDrivers = await prisma.driver.count({ where: { status: 'ON_TRIP' } });

    // Trips counts
    const activeTrips = await prisma.trip.count({ where: { status: 'DISPATCHED' } });
    const pendingTrips = await prisma.trip.count({ where: { status: 'DRAFT' } });

    // Utilization
    const fleetUtilization = activeVehicles > 0 ? (onTripVehicles / activeVehicles) * 100 : 0;

    // Financial & ROI
    // ROI = (Revenue - (Maintenance + Fuel)) / Acquisition Cost
    const vehicles = await prisma.vehicle.findMany({
      include: {
        trips: true,
        maintenance: true,
        fuelLogs: true,
        expenses: true
      }
    });

    let totalRevenue = 0;
    let totalMaintenanceCost = 0;
    let totalFuelCost = 0;
    let totalOtherExpenseCost = 0;
    let totalAcquisitionCost = 0;
    let totalDistance = 0;
    let totalFuelLiters = 0;

    const vehicleROI = vehicles.map(v => {
      const vRevenue = v.trips.reduce((sum, trip) => sum + (trip.revenue || 0), 0);
      const vMaintCost = v.maintenance.reduce((sum, log) => sum + log.cost, 0);
      const vFuelCost = v.fuelLogs.reduce((sum, log) => sum + log.cost, 0);
      const vFuelLiters = v.fuelLogs.reduce((sum, log) => sum + log.liters, 0);
      const vOtherExpenseCost = v.expenses.reduce((sum, expense) => sum + expense.tollCost + expense.otherCost, 0);
      
      const vTotalDistance = v.trips.reduce((sum, trip) => sum + trip.plannedDistanceKm, 0); // Simplified using planned

      totalRevenue += vRevenue;
      totalMaintenanceCost += vMaintCost;
      totalFuelCost += vFuelCost;
      totalOtherExpenseCost += vOtherExpenseCost;
      totalAcquisitionCost += v.acquisitionCost;
      totalDistance += vTotalDistance;
      totalFuelLiters += vFuelLiters;

      const roi = v.acquisitionCost > 0 
        ? ((vRevenue - (vMaintCost + vFuelCost)) / v.acquisitionCost) * 100 
        : 0;

      return {
        id: v.id,
        registrationNo: v.registrationNo,
        roi,
        totalCost: vMaintCost + vFuelCost + vOtherExpenseCost
      };
    });

    const overallOperationalCost = totalMaintenanceCost + totalFuelCost + totalOtherExpenseCost;
    const overallFuelEfficiency = totalFuelLiters > 0 ? (totalDistance / totalFuelLiters) : 0;

    res.json({
      kpis: {
        totalVehicles,
        activeVehicles,
        availableVehicles,
        inShopVehicles,
        onTripVehicles,
        totalDrivers,
        availableDrivers,
        onDutyDrivers,
        activeTrips,
        pendingTrips,
        fleetUtilization: parseFloat(fleetUtilization.toFixed(2)),
        totalRevenue,
        overallOperationalCost,
        overallFuelEfficiency: parseFloat(overallFuelEfficiency.toFixed(2))
      },
      vehicleROI
    });

  } catch (error: any) {
    console.error('DASHBOARD ERROR:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard analytics', details: error.message, stack: error.stack });
  }
});

export default router;
