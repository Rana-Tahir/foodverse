'use client';

import Link from 'next/link';
import { useAuth } from '@/features/auth/use-auth';

export default function HomePage() {
  const { user, isAuthenticated, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/" className="text-2xl font-bold text-red-600">
              Foodverse
            </Link>
            <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full font-medium">
              Pakistan
            </span>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700 hidden sm:inline">
                  {user?.email}
                </span>
                <Link
                  href="/restaurant/dashboard"
                  className="text-sm text-gray-600 hover:text-red-600 font-medium"
                >
                  Dashboards
                </Link>
                <button
                  onClick={() => signOut()}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/auth/login"
                  className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition shadow-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-rose-500 text-white py-16 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Great food, delivered fast to your door.
          </h1>
          <p className="text-lg sm:text-xl text-red-100 mb-8">
            Order from the best local restaurants in Karachi, Lahore, Islamabad and across Pakistan.
          </p>
          <div className="bg-white p-2 rounded-lg shadow-lg max-w-xl mx-auto flex items-center">
            <input
              type="text"
              placeholder="Enter your delivery area (e.g. Gulshan, DHA)..."
              className="w-full px-4 py-2 text-gray-800 focus:outline-none text-sm"
            />
            <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md font-medium text-sm transition whitespace-nowrap">
              Find Food
            </button>
          </div>
        </div>
      </section>

      {/* Main Content / Features */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
              1
            </div>
            <h3 className="font-semibold text-lg text-gray-900 mb-2">Choose Restaurant</h3>
            <p className="text-gray-600 text-sm">
              Browse approved local restaurants offering authentic Pakistani and continental cuisines.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
              2
            </div>
            <h3 className="font-semibold text-lg text-gray-900 mb-2">Select Your Meal</h3>
            <p className="text-gray-600 text-sm">
              Explore rich menus with transparent PKR pricing and custom options.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
              3
            </div>
            <h3 className="font-semibold text-lg text-gray-900 mb-2">Fast Delivery</h3>
            <p className="text-gray-600 text-sm">
              Track your rider in real-time until your hot meal arrives at your doorstep.
            </p>
          </div>
        </div>

        {isAuthenticated && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Links & Dashboards</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link
                href="/restaurant/dashboard"
                className="p-4 border border-gray-200 rounded-lg hover:border-red-500 hover:shadow-md transition text-center"
              >
                <h4 className="font-semibold text-gray-900">Restaurant Owner</h4>
                <p className="text-xs text-gray-500 mt-1">Manage menu & orders</p>
              </Link>
              <Link
                href="/rider/dashboard"
                className="p-4 border border-gray-200 rounded-lg hover:border-red-500 hover:shadow-md transition text-center"
              >
                <h4 className="font-semibold text-gray-900">Delivery Rider</h4>
                <p className="text-xs text-gray-500 mt-1">View assigned deliveries</p>
              </Link>
              <Link
                href="/admin/dashboard"
                className="p-4 border border-gray-200 rounded-lg hover:border-red-500 hover:shadow-md transition text-center"
              >
                <h4 className="font-semibold text-gray-900">Admin Control</h4>
                <p className="text-xs text-gray-500 mt-1">Platform management & RLS</p>
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} Foodverse Pakistan. All rights reserved.</p>
      </footer>
    </div>
  );
}
