import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

interface FleetUtilizationData {
  name: string
  utilized: number
  total: number
}

interface FleetUtilizationChartProps {
  data?: FleetUtilizationData[]
}

const DEFAULT_DATA: FleetUtilizationData[] = [
  { name: 'Mon', utilized: 12, total: 15 },
  { name: 'Tue', utilized: 14, total: 15 },
  { name: 'Wed', utilized: 15, total: 15 },
  { name: 'Thu', utilized: 13, total: 15 },
  { name: 'Fri', utilized: 11, total: 15 },
  { name: 'Sat', utilized: 8, total: 10 },
  { name: 'Sun', utilized: 6, total: 10 },
]

export default function FleetUtilizationChart({ data = DEFAULT_DATA }: FleetUtilizationChartProps) {
  // Add active rate percentage dynamically
  const chartData = data.map((d) => ({
    ...d,
    'Utilization Rate (%)': Math.round((d.utilized / d.total) * 100),
  }))

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm h-80 flex flex-col">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-700">Fleet Utilization</h3>
        <p className="text-xs text-slate-400">Weekly active vs total capacity utilization rate</p>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="name"
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '12px',
              }}
              formatter={(value) => [`${value}%`, 'Utilization']}
            />
            <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', color: '#64748b' }} />
            <Bar
              name="Utilization Rate (%)"
              dataKey="Utilization Rate (%)"
              fill="#4f46e5"
              radius={[4, 4, 0, 0]}
              maxBarSize={32}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
