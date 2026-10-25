'use client';

import { useState, useEffect } from 'react';
import { Search, AlertCircle, Star } from 'lucide-react';
import { getAllRiders, AdminRider } from '@/features/admin/rider-management';

export default function RidersPage() {
  const [riders, setRiders] = useState<AdminRider[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadRiders = async () => {
      try {
        const data = await getAllRiders();
        setRiders(data);
      } catch (err) {
        console.error('Failed to load riders:', err);
      } finally {
        setLoading(false);
      }
    };
    loadRiders();
  }, []);

  const filtered = riders.filter(r =>
    r.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rider Management</h1>
          <p className="text-gray-500 text-sm mt-1">Verify and manage delivery partners</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search riders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent text-sm focus:outline-none"
            />
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">No riders found</h3>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Vehicle</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Verified</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Deliveries</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{r.full_name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{r.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{r.vehicle_type}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${r.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {r.is_verified ? 'Yes' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{r.total_deliveries}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
