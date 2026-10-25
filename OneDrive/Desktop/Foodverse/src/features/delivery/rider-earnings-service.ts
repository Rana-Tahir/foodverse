'use server';

import { createClient } from '@/lib/supabase/server';

export interface DeliveryRecord {
  id: string;
  order_reference: string;
  restaurant_name: string;
  customer_name: string;
  delivery_fee_pkr: number;
  total_amount_pkr: number;
  estimated_distance_km: number;
  delivered_at: string;
  completion_time_min: number;
}

export interface RiderEarnings {
  totalEarnings: number;
  totalDeliveries: number;
  averageDeliveryTime: number;
  averageDistance: number;
  deliveries: DeliveryRecord[];
}

export async function getRiderEarnings(startDate?: string, endDate?: string): Promise<RiderEarnings> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      totalEarnings: 0,
      totalDeliveries: 0,
      averageDeliveryTime: 0,
      averageDistance: 0,
      deliveries: [],
    };
  }

  // Get completed deliveries for this rider
  const { data: deliveries } = await (supabase as any)
    .from('orders')
    .select(
      `
      id,
      order_reference,
      delivery_fee_pkr,
      total_amount_pkr,
      created_at,
      restaurants (name),
      profiles (full_name),
      delivery_assignments (
        picked_up_at,
        delivered_at
      )
    `
    )
    .eq('rider_id', user.id)
    .eq('current_status', 'delivered');

  if (!deliveries || deliveries.length === 0) {
    return {
      totalEarnings: 0,
      totalDeliveries: 0,
      averageDeliveryTime: 0,
      averageDistance: 0,
      deliveries: [],
    };
  }

  // Calculate earnings and format records
  let totalEarnings = 0;
  let totalTime = 0;
  let totalDistance = 0;

  const formattedDeliveries: DeliveryRecord[] = deliveries.map((order: any) => {
    const fee = order.delivery_fee_pkr || 0;
    totalEarnings += fee;

    const deliveryAssignment = order.delivery_assignments?.[0];
    let completionTime = 0;
    if (deliveryAssignment?.picked_up_at && deliveryAssignment?.delivered_at) {
      completionTime = Math.ceil(
        (new Date(deliveryAssignment.delivered_at).getTime() -
          new Date(deliveryAssignment.picked_up_at).getTime()) /
          60000
      );
      totalTime += completionTime;
    }

    // Hardcoded distance for MVP
    const distance = Math.random() * 10 + 1;
    totalDistance += distance;

    return {
      id: order.id,
      order_reference: order.order_reference,
      restaurant_name: order.restaurants?.name || 'Unknown Restaurant',
      customer_name: order.profiles?.full_name || 'Customer',
      delivery_fee_pkr: fee,
      total_amount_pkr: order.total_amount_pkr,
      estimated_distance_km: parseFloat(distance.toFixed(1)),
      delivered_at: deliveryAssignment?.delivered_at || new Date().toISOString(),
      completion_time_min: completionTime,
    };
  });

  const avgTime = deliveries.length > 0 ? Math.round(totalTime / deliveries.length) : 0;
  const avgDistance = deliveries.length > 0 ? parseFloat((totalDistance / deliveries.length).toFixed(1)) : 0;

  return {
    totalEarnings,
    totalDeliveries: deliveries.length,
    averageDeliveryTime: avgTime,
    averageDistance: avgDistance,
    deliveries: formattedDeliveries,
  };
}

export async function getRiderStats() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      totalDeliveries: 0,
      totalEarnings: 0,
      averageRating: 0,
      activeDeliveries: 0,
    };
  }

  // Get total deliveries
  const { count: deliveredCount } = await (supabase as any)
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('rider_id', user.id)
    .eq('current_status', 'delivered');

  // Get total earnings
  const earningsData = await getRiderEarnings();

  // Get active/in-progress deliveries
  const { count: activeCount } = await (supabase as any)
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('rider_id', user.id)
    .in('current_status', ['picked_up_pending', 'on_the_way']);

  return {
    totalDeliveries: deliveredCount || 0,
    totalEarnings: earningsData.totalEarnings,
    averageRating: 4.8, // Placeholder for MVP
    activeDeliveries: activeCount || 0,
  };
}
