import ReportCard from "../components/reports/ReportCard";
import FuelEfficiencyChart from "../components/reports/FuelEfficiencyChart"
import CostAnalysisChart from "../components/reports/CostAnalysisChart";

import {
  Fuel,
  TrendingUp,
  Wrench,
  IndianRupee
} from "lucide-react";


export default function Report() {

  return (
    <div className="space-y-6">


      {/* Header */}
      <div>

        <h2 className="text-xl font-bold text-slate-900">
          Reports & Analytics
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          Operational insights and fleet performance analysis
        </p>

      </div>



      {/* Summary Cards */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">


        <ReportCard
          title="Fuel Efficiency"
          value="8.5 km/L"
          description="Average fleet efficiency"
          icon={Fuel}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-50"
        />


        <ReportCard
          title="Fleet Utilization"
          value="82%"
          description="Vehicle usage rate"
          icon={TrendingUp}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />


        <ReportCard
          title="Maintenance Cost"
          value="₹45,000"
          description="Monthly maintenance"
          icon={Wrench}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        />


        <ReportCard
          title="Vehicle ROI"
          value="18%"
          description="Average return"
          icon={IndianRupee}
          iconColor="text-rose-600"
          iconBg="bg-rose-50"
        />


      </div>




      {/* Charts */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <FuelEfficiencyChart />

        <CostAnalysisChart />

      </div>



    </div>
  );
}