'use server';

import { createClient } from '@/lib/supabase/server';

export interface AvailableAssignment {
  id: string;
  order_reference: string;
  restaurant_name: string;
  restaurant_address: string;
  customer_name: string;
  delivery_address: string;
  items_summary: string;
  total_amount_pkr: number;
  estimated_distance_km: number;
  estimated_time_min: number;
  created_at: string;
}

export async function getAvailableAssignments(): Promise<AvailableAssignment[]> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  // Check if user is a rider
  const { data: profile } = await (supabase as any)
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'rider') {
    return [];
  }

  // Get orders ready for pickup that don't have active assignments
  const { data: orders } = await (supabase as any)
    .from('orders')
    .select(
      `
      id,
      order_reference,
      current_status,
      total_amount_pkr,
      created_at,
      delivery_address_snapshot,
      restaurants (name, address),
      profiles (full_name),
      order_items (name_snapshot, quantity)
    `
    )
    .eq('current_status', 'ready_for_pickup')
    .is('rider_id', null);

  if (!orders) {
    return [];
  }

  // Format and enrich with estimates
  return orders.map((order: any) => {
    const itemsSummary = order.order_items
      ?.map((item: any) => `${item.quantity}x ${item.name_snapshot}`)
      .join(', ') || 'N/A';

    // Hardcoded estimate for MVP (would use real geolocation in production)
    const estimatedDistanceKm = Math.random() * 10 + 1;
    const estimatedTimeMin = Math.ceil(estimatedDistanceKm * 2 + 5);

    return {
      id: order.id,
      order_reference: order.order_reference,
      restaurant_name: order.restaurants?.name || 'Unknown Restaurant',
      restaurant_address: order.restaurants?.address || 'N/A',
      customer_name: order.profiles?.full_name || 'Customer',
      delivery_address: `${order.delivery_address_snapshot?.street_address || ''}, ${order.delivery_address_snapshot?.area || ''}`,
      items_summary: itemsSummary,
      total_amount_pkr: order.total_amount_pkr,
      estimated_distance_km: parseFloat(estimatedDistanceKm.toFixed(1)),
      estimated_time_min: estimatedTimeMin,
      created_at: order.created_at,
    };
  });
}
