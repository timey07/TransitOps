import { MapPin, Package, UserRound } from 'lucide-react'
import type { Trip } from '../../types/trip'

type Props = { trip: Trip; busy: boolean; onDispatch: (trip: Trip) => void; onComplete: (trip: Trip) => void; onCancel: (trip: Trip) => void }

export default function TripCard({ trip, busy, onDispatch, onComplete, onCancel }: Props) {
  return (
    <article className="rounded-xl border border-slate-200/70 bg-white p-4 shadow-sm dark:border-slate-800/70 dark:bg-[#030712]">
      <div className="flex items-start justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{trip.vehicle.registrationNo}</p><h5 className="mt-1 text-xs font-bold text-slate-900 dark:text-white">{trip.source} → {trip.destination}</h5></div><span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{trip.plannedDistanceKm} km</span></div>
      <div className="mt-3 space-y-2 border-t border-slate-100 pt-3 text-[11px] font-medium text-slate-500 dark:border-slate-800 dark:text-slate-400"><p className="flex items-center gap-2"><UserRound size={13} />{trip.driver.name}</p><p className="flex items-center gap-2"><Package size={13} />{trip.cargoWeightKg.toLocaleString()} kg / {trip.vehicle.capacityKg.toLocaleString()} kg</p><p className="flex items-center gap-2"><MapPin size={13} />{trip.vehicle.name}</p></div>
      {(trip.status === 'DRAFT' || trip.status === 'DISPATCHED') && <div className="mt-4 flex gap-2"><button disabled={busy} onClick={() => trip.status === 'DRAFT' ? onDispatch(trip) : onComplete(trip)} className="flex-1 rounded-lg bg-indigo-600 px-3 py-2 text-[10px] font-bold text-white transition-colors hover:bg-indigo-700 disabled:opacity-50">{trip.status === 'DRAFT' ? 'Dispatch' : 'Complete'}</button><button disabled={busy} onClick={() => onCancel(trip)} className="rounded-lg border border-rose-200 px-3 py-2 text-[10px] font-bold text-rose-600 transition-colors hover:bg-rose-50 disabled:opacity-50 dark:border-rose-900/40 dark:hover:bg-rose-950/20">Cancel</button></div>}
    </article>
  )
}
