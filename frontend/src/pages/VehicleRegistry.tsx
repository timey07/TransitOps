import { useState, useEffect } from 'react';
import { Truck, Plus, Upload, Search, Filter, X } from 'lucide-react';

interface Vehicle {
  id: string;
  registrationNo: string;
  name: string;
  type: string;
  capacityKg: number;
  status: string;
  fuelStatusPct: number;
}

export default function VehicleRegistry() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    registrationNo: '', name: '', type: '', capacityKg: 0, odometerKm: 0, acquisitionCost: 0
  });

  const API_URL = 'http://localhost:3000/api/vehicles';

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_URL, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setVehicles(data);
      }
    } catch (error) {
      console.error('Failed to fetch vehicles', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-900/30 dot-emerald';
      case 'ON_TRIP':
        return 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 border-indigo-200/40 dark:border-indigo-900/30 dot-indigo';
      case 'IN_SHOP':
        return 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border-amber-200/50 dark:border-amber-900/30 dot-amber';
      default:
        return 'bg-slate-50 dark:bg-slate-950/40 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 dot-slate';
    }
  };

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newVehicle)
      });
      if (res.ok) {
        setShowAddModal(false);
        fetchVehicles();
        setNewVehicle({ registrationNo: '', name: '', type: '', capacityKg: 0, odometerKm: 0, acquisitionCost: 0 });
      } else {
        const data = await res.json();
        alert('Failed to add vehicle: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        fetchVehicles();
      } else {
        alert('Upload failed: ' + data.error);
      }
    } catch (err) {
      console.error(err);
    }
    e.target.value = '';
  };

  return (
    <div className="flex h-full flex-col space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Vehicle Registry</h2>
          <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-1">Manage your fleet, view statuses, and import bulk data.</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="inline-flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#090d16] hover:bg-slate-50 dark:hover:bg-slate-900 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 shadow-sm transition-colors cursor-pointer">
            <Upload className="mr-2 h-4 w-4 text-slate-400" />
            Import CSV
            <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
          </label>
          <button 
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 px-4 py-2.5 text-xs font-bold shadow-sm transition-all duration-200 hover:scale-[1.01]"
          >
            <Plus className="mr-2 h-4 w-4 stroke-[2.5]" />
            Add Vehicle
          </button>
        </div>
      </div>

      {/* Query Filters */}
      <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800/60 pb-5">
        <div className="relative flex-1 max-w-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <Search className="h-4 w-4 text-slate-400 dark:text-slate-500" />
          </div>
          <input
            type="text"
            className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#030712] pl-10 pr-4 py-2.5 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/40 transition-all outline-none"
            placeholder="Search by registration..."
          />
        </div>
        <button className="inline-flex items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#090d16] hover:bg-slate-50 dark:hover:bg-slate-900 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 shadow-sm transition-colors">
          <Filter className="mr-2 h-4 w-4 text-slate-400 dark:text-slate-500" />
          Filters
        </button>
      </div>

      {/* Main Registry Table */}
      <div className="flex-1 overflow-auto rounded-2xl border border-slate-200/80 dark:border-slate-800/60 bg-white dark:bg-[#090d16] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_30px_-4px_rgba(0,0,0,0.2)]">
        <table className="min-w-full divide-y divide-slate-200/60 dark:divide-slate-800/50">
          <thead className="bg-slate-50/70 dark:bg-[#030712] sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Vehicle Profile</th>
              <th className="px-6 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Registration</th>
              <th className="px-6 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Volumetric Capacity</th>
              <th className="px-6 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Fuel Level Telemetry</th>
              <th className="px-6 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Deployment Status</th>
              <th className="px-6 py-3.5 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 bg-white dark:bg-[#090d16]">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-xs font-semibold text-slate-400 dark:text-slate-500 animate-pulse">
                  Syncing active fleet registry...
                </td>
              </tr>
            ) : vehicles.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#030712] border border-slate-100 dark:border-slate-800/60 inline-flex mb-3 text-slate-400 dark:text-slate-500">
                    <Truck className="h-6 w-6" />
                  </div>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">No registered machinery profiles found</p>
                  <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mt-1">Add vehicle entries manually or import from a standard logistics manifest file.</p>
                </td>
              </tr>
            ) : (
              vehicles.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-900/20 transition-colors">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 shrink-0 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-[#030712] border border-slate-100 dark:border-slate-800/50 text-slate-400 dark:text-slate-500">
                        <Truck className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">{vehicle.name}</div>
                        <div className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase mt-0.5 tracking-wider">{vehicle.type}</div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className="text-xs font-semibold font-mono text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/60 px-1.5 py-0.5 rounded border border-slate-200/40 dark:border-slate-700/30">
                      {vehicle.registrationNo}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-xs font-bold text-slate-800 dark:text-slate-200">
                    {vehicle.capacityKg.toLocaleString()} kg
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-20 bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            vehicle.fuelStatusPct < 20 ? 'bg-rose-500' : vehicle.fuelStatusPct < 50 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`} 
                          style={{ width: `${vehicle.fuelStatusPct}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold font-mono text-slate-500 dark:text-slate-400">{vehicle.fuelStatusPct}%</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`inline-flex items-center rounded-lg px-2 py-0.5 text-[10px] font-bold border tracking-wide uppercase ${getStatusStyles(vehicle.status)}`}>
                      <span className="h-1 w-1 rounded-full mr-1.5 currentColor" />
                      {vehicle.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-xs font-bold">
                    <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">Configure</a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Creation Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity" onClick={() => setShowAddModal(false)} />
          
          <div className="relative w-full max-w-md rounded-2xl border border-slate-200/80 dark:border-slate-800/60 bg-white dark:bg-[#090d16] p-6 shadow-2xl transition-all">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">Add New Fleet Asset</h3>
                <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mt-0.5">Initialize custom engine telemetry metrics</p>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg border border-slate-100 dark:border-slate-800/60 bg-slate-50 dark:bg-[#030712] text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddVehicle} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">Registration Identifier</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. MH-12-HQ-4567"
                  className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#030712] px-4 py-3 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/40 transition-all outline-none" 
                  value={newVehicle.registrationNo} 
                  onChange={e => setNewVehicle({...newVehicle, registrationNo: e.target.value})} 
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">Machine Model Name</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Volvo FH16 Globetrotter"
                  className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#030712] px-4 py-3 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/40 transition-all outline-none"
                  value={newVehicle.name} 
                  onChange={e => setNewVehicle({...newVehicle, name: e.target.value})} 
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">Classification Type</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Heavy Duty Semi-Trailer"
                  className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#030712] px-4 py-3 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/40 transition-all outline-none"
                  value={newVehicle.type} 
                  onChange={e => setNewVehicle({...newVehicle, type: e.target.value})} 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">Net Payload (Kg)</label>
                  <input 
                    type="number" 
                    required 
                    min="0" 
                    placeholder="0"
                    className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#030712] px-4 py-3 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/40 transition-all outline-none"
                    value={newVehicle.capacityKg || ''} 
                    onChange={e => setNewVehicle({...newVehicle, capacityKg: Number(e.target.value)})} 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">Initial Odometer (Km)</label>
                  <input 
                    type="number" 
                    required 
                    min="0" 
                    placeholder="0"
                    className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#030712] px-4 py-3 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/40 transition-all outline-none"
                    value={newVehicle.odometerKm || ''} 
                    onChange={e => setNewVehicle({...newVehicle, odometerKm: Number(e.target.value)})} 
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">Acquisition Capital Settlement ($)</label>
                <input 
                  type="number" 
                  required 
                  min="0" 
                  placeholder="0.00"
                  className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#030712] px-4 py-3 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/40 transition-all outline-none"
                  value={newVehicle.acquisitionCost || ''} 
                  onChange={e => setNewVehicle({...newVehicle, acquisitionCost: Number(e.target.value)})} 
                />
              </div>
              
              <div className="pt-3 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)} 
                  className="inline-flex justify-center items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#030712] hover:bg-slate-50 dark:hover:bg-slate-900 px-4 py-3 text-xs font-bold text-slate-700 dark:text-slate-400 shadow-sm transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="inline-flex justify-center items-center rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 px-4 py-3 text-xs font-bold shadow-md transition-all duration-200 hover:scale-[1.01]"
                >
                  Register Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}