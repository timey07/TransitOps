import { useState, useEffect } from 'react';
import { Users, Plus, Calendar, Shield, Search, Star } from 'lucide-react';

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
      case 'AVAILABLE': return 'bg-green-100 text-green-800';
      case 'ON_TRIP': return 'bg-blue-100 text-blue-800';
      case 'SUSPENDED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
    <div className="flex h-full flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Driver Profiles</h2>
          <p className="text-sm text-gray-500">Monitor driver certifications, schedules, and safety scores.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Driver
        </button>
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
            placeholder="Search drivers by name..."
          />
        </div>
      </div>

      {/* Grid of Drivers */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center text-gray-500">Loading drivers...</div>
      ) : drivers.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center border border-gray-200 rounded-lg bg-white p-12 shadow text-gray-500">
          <Users className="h-12 w-12 text-gray-300 mb-3" />
          No drivers registered yet. Add a driver profile.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {drivers.map((driver) => {
            const expired = isExpired(driver.licenseExpiry);
            return (
              <div key={driver.id} className="relative flex flex-col justify-between rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 flex-shrink-0 flex items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <Users className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">{driver.name}</h3>
                    <p className="text-xs text-gray-500 truncate">{driver.contact}</p>
                  </div>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(driver.status)}`}>
                    {driver.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="mt-6 border-t border-gray-100 pt-4 space-y-3">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center">
                      <Shield className="mr-1.5 h-4 w-4 text-gray-400" />
                      License ({driver.category})
                    </span>
                    <span className="font-medium text-gray-900">{driver.licenseNo}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center">
                      <Calendar className="mr-1.5 h-4 w-4 text-gray-400" />
                      License Expiry
                    </span>
                    <span className={`font-medium ${expired ? 'text-red-600 font-bold' : 'text-gray-900'}`}>
                      {new Date(driver.licenseExpiry).toLocaleDateString()}
                      {expired && ' (EXPIRED)'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center">
                      <Star className="mr-1.5 h-4 w-4 text-gray-400" />
                      Safety Score
                    </span>
                    <span className={`font-semibold ${driver.safetyScore >= 85 ? 'text-green-600' : 'text-orange-500'}`}>
                      {driver.safetyScore}/100
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3 text-xs border-t border-gray-100 pt-4">
                  <button className="text-blue-600 hover:text-blue-900 font-medium">Edit Details</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-10 flex items-center justify-center overflow-y-auto bg-gray-500 bg-opacity-75">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Driver</h3>
            <form onSubmit={handleAddDriver} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" required className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" 
                  value={newDriver.name} onChange={e => setNewDriver({...newDriver, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">License Number</label>
                <input type="text" required className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  value={newDriver.licenseNo} onChange={e => setNewDriver({...newDriver, licenseNo: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white"
                  value={newDriver.category} onChange={e => setNewDriver({...newDriver, category: e.target.value})}>
                  <option value="LMV">LMV (Light Motor Vehicle)</option>
                  <option value="HMV">HMV (Heavy Motor Vehicle)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">License Expiry Date</label>
                <input type="date" required className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  value={newDriver.licenseExpiry} onChange={e => setNewDriver({...newDriver, licenseExpiry: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                <input type="text" required className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  value={newDriver.contact} onChange={e => setNewDriver({...newDriver, contact: e.target.value})} />
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
