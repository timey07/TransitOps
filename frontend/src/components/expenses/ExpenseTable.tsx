import { useState, useEffect } from "react";
import { apiRequest } from "../../services/api";

type ExpenseData = {
  vehicle: string;
  date: string;
  fuel: number;
  toll: number;
  other: number;
};

export default function ExpenseTable() {
  const [items, setItems] = useState<ExpenseData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const data = await apiRequest<{ fuelLogs: any[], expenses: any[] }>('/expenses');
      
      const fuelMapped = data.fuelLogs.map(log => ({
        vehicle: log.vehicle.registrationNo,
        date: new Date(log.date).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' }),
        fuel: log.cost,
        toll: 0,
        other: 0
      }));

      const expMapped = data.expenses.map(exp => ({
        vehicle: exp.vehicle.registrationNo,
        date: exp.trip ? `Trip: ${exp.trip.id.substring(0,8)}` : 'N/A',
        fuel: 0,
        toll: exp.tollCost,
        other: exp.otherCost
      }));

      setItems([...fuelMapped, ...expMapped]);
    } catch (err) {
      console.error("Failed to load expenses", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
    window.addEventListener('expense-logged', fetchExpenses);
    return () => window.removeEventListener('expense-logged', fetchExpenses);
  }, []);

  return (
    <div className="bg-white dark:bg-[#090d16] rounded-2xl border border-slate-200/80 dark:border-slate-800/60 p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_30px_-4px_rgba(0,0,0,0.2)]">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
            Expense History
          </h3>
          <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-1">
            Historical breakdown of automated fuel logs and manual line item uploads
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800/50">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-[#030712] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
              <th className="px-5 py-3.5 font-bold">Vehicle Unit</th>
              <th className="px-5 py-3.5 font-bold">Settlement Date/Trip</th>
              <th className="px-5 py-3.5 font-bold text-right">Fuel System</th>
              <th className="px-5 py-3.5 font-bold text-right">Toll Gateways</th>
              <th className="px-5 py-3.5 font-bold text-right">Misc. Line Items</th>
              <th className="px-5 py-3.5 font-bold text-right text-slate-900 dark:text-slate-300">Aggregate Total</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 text-slate-700 dark:text-slate-300 font-medium">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-slate-500 animate-pulse">Loading ledger...</td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-slate-500">No expense records found.</td>
              </tr>
            ) : (
              items.map((item, index) => (
                <tr 
                  key={index} 
                  className="hover:bg-slate-50/40 dark:hover:bg-slate-900/20 transition-colors"
                >
                  <td className="px-5 py-4 font-bold text-slate-900 dark:text-white">
                    {item.vehicle}
                  </td>
                  <td className="px-5 py-4 text-slate-400 dark:text-slate-500">
                    {item.date}
                  </td>
                  <td className="px-5 py-4 text-right tabular-nums">
                    ₹{item.fuel.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-5 py-4 text-right tabular-nums">
                    ₹{item.toll.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-5 py-4 text-right tabular-nums">
                    ₹{item.other.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-5 py-4 text-right font-bold text-slate-900 dark:text-white tabular-nums">
                    ₹{(item.fuel + item.toll + item.other).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}