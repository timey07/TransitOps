export type DashboardAnalytics = {
  kpis: {
    totalVehicles: number;
    activeVehicles: number;
    availableVehicles: number;
    inShopVehicles: number;
    onTripVehicles: number;
    totalDrivers: number;
    availableDrivers: number;
    onDutyDrivers: number;
    activeTrips: number;
    pendingTrips: number;
    fleetUtilization: number;
    totalRevenue: number;
    overallOperationalCost: number;
    overallFuelEfficiency: number;
  };
  vehicleROI: Array<{
    id: string;
    registrationNo: string;
    roi: number;
    totalCost: number;
  }>;
};
