'use server';

import { createClient } from '@/lib/supabase/server';

export async function markPickedUp(orderId: string) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  // Verify order is assigned to this rider
  const { data: order, error: orderError } = await (supabase as any)
    .from('orders')
    .select('id, current_status, rider_id')
    .eq('id', orderId)
    .single();

  if (orderError || !order) {
    throw new Error('Order not found');
  }

  if (order.rider_id !== user.id) {
    throw new Error('Unauthorized: Order not assigned to you');
  }

  if (order.current_status !== 'picked_up_pending') {
    throw new Error('Order must be in picked_up_pending status');
  }

  // Update order status
  const { error: updateError } = await (supabase as any)
    .from('orders')
    .update({
      current_status: 'on_the_way',
    })
    .eq('id', orderId);

  if (updateError) {
    throw new Error(updateError.message || 'Failed to update status');
  }

  // Update delivery assignment
  await (supabase as any)
    .from('delivery_assignments')
    .update({
      status: 'picked_up',
      picked_up_at: new Date().toISOString(),
    })
    .eq('order_id', orderId);

  // Record status history
  await (supabase as any)
    .from('order_status_history')
    .insert({
      order_id: orderId,
      status: 'on_the_way',
      changed_by_user_id: user.id,
      notes: 'Order picked up from restaurant',
    });

  return { success: true };
}

export async function markDelivered(orderId: string) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  // Verify order is assigned to this rider
  const { data: order, error: orderError } = await (supabase as any)
    .from('orders')
    .select('id, current_status, rider_id')
    .eq('id', orderId)
    .single();

  if (orderError || !order) {
    throw new Error('Order not found');
  }

  if (order.rider_id !== user.id) {
    throw new Error('Unauthorized: Order not assigned to you');
  }

  if (order.current_status !== 'on_the_way') {
    throw new Error('Order must be on_the_way before marking delivered');
  }

  // Update order status
  const { error: updateError } = await (supabase as any)
    .from('orders')
    .update({
      current_status: 'delivered',
    })
    .eq('id', orderId);

  if (updateError) {
    throw new Error(updateError.message || 'Failed to update status');
  }

  // Update delivery assignment
  await (supabase as any)
    .from('delivery_assignments')
    .update({
      status: 'delivered',
      delivered_at: new Date().toISOString(),
    })
    .eq('order_id', orderId);

  // Record status history
  await (supabase as any)
    .from('order_status_history')
    .insert({
      order_id: orderId,
      status: 'delivered',
      changed_by_user_id: user.id,
      notes: 'Order delivered to customer',
    });

  return { success: true };
}
