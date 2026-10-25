'use client';

import { useState, useEffect } from 'react';
import { Search, AlertCircle } from 'lucide-react';
import { getAllOrders, AdminOrder } from '@/features/admin/order-management';

export default function OrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await getAllOrders();
        setOrders(data);
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  const filtered = orders.filter(o =>
    o.order_reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customer_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Monitoring</h1>
          <p className="text-gray-500 text-sm mt-1">View all platform orders</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
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
            <h3 className="text-lg font-semibold text-gray-900">No orders found</h3>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Reference</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Restaurant</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-mono font-bold text-red-600">{o.order_reference}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{o.customer_name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{o.restaurant_name}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${o.current_status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                        {o.current_status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold">Rs. {o.total_amount_pkr.toLocaleString()}</td>
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
