import { useState, useEffect } from 'react'
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
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const checkTheme = () => setIsDark(document.documentElement.classList.contains('dark'))
    checkTheme()
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  const chartData = data.map((d) => ({
    ...d,
    'Utilization Rate (%)': Math.round((d.utilized / d.total) * 100),
  }))

  return (
    <div className="bg-white dark:bg-[#090d16] rounded-3xl border border-slate-200/80 dark:border-slate-800/60 p-6 md:p-8 h-96 flex flex-col shadow-[0_4px_24px_-6px_rgba(0,0,0,0.01)]">
      <div className="mb-5 flex items-start justify-between">
        <div>
          <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">System Utilization Metrics</h3>
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-0.5">Asset load capacity limits optimization data</p>
        </div>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke={isDark ? '#141b2b' : '#f1f5f9'} />
            <XAxis dataKey="name" stroke={isDark ? '#475569' : '#94a3b8'} fontSize={11} tickLine={false} axisLine={false} dy={10} />
            <YAxis stroke={isDark ? '#475569' : '#94a3b8'} fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} tickFormatter={(val) => `${val}%`} dx={-5} />
            <Tooltip
              cursor={{ fill: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}
              contentStyle={{
                backgroundColor: isDark ? '#090d16' : '#ffffff',
                border: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0',
                borderRadius: '16px',
                color: isDark ? '#fff' : '#0f172a',
                fontSize: '12px',
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
              }}
              formatter={(value) => [`${value}%`, 'Utilization Factor']}
            />
            <Legend verticalAlign="top" height={40} iconType="circle" iconSize={7} wrapperStyle={{ fontSize: '11px', fontWeight: 600, color: isDark ? '#64748b' : '#64748b', paddingBottom: '10px' }} />
            <Bar name="Utilization Rate (%)" dataKey="Utilization Rate (%)" fill={isDark ? '#6366f1' : '#4f46e5'} radius={[6, 6, 0, 0]} maxBarSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}