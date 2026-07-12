import { useEffect, useState } from 'react'
import { Fuel, TrendingUp, Wrench, IndianRupee, Download } from 'lucide-react'
import { toast } from 'sonner'
import ReportCard from '../components/reports/ReportCard'
import FuelEfficiencyChart from '../components/reports/FuelEfficiencyChart'
import CostAnalysisChart from '../components/reports/CostAnalysisChart'
import { apiRequest, downloadReport } from '../services/api'
import type { DashboardAnalytics } from '../types/report'

const currency = (amount: number) => `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`

export default function Report() {
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null)

  useEffect(() => {
    apiRequest<DashboardAnalytics>('/analytics/dashboard')
      .then(setAnalytics)
      .catch((error: Error) => toast.error(error.message))
  }, [])

  const exportCsv = async () => {
    try {
      await downloadReport('/reports/export?format=csv', 'transitops-roi-report.csv')
      toast.success('CSV report downloaded.')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to export report.')
    }
  }

  const kpis = analytics?.kpis
  const averageRoi = analytics?.vehicleROI.length
    ? analytics.vehicleROI.reduce((sum, vehicle) => sum + vehicle.roi, 0) / analytics.vehicleROI.length
    : 0

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Reports & Analytics</h2>
          <p className="mt-1 text-xs font-medium text-slate-400 dark:text-slate-500">Live operational cost, efficiency, utilization, and return analysis.</p>
        </div>
        <button onClick={exportCsv} className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:scale-[1.01] hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"><Download size={14} />Export CSV</button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ReportCard title="Fuel Efficiency" value={`${kpis?.overallFuelEfficiency ?? 0} km/L`} description="Distance per litre across the fleet" icon={Fuel} iconColor="text-indigo-600 dark:text-indigo-400" iconBg="bg-indigo-50 dark:bg-indigo-950/30 border-indigo-100/40 dark:border-indigo-900/20" />
        <ReportCard title="Fleet Utilization" value={`${kpis?.fleetUtilization ?? 0}%`} description="Active vehicle usage rate" icon={TrendingUp} iconColor="text-emerald-600 dark:text-emerald-400" iconBg="bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100/40 dark:border-emerald-900/20" />
        <ReportCard title="Operational Cost" value={currency(kpis?.overallOperationalCost ?? 0)} description="Fuel, maintenance, tolls, and other costs" icon={Wrench} iconColor="text-amber-600 dark:text-amber-400" iconBg="bg-amber-50 dark:bg-amber-950/30 border-amber-100/40 dark:border-amber-900/20" />
        <ReportCard title="Vehicle ROI" value={`${averageRoi.toFixed(1)}%`} description="Average return on acquisition cost" icon={IndianRupee} iconColor="text-rose-600 dark:text-rose-400" iconBg="bg-rose-50 dark:bg-rose-950/30 border-rose-100/40 dark:border-rose-900/20" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <FuelEfficiencyChart value={kpis?.overallFuelEfficiency ?? 0} />
        <CostAnalysisChart data={analytics?.vehicleROI ?? []} />
      </div>
    </div>
  )
}
