'use server';

import { createClient } from '@/lib/supabase/server';

export interface AdminRider {
  id: string;
  full_name: string;
  email: string;
  phone_number: string | null;
  vehicle_type: string | null;
  is_verified: boolean;
  is_suspended: boolean;
  rating: number;
  total_deliveries: number;
}

export async function getAllRiders() {
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

  const { data: riders } = await (supabase as any)
    .from('profiles')
    .select('*')
    .eq('role', 'rider')
    .order('created_at', { ascending: false });

  if (!riders) {
    return [];
  }

  // Enrich with delivery stats
  const enrichedRiders = await Promise.all(
    riders.map(async (rider: any) => {
      const { count: deliveryCount } = await (supabase as any)
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('rider_id', rider.id)
        .eq('current_status', 'delivered');

      return {
        id: rider.id,
        full_name: rider.full_name,
        email: rider.email,
        phone_number: rider.phone_number,
        vehicle_type: rider.vehicle_type || 'Not specified',
        is_verified: rider.is_verified || false,
        is_suspended: rider.is_suspended || false,
        rating: 4.8, // Placeholder for MVP
        total_deliveries: deliveryCount || 0,
      };
    })
  );

  return enrichedRiders;
}

export async function verifyRider(riderId: string) {
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

  const { data: rider } = await (supabase as any)
    .from('profiles')
    .select('*')
    .eq('id', riderId)
    .single();

  if (!rider || rider.role !== 'rider') {
    throw new Error('Rider not found');
  }

  const { error: updateError } = await (supabase as any)
    .from('profiles')
    .update({ is_verified: true })
    .eq('id', riderId);

  if (updateError) {
    throw new Error(updateError.message || 'Failed to verify rider');
  }

  // Log admin action
  await (supabase as any)
    .from('admin_audit_log')
    .insert({
      admin_user_id: user.id,
      action: 'VERIFY_RIDER',
      target_type: 'rider',
      target_id: riderId,
      details: `Verified rider: ${rider.full_name}`,
    });

  return { success: true };
}

export async function suspendRider(riderId: string) {
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

  const { data: rider } = await (supabase as any)
    .from('profiles')
    .select('*')
    .eq('id', riderId)
    .single();

  if (!rider || rider.role !== 'rider') {
    throw new Error('Rider not found');
  }

  const { error: updateError } = await (supabase as any)
    .from('profiles')
    .update({ is_suspended: true })
    .eq('id', riderId);

  if (updateError) {
    throw new Error(updateError.message || 'Failed to suspend rider');
  }

  // Log admin action
  await (supabase as any)
    .from('admin_audit_log')
    .insert({
      admin_user_id: user.id,
      action: 'SUSPEND_RIDER',
      target_type: 'rider',
      target_id: riderId,
      details: `Suspended rider: ${rider.full_name}`,
    });

  return { success: true };
}

export async function activateRider(riderId: string) {
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

  const { data: rider } = await (supabase as any)
    .from('profiles')
    .select('*')
    .eq('id', riderId)
    .single();

  if (!rider || rider.role !== 'rider') {
    throw new Error('Rider not found');
  }

  const { error: updateError } = await (supabase as any)
    .from('profiles')
    .update({ is_suspended: false })
    .eq('id', riderId);

  if (updateError) {
    throw new Error(updateError.message || 'Failed to activate rider');
  }

  // Log admin action
  await (supabase as any)
    .from('admin_audit_log')
    .insert({
      admin_user_id: user.id,
      action: 'ACTIVATE_RIDER',
      target_type: 'rider',
      target_id: riderId,
      details: `Activated rider: ${rider.full_name}`,
    });

  return { success: true };
}
