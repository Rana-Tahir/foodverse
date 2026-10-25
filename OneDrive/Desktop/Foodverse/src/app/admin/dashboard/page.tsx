'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BarChart3, Building2, Users, Package, Bike, TrendingUp, AlertCircle } from 'lucide-react';
import { getDashboardMetrics, DashboardMetrics } from '@/features/admin/get-dashboard-metrics';

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const data = await getDashboardMetrics();
        setMetrics(data);
      } catch (err) {
        console.error('Failed to load metrics:', err);
        setError('Failed to load dashboard metrics');
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Platform overview and key metrics</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900">Error</h3>
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
                <div className="h-8 bg-gray-200 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : metrics ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Total Customers</p>
                <p className="text-3xl font-extrabold text-gray-900">{metrics.totalCustomers}</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Active Restaurants</p>
                <p className="text-3xl font-extrabold text-gray-900">{metrics.activeRestaurants}</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Active Riders</p>
                <p className="text-3xl font-extrabold text-gray-900">{metrics.activeRiders}</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Pending</p>
                <p className="text-3xl font-extrabold text-yellow-600">{metrics.pendingRestaurants}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Orders Today</h3>
                <p className="text-3xl font-extrabold text-gray-900">{metrics.totalOrdersToday}</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Revenue Today</h3>
                <p className="text-3xl font-extrabold text-green-600">Rs. {metrics.totalRevenueToday.toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Avg Order Value</h3>
                <p className="text-3xl font-extrabold text-blue-600">Rs. {metrics.averageOrderValue.toLocaleString()}</p>
              </div>
            </div>
          </>
        ) : null}

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/admin/restaurants/pending" className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 hover:shadow-lg transition">
              <AlertCircle className="w-8 h-8 text-yellow-600 mb-2" />
              <h3 className="font-semibold text-gray-900">Approve Restaurants</h3>
              <p className="text-sm text-gray-600 mt-1">Review pending registrations</p>
            </Link>
            <Link href="/admin/users" className="bg-blue-50 border border-blue-200 rounded-lg p-6 hover:shadow-lg transition">
              <Users className="w-8 h-8 text-blue-600 mb-2" />
              <h3 className="font-semibold text-gray-900">Manage Users</h3>
              <p className="text-sm text-gray-600 mt-1">View user accounts</p>
            </Link>
            <Link href="/admin/orders" className="bg-green-50 border border-green-200 rounded-lg p-6 hover:shadow-lg transition">
              <Package className="w-8 h-8 text-green-600 mb-2" />
              <h3 className="font-semibold text-gray-900">Monitor Orders</h3>
              <p className="text-sm text-gray-600 mt-1">View all orders</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
