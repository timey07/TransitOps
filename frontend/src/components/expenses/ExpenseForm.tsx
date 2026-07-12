import { Receipt } from "lucide-react";
import { useForm } from "react-hook-form";


type ExpenseData = {
  vehicle: string;
  trip: string;
  type: string;
  toll: number;
  other: number;
};


export default function ExpenseForm(){


const {
  register,
  handleSubmit,
  reset
}=useForm<ExpenseData>();



const onSubmit=(data:ExpenseData)=>{
  console.log(data);
  reset();
}



return (

<div className="bg-white rounded-xl border border-slate-200 p-5 space-y-5">


<div className="flex items-center gap-3">

<div className="p-2 rounded-lg bg-emerald-50">
<Receipt 
size={20}
className="text-emerald-600"
/>
</div>


<div>

<h3 className="font-semibold text-slate-900">
Add Expense
</h3>

<p className="text-sm text-slate-500">
Record operational costs
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
className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
/>


<input
{...register("trip")}
placeholder="Trip (optional)"
className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
/>


<input
{...register("type")}
placeholder="Expense Type"
className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
/>


<input
type="number"
{...register("toll")}
placeholder="Toll Cost"
className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
/>


<input
type="number"
{...register("other")}
placeholder="Other Cost"
className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
/>



<button
className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg py-2 text-sm font-medium"
>
Add Expense
</button>


</form>



</div>

)

}