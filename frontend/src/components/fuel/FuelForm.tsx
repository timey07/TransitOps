import { Fuel } from "lucide-react";
import { useForm } from "react-hook-form";


type FuelData = {
  vehicle: string;
  date: string;
  liters: number;
  cost: number;
};


export default function FuelForm() {

  const {
    register,
    handleSubmit,
    reset
  } = useForm<FuelData>();


  const onSubmit = (data: FuelData) => {
    console.log(data);
    reset();
  };


  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-5">


      {/* Header */}
      <div className="flex items-center gap-3">

        <div className="p-2 rounded-lg bg-indigo-50">
          <Fuel 
            size={20}
            className="text-indigo-600"
          />
        </div>


        <div>
          <h3 className="font-semibold text-slate-900">
            Add Fuel Log
          </h3>

          <p className="text-sm text-slate-500">
            Record vehicle fuel usage
          </p>
        </div>

      </div>



      <form 
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-3"
      >


        <input
          {...register("vehicle")}
          placeholder="Vehicle Name"
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
        />


        <input
          type="date"
          {...register("date")}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />


        <input
          type="number"
          {...register("liters")}
          placeholder="Fuel Liters"
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />


        <input
          type="number"
          {...register("cost")}
          placeholder="Fuel Cost"
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />



        <button
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-2 text-sm font-medium"
        >
          Add Fuel
        </button>


      </form>

    </div>
  );
}