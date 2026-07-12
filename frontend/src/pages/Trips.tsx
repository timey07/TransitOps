import { useCallback, useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { toast } from 'sonner'
import TripForm from '../components/trips/TripForm'
import TripBoard from '../components/trips/TripBoard'
import { apiRequest } from '../services/api'
import type { Driver, Trip, Vehicle } from '../types/trip'

export default function Trips() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [busyId, setBusyId] = useState<string | null>(null)
  const [completingTrip, setCompletingTrip] = useState<Trip | null>(null)
  const [completion, setCompletion] = useState({ finalOdometerKm: '', revenue: '', fuelLiters: '', fuelCost: '' })

  const loadData = useCallback(async () => {
    try {
      const [tripData, vehicleData, driverData] = await Promise.all([apiRequest<Trip[]>('/trips'), apiRequest<Vehicle[]>('/vehicles'), apiRequest<Driver[]>('/drivers')])
      setTrips(tripData); setVehicles(vehicleData); setDrivers(driverData)
    } catch (error) { toast.error(error instanceof Error ? error.message : 'Unable to load trip data.') }
  }, [])
  useEffect(() => { void loadData() }, [loadData])

  const transition = async (trip: Trip, action: 'dispatch' | 'cancel') => {
    setBusyId(trip.id)
    try { await apiRequest(`/trips/${trip.id}/${action}`, { method: 'PATCH' }); await loadData(); toast.success(`Trip ${action === 'dispatch' ? 'dispatched' : 'cancelled'}.`) }
    catch (error) { toast.error(error instanceof Error ? error.message : 'Unable to update trip.') }
    finally { setBusyId(null) }
  }
  const beginCompletion = (trip: Trip) => { setCompletingTrip(trip); setCompletion({ finalOdometerKm: String(trip.vehicle.odometerKm), revenue: '', fuelLiters: '', fuelCost: '' }) }
  const completeTrip = async (event: React.FormEvent) => {
    event.preventDefault(); if (!completingTrip) return
    setBusyId(completingTrip.id)
    try { await apiRequest(`/trips/${completingTrip.id}/complete`, { method: 'PATCH', body: JSON.stringify({ finalOdometerKm: Number(completion.finalOdometerKm), revenue: Number(completion.revenue || 0), fuelLiters: Number(completion.fuelLiters), fuelCost: Number(completion.fuelCost), fuelDate: new Date().toISOString() }) }); setCompletingTrip(null); await loadData(); toast.success('Trip completed and fuel log recorded.') }
    catch (error) { toast.error(error instanceof Error ? error.message : 'Unable to complete trip.') }
    finally { setBusyId(null) }
  }

  return <div className="space-y-8"><div><h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Trip Dispatcher</h2><p className="mt-1 text-xs font-medium text-slate-400 dark:text-slate-500">Create, dispatch, complete, and cancel fleet logistics trips.</p></div><TripForm vehicles={vehicles} drivers={drivers} onCreated={loadData} /><TripBoard trips={trips} busyId={busyId} onDispatch={(trip) => void transition(trip, 'dispatch')} onCancel={(trip) => void transition(trip, 'cancel')} onComplete={beginCompletion} />{completingTrip && <div className="fixed inset-0 z-50 flex items-center justify-center p-4"><div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={() => setCompletingTrip(null)} /><form onSubmit={completeTrip} className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-[#090d16]"><div className="mb-5 flex items-start justify-between"><div><h3 className="text-base font-bold text-slate-900 dark:text-white">Complete trip</h3><p className="mt-1 text-xs text-slate-400">Record the final odometer and fuel consumption.</p></div><button type="button" onClick={() => setCompletingTrip(null)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"><X size={16} /></button></div><div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Final odometer<input required min={completingTrip.vehicle.odometerKm} type="number" step="any" value={completion.finalOdometerKm} onChange={(event) => setCompletion({ ...completion, finalOdometerKm: event.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 dark:border-slate-800 dark:bg-[#030712] dark:text-white" /></label><label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Revenue (optional)<input min="0" type="number" step="any" value={completion.revenue} onChange={(event) => setCompletion({ ...completion, revenue: event.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 dark:border-slate-800 dark:bg-[#030712] dark:text-white" /></label><label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Fuel consumed (L)<input required min="0.01" type="number" step="any" value={completion.fuelLiters} onChange={(event) => setCompletion({ ...completion, fuelLiters: event.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 dark:border-slate-800 dark:bg-[#030712] dark:text-white" /></label><label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Fuel cost (₹)<input required min="0" type="number" step="any" value={completion.fuelCost} onChange={(event) => setCompletion({ ...completion, fuelCost: event.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 dark:border-slate-800 dark:bg-[#030712] dark:text-white" /></label></div><button disabled={busyId === completingTrip.id} className="mt-6 w-full rounded-xl bg-slate-900 py-3 text-xs font-bold text-white dark:bg-white dark:text-slate-900">{busyId === completingTrip.id ? 'Completing…' : 'Complete trip'}</button></form></div>}</div>
}
