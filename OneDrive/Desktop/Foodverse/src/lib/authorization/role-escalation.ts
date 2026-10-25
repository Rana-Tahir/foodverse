import { getCurrentProfile } from './auth-helpers';
import { createClient } from '@/lib/supabase/server';
import { UserRole } from './auth-helpers';

export class RoleEscalationError extends Error {
  constructor(message: string = 'Role escalation attempt detected') {
    super(message);
    this.name = 'RoleEscalationError';
  }
}

/**
 * Validates that a profile update does not attempt to change the user's own role
 * unless the requester is an admin.
 *
 * @param userId - The ID of the user being updated
 * @param updates - Object containing fields to update
 * @throws RoleEscalationError if a non-admin tries to change their own role
 */
export async function validateProfileUpdate(
  userId: string,
  updates: Partial<{
    email: string;
    full_name: string;
    phone_number: string;
    role: UserRole;
    avatar_url: string;
  }>
): Promise<void> {
  // If role is not being updated, no validation needed
  if (!updates.role) {
    return;
  }

  const currentProfile = await getCurrentProfile();

  if (!currentProfile) {
    throw new Error('Unable to verify user permissions');
  }

  // Check if user is updating their own profile
  const isOwnProfile = currentProfile.id === userId;

  // Non-admins cannot change any role (their own or others')
  if (currentProfile.role !== 'admin' && updates.role) {
    throw new RoleEscalationError(
      isOwnProfile
        ? 'You cannot modify your own role'
        : 'Only admins can modify user roles'
    );
  }

  // Admins can change roles, but we still want to log it
  // This will be handled by the database trigger
}

/**
 * Validates a profile update at the Server Action level
 * Prevents users from escalating their own roles
 */
export async function secureProfileUpdate(
  userId: string,
  updates: Partial<{
    email: string;
    full_name: string;
    phone_number: string;
    role: UserRole;
    avatar_url: string;
  }>
) {
  // Validate escalation attempt
  await validateProfileUpdate(userId, updates);

  const supabase = createClient();
  const currentProfile = await getCurrentProfile();

  if (!currentProfile) {
    throw new Error('Unauthorized: Could not verify user');
  }

  // Only allow updating own profile or other profiles if admin
  if (currentProfile.id !== userId && currentProfile.role !== 'admin') {
    throw new Error('Unauthorized: Cannot modify other user profiles');
  }

  // Remove role from updates if user is not admin
  const safeUpdates: any = { ...updates };
  if (currentProfile.role !== 'admin') {
    delete safeUpdates.role;
  }

  // Perform the update
  const { data, error } = await (supabase as any)
    .from('profiles')
    .update(safeUpdates)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Fetches role change audit log (admin only)
 */
export async function getRoleChangeAudit(limit: number = 100) {
  const currentProfile = await getCurrentProfile();

  if (!currentProfile || currentProfile.role !== 'admin') {
    throw new Error('Unauthorized: Only admins can view role audit log');
  }

  const supabase = createClient();

  const { data, error } = await (supabase as any)
    .from('role_change_audit')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Admin-only function to change a user's role with audit logging
 */
export async function adminUpdateUserRole(
  userId: string,
  newRole: UserRole,
  reason?: string
) {
  const currentProfile = await getCurrentProfile();

  if (!currentProfile || currentProfile.role !== 'admin') {
    throw new Error('Unauthorized: Only admins can change user roles');
  }

  const supabase = createClient();

  // Update the role
  const { data, error } = await (supabase as any)
    .from('profiles')
    .update({ role: newRole })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  // Audit log is automatically created by the trigger
  // But we can optionally log the reason via a separate update
  if (reason) {
    await (supabase as any)
      .from('role_change_audit')
      .update({ change_reason: reason })
      .eq('user_id', userId)
      .eq('changed_by_user_id', currentProfile.id)
      .order('created_at', { ascending: false })
      .limit(1);
  }

  return data;
}
