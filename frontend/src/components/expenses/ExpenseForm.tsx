import { Receipt, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { apiRequest } from "../../services/api";

type ExpenseData = {
  vehicleId: string;
  tripId?: string;
  type: string;
  tollCost: number;
  otherCost: number;
};

type Vehicle = {
  id: string;
  registrationNo: string;
  name: string;
};

type Trip = {
  id: string;
  routeId: string;
};

export default function ExpenseForm() {
  const { register, handleSubmit, reset } = useForm<ExpenseData>();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vData, tData] = await Promise.all([
          apiRequest<Vehicle[]>('/vehicles'),
          apiRequest<Trip[]>('/trips')
        ]);
        setVehicles(vData);
        setTrips(tData);
      } catch (err) {
        console.error("Failed to load form data", err);
      }
    };
    fetchData();
  }, []);

  const onSubmit = async (data: ExpenseData) => {
    setLoading(true);
    setSuccess(false);
    try {
      await apiRequest('/expenses/expense', {
        method: 'POST',
        body: JSON.stringify({
          ...data,
          tripId: data.tripId || undefined,
          tollCost: Number(data.tollCost || 0),
          otherCost: Number(data.otherCost || 0)
        })
      });
      reset();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      window.dispatchEvent(new Event('expense-logged'));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save expense log');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#090d16] rounded-2xl border border-slate-200/80 dark:border-slate-800/60 p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_30px_-4px_rgba(0,0,0,0.2)] flex flex-col justify-between">
      <div className="space-y-6">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100/40 dark:border-emerald-900/20">
            <Receipt size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              Add Expense
            </h3>
            <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-0.5">
              Record secondary operational costs
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">Asset Identification</label>
            <select
              {...register("vehicleId", { required: true })}
              className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#030712] px-4 py-3 text-xs font-medium text-slate-900 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-emerald-500/40 transition-all outline-none appearance-none"
            >
              <option value="">Select Vehicle...</option>
              {vehicles.map(v => (
                <option key={v.id} value={v.id}>{v.registrationNo} - {v.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">Trip Link (Optional)</label>
              <select
                {...register("tripId")}
                className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#030712] px-4 py-3 text-xs font-medium text-slate-900 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-emerald-500/40 transition-all outline-none appearance-none"
              >
                <option value="">None / N/A</option>
                {trips.map(t => (
                  <option key={t.id} value={t.id}>Route {t.routeId} ({t.id.slice(0, 8)})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">Expense Categorization</label>
              <input
                {...register("type", { required: true })}
                placeholder="e.g. Maintenance, Food"
                className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#030712] px-4 py-3 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-emerald-500/40 transition-all outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">Toll Costs (₹)</label>
              <input
                type="number"
                step="any"
                min="0"
                {...register("tollCost")}
                placeholder="0.00"
                className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#030712] px-4 py-3 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-emerald-500/40 transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">Other Costs (₹)</label>
              <input
                type="number"
                step="any"
                min="0"
                {...register("otherCost")}
                placeholder="0.00"
                className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#030712] px-4 py-3 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-emerald-500/40 transition-all outline-none"
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
            } mt-2 disabled:opacity-70`}
          >
            {loading ? 'Committing...' : success ? <><CheckCircle2 className="w-4 h-4 mr-1.5" /> Logged Successfully</> : 'Commit Ledger Entry'}
          </button>
        </form>
      </div>
    </div>
  );
}