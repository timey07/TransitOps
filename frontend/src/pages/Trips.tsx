import { useState } from 'react'
import type { Trip } from '@/types'
import TripForm from '../components/trips/TripForm'
import TripBoard from '../components/trips/TripBoard'

const INITIAL_TRIPS: Trip[] = [
  {
    id: 't-1',
    source: 'Pune Hub',
    destination: 'Mumbai Port',
    vehicleId: 'v1',
    driverId: 'd2',
    cargoWeightKg: 850,
    plannedDistanceKm: 150,
    status: 'DISPATCHED',
    revenue: 12000,
  },
  {
    id: 't-2',
    source: 'Pune Hub',
    destination: 'Bangalore Depot',
    vehicleId: 'v3',
    driverId: 'd1',
    cargoWeightKg: 2800,
    plannedDistanceKm: 840,
    status: 'DRAFT',
    revenue: 45000,
  },
  {
    id: 't-3',
    source: 'Chennai Port',
    destination: 'Hyderabad Hub',
    vehicleId: 'v4',
    driverId: 'd3',
    cargoWeightKg: 6200,
    plannedDistanceKm: 620,
    status: 'COMPLETED',
    revenue: 72000,
  },
]

export default function Trips() {
  const [trips, setTrips] = useState<Trip[]>(INITIAL_TRIPS)

  // Handle status update of a trip
  const handleStatusChange = (id: string, newStatus: Trip['status']) => {
    setTrips((prevTrips) =>
      prevTrips.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    )
  }

  // Handle new trip creation
  const handleCreateTrip = (data: {
    source: string
    destination: string
    vehicleId: string
    driverId: string
    cargoWeightKg: number
    plannedDistanceKm: number
  }) => {
    const newTrip: Trip = {
      id: `t-${Date.now()}`,
      ...data,
      status: 'DRAFT',
      revenue: data.plannedDistanceKm * 85, // estimated revenue based on distance
    }
    setTrips((prevTrips) => [newTrip, ...prevTrips])
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900">Trip Dispatcher</h2>
        <p className="text-sm text-slate-500 mt-1">Book, validate and manage vehicle dispatches in real-time</p>
      </div>

      {/* Grid: Form + Board */}
      <div className="space-y-6">
        <div className="max-w-4xl">
          <TripForm onSubmit={handleCreateTrip} />
        </div>

        <div>
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-slate-700">Live Trip Board</h3>
            <p className="text-xs text-slate-400">Track and transition trips through their operational lifecycle</p>
          </div>
          <TripBoard trips={trips} onStatusChange={handleStatusChange} />
        </div>
      </div>
    </div>
  )
}