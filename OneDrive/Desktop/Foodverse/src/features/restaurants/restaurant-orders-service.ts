'use server';

import { createClient } from '@/lib/supabase/server';

export interface RestaurantOrder {
  id: string;
  order_reference: string;
  current_status: string;
  subtotal_pkr: number;
  delivery_fee_pkr: number;
  total_amount_pkr: number;
  delivery_address_snapshot: any;
  created_at: string;
  profiles: {
    full_name: string;
    phone_number: string | null;
    email: string;
  };
  order_items: {
    id: string;
    name_snapshot: string;
    price_snapshot: number;
    quantity: number;
    total_price: number;
  }[];
}

export async function getRestaurantOrdersForOwner(): Promise<{
  restaurant: any;
  orders: RestaurantOrder[];
}> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { restaurant: null, orders: [] };
  }

  // Get restaurant owned by this user
  const { data: restaurant, error: restError } = await (supabase as any)
    .from('restaurants')
    .select('*')
    .eq('owner_id', user.id)
    .single();

  if (restError || !restaurant) {
    return { restaurant: null, orders: [] };
  }

  // Get orders for this restaurant
  const { data: orders, error: ordersError } = await (supabase as any)
    .from('orders')
    .select(
      `
      *,
      profiles:customer_id (full_name, phone_number, email),
      order_items (*)
    `
    )
    .eq('restaurant_id', (restaurant as any).id)
    .order('created_at', { ascending: false });

  if (ordersError || !orders) {
    return { restaurant, orders: [] };
  }

  return { restaurant, orders: orders as RestaurantOrder[] };
}

export async function updateOrderStatus(orderId: string, status: string, notes?: string) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  // Update order status
  const { error: updateError } = await (supabase as any)
    .from('orders')
    .update({ current_status: status })
    .eq('id', orderId);

  if (updateError) {
    throw new Error(updateError.message || 'Failed to update order status');
  }

  // Record status history
  await (supabase as any).from('order_status_history').insert({
    order_id: orderId,
    status,
    changed_by_user_id: user.id,
    notes: notes || `Order status updated to ${status}`,
  });

  return { success: true };
}
