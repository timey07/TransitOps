export type Vehicle = {
  id: string;
  registrationNo: string;
  name: string;
  type: string;
  capacityKg: number;
  odometerKm: number;
  fuelStatusPct: number;
  status: 'AVAILABLE' | 'ON_TRIP' | 'IN_SHOP' | 'RETIRED';
  acquisitionCost: number;
};

export type Driver = {
  id: string;
  name: string;
  licenseNo: string;
  licenseExpiry: string;
  contact: string;
  status: 'AVAILABLE' | 'ON_TRIP' | 'OFF_DUTY' | 'SUSPENDED';
};

export type TripStatus = 'DRAFT' | 'DISPATCHED' | 'COMPLETED' | 'CANCELLED';

export type Trip = {
  id: string;
  source: string;
  destination: string;
  vehicleId: string;
  driverId: string;
  cargoWeightKg: number;
  plannedDistanceKm: number;
  status: TripStatus;
  revenue: number;
  vehicle: Vehicle;
  driver: Driver;
};
