'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bike, TrendingUp, Package, Star, ArrowRight } from 'lucide-react';
import { getRiderStats } from '@/features/delivery/rider-earnings-service';

export default function RiderDashboardPage() {
  const [stats, setStats] = useState({
    totalDeliveries: 0,
    totalEarnings: 0,
    averageRating: 0,
    activeDeliveries: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getRiderStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to load rider stats:', err);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const quickActions = [
    {
      label: 'View Assignments',
      href: '/rider/assignments/available',
      icon: Package,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Current Delivery',
      href: '/rider/deliveries/current',
      icon: Bike,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: 'View Earnings',
      href: '/rider/earnings',
      icon: TrendingUp,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, Rider!</h1>
            <p className="text-gray-500 text-sm mt-1">Manage your deliveries and track your earnings</p>
          </div>
          <Bike className="w-12 h-12 text-red-600 hidden sm:block" />
        </div>

        {/* Stats Grid */}
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
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Total Deliveries
              </h3>
              <p className="text-3xl font-extrabold text-gray-900">{stats.totalDeliveries}</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Total Earnings
              </h3>
              <p className="text-3xl font-extrabold text-green-600">Rs. {stats.totalEarnings.toLocaleString()}</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Rating
              </h3>
              <div className="flex items-center space-x-2">
                <p className="text-3xl font-extrabold text-yellow-500">{stats.averageRating.toFixed(1)}</p>
                <Star className="w-6 h-6 fill-yellow-500 text-yellow-500" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Active Deliveries
              </h3>
              <p className="text-3xl font-extrabold text-blue-600">{stats.activeDeliveries}</p>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className={`${action.bg} border border-gray-200 rounded-xl p-6 hover:shadow-lg transition cursor-pointer group`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className={`${action.color} mb-3`}>
                        <Icon className="w-8 h-8" />
                      </div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-gray-700">{action.label}</h3>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Tips for Success</h3>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Check available assignments regularly for the best delivery offers</li>
            <li>Update your status promptly to keep customers informed</li>
            <li>Maintain excellent ratings by delivering on time and handling orders carefully</li>
            <li>Track your earnings to monitor your income and performance</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
