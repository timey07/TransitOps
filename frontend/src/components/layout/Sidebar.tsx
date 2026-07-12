import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Route, Receipt, BarChart3, Truck, Users, Wrench } from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Vehicles', path: '/vehicles', icon: Truck },
  { label: 'Drivers', path: '/drivers', icon: Users },
  { label: 'Trips', path: '/trips', icon: Route },
  { label: 'Maintenance', path: '/maintenance', icon: Wrench },
  { label: 'Expenses', path: '/expenses', icon: Receipt },
  { label: 'Reports', path: '/reports', icon: BarChart3 },
]

export default function Sidebar() {
  const location = useLocation()

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full text-slate-300">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800 shrink-0">
        <span className="text-lg font-bold text-white tracking-wide">TransitOps</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400'} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800">
        <p className="text-xs text-slate-500">Person B · Fleet & Finance</p>
      </div>
    </aside>
  )
}
