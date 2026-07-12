import TripForm from "../components/trips/TripForm";
import TripBoard from "../components/trips/TripBoard";

export default function Trips() {
  return (
    <div className="space-y-8">
      {/* Header Panel */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
          Trip Dispatcher
        </h2>
        <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-1">
          Create, schedule, route, and monitor active fleet logistics deployments.
        </p>
      </div>

      {/* Trip Creation Form Matrix */}
      <TripForm />

      {/* Kanban Lifecycle Board */}
      <TripBoard />
    </div>
  );
}