import { useState } from 'react'
import { Truck, CheckCircle2, Wrench, Navigation, TrendingUp, Download, Layers } from 'lucide-react'
import KPICard from '../components/dashboard/KPICard'
import FleetUtilizationChart from '../components/dashboard/FleetUtilizationChart'
import RevenueChart from '../components/dashboard/RevenueChart'

export default function Dashboard() {
  const [activeFilter, setActiveFilter] = useState('All')

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header Deck Component */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 bg-white dark:bg-[#090d16] p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800/60 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_30px_-4px_rgba(0,0,0,0.2)]">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-600 dark:text-indigo-400">
              <Layers size={20} />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight sm:text-3xl">TransitOps Ecosystem</h2>
          </div>
          <p className="text-sm font-medium text-slate-400 dark:text-slate-500 mt-1.5 ml-11">Autonomous logistical asset coordination center</p>
        </div>

        {/* Dynamic Controls Filter Component Row */}
        <div className="flex flex-wrap items-center gap-3 ml-0 md:ml-11">
          <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-800/80">
            {['All', 'Heavy Duty', 'Last Mile', 'In Shop'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                  activeFilter === filter
                    ? 'bg-white dark:bg-[#090d16] text-indigo-600 dark:text-white shadow-sm ring-1 ring-slate-200/50 dark:ring-slate-800'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 rounded-xl text-xs font-bold shadow-md transition-all duration-200 hover:scale-[1.02]">
            <Download size={14} />
            <span>Generate Asset Manifest</span>
          </button>
        </div>
      </div>

      {/* Expanded Metrics System Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
        <KPICard
          title="Active Fleet"
          value={8}
          icon={Truck}
          iconColor="text-indigo-600 dark:text-indigo-400"
          iconBgColor="bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-100/60 dark:border-indigo-900/30"
          description="In terminal transit"
          trend={{ value: '12%', isPositive: true }}
        />
        <KPICard
          title="Available Stock"
          value={15}
          icon={CheckCircle2}
          iconColor="text-emerald-600 dark:text-emerald-400"
          iconBgColor="bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100/60 dark:border-emerald-900/30"
          description="Ready for dispatch allocations"
        />
        <KPICard
          title="Vehicles In Maintenance"
          value={2}
          icon={Wrench}
          iconColor="text-amber-600 dark:text-amber-400"
          iconBgColor="bg-amber-50/60 dark:bg-amber-950/20 border border-amber-100/60 dark:border-amber-900/30"
          description="Awaiting diagnostic close"
          trend={{ value: '5%', isPositive: false }}
        />
        <KPICard
          title="Dispatched Routes"
          value={6}
          icon={Navigation}
          iconColor="text-sky-600 dark:text-sky-400"
          iconBgColor="bg-sky-50/60 dark:bg-sky-950/20 border border-sky-100/60 dark:border-sky-900/30"
          description="Live trajectory tracking"
        />
        <KPICard
          title="Fleet Utilization Rate"
          value="80%"
          icon={TrendingUp}
          iconColor="text-rose-600 dark:text-rose-400"
          iconBgColor="bg-rose-50/60 dark:bg-rose-950/20 border border-rose-100/60 dark:border-rose-900/30"
          description="Operational system load"
          trend={{ value: '3.4%', isPositive: true }}
        />
      </div>

      {/* Advanced Chart Panels Deck Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="hover:shadow-xl dark:hover:shadow-[#090d16]/10 transition-shadow duration-300 rounded-3xl">
          <FleetUtilizationChart />
        </div>
        <div className="hover:shadow-xl dark:hover:shadow-[#090d16]/10 transition-shadow duration-300 rounded-3xl">
          <RevenueChart />
        </div>
      </div>
    </div>
  )
}