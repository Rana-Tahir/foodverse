'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        const supabase = createClient();
        const { data } = await (supabase as any)
          .from('restaurants')
          .select('*')
          .order('created_at', { ascending: false });
        setRestaurants(data || []);
      } catch (err) {
        console.error('Failed to load restaurants:', err);
      } finally {
        setLoading(false);
      }
    };
    loadRestaurants();
  }, []);

  const filtered = restaurants.filter(r => 
    r.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Restaurant Management</h1>
          <p className="text-gray-500 text-sm mt-1">View and manage all restaurants</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search restaurants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent text-sm focus:outline-none"
            />
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">No restaurants found</h3>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Approved</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{r.name}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${r.is_available ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                        {r.is_available ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${r.is_approved ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {r.is_approved ? 'Yes' : 'Pending'}
                      </span>
                    </td>
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
