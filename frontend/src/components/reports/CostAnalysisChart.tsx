import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
  { vehicle: "Van-05", cost: 12000 },
  { vehicle: "Truck-02", cost: 25000 },
  { vehicle: "Bus-01", cost: 18000 },
];

export default function CostAnalysisChart() {
  return (
    <div className="bg-white dark:bg-[#090d16] border border-slate-200/80 dark:border-slate-800/60 rounded-2xl p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_30px_-4px_rgba(0,0,0,0.2)]">
      <div className="mb-6">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[10px] mb-1">
          Financial Distributions
        </h3>
        <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          Vehicle Cost Analysis
        </h4>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:hidden" />
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" className="hidden dark:block" />
          
          <XAxis 
            dataKey="vehicle" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
          />
          <Tooltip 
            cursor={{ fill: 'rgba(99, 102, 241, 0.04)' }}
            contentStyle={{
              backgroundColor: '#090d16',
              border: '1px solid #1e293b',
              borderRadius: '12px',
              padding: '10px 14px',
            }}
            itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 600 }}
            labelStyle={{ color: '#64748b', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' }}
          />
          <Bar 
            dataKey="cost" 
            fill="#4f46e5" 
            radius={[6, 6, 0, 0]}
            maxBarSize={45}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}