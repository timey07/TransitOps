import { Fuel, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { apiRequest } from "../../services/api";

type FuelData = {
  vehicleId: string;
  date: string;
  liters: number;
  cost: number;
};

type Vehicle = {
  id: string;
  registrationNo: string;
  name: string;
};

export default function FuelForm() {
  const { register, handleSubmit, reset } = useForm<FuelData>();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const data = await apiRequest<Vehicle[]>('/vehicles');
        setVehicles(data);
      } catch (err) {
        console.error("Failed to load vehicles", err);
      }
    };
    fetchVehicles();
  }, []);

  const onSubmit = async (data: FuelData) => {
    setLoading(true);
    setSuccess(false);
    try {
      await apiRequest('/expenses/fuel', {
        method: 'POST',
        body: JSON.stringify({
          ...data,
          liters: Number(data.liters),
          cost: Number(data.cost)
        })
      });
      reset();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      // Dispatch an event to refresh the table
      window.dispatchEvent(new Event('expense-logged'));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save fuel log');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#090d16] rounded-2xl border border-slate-200/80 dark:border-slate-800/60 p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_30px_-4px_rgba(0,0,0,0.2)] flex flex-col justify-between">
      <div className="space-y-6">
        {/* Header Block */}
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100/40 dark:border-indigo-900/20">
            <Fuel size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              Add Fuel Log
            </h3>
            <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-0.5">
              Record vehicle telemetry and propellant consumption
            </p>
          </div>
        </div>

        {/* Input Matrix */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">Asset Identification</label>
              <select
                {...register("vehicleId", { required: true })}
                className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#030712] px-4 py-3 text-xs font-medium text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/40 transition-all outline-none appearance-none"
              >
                <option value="">Select Vehicle...</option>
                {vehicles.map(v => (
                  <option key={v.id} value={v.id}>{v.registrationNo} - {v.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">Refueling Date</label>
              <input
                type="date"
                required
                {...register("date")}
                className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#030712] px-4 py-3 text-xs font-semibold text-slate-900 dark:text-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/40 transition-all outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">Volume (Liters)</label>
              <input
                type="number"
                step="any"
                min="0.1"
                required
                {...register("liters")}
                placeholder="0.00"
                className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#030712] px-4 py-3 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/40 transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">Total Settlement Cost (₹)</label>
              <input
                type="number"
                step="any"
                min="0"
                required
                {...register("cost")}
                placeholder="0.00"
                className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#030712] px-4 py-3 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/40 transition-all outline-none"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className={`w-full inline-flex items-center justify-center rounded-xl py-3.5 text-xs font-bold shadow-md transition-all duration-200 ${
              success 
                ? 'bg-emerald-500 text-white' 
                : 'bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 hover:scale-[1.01]'
            } disabled:opacity-70`}
          >
            {loading ? 'Committing...' : success ? <><CheckCircle2 className="w-4 h-4 mr-1.5" /> Logged Successfully</> : 'Commit Log Entry'}
          </button>
        </form>
      </div>
    </div>
  );
}