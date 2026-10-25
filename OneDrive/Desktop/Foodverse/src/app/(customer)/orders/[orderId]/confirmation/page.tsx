import Link from 'next/link';
import { CheckCircle2, Package, ArrowRight, Home } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

interface OrderConfirmationPageProps {
  params: {
    orderId: string;
  };
  searchParams: {
    ref?: string;
  };
}

export default async function OrderConfirmationPage({
  params,
  searchParams,
}: OrderConfirmationPageProps) {
  const supabase = createClient();
  const orderRef = searchParams.ref || 'FV-ORDER';

  // Fetch order details
  const { data: order } = await (supabase as any)
    .from('orders')
    .select('*, restaurants(name)')
    .eq('id', params.orderId)
    .single();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-gray-200 p-8 max-w-lg w-full shadow-sm text-center space-y-6">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Order Placed Successfully!</h1>
          <p className="text-gray-500 text-sm">
            Thank you for ordering with Foodverse. Your order is pending confirmation by the restaurant.
          </p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-left space-y-2">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Order Reference</span>
            <span className="font-mono font-bold text-gray-900">{order?.order_reference || orderRef}</span>
          </div>
          {order?.restaurants?.name && (
            <div className="flex justify-between text-xs text-gray-500">
              <span>Restaurant</span>
              <span className="font-semibold text-gray-900">{order.restaurants.name}</span>
            </div>
          )}
          <div className="flex justify-between text-xs text-gray-500">
            <span>Payment Method</span>
            <span className="font-semibold text-gray-900">Cash on Delivery</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-gray-900 pt-2 border-t border-gray-200">
            <span>Total Amount</span>
            <span className="text-red-600">Rs. {order?.total_amount_pkr?.toLocaleString() || '0'}</span>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs p-3 rounded-xl">
          Estimated delivery time: <span className="font-bold">30 - 45 minutes</span>
        </div>

        <div className="space-y-3 pt-2">
          <Link
            href="/"
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold text-sm transition block shadow-sm"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
