import { Truck, CheckCircle2, Wrench, Navigation, TrendingUp } from 'lucide-react'
import KPICard from '../components/dashboard/KPICard'
import FleetUtilizationChart from '../components/dashboard/FleetUtilizationChart'
import RevenueChart from '../components/dashboard/RevenueChart'

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900">TransitOps Dashboard</h2>
        <p className="text-sm text-slate-500 mt-1">Real-time fleet operations performance and metrics</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        <KPICard
          title="Active Vehicles"
          value={8}
          icon={Truck}
          iconColor="text-indigo-600"
          iconBgColor="bg-indigo-50"
          description="In transit"
          trend={{ value: '12%', isPositive: true }}
        />
        <KPICard
          title="Available Vehicles"
          value={15}
          icon={CheckCircle2}
          iconColor="text-emerald-600"
          iconBgColor="bg-emerald-50"
          description="Ready to dispatch"
        />
        <KPICard
          title="Vehicles In Shop"
          value={2}
          icon={Wrench}
          iconColor="text-amber-600"
          iconBgColor="bg-amber-50"
          description="Under service"
          trend={{ value: '5%', isPositive: false }}
        />
        <KPICard
          title="Active Trips"
          value={6}
          icon={Navigation}
          iconColor="text-sky-600"
          iconBgColor="bg-sky-50"
          description="Currently en-route"
        />
        <KPICard
          title="Fleet Utilization"
          value="80%"
          icon={TrendingUp}
          iconColor="text-rose-600"
          iconBgColor="bg-rose-50"
          description="Active vs idle capacity"
          trend={{ value: '3.4%', isPositive: true }}
        />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FleetUtilizationChart />
        <RevenueChart />
      </div>
    </div>
  )
}