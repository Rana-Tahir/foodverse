'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Trash2, Plus, Minus, X, ArrowRight } from 'lucide-react';
import { useCart } from '@/features/ordering/cart-context';

export function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const { restaurantName, items, updateQuantity, removeItem, clearCart, subtotal } = useCart();

  const totalItemsCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const deliveryFee = items.length > 0 ? 150 : 0;
  const grandTotal = subtotal + deliveryFee;

  if (items.length === 0) {
    return null; // Don't show floating cart if empty
  }

  return (
    <>
      {/* Floating Cart Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-red-600 hover:bg-red-700 text-white px-5 py-3.5 rounded-full shadow-lg flex items-center space-x-3 transition transform hover:scale-105"
        >
          <ShoppingCart className="w-5 h-5" />
          <span className="font-bold text-sm">{totalItemsCount} items</span>
          <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-xs font-semibold">
            Rs. {grandTotal.toLocaleString()}
          </span>
        </button>
      </div>

      {/* Slide-over Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-black/50 transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-xl flex flex-col">
              {/* Drawer Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                <div>
                  <h2 className="font-bold text-lg text-gray-900">Your Order</h2>
                  {restaurantName && (
                    <p className="text-xs text-red-600 font-medium">from {restaurantName}</p>
                  )}
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Items */}
              <div className="flex-grow overflow-y-auto p-4 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between pb-4 border-b border-gray-100"
                  >
                    <div className="flex items-center space-x-3">
                      {item.image_url && (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-14 h-14 object-cover rounded-lg flex-shrink-0"
                        />
                      )}
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm">{item.name}</h4>
                        <p className="text-xs text-red-600 font-medium">
                          Rs. {item.price_pkr.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center border border-gray-200 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 text-gray-600 hover:bg-gray-100 rounded-l-lg transition"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 text-xs font-semibold text-gray-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 text-gray-600 hover:bg-gray-100 rounded-r-lg transition"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-600 p-1 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Drawer Footer / Summary */}
              <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-3">
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-medium text-gray-900">Rs. {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span className="font-medium text-gray-900">Rs. {deliveryFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span className="text-red-600">Rs. {grandTotal.toLocaleString()}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => clearCart()}
                    className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-2.5 rounded-lg text-xs font-medium transition"
                  >
                    Clear Cart
                  </button>
                  <Link
                    href="/checkout"
                    onClick={() => setIsOpen(false)}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg text-xs font-semibold transition flex items-center justify-center space-x-1.5 shadow-sm"
                  >
                    <span>Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
