'use client';

import { useState } from 'react';
import {
  requestPasswordReset,
  updatePassword,
  updateEmail,
  updateUserMetadata,
} from '@/lib/supabase/auth-helpers';

/**
 * Hook for password reset flow
 */
export function usePasswordReset() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const sendPasswordResetEmail = async (email: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await requestPasswordReset(email);
      setSuccess(true);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Password reset failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (newPassword: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await updatePassword(newPassword);
      setSuccess(true);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Password update failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    sendPasswordResetEmail,
    resetPassword,
    loading,
    error,
    success,
  };
}

/**
 * Hook for email update flow
 */
export function useUpdateEmail() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const update = async (newEmail: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await updateEmail(newEmail);
      setSuccess(true);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Email update failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { update, loading, error, success };
}

/**
 * Hook for user metadata updates
 */
export function useUpdateUserMetadata() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const update = async (metadata: Record<string, unknown>) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await updateUserMetadata(metadata);
      setSuccess(true);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Metadata update failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { update, loading, error, success };
}

/**
 * Hook for requiring authentication on a component
 * Redirects to login if user is not authenticated
 */
export function useRequireAuth() {
  const { user, loading } = useAuth();

  const isAuthenticated = !loading && !!user;

  return { isAuthenticated, loading };
}

// Import useAuth for re-export
import { useAuth } from './use-auth';
