import type { Trip } from '@/types'
import { ArrowRight, Truck, User, Milestone, Weight, Check, X, Send } from 'lucide-react'

interface TripCardProps {
  trip: Trip
  vehicleName?: string
  driverName?: string
  onStatusChange?: (id: string, newStatus: Trip['status']) => void
}

const statusColors: Record<Trip['status'], string> = {
  DRAFT: 'bg-slate-100 text-slate-700 border-slate-200',
  DISPATCHED: 'bg-indigo-50 text-indigo-700 border-indigo-150',
  COMPLETED: 'bg-emerald-50 text-emerald-700 border-emerald-150',
  CANCELLED: 'bg-rose-50 text-rose-700 border-rose-150',
}

export default function TripCard({
  trip,
  vehicleName = 'Unknown Vehicle',
  driverName = 'Unknown Driver',
  onStatusChange,
}: TripCardProps) {
  return (
    <div className={`p-4 bg-white rounded-xl border shadow-sm transition-all hover:shadow-md ${statusColors[trip.status] || 'border-slate-200'}`}>
      {/* Route Header */}
      <div className="flex items-center gap-2 mb-3">
        <span className="font-semibold text-slate-800 text-sm truncate max-w-[100px]" title={trip.source}>
          {trip.source}
        </span>
        <ArrowRight size={14} className="text-slate-400 shrink-0" />
        <span className="font-semibold text-slate-800 text-sm truncate max-w-[100px]" title={trip.destination}>
          {trip.destination}
        </span>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-x-2 gap-y-2 mb-4 text-xs">
        <div className="flex items-center gap-1.5 text-slate-600">
          <Truck size={13} className="text-slate-400 shrink-0" />
          <span className="truncate">{vehicleName}</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-600">
          <User size={13} className="text-slate-400 shrink-0" />
          <span className="truncate">{driverName}</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-600">
          <Weight size={13} className="text-slate-400 shrink-0" />
          <span>{trip.cargoWeightKg.toLocaleString()} kg</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-600">
          <Milestone size={13} className="text-slate-400 shrink-0" />
          <span>{trip.plannedDistanceKm.toLocaleString()} km</span>
        </div>
      </div>

      {/* Actions / Status Controls */}
      {onStatusChange && (
        <div className="flex items-center justify-end gap-1.5 pt-3 border-t border-slate-100">
          {trip.status === 'DRAFT' && (
            <>
              <button
                onClick={() => onStatusChange(trip.id, 'CANCELLED')}
                className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-rose-600 transition-colors"
                title="Cancel Trip"
              >
                <X size={15} />
              </button>
              <button
                onClick={() => onStatusChange(trip.id, 'DISPATCHED')}
                className="flex items-center gap-1 px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[11px] font-medium transition-colors"
                title="Dispatch Trip"
              >
                <Send size={11} />
                <span>Dispatch</span>
              </button>
            </>
          )}

          {trip.status === 'DISPATCHED' && (
            <>
              <button
                onClick={() => onStatusChange(trip.id, 'CANCELLED')}
                className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-rose-600 transition-colors"
                title="Cancel Trip"
              >
                <X size={15} />
              </button>
              <button
                onClick={() => onStatusChange(trip.id, 'COMPLETED')}
                className="flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-medium transition-colors"
                title="Complete Trip"
              >
                <Check size={11} />
                <span>Complete</span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
