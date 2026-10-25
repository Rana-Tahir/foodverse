'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string; // menu item id
  name: string;
  price_pkr: number;
  quantity: number;
  image_url: string | null;
}

interface CartContextType {
  restaurantId: string | null;
  restaurantName: string | null;
  items: CartItem[];
  addItem: (restaurantId: string, restaurantName: string, item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'foodverse_cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [restaurantName, setRestaurantName] = useState<string | null>(null);
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        setRestaurantId(data.restaurantId || null);
        setRestaurantName(data.restaurantName || null);
        setItems(data.items || []);
      }
    } catch (e) {
      console.error('Failed to load cart from storage:', e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify({ restaurantId, restaurantName, items })
      );
    } catch (e) {
      console.error('Failed to save cart to storage:', e);
    }
  }, [restaurantId, restaurantName, items]);

  const addItem = (restId: string, restName: string, newItem: CartItem) => {
    if (restaurantId && restaurantId !== restId) {
      const confirmReplace = window.confirm(
        `Your cart contains items from ${restaurantName}. Do you want to clear your cart and start a new order from ${restName}?`
      );
      if (!confirmReplace) return;
      setRestaurantId(restId);
      setRestaurantName(restName);
      setItems([newItem]);
      return;
    }

    setRestaurantId(restId);
    setRestaurantName(restName);

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((i) => i.id === newItem.id);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += newItem.quantity;
        return updated;
      }
      return [...prevItems, newItem];
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => {
      const updated = prev.filter((i) => i.id !== id);
      if (updated.length === 0) {
        setRestaurantId(null);
        setRestaurantName(null);
      }
      return updated;
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setRestaurantId(null);
    setRestaurantName(null);
    setItems([]);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (e) {}
  };

  const subtotal = items.reduce((sum, item) => sum + item.price_pkr * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        restaurantId,
        restaurantName,
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
