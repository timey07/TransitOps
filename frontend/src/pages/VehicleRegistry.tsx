import { useState, useEffect } from 'react';
import { Truck, Plus, Upload, Search, Filter } from 'lucide-react';

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

  // Note: in a real app, this URL comes from env
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'bg-green-100 text-green-800';
      case 'ON_TRIP': return 'bg-blue-100 text-blue-800';
      case 'IN_SHOP': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
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
    // reset input
    e.target.value = '';
  };

  return (
    <div className="flex h-full flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Vehicle Registry</h2>
          <p className="text-sm text-gray-500">Manage your fleet, view statuses, and import bulk data.</p>
        </div>
        <div className="flex space-x-3">
          <label className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none cursor-pointer">
            <Upload className="mr-2 h-4 w-4" />
            Import CSV
            <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
          </label>
          <button 
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Vehicle
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex space-x-4 border-b border-gray-200 pb-4">
        <div className="relative flex-1 max-w-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full rounded-md border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm border py-2 px-3"
            placeholder="Search by registration..."
          />
        </div>
        <button className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
          <Filter className="mr-2 h-4 w-4 text-gray-400" />
          Filters
        </button>
      </div>

      {/* Data Table */}
      <div className="flex-1 overflow-auto rounded-lg border border-gray-200 bg-white shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Vehicle</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Registration</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Capacity</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Fuel Level</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-500">Loading vehicles...</td>
              </tr>
            ) : vehicles.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                  <Truck className="mx-auto h-10 w-10 text-gray-300 mb-3" />
                  No vehicles found. Add one to get started.
                </td>
              </tr>
            ) : (
              vehicles.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-full bg-blue-100">
                        <Truck className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{vehicle.name}</div>
                        <div className="text-sm text-gray-500">{vehicle.type}</div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-gray-900">{vehicle.registrationNo}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {vehicle.capacityKg.toLocaleString()} kg
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div className={`h-2 rounded-full ${vehicle.fuelStatusPct < 20 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${vehicle.fuelStatusPct}%` }}></div>
                      </div>
                      <span className="text-sm text-gray-500">{vehicle.fuelStatusPct}%</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(vehicle.status)}`}>
                      {vehicle.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <a href="#" className="text-blue-600 hover:text-blue-900">Edit</a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-10 flex items-center justify-center overflow-y-auto bg-gray-500 bg-opacity-75">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Vehicle</h3>
            <form onSubmit={handleAddVehicle} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Registration Number</label>
                <input type="text" required className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" 
                  value={newVehicle.registrationNo} onChange={e => setNewVehicle({...newVehicle, registrationNo: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Name/Model</label>
                <input type="text" required className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  value={newVehicle.name} onChange={e => setNewVehicle({...newVehicle, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <input type="text" required className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  value={newVehicle.type} onChange={e => setNewVehicle({...newVehicle, type: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Capacity (Kg)</label>
                  <input type="number" required min="0" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    value={newVehicle.capacityKg} onChange={e => setNewVehicle({...newVehicle, capacityKg: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Odometer (Km)</label>
                  <input type="number" required min="0" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    value={newVehicle.odometerKm} onChange={e => setNewVehicle({...newVehicle, odometerKm: Number(e.target.value)})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Acquisition Cost ($)</label>
                <input type="number" required min="0" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  value={newVehicle.acquisitionCost} onChange={e => setNewVehicle({...newVehicle, acquisitionCost: Number(e.target.value)})} />
              </div>
              
              <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                <button type="submit" className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 sm:ml-3 sm:w-auto sm:text-sm">
                  Save
                </button>
                <button type="button" onClick={() => setShowAddModal(false)} className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
