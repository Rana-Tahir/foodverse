'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Store, UtensilsCrossed, ClipboardList, CheckCircle, XCircle, Clock, ArrowRight } from 'lucide-react';
import { getRestaurantOrdersForOwner, updateOrderStatus, RestaurantOrder } from '@/features/restaurants/restaurant-orders-service';
import { ProtectedRoute } from '@/lib/authorization/protected-route';

export default function RestaurantDashboardPage() {
  const [restaurant, setRestaurant] = useState<any>(null);
  const [orders, setOrders] = useState<RestaurantOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const data = await getRestaurantOrdersForOwner();
      setRestaurant(data.restaurant);
      setOrders(data.orders);
    } catch (err) {
      console.error('Failed to load restaurant dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000); // poll every 10s
    return () => clearInterval(interval);
  }, []);

  const handleStatusUpdate = async (orderId: string, status: string, notes?: string) => {
    try {
      await updateOrderStatus(orderId, status, notes);
      await fetchOrders();
    } catch (err: any) {
      alert(err.message || 'Failed to update order status');
    }
  };

  const pendingOrders = orders.filter((o) => o.current_status === 'pending_confirmation');
  const activeOrders = orders.filter((o) => ['confirmed', 'preparing', 'ready_for_pickup', 'picked_up'].includes(o.current_status));
  const todayRevenue = orders
    .filter((o) => o.current_status === 'delivered')
    .reduce((sum, o) => sum + o.total_amount_pkr, 0);

  return (
    <ProtectedRoute requiredRoles={['restaurant_owner']}>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Store className="w-6 h-6 text-red-600" />
              <span className="font-bold text-lg text-gray-900">
                {restaurant?.name ? `${restaurant.name} Dashboard` : 'Restaurant Owner Dashboard'}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/restaurant/menu"
                className="inline-flex items-center space-x-1.5 text-sm font-medium text-gray-700 hover:text-red-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition"
              >
                <UtensilsCrossed className="w-4 h-4" />
                <span>Manage Menu</span>
              </Link>
              <Link href="/" className="text-sm font-medium text-gray-500 hover:text-gray-900">
                Home
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
          {loading ? (
            <div className="py-12 text-center text-gray-500 text-sm">Loading restaurant dashboard...</div>
          ) : !restaurant ? (
            <div className="bg-white border border-gray-200 rounded-xl p-12 text-center space-y-4">
              <Store className="w-12 h-12 text-gray-400 mx-auto" />
              <h2 className="text-xl font-bold text-gray-900">No Restaurant Profile Found</h2>
              <p className="text-gray-500 text-sm max-w-md mx-auto">
                You have not registered a restaurant yet, or your profile is pending setup. Please seed or contact admin.
              </p>
            </div>
          ) : (
            <>
              {/* Stats Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Pending Orders</h3>
                  <p className="text-3xl font-extrabold text-amber-600">{pendingOrders.length}</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Active Orders</h3>
                  <p className="text-3xl font-extrabold text-blue-600">{activeOrders.length}</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Delivered Revenue</h3>
                  <p className="text-3xl font-extrabold text-green-600">Rs. {todayRevenue.toLocaleString()}</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Orders</h3>
                  <p className="text-3xl font-extrabold text-gray-900">{orders.length}</p>
                </div>
              </div>

              {/* Pending Orders Section */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-amber-600" />
                  <span>Incoming Pending Orders ({pendingOrders.length})</span>
                </h2>

                {pendingOrders.length === 0 ? (
                  <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500 text-sm">
                    No pending orders requiring confirmation right now.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {pendingOrders.map((order) => (
                      <div key={order.id} className="bg-white rounded-xl border border-amber-300 shadow-sm p-6 space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-mono font-bold text-red-600 text-sm">{order.order_reference}</span>
                            <h4 className="font-semibold text-gray-900 text-base">{order.profiles?.full_name || 'Customer'}</h4>
                            <p className="text-xs text-gray-500">{order.profiles?.phone_number || order.profiles?.email}</p>
                          </div>
                          <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                            Pending
                          </span>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-3 text-xs space-y-1">
                          <p className="font-medium text-gray-700">Delivery Address:</p>
                          <p className="text-gray-600">
                            {order.delivery_address_snapshot?.street_address}, {order.delivery_address_snapshot?.area}
                          </p>
                        </div>

                        <div className="space-y-1 text-sm border-t border-gray-100 pt-3">
                          <p className="text-xs font-semibold text-gray-500 mb-1">Items:</p>
                          {order.order_items.map((item) => (
                            <div key={item.id} className="flex justify-between text-xs text-gray-700">
                              <span>{item.quantity}x {item.name_snapshot}</span>
                              <span className="font-medium">Rs. {item.total_price.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-between items-center pt-3 border-t border-gray-100 font-bold text-sm">
                          <span>Total Amount</span>
                          <span className="text-red-600">Rs. {order.total_amount_pkr.toLocaleString()}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <button
                            onClick={() => handleStatusUpdate(order.id, 'rejected', 'Rejected by restaurant owner')}
                            className="bg-gray-100 hover:bg-red-50 text-red-600 border border-red-200 py-2.5 rounded-lg text-xs font-semibold transition flex items-center justify-center space-x-1"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>Reject</span>
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(order.id, 'confirmed', 'Confirmed by restaurant owner')}
                            className="bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg text-xs font-semibold transition flex items-center justify-center space-x-1 shadow-sm"
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span>Accept & Confirm</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Active & Past Orders Section */}
              <div className="space-y-4 pt-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                  <ClipboardList className="w-5 h-5 text-blue-600" />
                  <span>All Restaurant Orders</span>
                </h2>

                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase">
                          <th className="p-4">Reference</th>
                          <th className="p-4">Customer</th>
                          <th className="p-4">Status</th>
                          <th className="p-4">Total</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {orders.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="p-8 text-center text-gray-500 text-sm">
                              No orders found for this restaurant yet.
                            </td>
                          </tr>
                        ) : (
                          orders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50 transition">
                              <td className="p-4 font-mono font-bold text-gray-900">{order.order_reference}</td>
                              <td className="p-4 text-gray-700">{order.profiles?.full_name || 'Customer'}</td>
                              <td className="p-4">
                                <span
                                  className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                                    order.current_status === 'delivered'
                                      ? 'bg-green-100 text-green-800'
                                      : order.current_status === 'rejected'
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-blue-100 text-blue-800'
                                  }`}
                                >
                                  {order.current_status.replace(/_/g, ' ').toUpperCase()}
                                </span>
                              </td>
                              <td className="p-4 font-semibold text-gray-900">
                                Rs. {order.total_amount_pkr.toLocaleString()}
                              </td>
                              <td className="p-4 text-right space-x-2">
                                {order.current_status === 'confirmed' && (
                                  <button
                                    onClick={() => handleStatusUpdate(order.id, 'preparing')}
                                    className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-blue-700 transition"
                                  >
                                    Mark Preparing
                                  </button>
                                )}
                                {order.current_status === 'preparing' && (
                                  <button
                                    onClick={() => handleStatusUpdate(order.id, 'ready_for_pickup')}
                                    className="bg-purple-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-purple-700 transition"
                                  >
                                    Ready for Pickup
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
