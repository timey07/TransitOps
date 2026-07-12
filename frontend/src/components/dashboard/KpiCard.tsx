import type { LucideIcon } from 'lucide-react'

interface KPICardProps {
  title: string
  value: string | number
  icon: LucideIcon
  iconColor?: string
  iconBgColor?: string
  description?: string
  trend?: {
    value: string
    isPositive: boolean
  }
}

export default function KPICard({
  title,
  value,
  icon: Icon,
  iconColor = 'text-indigo-600 dark:text-indigo-400',
  iconBgColor = 'bg-indigo-50/80 dark:bg-indigo-950/30',
  description,
  trend,
}: KPICardProps) {
  return (
    <div className="bg-white dark:bg-[#090d16] rounded-2xl border border-slate-200/80 dark:border-slate-800/60 p-6 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.01)] dark:shadow-none hover:border-slate-300 dark:hover:border-slate-700/80 transition-all duration-300 flex flex-col justify-between min-h-38.75">
      <div className="w-full">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
              {title}
            </span>
            <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{value}</p>
          </div>
          <div className={`p-3 rounded-xl border border-transparent shrink-0 ${iconBgColor} ${iconColor}`}>
            <Icon size={20} strokeWidth={2.2} />
          </div>
        </div>
      </div>
      
      {(description || trend) && (
        <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800/40 flex items-center gap-2.5 flex-wrap">
          {trend && (
            <span
              className={`text-[11px] font-extrabold px-2 py-0.5 rounded-md ${
                trend.isPositive
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400'
              }`}
            >
              {trend.isPositive ? '+' : ''}{trend.value}
            </span>
          )}
          {description && (
            <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold tracking-wide">
              {description}
            </span>
          )}
        </div>
      )}
    </div>
  )
}