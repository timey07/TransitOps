import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";


const data = [
  { month: "Jan", efficiency: 7 },
  { month: "Feb", efficiency: 8 },
  { month: "Mar", efficiency: 8.5 },
  { month: "Apr", efficiency: 9 },
];


export default function FuelEfficiencyChart() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">

      <h3 className="font-semibold text-slate-900 mb-4">
        Fuel Efficiency Trend
      </h3>


      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>

          <XAxis dataKey="month" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="efficiency"
            strokeWidth={3}
          />

        </LineChart>
      </ResponsiveContainer>

    </div>
  );
}