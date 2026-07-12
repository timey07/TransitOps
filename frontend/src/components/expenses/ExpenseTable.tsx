const expenses = [
  {
    vehicle:"Van-05",
    date:"12 July 2026",
    fuel:2500,
    toll:500,
    other:200
  },
  {
    vehicle:"Truck-02",
    date:"10 July 2026",
    fuel:4000,
    toll:700,
    other:300
  }
];



export default function ExpenseTable(){


return (

<div className="bg-white rounded-xl border border-slate-200 p-5">


<div className="mb-5">

<h3 className="font-semibold text-slate-900">
Expense History
</h3>

<p className="text-sm text-slate-500 mt-1">
Fuel and operational cost records
</p>

</div>



<div className="overflow-x-auto">

<table className="w-full text-sm">


<thead>

<tr className="border-b bg-slate-50">

<th className="text-left px-4 py-3">
Vehicle
</th>

<th>
Date
</th>

<th>
Fuel
</th>

<th>
Toll
</th>

<th>
Other
</th>

<th>
Total
</th>

</tr>

</thead>



<tbody>


{
expenses.map((item,index)=>(

<tr 
key={index}
className="border-b"
>


<td className="px-4 py-3 text-slate-700">
{item.vehicle}
</td>


<td>
{item.date}
</td>


<td>
₹{item.fuel}
</td>


<td>
₹{item.toll}
</td>


<td>
₹{item.other}
</td>


<td className="font-medium">
₹{item.fuel+item.toll+item.other}
</td>


</tr>


))
}



</tbody>



</table>

</div>


</div>


)

}