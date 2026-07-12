import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET /api/reports/export?format=csv
router.get('/export', async (req, res) => {
  try {
    const { format } = req.query;

    if (format !== 'csv') {
      return res.status(400).json({ error: 'Only CSV format is currently supported' });
    }

    // Fetch all vehicles and their associated costs for the report
    const vehicles = await prisma.vehicle.findMany({
      include: {
        trips: true,
        maintenance: true,
        fuelLogs: true
      }
    });

    // Build CSV Header
    let csvData = 'Vehicle ID,Registration No,Name,Type,Acquisition Cost,Total Revenue,Total Maintenance Cost,Total Fuel Cost,Vehicle ROI (%)\n';

    // Build CSV Rows
    vehicles.forEach(v => {
      const vRevenue = v.trips.reduce((sum, trip) => sum + (trip.revenue || 0), 0);
      const vMaintCost = v.maintenance.reduce((sum, log) => sum + log.cost, 0);
      const vFuelCost = v.fuelLogs.reduce((sum, log) => sum + log.cost, 0);
      
      const roi = v.acquisitionCost > 0 
        ? ((vRevenue - (vMaintCost + vFuelCost)) / v.acquisitionCost) * 100 
        : 0;

      csvData += `"${v.id}","${v.registrationNo}","${v.name}","${v.type}",${v.acquisitionCost},${vRevenue},${vMaintCost},${vFuelCost},${roi.toFixed(2)}\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="transitops_roi_report.csv"');
    res.send(csvData);

  } catch (error) {
    console.error('Failed to export CSV', error);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

export default router;
