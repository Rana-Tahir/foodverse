'use server';

import { createClient } from '@/lib/supabase/server';

export interface AdminOrder {
  id: string;
  order_reference: string;
  customer_name: string;
  restaurant_name: string;
  current_status: string;
  total_amount_pkr: number;
  created_at: string;
  delivery_address: string;
}

export async function getAllOrders(statusFilter?: string, dateRange?: { start: string; end: string }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  // Verify user is admin
  const { data: profile } = await (supabase as any)
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    throw new Error('Admin access required');
  }

  let query = (supabase as any)
    .from('orders')
    .select(
      `
      id,
      order_reference,
      current_status,
      total_amount_pkr,
      created_at,
      delivery_address_snapshot,
      profiles (full_name),
      restaurants (name)
    `
    );

  if (statusFilter) {
    query = query.eq('current_status', statusFilter);
  }

  if (dateRange?.start) {
    query = query.gte('created_at', dateRange.start);
  }

  if (dateRange?.end) {
    query = query.lte('created_at', dateRange.end);
  }

  const { data: orders } = await query.order('created_at', { ascending: false });

  if (!orders) {
    return [];
  }

  return orders.map((order: any) => ({
    id: order.id,
    order_reference: order.order_reference,
    customer_name: order.profiles?.full_name || 'Unknown',
    restaurant_name: order.restaurants?.name || 'Unknown',
    current_status: order.current_status,
    total_amount_pkr: order.total_amount_pkr,
    created_at: order.created_at,
    delivery_address: `${order.delivery_address_snapshot?.street_address || ''}, ${order.delivery_address_snapshot?.area || ''}`,
  }));
}

export async function getOrderDetails(orderId: string) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  // Verify user is admin
  const { data: profile } = await (supabase as any)
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    throw new Error('Admin access required');
  }

  const { data: order } = await (supabase as any)
    .from('orders')
    .select(
      `
      *,
      profiles (full_name, email, phone_number),
      restaurants (name, address),
      order_items (*),
      order_status_history (*)
    `
    )
    .eq('id', orderId)
    .single();

  return order;
}
