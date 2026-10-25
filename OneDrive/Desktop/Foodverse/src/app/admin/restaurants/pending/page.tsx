'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { approveRestaurant, rejectRestaurant } from '@/features/admin/restaurant-management';

export default function PendingRestaurantsPage() {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    const loadPending = async () => {
      try {
        const supabase = createClient();
        const { data } = await (supabase as any)
          .from('restaurants')
          .select('*, profiles:owner_id(full_name, email)')
          .eq('is_approved', false);
        setRestaurants(data || []);
      } catch (err) {
        console.error('Failed to load pending restaurants:', err);
      } finally {
        setLoading(false);
      }
    };
    loadPending();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      setProcessing(id);
      await approveRestaurant(id);
      setRestaurants(restaurants.filter(r => r.id !== id));
    } catch (err) {
      console.error('Failed to approve:', err);
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (id: string) => {
    try {
      setProcessing(id);
      await rejectRestaurant(id);
      setRestaurants(restaurants.filter(r => r.id !== id));
    } catch (err) {
      console.error('Failed to reject:', err);
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <Link href="/admin/dashboard" className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-blue-600">
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Dashboard
        </Link>

        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pending Approvals</h1>
          <p className="text-gray-500 text-sm mt-1">Review and approve restaurant registrations</p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
              </div>
            ))}
          </div>
        ) : restaurants.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">No Pending Approvals</h3>
            <p className="text-gray-500 text-sm mt-1">All restaurants have been reviewed</p>
          </div>
        ) : (
          <div className="space-y-4">
            {restaurants.map((r) => (
              <div key={r.id} className="bg-white rounded-lg border border-yellow-200 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{r.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">Owner: {r.profiles?.full_name || 'N/A'}</p>
                  </div>
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold">Pending</span>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <p className="text-gray-600 mb-1">Address:</p>
                    <p className="text-gray-900 font-medium">{r.address}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Phone:</p>
                    <p className="text-gray-900 font-medium">{r.phone_number}</p>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleApprove(r.id)}
                    disabled={processing === r.id}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-2 rounded-lg font-semibold text-sm transition flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(r.id)}
                    disabled={processing === r.id}
                    className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-2 rounded-lg font-semibold text-sm transition flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
