'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, ShoppingBag, CreditCard, CheckCircle2, AlertCircle } from 'lucide-react';
import { useCart } from '@/features/ordering/cart-context';
import { getUserAddresses, Address, validateAndCreateOrder } from '@/features/ordering/checkout-service';

export default function CheckoutPage() {
  const router = useRouter();
  const { restaurantId, restaurantName, items, subtotal, clearCart } = useCart();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [fetchingAddresses, setFetchingAddresses] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const deliveryFee = items.length > 0 ? 150 : 0;
  const grandTotal = subtotal + deliveryFee;

  useEffect(() => {
    async function loadAddresses() {
      try {
        const userAddresses = await getUserAddresses();
        setAddresses(userAddresses);
        if (userAddresses.length > 0) {
          const defaultAddr = userAddresses.find((a) => a.is_default) || userAddresses[0];
          setSelectedAddressId(defaultAddr.id);
        }
      } catch (err) {
        console.error('Failed to load addresses:', err);
      } finally {
        setFetchingAddresses(false);
      }
    }
    loadAddresses();
  }, []);

  const handlePlaceOrder = async () => {
    if (!restaurantId || items.length === 0) {
      setError('Your cart is empty');
      return;
    }

    if (!selectedAddressId) {
      setError('Please select a delivery address');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await validateAndCreateOrder({
        restaurantId,
        cartItems: items.map((i) => ({ id: i.id, quantity: i.quantity, price_pkr: i.price_pkr })),
        deliveryAddressId: selectedAddressId,
      });

      clearCart();
      router.push(`/orders/${result.orderId}/confirmation?ref=${result.orderReference}`);
    } catch (err: any) {
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center max-w-md w-full shadow-sm">
          <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 text-sm mb-6">Add delicious food from a restaurant to proceed to checkout.</p>
          <Link
            href="/"
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium text-sm transition block shadow-sm"
          >
            Browse Restaurants
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-red-600"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to Home
          </Link>
          <span className="font-bold text-lg text-gray-900">Checkout</span>
          <div className="w-20" />
        </div>
      </header>

      {/* Main Checkout Content */}
      <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: Delivery Address & Payment */}
          <div className="md:col-span-2 space-y-6">
            {/* Delivery Address Section */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
              <div className="flex items-center space-x-2 text-gray-900 font-bold border-b border-gray-100 pb-3">
                <MapPin className="w-5 h-5 text-red-600" />
                <span>Delivery Address</span>
              </div>

              {fetchingAddresses ? (
                <div className="py-6 text-center text-gray-500 text-sm">Loading addresses...</div>
              ) : addresses.length === 0 ? (
                <div className="py-4 text-center space-y-3">
                  <p className="text-sm text-gray-600">No saved addresses found in your profile.</p>
                  <p className="text-xs text-gray-400">Please add an address in your database or profile settings.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <label
                      key={addr.id}
                      className={`flex items-start p-4 rounded-xl border cursor-pointer transition ${
                        selectedAddressId === addr.id
                          ? 'border-red-600 bg-red-50/50 shadow-sm'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        value={addr.id}
                        checked={selectedAddressId === addr.id}
                        onChange={() => setSelectedAddressId(addr.id)}
                        className="mt-1 text-red-600 focus:ring-red-500"
                      />
                      <div className="ml-3 text-sm">
                        <div className="font-semibold text-gray-900 flex items-center space-x-2">
                          <span>{addr.label || 'Delivery Address'}</span>
                          {addr.is_default && (
                            <span className="bg-red-100 text-red-800 text-[10px] font-medium px-2 py-0.5 rounded">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 mt-0.5">{addr.street_address}</p>
                        <p className="text-gray-500 text-xs">
                          {addr.area}, {addr.city} {addr.postal_code ? `- ${addr.postal_code}` : ''}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Payment Method Section */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
              <div className="flex items-center space-x-2 text-gray-900 font-bold border-b border-gray-100 pb-3">
                <CreditCard className="w-5 h-5 text-red-600" />
                <span>Payment Method</span>
              </div>
              <div className="flex items-center p-4 rounded-xl border border-red-600 bg-red-50/50">
                <input type="radio" checked readOnly className="text-red-600 focus:ring-red-500" />
                <div className="ml-3 text-sm">
                  <span className="font-semibold text-gray-900">Cash on Delivery (COD)</span>
                  <p className="text-xs text-gray-500">Pay securely with cash when your order arrives at your doorstep.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm sticky top-24 space-y-4">
              <h3 className="font-bold text-lg text-gray-900 border-b border-gray-100 pb-3">Order Summary</h3>

              {restaurantName && (
                <div className="text-xs text-gray-500 font-medium">
                  Ordering from: <span className="text-gray-900 font-bold">{restaurantName}</span>
                </div>
              )}

              <div className="divide-y divide-gray-100 max-h-60 overflow-y-auto pr-1 space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="pt-3 flex justify-between text-sm">
                    <div>
                      <span className="font-medium text-gray-800">{item.name}</span>
                      <span className="text-xs text-gray-500 block">Qty: {item.quantity}</span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      Rs. {(item.price_pkr * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-gray-200 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span className="font-medium text-gray-900">Rs. {deliveryFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-gray-900 pt-3 border-t border-gray-200">
                  <span>Total</span>
                  <span className="text-red-600">Rs. {grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={loading || addresses.length === 0}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white py-3 rounded-xl font-bold text-sm transition shadow-sm mt-4 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <span>Processing Order...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Place Order (Rs. {grandTotal.toLocaleString()})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
