'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, MapPin, Package, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { markPickedUp, markDelivered } from '@/features/delivery/update-delivery-status';

interface CurrentDelivery {
  id: string;
  order_reference: string;
  current_status: string;
  restaurant_name: string;
  restaurant_address: string;
  customer_name: string;
  delivery_address: string;
  items: Array<{
    name_snapshot: string;
    quantity: number;
    total_price: number;
  }>;
  total_amount_pkr: number;
  delivery_fee_pkr: number;
}

export default function CurrentDeliveryPage() {
  const [delivery, setDelivery] = useState<CurrentDelivery | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCurrentDelivery = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setError('Not authenticated');
          setLoading(false);
          return;
        }

        // Get current active delivery
        const { data: orders } = await (supabase as any)
          .from('orders')
          .select(
            `
            id,
            order_reference,
            current_status,
            total_amount_pkr,
            delivery_fee_pkr,
            delivery_address_snapshot,
            restaurants (name, address),
            profiles (full_name),
            order_items (name_snapshot, quantity, total_price)
          `
          )
          .eq('rider_id', user.id)
          .in('current_status', ['picked_up_pending', 'on_the_way']);

        if (!orders || orders.length === 0) {
          setDelivery(null);
          setLoading(false);
          return;
        }

        const order = orders[0];
        setDelivery({
          id: order.id,
          order_reference: order.order_reference,
          current_status: order.current_status,
          restaurant_name: order.restaurants?.name || 'Unknown',
          restaurant_address: order.restaurants?.address || 'N/A',
          customer_name: order.profiles?.full_name || 'Customer',
          delivery_address: `${order.delivery_address_snapshot?.street_address || ''}, ${order.delivery_address_snapshot?.area || ''}`,
          items: order.order_items || [],
          total_amount_pkr: order.total_amount_pkr,
          delivery_fee_pkr: order.delivery_fee_pkr,
        });
      } catch (err) {
        console.error('Failed to load delivery:', err);
        setError('Failed to load current delivery');
      } finally {
        setLoading(false);
      }
    };

    loadCurrentDelivery();
  }, []);

  const handlePickedUp = async () => {
    if (!delivery) return;
    try {
      setUpdating(true);
      setError(null);
      await markPickedUp(delivery.id);
      setDelivery({ ...delivery, current_status: 'on_the_way' });
    } catch (err: any) {
      setError(err.message || 'Failed to mark as picked up');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelivered = async () => {
    if (!delivery) return;
    try {
      setUpdating(true);
      setError(null);
      await markDelivered(delivery.id);
      setDelivery({ ...delivery, current_status: 'delivered' });
    } catch (err: any) {
      setError(err.message || 'Failed to mark as delivered');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Link href="/rider/dashboard" className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-red-600">
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Dashboard
        </Link>

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
          <div className="bg-white rounded-lg border border-gray-200 p-8 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-2/3" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        ) : !delivery ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No Active Delivery</h3>
            <p className="text-gray-500 text-sm mb-4">
              You don&apos;t have any active deliveries. Accept an assignment to get started.
            </p>
            <Link href="/rider/assignments/available" className="inline-block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold">
              View Assignments
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Order Reference & Status */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Order Reference</p>
                  <p className="text-2xl font-bold text-red-600">{delivery.order_reference}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    delivery.current_status === 'picked_up_pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {delivery.current_status === 'picked_up_pending' ? 'Ready for Pickup' : 'On the Way'}
                  </span>
                </div>
              </div>
            </div>

            {/* From & To */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-red-600" />
                  <span>Pick Up From</span>
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Restaurant Name</p>
                    <p className="font-semibold text-gray-900">{delivery.restaurant_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Address</p>
                    <p className="text-sm text-gray-600">{delivery.restaurant_address}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-green-600" />
                  <span>Deliver To</span>
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Customer Name</p>
                    <p className="font-semibold text-gray-900">{delivery.customer_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Delivery Address</p>
                    <p className="text-sm text-gray-600">{delivery.delivery_address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <Package className="w-5 h-5 text-blue-600" />
                <span>Order Items</span>
              </h3>
              <div className="divide-y divide-gray-100">
                {delivery.items.map((item, idx) => (
                  <div key={idx} className="py-3 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-900">{item.name_snapshot}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-gray-900">Rs. {item.total_price.toLocaleString()}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-red-600">Rs. {delivery.total_amount_pkr.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>Your Delivery Fee:</span>
                <span className="font-semibold text-green-600">Rs. {delivery.delivery_fee_pkr.toLocaleString()}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              {delivery.current_status === 'picked_up_pending' ? (
                <button
                  onClick={handlePickedUp}
                  disabled={updating}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-bold text-lg transition flex items-center justify-center space-x-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>{updating ? 'Confirming...' : 'Mark as Picked Up'}</span>
                </button>
              ) : delivery.current_status === 'on_the_way' ? (
                <button
                  onClick={handleDelivered}
                  disabled={updating}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-bold text-lg transition flex items-center justify-center space-x-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>{updating ? 'Confirming...' : 'Mark as Delivered'}</span>
                </button>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="font-semibold text-green-900">Delivery Complete!</p>
                  <p className="text-sm text-green-800 mt-1">Thank you for your excellent service</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
