import { useState, useEffect } from 'react';
import { Wrench, Plus, CheckCircle, Truck } from 'lucide-react';

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
  const [loading, setLoading] = useState(true);

  const API_URL = 'http://localhost:3000/api/maintenance';

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await fetch(API_URL);
      if (response.ok) {
        const data = await response.json();
        setLogs(data);
      }
    } catch (error) {
      console.error('Failed to fetch logs', error);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/${id}/complete`, {
        method: 'PATCH'
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Maintenance Logs</h2>
          <p className="text-sm text-gray-500">Track and schedule servicing for your fleet vehicles.</p>
        </div>
        <button className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none">
          <Plus className="mr-2 h-4 w-4" />
          Log Maintenance
        </button>
      </div>

      {/* Logs Table */}
      <div className="flex-1 overflow-auto rounded-lg border border-gray-200 bg-white shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Vehicle</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Service Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Cost</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-500">Loading maintenance logs...</td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                  <Wrench className="mx-auto h-10 w-10 text-gray-300 mb-3" />
                  No maintenance logged. Log service to update status.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <Truck className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{log.vehicle.name}</div>
                        <div className="text-sm text-gray-500">{log.vehicle.registrationNo}</div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className="text-sm font-medium text-gray-900">{log.serviceType}</span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 font-medium">
                    ${log.cost.toLocaleString()}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {new Date(log.date).toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${log.status === 'ACTIVE' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    {log.status === 'ACTIVE' && (
                      <button
                        onClick={() => handleComplete(log.id)}
                        className="inline-flex items-center text-green-600 hover:text-green-900 font-medium"
                      >
                        <CheckCircle className="mr-1 h-4 w-4" />
                        Complete
                      </button>
                    )}
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
