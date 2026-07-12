import { useState, useEffect } from 'react'
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
  formatValue?: (value: number) => string
}

const DEFAULT_DATA: MonthlyRevenueData[] = [
  { month: 'Jan', revenue: 450000, target: 500000 },
  { month: 'Feb', revenue: 520000, target: 500000 },
  { month: 'Mar', revenue: 610000, target: 550000 },
  { month: 'Apr', revenue: 580000, target: 550000 },
  { month: 'May', revenue: 630000, target: 600000 },
  { month: 'Jun', revenue: 710000, target: 600000 },
]

export default function RevenueChart({ data = DEFAULT_DATA, formatValue }: RevenueChartProps) {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const checkTheme = () => setIsDark(document.documentElement.classList.contains('dark'))
    checkTheme()
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  const formatCurrency = (val: number) => {
    if (formatValue) return formatValue(val)
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`
    return `₹${val}`
  }

  return (
    <div className="bg-white dark:bg-[#090d16] rounded-3xl border border-slate-200/80 dark:border-slate-800/60 p-6 md:p-8 h-96 flex flex-col shadow-[0_4px_24px_-6px_rgba(0,0,0,0.01)]">
      <div className="mb-5">
        <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">Financial Operation Tracking</h3>
        <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-0.5">Aggregate performance parameters vs target indicators</p>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke={isDark ? '#141b2b' : '#f1f5f9'} />
            <XAxis dataKey="month" stroke={isDark ? '#475569' : '#94a3b8'} fontSize={11} tickLine={false} axisLine={false} dy={10} />
            <YAxis stroke={isDark ? '#475569' : '#94a3b8'} fontSize={11} tickLine={false} axisLine={false} tickFormatter={formatCurrency} dx={-5} />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? '#090d16' : '#ffffff',
                border: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0',
                borderRadius: '16px',
                color: isDark ? '#fff' : '#0f172a',
                fontSize: '12px',
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
              }}
              formatter={(value: any) => [value !== undefined ? `₹${Number(value).toLocaleString('en-IN')}` : '', 'Gross Operations Volume']}
            />
            <Legend verticalAlign="top" height={40} iconType="circle" iconSize={7} wrapperStyle={{ fontSize: '11px', fontWeight: 600, color: isDark ? '#64748b' : '#64748b', paddingBottom: '10px' }} />
            <Line name="Actual Operations Yield" type="monotone" dataKey="revenue" stroke={isDark ? '#818cf8' : '#4f46e5'} strokeWidth={3.5} dot={{ r: 4, strokeWidth: 2, fill: isDark ? '#090d16' : '#fff' }} activeDot={{ r: 6, strokeWidth: 0 }} />
            <Line name="Target Yield Threshold" type="monotone" dataKey="target" stroke={isDark ? '#334155' : '#cbd5e1'} strokeDasharray="6 6" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
