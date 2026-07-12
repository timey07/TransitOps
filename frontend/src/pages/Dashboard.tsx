import { useCallback, useEffect, useState } from 'react'
import { Truck, CheckCircle2, Wrench, Navigation, TrendingUp, Download, Layers } from 'lucide-react'
import { toast } from 'sonner'
import KPICard from '../components/dashboard/KpiCard'
import FleetUtilizationChart from '../components/dashboard/FleetUtilizationChart'
import RevenueChart from '../components/dashboard/RevenueChart'
import { apiRequest, downloadReport } from '../services/api'
import type { DashboardAnalytics } from '../types/report'

const FILTERS = [
  { label: 'All', value: undefined },
  { label: 'Available', value: 'AVAILABLE' },
  { label: 'On Trip', value: 'ON_TRIP' },
  { label: 'In Shop', value: 'IN_SHOP' },
] as const

const formatCurrency = (value: number) => `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`

export default function Dashboard() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null)
  const [loading, setLoading] = useState(true)

  const loadAnalytics = useCallback(async () => {
    setLoading(true)
    const selected = FILTERS.find((filter) => filter.label === activeFilter)
    const query = selected?.value ? `?status=${selected.value}` : ''

    try {
      setAnalytics(await apiRequest<DashboardAnalytics>(`/analytics/dashboard${query}`))
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to load dashboard metrics.')
    } finally {
      setLoading(false)
    }
  }, [activeFilter])

  useEffect(() => {
    void loadAnalytics()
  }, [loadAnalytics])

  const kpis = analytics?.kpis
  const chartTotal = Math.max(kpis?.activeVehicles ?? 0, 1)
  const utilizationData = kpis ? [
    { name: 'Available', utilized: kpis.availableVehicles, total: chartTotal },
    { name: 'On Trip', utilized: kpis.onTripVehicles, total: chartTotal },
    { name: 'In Shop', utilized: kpis.inShopVehicles, total: chartTotal },
  ] : []

  const exportManifest = async () => {
    try {
      await downloadReport('/reports/export?format=csv', 'transitops-roi-report.csv')
      toast.success('The fleet report is ready.')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to export the report.')
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col gap-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] dark:border-slate-800/60 dark:bg-[#090d16] sm:p-8 md:flex-row md:items-center md:justify-between dark:shadow-[0_4px_30px_-4px_rgba(0,0,0,0.2)]">
        <div>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-indigo-500/10 p-2 text-indigo-600 dark:text-indigo-400"><Layers size={20} /></div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">TransitOps Ecosystem</h2>
          </div>
          <p className="ml-11 mt-1.5 text-sm font-medium text-slate-400 dark:text-slate-500">Live fleet coordination and operational intelligence</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center rounded-2xl border border-slate-200/60 bg-slate-100 p-1.5 dark:border-slate-800/80 dark:bg-slate-900">
            {FILTERS.map((filter) => (
              <button key={filter.label} onClick={() => setActiveFilter(filter.label)} className={`rounded-xl px-3 py-2 text-xs font-bold transition-all sm:px-4 ${activeFilter === filter.label ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200/50 dark:bg-[#090d16] dark:text-white dark:ring-slate-800' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'}`}>
                {filter.label}
              </button>
            ))}
          </div>
          <button onClick={exportManifest} className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:scale-[1.02] hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100">
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <KPICard title="Active Vehicles" value={loading ? '—' : kpis?.activeVehicles ?? 0} icon={Truck} iconColor="text-indigo-600 dark:text-indigo-400" iconBgColor="bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-100/60 dark:border-indigo-900/30" description="Non-retired fleet assets" />
        <KPICard title="Available Vehicles" value={loading ? '—' : kpis?.availableVehicles ?? 0} icon={CheckCircle2} iconColor="text-emerald-600 dark:text-emerald-400" iconBgColor="bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100/60 dark:border-emerald-900/30" description="Ready for dispatch" />
        <KPICard title="In Maintenance" value={loading ? '—' : kpis?.inShopVehicles ?? 0} icon={Wrench} iconColor="text-amber-600 dark:text-amber-400" iconBgColor="bg-amber-50/60 dark:bg-amber-950/20 border border-amber-100/60 dark:border-amber-900/30" description="Unavailable for dispatch" />
        <KPICard title="Active Trips" value={loading ? '—' : kpis?.activeTrips ?? 0} icon={Navigation} iconColor="text-sky-600 dark:text-sky-400" iconBgColor="bg-sky-50/60 dark:bg-sky-950/20 border border-sky-100/60 dark:border-sky-900/30" description={`${kpis?.pendingTrips ?? 0} awaiting dispatch`} />
        <KPICard title="Fleet Utilization" value={loading ? '—' : `${kpis?.fleetUtilization ?? 0}%`} icon={TrendingUp} iconColor="text-rose-600 dark:text-rose-400" iconBgColor="bg-rose-50/60 dark:bg-rose-950/20 border border-rose-100/60 dark:border-rose-900/30" description={`${kpis?.onDutyDrivers ?? 0} drivers on duty`} />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <FleetUtilizationChart data={utilizationData} />
        <RevenueChart data={kpis ? [{ month: 'Current', revenue: kpis.totalRevenue, target: kpis.overallOperationalCost }] : []} formatValue={formatCurrency} />
      </div>
    </div>
  )
}
