'use server';

import { createClient } from '@/lib/supabase/server';

export async function approveRestaurant(restaurantId: string) {
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

  // Get restaurant details
  const { data: restaurant } = await (supabase as any)
    .from('restaurants')
    .select('*, owner_id')
    .eq('id', restaurantId)
    .single();

  if (!restaurant) {
    throw new Error('Restaurant not found');
  }

  // Update restaurant approval
  const { error: updateError } = await (supabase as any)
    .from('restaurants')
    .update({ is_approved: true })
    .eq('id', restaurantId);

  if (updateError) {
    throw new Error(updateError.message || 'Failed to approve restaurant');
  }

  // Log admin action
  await (supabase as any)
    .from('admin_audit_log')
    .insert({
      admin_user_id: user.id,
      action: 'APPROVE_RESTAURANT',
      target_type: 'restaurant',
      target_id: restaurantId,
      details: `Approved restaurant: ${restaurant.name}`,
    });

  return { success: true };
}

export async function rejectRestaurant(restaurantId: string, reason?: string) {
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

  // Get restaurant details
  const { data: restaurant } = await (supabase as any)
    .from('restaurants')
    .select('*')
    .eq('id', restaurantId)
    .single();

  if (!restaurant) {
    throw new Error('Restaurant not found');
  }

  // Delete restaurant (soft delete via is_approved flag for MVP)
  const { error: deleteError } = await (supabase as any)
    .from('restaurants')
    .delete()
    .eq('id', restaurantId);

  if (deleteError) {
    throw new Error(deleteError.message || 'Failed to reject restaurant');
  }

  // Log admin action
  await (supabase as any)
    .from('admin_audit_log')
    .insert({
      admin_user_id: user.id,
      action: 'REJECT_RESTAURANT',
      target_type: 'restaurant',
      target_id: restaurantId,
      details: `Rejected restaurant: ${restaurant.name}. Reason: ${reason || 'No reason provided'}`,
    });

  return { success: true };
}

export async function suspendRestaurant(restaurantId: string) {
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

  // Get restaurant details
  const { data: restaurant } = await (supabase as any)
    .from('restaurants')
    .select('*')
    .eq('id', restaurantId)
    .single();

  if (!restaurant) {
    throw new Error('Restaurant not found');
  }

  // Suspend restaurant
  const { error: updateError } = await (supabase as any)
    .from('restaurants')
    .update({ is_available: false })
    .eq('id', restaurantId);

  if (updateError) {
    throw new Error(updateError.message || 'Failed to suspend restaurant');
  }

  // Log admin action
  await (supabase as any)
    .from('admin_audit_log')
    .insert({
      admin_user_id: user.id,
      action: 'SUSPEND_RESTAURANT',
      target_type: 'restaurant',
      target_id: restaurantId,
      details: `Suspended restaurant: ${restaurant.name}`,
    });

  return { success: true };
}

export async function activateRestaurant(restaurantId: string) {
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

  // Get restaurant details
  const { data: restaurant } = await (supabase as any)
    .from('restaurants')
    .select('*')
    .eq('id', restaurantId)
    .single();

  if (!restaurant) {
    throw new Error('Restaurant not found');
  }

  // Activate restaurant
  const { error: updateError } = await (supabase as any)
    .from('restaurants')
    .update({ is_available: true })
    .eq('id', restaurantId);

  if (updateError) {
    throw new Error(updateError.message || 'Failed to activate restaurant');
  }

  // Log admin action
  await (supabase as any)
    .from('admin_audit_log')
    .insert({
      admin_user_id: user.id,
      action: 'ACTIVATE_RESTAURANT',
      target_type: 'restaurant',
      target_id: restaurantId,
      details: `Activated restaurant: ${restaurant.name}`,
    });

  return { success: true };
}
