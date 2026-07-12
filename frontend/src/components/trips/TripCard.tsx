import TripCard from "./TripCard";

const trips = [
  {
    source: "Lucknow",
    destination: "Delhi",
    vehicle: "Van-05",
    driver: "Alex",
    cargo: 450,
    status: "Dispatched"
  },
  {
    source: "Kanpur",
    destination: "Agra",
    vehicle: "Truck-02",
    driver: "John",
    cargo: 700,
    status: "Completed"
  }
];

export default function TripBoard() {
  const statuses = ["Draft", "Dispatched", "Completed", "Cancelled"];

  return (
    <div className="space-y-4">
      <div className="border-b border-slate-100 dark:border-slate-800/60 pb-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          Logistics Lifecycle Board
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {statuses.map((status) => {
          const filteredTrips = trips.filter((trip) => trip.status === status);
          
          return (
            <div
              key={status}
              className="bg-slate-50/60 dark:bg-[#090d16] border border-slate-100 dark:border-slate-800/40 rounded-2xl p-4 flex flex-col min-h-[380px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-4 px-1">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <span className={`h-1.5 w-1.5 rounded-full ${
                    status === 'Draft' ? 'bg-slate-400' :
                    status === 'Dispatched' ? 'bg-indigo-500' :
                    status === 'Completed' ? 'bg-emerald-500' : 'bg-rose-500'
                  }`} />
                  {status}
                </h4>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200/50 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {filteredTrips.length}
                </span>
              </div>

              {/* Card Dynamic Stack */}
              <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar">
                {filteredTrips.length === 0 ? (
                  <div className="h-full border-2 border-dashed border-slate-200/40 dark:border-slate-800/40 rounded-xl flex items-center justify-center p-4 min-h-[120px]">
                    <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-600 uppercase tracking-wider text-center">
                      No matching assets
                    </p>
                  </div>
                ) : (
                  filteredTrips.map((trip, index) => (
                    <TripCard key={index} {...trip} />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}