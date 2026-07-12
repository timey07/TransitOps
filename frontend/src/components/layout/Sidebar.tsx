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
    <aside className="w-64 bg-[#090d16] border-r border-slate-800/60 flex flex-col h-full text-slate-400 select-none">
      
      {/* Brand Header - Synced with the new h-20 Navbar height */}
      <div className="h-20 flex items-center px-8 border-b border-slate-800/60 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold font-mono text-xs">
            T
          </div>
          <span className="text-sm font-black text-white tracking-wider uppercase">
            Transit<span className="text-indigo-400">Ops</span>
          </span>
        </div>
      </div>

      {/* Navigation Layer */}
      <nav className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all duration-150 ${
                isActive
                  ? 'bg-indigo-600/90 text-white shadow-md shadow-indigo-600/10'
                  : 'hover:bg-[#030712] hover:text-slate-200 border border-transparent hover:border-slate-800/40'
              }`}
            >
              <Icon 
                size={16} 
                className={`transition-colors ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-400'}`} 
              />
              {item.label}
            </Link>
          )
        })}
      </nav>

    </aside>
  )
}