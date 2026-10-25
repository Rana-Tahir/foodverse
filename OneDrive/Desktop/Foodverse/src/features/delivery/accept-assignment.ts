'use server';

import { createClient } from '@/lib/supabase/server';

export async function acceptAssignment(orderId: string) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  // Verify user is a rider
  const { data: profile, error: profileError } = await (supabase as any)
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError || profile?.role !== 'rider') {
    throw new Error('Only riders can accept assignments');
  }

  // Check order exists and is in ready_for_pickup status
  const { data: order, error: orderError } = await (supabase as any)
    .from('orders')
    .select('id, current_status, rider_id')
    .eq('id', orderId)
    .single();

  if (orderError || !order) {
    throw new Error('Order not found');
  }

  if (order.current_status !== 'ready_for_pickup') {
    throw new Error('Order is not ready for pickup');
  }

  if (order.rider_id) {
    throw new Error('Order already assigned to a rider');
  }

  // Update order to assign rider
  const { error: updateError } = await (supabase as any)
    .from('orders')
    .update({
      rider_id: user.id,
      current_status: 'picked_up_pending',
    })
    .eq('id', orderId);

  if (updateError) {
    throw new Error(updateError.message || 'Failed to accept assignment');
  }

  // Create delivery assignment record
  const { error: assignmentError } = await (supabase as any)
    .from('delivery_assignments')
    .insert({
      order_id: orderId,
      rider_id: user.id,
      status: 'accepted',
      accepted_at: new Date().toISOString(),
    });

  if (assignmentError) {
    throw new Error(assignmentError.message || 'Failed to create assignment');
  }

  // Record status history
  await (supabase as any)
    .from('order_status_history')
    .insert({
      order_id: orderId,
      status: 'picked_up_pending',
      changed_by_user_id: user.id,
      notes: 'Delivery assignment accepted by rider',
    });

  return { success: true, orderId };
}
