import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";


const data = [
  {
    vehicle: "Van-05",
    cost: 12000,
  },
  {
    vehicle: "Truck-02",
    cost: 25000,
  },
  {
    vehicle: "Bus-01",
    cost: 18000,
  },
];


export default function CostAnalysisChart() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">

      <h3 className="font-semibold text-slate-900 mb-4">
        Vehicle Cost Analysis
      </h3>


      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>

          <XAxis dataKey="vehicle" />

          <YAxis />

          <Tooltip />

          <Bar dataKey="cost" />

        </BarChart>
      </ResponsiveContainer>

    </div>
  );
}