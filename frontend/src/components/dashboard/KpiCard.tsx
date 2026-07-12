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
  iconColor = 'text-indigo-600',
  iconBgColor = 'bg-indigo-50',
  description,
  trend,
}: KPICardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {title}
          </span>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
        </div>
        <div className={`p-2.5 rounded-lg ${iconBgColor} ${iconColor}`}>
          <Icon size={20} />
        </div>
      </div>
      {(description || trend) && (
        <div className="mt-4 flex items-center gap-2">
          {trend && (
            <span
              className={`text-xs font-semibold px-1.5 py-0.5 rounded-md ${
                trend.isPositive
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-rose-50 text-rose-700'
              }`}
            >
              {trend.isPositive ? '+' : ''}
              {trend.value}
            </span>
          )}
          {description && (
            <span className="text-xs text-slate-400 font-medium">
              {description}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
