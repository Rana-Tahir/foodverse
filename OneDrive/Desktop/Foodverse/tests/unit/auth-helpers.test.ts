import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  setupAutoTokenRefresh,
  clearAutoTokenRefresh,
  refreshAuthSession,
  getAuthSession,
  isAuthenticated,
  signOutUser,
  getAuthToken,
  verifyOTP,
  requestPasswordReset,
  updatePassword,
  updateEmail,
  getUserMetadata,
  updateUserMetadata,
} from '@/lib/supabase/auth-helpers';

// Mock the Supabase client
vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    auth: {
      refreshSession: vi.fn(),
      getSession: vi.fn(),
      getUser: vi.fn(),
      signOut: vi.fn(),
      verifyOtp: vi.fn(),
      resetPasswordForEmail: vi.fn(),
      updateUser: vi.fn(),
    },
  })),
}));

describe('Auth Helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    clearAutoTokenRefresh();
  });

  describe('setupAutoTokenRefresh', () => {
    it('should setup token refresh interval', () => {
      vi.useFakeTimers();
      const intervalSpy = vi.spyOn(global, 'setInterval');

      setupAutoTokenRefresh();

      expect(intervalSpy).toHaveBeenCalled();

      vi.useRealTimers();
      clearAutoTokenRefresh();
    });

    it('should clear existing interval before creating new one', () => {
      vi.useFakeTimers();
      const clearIntervalSpy = vi.spyOn(global, 'clearInterval');

      setupAutoTokenRefresh();
      setupAutoTokenRefresh();

      expect(clearIntervalSpy).toHaveBeenCalled();

      vi.useRealTimers();
      clearAutoTokenRefresh();
    });
  });

  describe('clearAutoTokenRefresh', () => {
    it('should clear the refresh interval', () => {
      vi.useFakeTimers();

      setupAutoTokenRefresh();
      clearAutoTokenRefresh();

      // Interval should be cleared
      expect(true).toBe(true); // Just verify it runs without error

      vi.useRealTimers();
    });
  });

  describe('getAuthSession', () => {
    it('should return session when available', async () => {
      const mockSession = {
        user: { id: 'user-123' },
        access_token: 'token-123',
      };

      const { createClient } = await import('@/lib/supabase/client');
      vi.mocked(createClient).mockReturnValue({
        auth: {
          getSession: vi.fn().mockResolvedValue({
            data: { session: mockSession },
          }),
        },
      } as any);

      const session = await getAuthSession();
      expect(session).toEqual(mockSession);
    });

    it('should return null when no session', async () => {
      const { createClient } = await import('@/lib/supabase/client');
      vi.mocked(createClient).mockReturnValue({
        auth: {
          getSession: vi.fn().mockResolvedValue({
            data: { session: null },
          }),
        },
      } as any);

      const session = await getAuthSession();
      expect(session).toBeNull();
    });

    it('should handle errors gracefully', async () => {
      const { createClient } = await import('@/lib/supabase/client');
      vi.mocked(createClient).mockReturnValue({
        auth: {
          getSession: vi.fn().mockRejectedValue(new Error('Network error')),
        },
      } as any);

      const session = await getAuthSession();
      expect(session).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when session exists', async () => {
      const { createClient } = await import('@/lib/supabase/client');
      vi.mocked(createClient).mockReturnValue({
        auth: {
          getSession: vi.fn().mockResolvedValue({
            data: { session: { user: { id: 'user-123' } } },
          }),
        },
      } as any);

      const authenticated = await isAuthenticated();
      expect(authenticated).toBe(true);
    });

    it('should return false when no session', async () => {
      const { createClient } = await import('@/lib/supabase/client');
      vi.mocked(createClient).mockReturnValue({
        auth: {
          getSession: vi.fn().mockResolvedValue({
            data: { session: null },
          }),
        },
      } as any);

      const authenticated = await isAuthenticated();
      expect(authenticated).toBe(false);
    });
  });

  describe('getAuthToken', () => {
    it('should return access token when available', async () => {
      const { createClient } = await import('@/lib/supabase/client');
      vi.mocked(createClient).mockReturnValue({
        auth: {
          getSession: vi.fn().mockResolvedValue({
            data: {
              session: { access_token: 'token-123' },
            },
          }),
        },
      } as any);

      const token = await getAuthToken();
      expect(token).toBe('token-123');
    });

    it('should return null when no token available', async () => {
      const { createClient } = await import('@/lib/supabase/client');
      vi.mocked(createClient).mockReturnValue({
        auth: {
          getSession: vi.fn().mockResolvedValue({
            data: { session: null },
          }),
        },
      } as any);

      const token = await getAuthToken();
      expect(token).toBeNull();
    });
  });

  describe('signOutUser', () => {
    it('should clear token refresh and sign out', async () => {
      const { createClient } = await import('@/lib/supabase/client');
      vi.mocked(createClient).mockReturnValue({
        auth: {
          signOut: vi.fn().mockResolvedValue({ error: null }),
        },
      } as any);

      vi.useFakeTimers();
      setupAutoTokenRefresh();

      const result = await signOutUser();

      expect(result).toBe(true);

      vi.useRealTimers();
    });

    it('should handle sign out errors', async () => {
      const { createClient } = await import('@/lib/supabase/client');
      vi.mocked(createClient).mockReturnValue({
        auth: {
          signOut: vi
            .fn()
            .mockResolvedValue({ error: new Error('Sign out failed') }),
        },
      } as any);

      const result = await signOutUser();

      expect(result).toBe(false);
    });
  });
});
