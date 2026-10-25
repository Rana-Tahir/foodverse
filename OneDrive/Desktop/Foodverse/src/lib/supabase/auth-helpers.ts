import { createClient } from '@/lib/supabase/client';

const TOKEN_REFRESH_INTERVAL = 55 * 60 * 1000; // 55 minutes (refresh before 1hr expiry)

let refreshTokenTimeout: NodeJS.Timeout | null = null;

/**
 * Starts automatic token refresh
 * Supabase auth handles this automatically, but we can add explicit refresh logic
 */
export function setupAutoTokenRefresh() {
  if (refreshTokenTimeout) {
    clearInterval(refreshTokenTimeout);
  }

  refreshTokenTimeout = setInterval(async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.refreshSession();

      if (error) {
        console.error('Token refresh failed:', error);
      } else {
        console.debug('Token refreshed successfully');
      }
    } catch (error) {
      console.error('Token refresh error:', error);
    }
  }, TOKEN_REFRESH_INTERVAL);
}

/**
 * Clears the auto token refresh interval
 */
export function clearAutoTokenRefresh() {
  if (refreshTokenTimeout) {
    clearInterval(refreshTokenTimeout);
    refreshTokenTimeout = null;
  }
}

/**
 * Manually refresh the auth session
 */
export async function refreshAuthSession() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.auth.refreshSession();

    if (error) {
      throw error;
    }

    return data.session;
  } catch (error) {
    console.error('Session refresh error:', error);
    return null;
  }
}

/**
 * Get the current session without user state change
 */
export async function getAuthSession() {
  try {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session;
  } catch (error) {
    console.error('Get session error:', error);
    return null;
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getAuthSession();
  return !!session;
}

/**
 * Sign out and clear tokens
 */
export async function signOutUser() {
  try {
    clearAutoTokenRefresh();
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Sign out error:', error);
    return false;
  }
}

/**
 * Get the current user's JWT token (if available)
 */
export async function getAuthToken(): Promise<string | null> {
  try {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session?.access_token || null;
  } catch (error) {
    console.error('Get token error:', error);
    return null;
  }
}

/**
 * Verify email (for email confirmation flows)
 */
export async function verifyOTP(
  email: string,
  token: string,
  type: 'email' | 'recovery' = 'email'
) {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type,
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('OTP verification error:', error);
    throw error;
  }
}

/**
 * Request password reset email
 */
export async function requestPasswordReset(email: string) {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Password reset request error:', error);
    throw error;
  }
}

/**
 * Update password after reset
 */
export async function updatePassword(newPassword: string) {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Password update error:', error);
    throw error;
  }
}

/**
 * Update user email
 */
export async function updateEmail(newEmail: string) {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.auth.updateUser({
      email: newEmail,
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Email update error:', error);
    throw error;
  }
}

/**
 * Get user metadata
 */
export async function getUserMetadata() {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user?.user_metadata || null;
  } catch (error) {
    console.error('Get user metadata error:', error);
    return null;
  }
}

/**
 * Update user metadata
 */
export async function updateUserMetadata(
  metadata: Record<string, unknown>
) {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.auth.updateUser({
      data: metadata,
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Update metadata error:', error);
    throw error;
  }
}
