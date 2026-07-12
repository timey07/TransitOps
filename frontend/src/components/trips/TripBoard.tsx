import TripCard from "./TripCard";


const trips=[
{
source:"Lucknow",
destination:"Delhi",
vehicle:"Van-05",
driver:"Alex",
cargo:450,
status:"Dispatched"
},
{
source:"Kanpur",
destination:"Agra",
vehicle:"Truck-02",
driver:"John",
cargo:700,
status:"Completed"
}
];


export default function TripBoard(){


return (

<div>

<h3 className="font-semibold text-slate-900 mb-4">
Trip Lifecycle
</h3>


<div className="grid grid-cols-1 md:grid-cols-4 gap-4">


{
["Draft","Dispatched","Completed","Cancelled"].map(status=>(

<div
key={status}
className="bg-slate-50 rounded-xl p-4"
>

<h4 className="font-medium text-slate-700 mb-3">
{status}
</h4>


<div className="space-y-3">

{
trips
.filter(trip=>trip.status===status)
.map((trip,index)=>(

<TripCard
key={index}
{...trip}
/>

))
}

</div>


</div>

))

}


</div>

</div>

)

}