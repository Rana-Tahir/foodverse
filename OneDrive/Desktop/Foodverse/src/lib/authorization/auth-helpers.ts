import { createClient } from '@/lib/supabase/server';

export type UserRole = 'customer' | 'restaurant_owner' | 'rider' | 'admin';

export async function getUserRole(): Promise<UserRole | null> {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (error || !profile) return null;

    return (profile as { role: UserRole }).role;
  } catch (error) {
    console.error('Error getting user role:', error);
    return null;
  }
}

export async function checkUserAuthenticated(): Promise<boolean> {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return !!user;
  } catch (error) {
    return false;
  }
}

export async function checkUserHasRole(
  requiredRoles: UserRole[]
): Promise<boolean> {
  const userRole = await getUserRole();
  return userRole ? requiredRoles.includes(userRole) : false;
}

export async function getCurrentUser() {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    return null;
  }
}

export async function getCurrentProfile() {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error || !profile) return null;

    return profile as {
      id: string;
      email: string;
      full_name: string;
      phone_number: string | null;
      role: UserRole;
      avatar_url: string | null;
      created_at: string;
      updated_at: string;
    };
  } catch (error) {
    return null;
  }
}
