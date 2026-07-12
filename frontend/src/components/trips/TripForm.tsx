import { useForm } from "react-hook-form";
import { Send } from "lucide-react";

type TripData = {
  source: string;
  destination: string;
  vehicle: string;
  driver: string;
  cargo: number;
  distance: number;
};

export default function TripForm() {
  const { register, handleSubmit, reset } = useForm<TripData>();

  const onSubmit = (data: TripData) => {
    console.log(data);
    reset();
  };

  return (
    <div className="bg-white dark:bg-[#090d16] border border-slate-200/80 dark:border-slate-800/60 rounded-2xl p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_30px_-4px_rgba(0,0,0,0.2)]">
      {/* Header Matrix Block */}
      <div className="flex items-center gap-3.5 mb-6">
        <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100/40 dark:border-indigo-900/20">
          <Send size={20} />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
            Create Route & Dispatch Trip
          </h3>
          <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-0.5">
            Assign live inventory units and certified operators
          </p>
        </div>
      </div>

      {/* Inputs Configuration Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">Origin Parameters</label>
            <input
              {...register("source")}
              placeholder="e.g. Lucknow Hub"
              className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#030712] px-4 py-3 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/40 transition-all outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">Destination Terminal</label>
            <input
              {...register("destination")}
              placeholder="e.g. Delhi Yard"
              className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#030712] px-4 py-3 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/40 transition-all outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">Asset Identification</label>
            <input
              {...register("vehicle")}
              placeholder="e.g. Van-05"
              className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#030712] px-4 py-3 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/40 transition-all outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">Operator Assignment</label>
            <input
              {...register("driver")}
              placeholder="e.g. Alex Mercer"
              className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#030712] px-4 py-3 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/40 transition-all outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">Cargo Manifest Payload (kg)</label>
            <input
              type="number"
              step="any"
              {...register("cargo")}
              placeholder="0.00"
              className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#030712] px-4 py-3 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/40 transition-all outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">Estimated Distance Metrics (km)</label>
            <input
              type="number"
              step="any"
              {...register("distance")}
              placeholder="0"
              className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#030712] px-4 py-3 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/40 transition-all outline-none"
            />
          </div>
        </div>

        <button className="w-full md:col-span-2 inline-flex items-center justify-center rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 py-3.5 text-xs font-bold shadow-md transition-all duration-200 hover:scale-[1.01] mt-2">
          Initialize Lifecycle Dispatch
        </button>
      </form>
    </div>
  );
}