import { useForm } from 'react-hook-form'
import { Send } from 'lucide-react'
import { toast } from 'sonner'
import { apiRequest } from '../../services/api'
import type { Driver, Vehicle } from '../../types/trip'

type TripFormValues = {
  source: string
  destination: string
  vehicleId: string
  driverId: string
  cargoWeightKg: number
  plannedDistanceKm: number
}

type Props = { vehicles: Vehicle[]; drivers: Driver[]; onCreated: () => Promise<void> }

const inputClass = 'block w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-xs font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-[#030712] dark:text-white dark:placeholder:text-slate-500 dark:focus:ring-indigo-500/40'

export default function TripForm({ vehicles, drivers, onCreated }: Props) {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<TripFormValues>()
  const availableVehicles = vehicles.filter((vehicle) => vehicle.status === 'AVAILABLE')
  const availableDrivers = drivers.filter((driver) => driver.status === 'AVAILABLE' && new Date(driver.licenseExpiry) >= new Date())

  const onSubmit = async (data: TripFormValues) => {
    try {
      await apiRequest('/trips', { method: 'POST', body: JSON.stringify(data) })
      reset()
      await onCreated()
      toast.success('Trip draft created. Dispatch it when the route is ready.')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to create trip.')
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] dark:border-slate-800/60 dark:bg-[#090d16] dark:shadow-[0_4px_30px_-4px_rgba(0,0,0,0.2)]">
      <div className="mb-6 flex items-center gap-3.5"><div className="rounded-xl border border-indigo-100/40 bg-indigo-50 p-2.5 text-indigo-600 dark:border-indigo-900/20 dark:bg-indigo-950/30 dark:text-indigo-400"><Send size={20} /></div><div><h3 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">Create Trip Draft</h3><p className="mt-0.5 text-xs font-medium text-slate-400 dark:text-slate-500">Only eligible vehicles and drivers are available for selection.</p></div></div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Origin<input {...register('source', { required: true })} placeholder="e.g. Lucknow Hub" className={`${inputClass} mt-1.5`} /></label>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Destination<input {...register('destination', { required: true })} placeholder="e.g. Delhi Terminal" className={`${inputClass} mt-1.5`} /></label>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Available vehicle<select {...register('vehicleId', { required: true })} defaultValue="" className={`${inputClass} mt-1.5`}><option value="" disabled>Select a vehicle</option>{availableVehicles.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.registrationNo} · {vehicle.name} ({vehicle.capacityKg} kg)</option>)}</select></label>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Available driver<select {...register('driverId', { required: true })} defaultValue="" className={`${inputClass} mt-1.5`}><option value="" disabled>Select a driver</option>{availableDrivers.map((driver) => <option key={driver.id} value={driver.id}>{driver.name} · {driver.licenseNo}</option>)}</select></label>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Cargo weight (kg)<input type="number" min="1" step="any" {...register('cargoWeightKg', { required: true, valueAsNumber: true })} placeholder="0" className={`${inputClass} mt-1.5`} /></label>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Planned distance (km)<input type="number" min="1" step="any" {...register('plannedDistanceKm', { required: true, valueAsNumber: true })} placeholder="0" className={`${inputClass} mt-1.5`} /></label>
        </div>
        {(!availableVehicles.length || !availableDrivers.length) && <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-300">Add an available vehicle and a driver with a valid license before creating a trip.</p>}
        <button type="submit" disabled={isSubmitting || !availableVehicles.length || !availableDrivers.length} className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-slate-900 py-3.5 text-xs font-bold text-white shadow-md transition-all hover:scale-[1.01] hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100">{isSubmitting ? 'Creating…' : 'Create trip draft'}</button>
      </form>
    </div>
  )
}
