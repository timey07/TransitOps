import { useState, useEffect } from 'react';
import { Users, Plus, Calendar, Shield, Search, Star, X, Smartphone, AlertCircle } from 'lucide-react';

interface Driver {
  id: string;
  name: string;
  licenseNo: string;
  category: string;
  licenseExpiry: string;
  contact: string;
  safetyScore: number;
  status: string;
}

export default function Drivers() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDriver, setNewDriver] = useState({
    name: '', licenseNo: '', category: 'LMV', licenseExpiry: '', contact: ''
  });

  const API_URL = 'http://localhost:3000/api/drivers';

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_URL, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setDrivers(data);
      }
    } catch (error) {
      console.error('Failed to fetch drivers', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE': 
        return 'bg-emerald-50/80 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30';
      case 'ON_TRIP': 
        return 'bg-indigo-50/80 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/30';
      case 'SUSPENDED': 
        return 'bg-rose-50/80 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/30';
      default: 
        return 'bg-slate-50/80 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800';
    }
  };

  const isExpired = (expiryStr: string) => {
    const expiry = new Date(expiryStr);
    return expiry < new Date();
  };

  const handleAddDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newDriver)
      });
      if (res.ok) {
        setShowAddModal(false);
        setNewDriver({ name: '', licenseNo: '', category: 'LMV', licenseExpiry: '', contact: '' });
        fetchDrivers();
      } else {
        const data = await res.json();
        alert('Failed to add driver: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex h-full flex-col space-y-8 animate-fade-in">
      {/* Premium Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 bg-white dark:bg-[#090d16] p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800/60 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_30px_-4px_rgba(0,0,0,0.2)]">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-600 dark:text-indigo-400">
              <Users size={20} />
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">Driver Personnel</h2>
          </div>
          <p className="text-sm font-medium text-slate-400 dark:text-slate-500 mt-1.5 ml-11">Monitor operator profiles, license compliance matrices, and risk profiles.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="sm:ml-11 inline-flex items-center justify-center rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 px-5 py-3 text-xs font-bold shadow-md transition-all duration-200 hover:scale-[1.02]"
        >
          <Plus className="mr-2 h-4 w-4" strokeWidth={2.5} />
          Add Core Operator
        </button>
      </div>

      {/* Advanced Filter Deck */}
      <div className="flex items-center bg-white dark:bg-[#090d16] p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/60 shadow-sm">
        <div className="relative w-full max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <Search className="h-4 w-4 text-slate-400 dark:text-slate-500" />
          </div>
          <input
            type="text"
            className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#030712] pl-11 pr-4 py-2.5 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/40 transition-all outline-none"
            placeholder="Filter operators by verification parameters..."
          />
        </div>
      </div>

      {/* Interactive Core Content Area */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center text-sm font-semibold text-slate-400 dark:text-slate-500 h-64">
          <span className="h-2 w-2 rounded-full bg-indigo-500 animate-ping mr-3" />
          Synchronizing operator registers...
        </div>
      ) : drivers.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center border border-slate-200/80 dark:border-slate-800/60 rounded-3xl bg-white dark:bg-[#090d16] p-16 text-center shadow-sm">
          <div className="p-4 bg-slate-50 dark:bg-[#030712] rounded-2xl border border-slate-100 dark:border-slate-800/40 text-slate-300 dark:text-slate-600 mb-4">
            <Users className="h-10 w-10" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No Operator Records</h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-sm">The platform directory is empty. Initialize compliance profiles by adding a profile.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {drivers.map((driver) => {
            const expired = isExpired(driver.licenseExpiry);
            return (
              <div key={driver.id} className="relative flex flex-col justify-between rounded-2xl border border-slate-200/80 dark:border-slate-800/60 bg-white dark:bg-[#090d16] p-6 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.01)] hover:border-slate-300 dark:hover:border-slate-700/80 transition-all duration-300 min-h-72.5">
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 shrink-0 flex items-center justify-center rounded-xl bg-indigo-50/60 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 border border-indigo-100/40 dark:border-indigo-900/20">
                        <Users className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white truncate tracking-tight">{driver.name}</h3>
                        <div className="flex items-center text-xs text-slate-400 dark:text-slate-500 mt-0.5 gap-1.5 font-medium">
                          <Smartphone size={12} />
                          <span className="truncate">{driver.contact}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-[10px] font-bold border tracking-wide shrink-0 uppercase ${getStatusColor(driver.status)}`}>
                      {driver.status.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Operational Metrics Block */}
                  <div className="mt-6 border-t border-slate-100 dark:border-slate-800/40 pt-5 space-y-3.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="flex items-center text-slate-400 dark:text-slate-500">
                        <Shield className="mr-2 h-4 w-4 shrink-0 text-slate-400" />
                        License Class
                      </span>
                      <span className="px-2 py-0.5 text-[11px] font-bold bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-300 rounded border border-slate-200/40 dark:border-slate-700/40">
                        {driver.category} &mdash; {driver.licenseNo}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="flex items-center text-slate-400 dark:text-slate-500">
                        <Calendar className="mr-2 h-4 w-4 shrink-0 text-slate-400" />
                        Valid Until
                      </span>
                      <span className={`flex items-center gap-1.5 ${expired ? 'text-rose-600 dark:text-rose-400 font-extrabold' : 'text-slate-800 dark:text-slate-300'}`}>
                        {expired && <AlertCircle size={12} className="text-rose-500" />}
                        {new Date(driver.licenseExpiry).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                        {expired && <span className="text-[9px] uppercase tracking-wide px-1.5 py-0.5 rounded bg-rose-50 dark:bg-rose-950/40 border border-rose-100/50 dark:border-rose-900/30 ml-1">Expired</span>}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="flex items-center text-slate-400 dark:text-slate-500">
                        <Star className="mr-2 h-4 w-4 shrink-0 text-slate-400" />
                        Safety Performance
                      </span>
                      <span className={`text-xs font-bold ${driver.safetyScore >= 85 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-500 dark:text-amber-400'}`}>
                        {driver.safetyScore} <span className="text-[10px] text-slate-400 font-medium">/ 100</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3 text-xs border-t border-slate-100 dark:border-slate-800/40 pt-4">
                  <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 font-bold tracking-wide transition-colors">
                    Configure Matrix
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Premium Glassmorphic Input Form Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-slate-950/40 dark:bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#090d16] p-8 shadow-2xl border border-slate-200 dark:border-slate-800 transform transition-all animate-scale-up">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/60 mb-6">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">Initialize Operator Record</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleAddDriver} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Operator Full Name</label>
                <input 
                  type="text" 
                  required 
                  className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#030712] px-4 py-3 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/40 transition-all outline-none"
                  value={newDriver.name} 
                  onChange={e => setNewDriver({...newDriver, name: e.target.value})} 
                  placeholder="e.g. Alex"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">License Serial Identification</label>
                  <input 
                    type="text" 
                    required 
                    className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#030712] px-4 py-3 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/40 transition-all outline-none"
                    value={newDriver.licenseNo} 
                    onChange={e => setNewDriver({...newDriver, licenseNo: e.target.value})} 
                    placeholder="Unique registration key..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Operational Tier Category</label>
                  <select 
                    className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#030712] px-4 py-3 text-xs font-bold text-slate-900 dark:text-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/40 transition-all outline-none"
                    value={newDriver.category} 
                    onChange={e => setNewDriver({...newDriver, category: e.target.value})}
                  >
                    <option value="LMV">LMV (Light Motor Vehicle)</option>
                    <option value="HMV">HMV (Heavy Motor Vehicle)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Regulatory Certification Expiration</label>
                <input 
                  type="date" 
                  required 
                  className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#030712] px-4 py-3 text-xs font-semibold text-slate-900 dark:text-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/40 transition-all outline-none"
                  value={newDriver.licenseExpiry} 
                  onChange={e => setNewDriver({...newDriver, licenseExpiry: e.target.value})} 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Comms Contact Parameter</label>
                <input 
                  type="text" 
                  required 
                  className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#030712] px-4 py-3 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/40 transition-all outline-none"
                  value={newDriver.contact} 
                  onChange={e => setNewDriver({...newDriver, contact: e.target.value})} 
                  placeholder="Primary terminal routing number..."
                />
              </div>
              
              <div className="mt-8 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/60">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)} 
                  className="inline-flex w-full sm:w-auto justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#030712] px-5 py-3 text-xs font-bold text-slate-700 dark:text-slate-400 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                >
                  Abort
                </button>
                <button 
                  type="submit" 
                  className="inline-flex w-full sm:w-auto justify-center rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 px-5 py-3 text-xs font-bold shadow-md transition-all duration-200 hover:scale-[1.02]"
                >
                  Commit Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}