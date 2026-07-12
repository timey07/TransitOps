import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus } from 'lucide-react'

// Define validation schema
const tripSchema = z.object({
  source: z.string().min(1, 'Source location is required'),
  destination: z.string().min(1, 'Destination location is required'),
  vehicleId: z.string().min(1, 'Vehicle is required'),
  driverId: z.string().min(1, 'Driver is required'),
  cargoWeightKg: z
    .number({ invalid_type_error: 'Must be a number' })
    .positive('Weight must be positive'),
  plannedDistanceKm: z
    .number({ invalid_type_error: 'Must be a number' })
    .positive('Distance must be positive'),
})

type TripFormData = z.infer<typeof tripSchema>

// Dummy data for select lists
const DUMMY_VEHICLES = [
  { id: 'v1', name: 'MH-12-HE-1234 (Tata Ace)' },
  { id: 'v2', name: 'DL-01-AB-5678 (Leyland Dost)' },
  { id: 'v3', name: 'KA-03-XY-9012 (Eicher Pro)' },
  { id: 'v4', name: 'GJ-05-ZZ-3456 (BharatBenz)' },
]

const DUMMY_DRIVERS = [
  { id: 'd1', name: 'Rajesh Kumar (HMV)' },
  { id: 'd2', name: 'Amit Singh (LMV)' },
  { id: 'd3', name: 'Suresh Patil (HMV)' },
  { id: 'd4', name: 'Vikram Rathore (LMV)' },
]

interface TripFormProps {
  onSubmit: (data: TripFormData) => void
}

export default function TripForm({ onSubmit }: TripFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TripFormData>({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      source: '',
      destination: '',
      vehicleId: '',
      driverId: '',
    },
  })

  const handleFormSubmit = (data: TripFormData) => {
    onSubmit(data)
    reset()
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-700">Dispatch New Trip</h3>
        <p className="text-xs text-slate-400">Validate capacity and book cargo delivery</p>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Source Location */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Source Location
            </label>
            <input
              type="text"
              placeholder="e.g. Pune Hub"
              className={`h-9 px-3 text-sm rounded-lg border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${
                errors.source ? 'border-rose-300 focus:ring-rose-500/20' : 'border-slate-200'
              }`}
              {...register('source')}
            />
            {errors.source && (
              <span className="text-[10px] text-rose-600 font-medium">{errors.source.message}</span>
            )}
          </div>

          {/* Destination Location */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Destination Location
            </label>
            <input
              type="text"
              placeholder="e.g. Mumbai Hub"
              className={`h-9 px-3 text-sm rounded-lg border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${
                errors.destination ? 'border-rose-300 focus:ring-rose-500/20' : 'border-slate-200'
              }`}
              {...register('destination')}
            />
            {errors.destination && (
              <span className="text-[10px] text-rose-600 font-medium">{errors.destination.message}</span>
            )}
          </div>

          {/* Vehicle Select */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Vehicle
            </label>
            <select
              className={`h-9 px-3 text-sm rounded-lg border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${
                errors.vehicleId ? 'border-rose-300 focus:ring-rose-500/20' : 'border-slate-200'
              }`}
              {...register('vehicleId')}
            >
              <option value="">Select a Vehicle</option>
              {DUMMY_VEHICLES.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
            {errors.vehicleId && (
              <span className="text-[10px] text-rose-600 font-medium">{errors.vehicleId.message}</span>
            )}
          </div>

          {/* Driver Select */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Driver
            </label>
            <select
              className={`h-9 px-3 text-sm rounded-lg border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${
                errors.driverId ? 'border-rose-300 focus:ring-rose-500/20' : 'border-slate-200'
              }`}
              {...register('driverId')}
            >
              <option value="">Select a Driver</option>
              {DUMMY_DRIVERS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
            {errors.driverId && (
              <span className="text-[10px] text-rose-600 font-medium">{errors.driverId.message}</span>
            )}
          </div>

          {/* Cargo Weight */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Cargo Weight (kg)
            </label>
            <input
              type="number"
              step="any"
              placeholder="e.g. 850"
              className={`h-9 px-3 text-sm rounded-lg border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${
                errors.cargoWeightKg ? 'border-rose-300 focus:ring-rose-500/20' : 'border-slate-200'
              }`}
              {...register('cargoWeightKg', { valueAsNumber: true })}
            />
            {errors.cargoWeightKg && (
              <span className="text-[10px] text-rose-600 font-medium">{errors.cargoWeightKg.message}</span>
            )}
          </div>

          {/* Planned Distance */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Planned Distance (km)
            </label>
            <input
              type="number"
              step="any"
              placeholder="e.g. 150"
              className={`h-9 px-3 text-sm rounded-lg border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${
                errors.plannedDistanceKm ? 'border-rose-300 focus:ring-rose-500/20' : 'border-slate-200'
              }`}
              {...register('plannedDistanceKm', { valueAsNumber: true })}
            />
            {errors.plannedDistanceKm && (
              <span className="text-[10px] text-rose-600 font-medium">{errors.plannedDistanceKm.message}</span>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 h-9 px-5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"
          >
            <Plus size={16} />
            <span>Create & validate Trip</span>
          </button>
        </div>
      </form>
    </div>
  )
}
