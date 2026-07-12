import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

interface MonthlyRevenueData {
  month: string
  revenue: number
  target: number
}

interface RevenueChartProps {
  data?: MonthlyRevenueData[]
}

const DEFAULT_DATA: MonthlyRevenueData[] = [
  { month: 'Jan', revenue: 450000, target: 500000 },
  { month: 'Feb', revenue: 520000, target: 500000 },
  { month: 'Mar', revenue: 610000, target: 550000 },
  { month: 'Apr', revenue: 580000, target: 550000 },
  { month: 'May', revenue: 630000, target: 600000 },
  { month: 'Jun', revenue: 710000, target: 600000 },
]

export default function RevenueChart({ data = DEFAULT_DATA }: RevenueChartProps) {
  const formatCurrency = (val: number) => {
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`
    return `₹${val}`
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm h-80 flex flex-col">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-700">Monthly Revenue</h3>
        <p className="text-xs text-slate-400">Comparing actual revenue against target goals</p>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="month"
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
              tickFormatter={formatCurrency}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '12px',
              }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value: any) => [value !== undefined ? `₹${Number(value).toLocaleString('en-IN')}` : '', '']}
            />
            <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', color: '#64748b' }} />
            <Line
              name="Actual Revenue"
              type="monotone"
              dataKey="revenue"
              stroke="#4f46e5"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
            <Line
              name="Target Revenue"
              type="monotone"
              dataKey="target"
              stroke="#94a3b8"
              strokeDasharray="5 5"
              strokeWidth={1.5}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
