type Props = {
 source:string;
 destination:string;
 vehicle:string;
 driver:string;
 cargo:number;
 status:string;
};


export default function TripCard({
source,
destination,
vehicle,
driver,
cargo,
status
}:Props){

return (

<div className="bg-white border border-slate-200 rounded-xl p-4">

<h4 className="font-semibold text-slate-900">
{source} → {destination}
</h4>


<p className="text-sm text-slate-500 mt-2">
Vehicle: {vehicle}
</p>

<p className="text-sm text-slate-500">
Driver: {driver}
</p>

<p className="text-sm text-slate-500">
Cargo: {cargo} kg
</p>


<span className="inline-block mt-3 px-3 py-1 text-xs rounded-full bg-indigo-50 text-indigo-600">
{status}
</span>


</div>

)

}