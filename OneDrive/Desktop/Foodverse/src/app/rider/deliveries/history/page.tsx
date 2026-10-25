'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, History, Package } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface DeliveryHistoryItem {
  id: string;
  order_reference: string;
  restaurant_name: string;
  customer_name: string;
  delivered_at: string;
  total_amount_pkr: number;
  delivery_fee_pkr: number;
}

export default function DeliveryHistoryPage() {
  const [deliveries, setDeliveries] = useState<DeliveryHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setLoading(false);
          return;
        }

        const { data: orders } = await (supabase as any)
          .from('orders')
          .select(
            `
            id,
            order_reference,
            total_amount_pkr,
            delivery_fee_pkr,
            delivery_assignments (delivered_at),
            restaurants (name),
            profiles (full_name)
          `
          )
          .eq('rider_id', user.id)
          .eq('current_status', 'delivered')
          .order('created_at', { ascending: false });

        if (orders) {
          setDeliveries(
            orders.map((order: any) => ({
              id: order.id,
              order_reference: order.order_reference,
              restaurant_name: order.restaurants?.name || 'Unknown',
              customer_name: order.profiles?.full_name || 'Customer',
              delivered_at: order.delivery_assignments?.[0]?.delivered_at || new Date().toISOString(),
              total_amount_pkr: order.total_amount_pkr,
              delivery_fee_pkr: order.delivery_fee_pkr,
            }))
          );
        }
      } catch (err) {
        console.error('Failed to load delivery history:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
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
          <h1 className="text-3xl font-bold text-gray-900">Delivery History</h1>
          <p className="text-gray-500 text-sm mt-1">View all your completed deliveries</p>
        </div>

        {/* Delivery List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-3" />
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : deliveries.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No Delivery History</h3>
            <p className="text-gray-500 text-sm">You haven&apos;t completed any deliveries yet</p>
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
                    <th className="p-4">Order Total</th>
                    <th className="p-4">Your Fee</th>
                    <th className="p-4 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {deliveries.map((delivery) => (
                    <tr key={delivery.id} className="hover:bg-gray-50 transition">
                      <td className="p-4 font-mono font-bold text-red-600">{delivery.order_reference}</td>
                      <td className="p-4 text-gray-700">{delivery.restaurant_name}</td>
                      <td className="p-4 text-gray-700">{delivery.customer_name}</td>
                      <td className="p-4 text-gray-700">Rs. {delivery.total_amount_pkr.toLocaleString()}</td>
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
  );
}
