import FuelForm from "../components/fuel/FuelForm";
import ExpenseForm from "../components/expenses/ExpenseForm";
import ExpenseTable from "../components/expenses/ExpenseTable";

export default function Expenses() {
  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900">
          Fuel & Expense Management
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          Track fuel consumption and operational expenses
        </p>
      </div>


      {/* Forms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FuelForm />
        <ExpenseForm />
      </div>


      {/* Expense History */}
      <ExpenseTable />

    </div>
  );
}