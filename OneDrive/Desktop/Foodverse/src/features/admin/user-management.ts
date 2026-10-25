'use server';

import { createClient } from '@/lib/supabase/server';

export async function suspendUser(userId: string) {
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

  // Get user details
  const { data: targetUser } = await (supabase as any)
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (!targetUser) {
    throw new Error('User not found');
  }

  // Prevent self-suspension
  if (userId === user.id) {
    throw new Error('Cannot suspend yourself');
  }

  // Suspend user (set is_suspended flag)
  const { error: updateError } = await (supabase as any)
    .from('profiles')
    .update({ is_suspended: true })
    .eq('id', userId);

  if (updateError) {
    throw new Error(updateError.message || 'Failed to suspend user');
  }

  // Log admin action
  await (supabase as any)
    .from('admin_audit_log')
    .insert({
      admin_user_id: user.id,
      action: 'SUSPEND_USER',
      target_type: 'user',
      target_id: userId,
      details: `Suspended user: ${targetUser.full_name} (${targetUser.email})`,
    });

  return { success: true };
}

export async function activateUser(userId: string) {
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

  // Get user details
  const { data: targetUser } = await (supabase as any)
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (!targetUser) {
    throw new Error('User not found');
  }

  // Activate user
  const { error: updateError } = await (supabase as any)
    .from('profiles')
    .update({ is_suspended: false })
    .eq('id', userId);

  if (updateError) {
    throw new Error(updateError.message || 'Failed to activate user');
  }

  // Log admin action
  await (supabase as any)
    .from('admin_audit_log')
    .insert({
      admin_user_id: user.id,
      action: 'ACTIVATE_USER',
      target_type: 'user',
      target_id: userId,
      details: `Activated user: ${targetUser.full_name} (${targetUser.email})`,
    });

  return { success: true };
}

export async function getAllUsers() {
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

  // Get all users
  const { data: users } = await (supabase as any)
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  return users || [];
}
