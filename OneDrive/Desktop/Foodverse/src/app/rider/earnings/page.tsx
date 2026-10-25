'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, Calendar, MapPin } from 'lucide-react';
import { getRiderEarnings, RiderEarnings } from '@/features/delivery/rider-earnings-service';

export default function EarningsPage() {
  const [earnings, setEarnings] = useState<RiderEarnings>({
    totalEarnings: 0,
    totalDeliveries: 0,
    averageDeliveryTime: 0,
    averageDistance: 0,
    deliveries: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEarnings = async () => {
      try {
        const data = await getRiderEarnings();
        setEarnings(data);
      } catch (err) {
        console.error('Failed to load earnings:', err);
      } finally {
        setLoading(false);
      }
    };

    loadEarnings();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <Link href="/rider/dashboard" className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-red-600">
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Dashboard
        </Link>

        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Earnings</h1>
          <p className="text-gray-500 text-sm mt-1">Track your delivery earnings and performance</p>
        </div>

        {/* Summary Cards */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
                <div className="h-8 bg-gray-200 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Total Earnings</h3>
              <p className="text-3xl font-extrabold text-green-600">Rs. {earnings.totalEarnings.toLocaleString()}</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Total Deliveries</h3>
              <p className="text-3xl font-extrabold text-blue-600">{earnings.totalDeliveries}</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Avg Delivery Time</h3>
              <p className="text-3xl font-extrabold text-purple-600">{earnings.averageDeliveryTime} min</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Avg Distance</h3>
              <p className="text-3xl font-extrabold text-orange-600">{earnings.averageDistance} km</p>
            </div>
          </div>
        )}

        {/* Delivery History */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Delivery History</h2>

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
          ) : earnings.deliveries.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-1">No Deliveries Yet</h3>
              <p className="text-gray-500 text-sm">Complete your first delivery to see earnings history</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase">
                      <th className="p-4">Order Reference</th>
                      <th className="p-4">Restaurant</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Distance</th>
                      <th className="p-4">Time</th>
                      <th className="p-4">Earnings</th>
                      <th className="p-4 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {earnings.deliveries.map((delivery) => (
                      <tr key={delivery.id} className="hover:bg-gray-50 transition">
                        <td className="p-4 font-mono font-bold text-red-600">{delivery.order_reference}</td>
                        <td className="p-4 text-gray-700">{delivery.restaurant_name}</td>
                        <td className="p-4 text-gray-700">{delivery.customer_name}</td>
                        <td className="p-4 text-gray-600">{delivery.estimated_distance_km} km</td>
                        <td className="p-4 text-gray-600">{delivery.completion_time_min} min</td>
                        <td className="p-4 font-semibold text-green-600">Rs. {delivery.delivery_fee_pkr.toLocaleString()}</td>
                        <td className="p-4 text-right text-gray-600">
                          {new Date(delivery.delivered_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
