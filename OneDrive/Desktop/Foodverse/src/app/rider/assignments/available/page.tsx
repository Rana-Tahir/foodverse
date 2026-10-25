'use client';

import { useState, useEffect } from 'react';
import { MapPin, Clock, Package, AlertCircle } from 'lucide-react';
import { getAvailableAssignments, AvailableAssignment } from '@/features/delivery/get-available-assignments';
import { acceptAssignment } from '@/features/delivery/accept-assignment';

export default function AvailableAssignmentsPage() {
  const [assignments, setAssignments] = useState<AvailableAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadAssignments = async () => {
    try {
      setError(null);
      const data = await getAvailableAssignments();
      setAssignments(data);
    } catch (err) {
      console.error('Failed to load assignments:', err);
      setError('Failed to load available assignments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssignments();
    // Auto-refresh every 10 seconds
    const interval = setInterval(loadAssignments, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleAccept = async (orderId: string) => {
    try {
      setAccepting(orderId);
      await acceptAssignment(orderId);
      // Reload assignments
      await loadAssignments();
      setAccepting(null);
    } catch (err: any) {
      setError(err.message || 'Failed to accept assignment');
      setAccepting(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Available Assignments</h1>
          <p className="text-gray-500 text-sm mt-1">Browse and accept new delivery assignments</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900">Error</h3>
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
                <div className="space-y-3">
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : assignments.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No Available Assignments</h3>
            <p className="text-gray-500 text-sm">
              Check back soon for new delivery opportunities. New assignments appear every few minutes.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
            {assignments.map((assignment) => (
              <div
                key={assignment.id}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition"
              >
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Restaurant Info */}
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-1">From Restaurant</p>
                      <h3 className="font-bold text-gray-900">{assignment.restaurant_name}</h3>
                      <p className="text-xs text-gray-600 flex items-start space-x-1 mt-1">
                        <MapPin className="w-3 h-3 flex-shrink-0 mt-0.5" />
                        <span>{assignment.restaurant_address}</span>
                      </p>
                    </div>
                  </div>

                  {/* Delivery Info */}
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-1">To Customer</p>
                      <h3 className="font-bold text-gray-900">{assignment.customer_name}</h3>
                      <p className="text-xs text-gray-600 flex items-start space-x-1 mt-1">
                        <MapPin className="w-3 h-3 flex-shrink-0 mt-0.5" />
                        <span>{assignment.delivery_address}</span>
                      </p>
                    </div>
                    <div className="pt-2">
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Items</p>
                      <p className="text-xs text-gray-600">{assignment.items_summary}</p>
                    </div>
                  </div>

                  {/* Earnings & Action */}
                  <div className="flex flex-col justify-between">
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Delivery Fee</p>
                        <p className="text-2xl font-bold text-green-600">
                          Rs. {assignment.total_amount_pkr.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>~{assignment.estimated_time_min} min</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>~{assignment.estimated_distance_km} km</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAccept(assignment.id)}
                      disabled={accepting === assignment.id}
                      className="mt-4 w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-2.5 rounded-lg font-semibold text-sm transition"
                    >
                      {accepting === assignment.id ? 'Accepting...' : 'Accept Delivery'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
