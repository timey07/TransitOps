import ReportCard from "../components/reports/ReportCard";
import FuelEfficiencyChart from "../components/reports/FuelEfficiencyChart";
import CostAnalysisChart from "../components/reports/CostAnalysisChart";

import {
  Fuel,
  TrendingUp,
  Wrench,
  IndianRupee
} from "lucide-react";

export default function Report() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
          Reports & Analytics
        </h2>
        <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-1">
          Operational insights and deep-dive fleet performance analytics
        </p>
      </div>

      {/* Summary Cards Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <ReportCard
          title="Fuel Efficiency"
          value="8.5 km/L"
          description="Average fleet efficiency"
          icon={Fuel}
          iconColor="text-indigo-600 dark:text-indigo-400"
          iconBg="bg-indigo-50 dark:bg-indigo-950/30 border-indigo-100/40 dark:border-indigo-900/20"
        />

        <ReportCard
          title="Fleet Utilization"
          value="82%"
          description="Active vehicle usage rate"
          icon={TrendingUp}
          iconColor="text-emerald-600 dark:text-emerald-400"
          iconBg="bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100/40 dark:border-emerald-900/20"
        />

        <ReportCard
          title="Maintenance Cost"
          value="₹45,000"
          description="Aggregated monthly expenses"
          icon={Wrench}
          iconColor="text-amber-600 dark:text-amber-400"
          iconBg="bg-amber-50 dark:bg-amber-950/30 border-amber-100/40 dark:border-amber-900/20"
        />

        <ReportCard
          title="Vehicle ROI"
          value="18%"
          description="Average capital return"
          icon={IndianRupee}
          iconColor="text-rose-600 dark:text-rose-400"
          iconBg="bg-rose-50 dark:bg-rose-950/30 border-rose-100/40 dark:border-rose-900/20"
        />
      </div>

      {/* Charts Visualization Layer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FuelEfficiencyChart />
        <CostAnalysisChart />
      </div>
    </div>
  );
}