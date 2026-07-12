import { useForm } from "react-hook-form";
import { Send } from "lucide-react";


type TripData = {
  source:string;
  destination:string;
  vehicle:string;
  driver:string;
  cargo:number;
  distance:number;
};


export default function TripForm(){

const {
 register,
 handleSubmit,
 reset
}=useForm<TripData>();


const onSubmit=(data:TripData)=>{

console.log(data);

reset();

};


return (

<div className="bg-white border border-slate-200 rounded-xl p-5">


<div className="flex items-center gap-3 mb-5">

<div className="p-2 rounded-lg bg-indigo-50">
<Send 
size={20}
className="text-indigo-600"
/>
</div>


<div>

<h3 className="font-semibold text-slate-900">
Create Trip
</h3>

<p className="text-sm text-slate-500">
Assign vehicle and driver
</p>

</div>

</div>



<form
onSubmit={handleSubmit(onSubmit)}
className="grid grid-cols-1 md:grid-cols-2 gap-4"
>


<input
{...register("source")}
placeholder="Source"
className="input"
/>


<input
{...register("destination")}
placeholder="Destination"
className="input"
/>


<input
{...register("vehicle")}
placeholder="Vehicle"
className="input"
/>


<input
{...register("driver")}
placeholder="Driver"
className="input"
/>


<input
type="number"
{...register("cargo")}
placeholder="Cargo Weight (kg)"
className="input"
/>


<input
type="number"
{...register("distance")}
placeholder="Distance (km)"
className="input"
/>



<button
className="md:col-span-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-2 font-medium"
>
Dispatch Trip
</button>


</form>


</div>

)

}