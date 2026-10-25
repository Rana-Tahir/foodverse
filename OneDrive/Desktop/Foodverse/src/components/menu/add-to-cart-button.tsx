'use client';

import { MenuItem } from '@/features/restaurants/get-menu';
import { useCart } from '@/features/ordering/cart-context';

interface AddToCartButtonProps {
  restaurantId: string;
  restaurantName: string;
  item: MenuItem;
}

export function AddToCartButton({ restaurantId, restaurantName, item }: AddToCartButtonProps) {
  const { addItem } = useCart();

  if (!item.is_available) {
    return (
      <span className="w-full text-center bg-gray-200 text-gray-600 font-semibold py-2 rounded-lg text-xs cursor-not-allowed">
        Sold Out
      </span>
    );
  }

  return (
    <button
      onClick={() =>
        addItem(restaurantId, restaurantName, {
          id: item.id,
          name: item.name,
          price_pkr: item.price_pkr,
          quantity: 1,
          image_url: item.image_url,
        })
      }
      className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-lg text-xs transition shadow-sm"
    >
      Add to Cart
    </button>
  );
}
