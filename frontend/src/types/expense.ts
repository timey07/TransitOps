import type { Trip, Vehicle } from './trip';

export type FuelLog = {
  id: string;
  vehicleId: string;
  date: string;
  liters: number;
  cost: number;
  vehicle: Vehicle;
};

export type Expense = {
  id: string;
  vehicleId: string;
  tripId?: string | null;
  tollCost: number;
  otherCost: number;
  vehicle: Vehicle;
  trip?: Trip | null;
};
