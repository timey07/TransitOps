import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
  { month: "Jan", efficiency: 7 },
  { month: "Feb", efficiency: 8 },
  { month: "Mar", efficiency: 8.5 },
  { month: "Apr", efficiency: 9 },
];

export default function FuelEfficiencyChart() {
  return (
    <div className="bg-white dark:bg-[#090d16] border border-slate-200/80 dark:border-slate-800/60 rounded-2xl p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_30px_-4px_rgba(0,0,0,0.2)]">
      <div className="mb-6">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[10px] mb-1">
          Performance Optimization
        </h3>
        <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          Fuel Efficiency Trend
        </h4>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:hidden" />
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" className="hidden dark:block" />
          
          <XAxis 
            dataKey="month" 
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
            contentStyle={{
              backgroundColor: '#090d16',
              border: '1px solid #1e293b',
              borderRadius: '12px',
              padding: '10px 14px',
            }}
            itemStyle={{ color: '#10b981', fontSize: '12px', fontWeight: 600 }}
            labelStyle={{ color: '#64748b', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' }}
          />
          <Line
            type="monotone"
            dataKey="efficiency"
            stroke="#10b981"
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 2, fill: '#090d16' }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}