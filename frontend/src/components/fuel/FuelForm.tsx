import { Fuel } from "lucide-react";
import { useForm } from "react-hook-form";

type FuelData = {
  vehicle: string;
  date: string;
  liters: number;
  cost: number;
};

export default function FuelForm() {
  const { register, handleSubmit, reset } = useForm<FuelData>();

  const onSubmit = (data: FuelData) => {
    console.log(data);
    reset();
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
              <input
                {...register("vehicle")}
                placeholder="e.g. Truck-02"
                className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#030712] px-4 py-3 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/40 transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">Refueling Date</label>
              <input
                type="date"
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
                {...register("liters")}
                placeholder="0.00"
                className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#030712] px-4 py-3 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/40 transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">Total Settlement Cost (₹)</label>
              <input
                type="number"
                {...register("cost")}
                placeholder="0.00"
                className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#030712] px-4 py-3 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/40 transition-all outline-none"
              />
            </div>
          </div>

          <button className="w-full inline-flex items-center justify-center rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 py-3.5 text-xs font-bold shadow-md transition-all duration-200 hover:scale-[1.01] mt-2">
            Commit Log Entry
          </button>
        </form>
      </div>
    </div>
  );
}