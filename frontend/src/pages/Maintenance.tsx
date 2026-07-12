import { useState, useEffect } from 'react';
import { Wrench, Plus, CheckCircle, Truck, X } from 'lucide-react';

interface MaintenanceLog {
  id: string;
  vehicleId: string;
  vehicle: {
    name: string;
    registrationNo: string;
  };
  serviceType: string;
  cost: number;
  date: string;
  status: string;
}

export default function Maintenance() {
  const [logs, setLogs] = useState<MaintenanceLog[]>([]);
  const [vehicles, setVehicles] = useState<{ id: string; registrationNo: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLog, setNewLog] = useState({
    vehicleId: '',
    serviceType: 'Routine Oil Change',
    cost: 0,
  });

  const API_URL = 'http://localhost:3000/api/maintenance';

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setLogs(data);
      }
      const vResponse = await fetch('http://localhost:3000/api/vehicles', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (vResponse.ok) {
        const vData = await vResponse.json();
        setVehicles(vData);
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLog = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newLog),
      });
      if (res.ok) {
        setShowAddModal(false);
        fetchLogs();
        setNewLog({ vehicleId: '', serviceType: 'Routine Oil Change', cost: 0 });
      } else {
        const data = await res.json();
        alert('Failed to log maintenance: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleComplete = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/${id}/complete`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchLogs();
      }
    } catch (error) {
      console.error('Failed to complete maintenance', error);
    }
  };

  return (
    <div className="flex h-full flex-col space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Maintenance Lifecycle Logs
          </h2>
          <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-1">
            Track, analyze, and authorize servicing schedules across your active asset fleet.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 px-4 py-2.5 text-xs font-bold shadow-sm transition-all duration-200 hover:scale-[1.01]"
        >
          <Plus className="mr-2 h-4 w-4 stroke-[2.5]" />
          Log Maintenance
        </button>
      </div>

      {/* Logs Table Container */}
      <div className="flex-1 overflow-auto rounded-2xl border border-slate-200/80 dark:border-slate-800/60 bg-white dark:bg-[#090d16] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_30px_-4px_rgba(0,0,0,0.2)]">
        <table className="min-w-full divide-y divide-slate-200/60 dark:divide-slate-800/50">
          <thead className="bg-slate-50/70 dark:bg-[#030712] sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Asset Target</th>
              <th className="px-6 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Service Profiling</th>
              <th className="px-6 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Cost Settlement</th>
              <th className="px-6 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Timestamp</th>
              <th className="px-6 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Lifecycle Status</th>
              <th className="px-6 py-3.5 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Execution</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 bg-white dark:bg-[#090d16]">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-xs font-semibold text-slate-400 dark:text-slate-500 animate-pulse">
                  Retrieving system maintenance records...
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#030712] border border-slate-100 dark:border-slate-800/60 inline-flex mb-3">
                    <Wrench className="h-6 w-6 text-slate-400 dark:text-slate-500" />
                  </div>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">No telemetry logs found</p>
                  <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mt-1">Log internal service metrics to track operational status.</p>
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-900/20 transition-colors">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-slate-50 dark:bg-[#030712] border border-slate-100 dark:border-slate-800/50 text-slate-400 dark:text-slate-500">
                        <Truck className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">{log.vehicle.name}</div>
                        <div className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-0.5">{log.vehicle.registrationNo}</div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{log.serviceType}</span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-xs font-black text-slate-900 dark:text-white">
                    ${log.cost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-xs font-medium text-slate-400 dark:text-slate-500">
                    {new Date(log.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`inline-flex items-center rounded-lg px-2 py-0.5 text-[10px] font-bold border tracking-wide uppercase ${
                      log.status === 'ACTIVE'
                        ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border-amber-200/50 dark:border-amber-900/30'
                        : 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-900/30'
                    }`}>
                      <span className={`h-1 w-1 rounded-full mr-1.5 ${log.status === 'ACTIVE' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                      {log.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-xs font-medium">
                    {log.status === 'ACTIVE' && (
                      <button
                        onClick={() => handleComplete(log.id)}
                        className="inline-flex items-center text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-bold transition-colors"
                      >
                        <CheckCircle className="mr-1.5 h-3.5 w-3.5 stroke-[2.5]" />
                        Complete Task
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal View Block */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity" onClick={() => setShowAddModal(false)} />
          
          <div className="relative w-full max-w-md rounded-2xl border border-slate-200/80 dark:border-slate-800/60 bg-white dark:bg-[#090d16] p-6 shadow-2xl transition-all">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">Log Maintenance Task</h3>
                <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">Commit new servicing configuration metrics</p>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg border border-slate-100 dark:border-slate-800/60 bg-slate-50 dark:bg-[#030712] text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddLog} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">Asset Registration Target</label>
                <select
                  required
                  className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#030712] px-4 py-3 text-xs font-semibold text-slate-900 dark:text-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/40 transition-all outline-none appearance-none"
                  value={newLog.vehicleId}
                  onChange={(e) => setNewLog({ ...newLog, vehicleId: e.target.value })}
                >
                  <option value="" className="dark:bg-[#090d16]">Select parameters...</option>
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id} className="dark:bg-[#090d16]">
                      {v.registrationNo}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">Service Profiling</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Brake Caliper Realignment"
                  className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#030712] px-4 py-3 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/40 transition-all outline-none"
                  value={newLog.serviceType}
                  onChange={(e) => setNewLog({ ...newLog, serviceType: e.target.value })}
                >
                </input>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">Estimated Cost Settlement ($)</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="any"
                  placeholder="0.00"
                  className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#030712] px-4 py-3 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/40 transition-all outline-none"
                  value={newLog.cost || ''}
                  onChange={(e) => setNewLog({ ...newLog, cost: Number(e.target.value) })}
                />
              </div>

              <div className="pt-3 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="inline-flex justify-center items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#030712] hover:bg-slate-50 dark:hover:bg-slate-900 px-4 py-3 text-xs font-bold text-slate-700 dark:text-slate-400 shadow-sm transition-colors"
                >
                  Abnormal Reset
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center items-center rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 px-4 py-3 text-xs font-bold shadow-md transition-all duration-200 hover:scale-[1.01]"
                >
                  Commit Log Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}