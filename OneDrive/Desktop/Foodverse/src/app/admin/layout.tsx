'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BarChart3, Building2, Users, Package, Bike, Settings, Menu, X, LogOut } from 'lucide-react';
import { ProtectedRoute } from '@/lib/authorization/protected-route';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: BarChart3 },
    { href: '/admin/restaurants/pending', label: 'Pending Restaurants', icon: Building2 },
    { href: '/admin/restaurants', label: 'All Restaurants', icon: Building2 },
    { href: '/admin/users', label: 'User Management', icon: Users },
    { href: '/admin/orders', label: 'Order Monitoring', icon: Package },
    { href: '/admin/riders', label: 'Rider Management', icon: Bike },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <ProtectedRoute requiredRoles={['admin']}>
      <div className="flex h-screen bg-gray-50">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed left-0 top-0 z-50 h-screen w-64 bg-gray-900 text-white transition-transform duration-300 lg:relative lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex h-16 items-center justify-between border-b border-gray-800 px-4">
            <Link href="/admin/dashboard" className="flex items-center space-x-2 font-bold text-lg">
              <BarChart3 className="w-6 h-6 text-blue-500" />
              <span>Foodverse Admin</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 space-y-2 px-3 py-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition"
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-gray-800 p-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-2 rounded-lg px-4 py-3 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-600 hover:text-gray-900"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-bold text-gray-900 hidden sm:block">Administrator Dashboard</h1>
            <div className="w-6" />
          </header>

          {/* Content */}
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
