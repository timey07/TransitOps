import TripForm from "../components/trips/TripForm";
import TripBoard from "../components/trips/TripBoard";

export default function Trips() {
  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900">
          Trip Dispatcher
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          Create and monitor vehicle trips
        </p>
      </div>


      {/* Trip Creation */}
      <TripForm />


      {/* Trip Board */}
      <TripBoard />

    </div>
  );
}