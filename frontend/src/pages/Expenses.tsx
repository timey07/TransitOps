import FuelForm from "../components/fuel/FuelForm";
import ExpenseForm from "../components/expenses/ExpenseForm";
import ExpenseTable from "../components/expenses/ExpenseTable";

export default function Expenses() {
  return (
    <div className="flex h-full flex-col space-y-8 animate-fade-in">
      {/* Page Header Block */}
      <div className="bg-white dark:bg-[#090d16] p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800/60 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_30px_-4px_rgba(0,0,0,0.2)]">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          Fuel & Expense Management
        </h2>
        <p className="text-sm font-medium text-slate-400 dark:text-slate-500 mt-1.5">
          Audit system-wide fuel consumption indexes and dynamic operational expenses.
        </p>
      </div>

      {/* Forms Deck Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <FuelForm />
        <ExpenseForm />
      </div>

      {/* Data History Table Area */}
      <ExpenseTable />
    </div>
  );
}