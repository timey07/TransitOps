import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

type CostData = { id: string; registrationNo: string; totalCost: number }

export default function CostAnalysisChart({ data }: { data: CostData[] }) {
  const [isDark, setIsDark] = useState(false)
  useEffect(() => {
    const updateTheme = () => setIsDark(document.documentElement.classList.contains('dark'))
    updateTheme()
    const observer = new MutationObserver(updateTheme)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])
  const textColor = isDark ? '#94a3b8' : '#64748b'

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] dark:border-slate-800/60 dark:bg-[#090d16] dark:shadow-[0_4px_30px_-4px_rgba(0,0,0,0.2)]">
      <div className="mb-6"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Financial Distribution</p><h3 className="mt-1 text-base font-bold tracking-tight text-slate-900 dark:text-slate-100">Vehicle Cost Analysis</h3></div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#1e293b' : '#f1f5f9'} />
          <XAxis dataKey="registrationNo" axisLine={false} tickLine={false} tick={{ fill: textColor, fontSize: 11, fontWeight: 500 }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: textColor, fontSize: 11, fontWeight: 500 }} tickFormatter={(amount: number) => `₹${amount.toLocaleString('en-IN')}`} />
          <Tooltip cursor={{ fill: isDark ? 'rgba(99,102,241,0.1)' : 'rgba(99,102,241,0.04)' }} contentStyle={{ backgroundColor: isDark ? '#090d16' : '#ffffff', border: `1px solid ${isDark ? '#1e293b' : '#e2e8f0'}`, borderRadius: '12px', padding: '10px 14px' }} formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Operational cost']} />
          <Bar dataKey="totalCost" name="Operational cost" fill="#4f46e5" radius={[6, 6, 0, 0]} maxBarSize={45} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
