import type { Trip } from '@/types'
import TripCard from './TripCard'
import { ClipboardList } from 'lucide-react'

interface TripBoardProps {
  trips: Trip[]
  onStatusChange: (id: string, newStatus: Trip['status']) => void
}

const COLUMNS: { status: Trip['status']; label: string; headerBg: string; borderCol: string }[] = [
  { status: 'DRAFT', label: 'Draft / Planned', headerBg: 'bg-slate-100 text-slate-800', borderCol: 'border-slate-200' },
  { status: 'DISPATCHED', label: 'Dispatched / Active', headerBg: 'bg-indigo-50 text-indigo-800', borderCol: 'border-indigo-100' },
  { status: 'COMPLETED', label: 'Completed', headerBg: 'bg-emerald-50 text-emerald-800', borderCol: 'border-emerald-100' },
  { status: 'CANCELLED', label: 'Cancelled', headerBg: 'bg-rose-50 text-rose-800', borderCol: 'border-rose-100' },
]

const VEHICLE_MAP: Record<string, string> = {
  v1: 'Tata Ace',
  v2: 'Leyland Dost',
  v3: 'Eicher Pro',
  v4: 'BharatBenz',
}

const DRIVER_MAP: Record<string, string> = {
  d1: 'Rajesh Kumar',
  d2: 'Amit Singh',
  d3: 'Suresh Patil',
  d4: 'Vikram Rathore',
}

export default function TripBoard({ trips, onStatusChange }: TripBoardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {COLUMNS.map((col) => {
        const columnTrips = trips.filter((t) => t.status === col.status)

        return (
          <div
            key={col.status}
            className={`bg-slate-50 rounded-xl border p-4 flex flex-col h-[500px] ${col.borderCol}`}
          >
            {/* Column Header */}
            <div className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider mb-4 flex items-center justify-between ${col.headerBg}`}>
              <span>{col.label}</span>
              <span className="bg-white/60 px-1.5 py-0.5 rounded text-[10px] tabular-nums font-semibold">
                {columnTrips.length}
              </span>
            </div>

            {/* Column Body / Cards Stack */}
            <div className="flex-1 overflow-y-auto space-y-3 min-h-0 pr-1">
              {columnTrips.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-center border-2 border-dashed border-slate-200/60 rounded-xl bg-white/40">
                  <ClipboardList size={22} className="text-slate-300 mb-1" />
                  <span className="text-[10px] text-slate-400 font-medium">No trips in this stage</span>
                </div>
              ) : (
                columnTrips.map((trip) => (
                  <TripCard
                    key={trip.id}
                    trip={trip}
                    vehicleName={VEHICLE_MAP[trip.vehicleId]}
                    driverName={DRIVER_MAP[trip.driverId]}
                    onStatusChange={onStatusChange}
                  />
                ))
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
