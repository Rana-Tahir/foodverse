'use client';

import { useAuth } from '@/features/auth/use-auth';
import { ProtectedRoute } from '@/lib/authorization/protected-route';

export default function AdminDashboardPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute requiredRoles={['admin']}>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">
              Welcome, {user?.email}! Manage the Foodverse platform.
            </p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-blue-900">
                  Total Users
                </h3>
                <p className="text-2xl font-bold text-blue-600 mt-2">0</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-green-900">
                  Active Restaurants
                </h3>
                <p className="text-2xl font-bold text-green-600 mt-2">0</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-yellow-900">
                  Today&apos;s Orders
                </h3>
                <p className="text-2xl font-bold text-yellow-600 mt-2">0</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-purple-900">
                  Platform Revenue
                </h3>
                <p className="text-2xl font-bold text-purple-600 mt-2">
                  PKR 0
                </p>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Management
              </h2>
              <div className="space-y-2">
                <button className="w-full text-left px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                  Manage Users
                </button>
                <button className="w-full text-left px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                  Approve Restaurants
                </button>
                <button className="w-full text-left px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                  View All Orders
                </button>
                <button className="w-full text-left px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                  Platform Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
