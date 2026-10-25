import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  validateProfileUpdate,
  RoleEscalationError,
} from '@/lib/authorization/role-escalation';
import * as authHelpers from '@/lib/authorization/auth-helpers';

// Mock the auth helpers
vi.mock('@/lib/authorization/auth-helpers', () => ({
  getCurrentProfile: vi.fn(),
  getUserRole: vi.fn(),
  checkUserAuthenticated: vi.fn(),
  checkUserHasRole: vi.fn(),
  getCurrentUser: vi.fn(),
}));

describe('Role Self-Escalation Prevention', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('validateProfileUpdate', () => {
    it('should allow non-admin to update non-role fields', async () => {
      const mockProfile = {
        id: 'user-123',
        email: 'user@example.com',
        full_name: 'John Doe',
        phone_number: '1234567890',
        role: 'customer' as const,
        avatar_url: null,
        created_at: '2026-01-01',
        updated_at: '2026-01-01',
      };

      vi.mocked(authHelpers.getCurrentProfile).mockResolvedValue(mockProfile);

      // Should not throw
      await expect(
        validateProfileUpdate('user-123', {
          full_name: 'Jane Doe',
          phone_number: '9876543210',
        })
      ).resolves.not.toThrow();
    });

    it('should throw error when customer tries to escalate to admin', async () => {
      const mockProfile = {
        id: 'user-123',
        email: 'user@example.com',
        full_name: 'John Doe',
        phone_number: '1234567890',
        role: 'customer' as const,
        avatar_url: null,
        created_at: '2026-01-01',
        updated_at: '2026-01-01',
      };

      vi.mocked(authHelpers.getCurrentProfile).mockResolvedValue(mockProfile);

      await expect(
        validateProfileUpdate('user-123', {
          role: 'admin',
        })
      ).rejects.toThrow(RoleEscalationError);
    });

    it('should throw error when customer tries to escalate to restaurant_owner', async () => {
      const mockProfile = {
        id: 'user-123',
        email: 'user@example.com',
        full_name: 'John Doe',
        phone_number: '1234567890',
        role: 'customer' as const,
        avatar_url: null,
        created_at: '2026-01-01',
        updated_at: '2026-01-01',
      };

      vi.mocked(authHelpers.getCurrentProfile).mockResolvedValue(mockProfile);

      await expect(
        validateProfileUpdate('user-123', {
          role: 'restaurant_owner',
        })
      ).rejects.toThrow(RoleEscalationError);
    });

    it('should throw error when rider tries to escalate to admin', async () => {
      const mockProfile = {
        id: 'user-456',
        email: 'rider@example.com',
        full_name: 'Rider Bob',
        phone_number: '5555555555',
        role: 'rider' as const,
        avatar_url: null,
        created_at: '2026-01-01',
        updated_at: '2026-01-01',
      };

      vi.mocked(authHelpers.getCurrentProfile).mockResolvedValue(mockProfile);

      await expect(
        validateProfileUpdate('user-456', {
          role: 'admin',
        })
      ).rejects.toThrow(RoleEscalationError);
    });

    it('should throw error when restaurant owner tries to escalate to admin', async () => {
      const mockProfile = {
        id: 'user-789',
        email: 'owner@example.com',
        full_name: 'Restaurant Owner',
        phone_number: '1111111111',
        role: 'restaurant_owner' as const,
        avatar_url: null,
        created_at: '2026-01-01',
        updated_at: '2026-01-01',
      };

      vi.mocked(authHelpers.getCurrentProfile).mockResolvedValue(mockProfile);

      await expect(
        validateProfileUpdate('user-789', {
          role: 'admin',
        })
      ).rejects.toThrow(RoleEscalationError);
    });

    it('should not throw when no role update is attempted', async () => {
      const mockProfile = {
        id: 'user-123',
        email: 'user@example.com',
        full_name: 'John Doe',
        phone_number: '1234567890',
        role: 'customer' as const,
        avatar_url: null,
        created_at: '2026-01-01',
        updated_at: '2026-01-01',
      };

      vi.mocked(authHelpers.getCurrentProfile).mockResolvedValue(mockProfile);

      // Should not throw even though it's a non-admin
      await expect(
        validateProfileUpdate('user-123', {
          full_name: 'Jane Doe',
        })
      ).resolves.not.toThrow();
    });

    it('should throw error when profile retrieval fails', async () => {
      vi.mocked(authHelpers.getCurrentProfile).mockResolvedValue(null);

      await expect(
        validateProfileUpdate('user-123', {
          role: 'admin',
        })
      ).rejects.toThrow('Unable to verify user permissions');
    });
  });

  describe('RoleEscalationError', () => {
    it('should be an instance of Error', () => {
      const error = new RoleEscalationError();
      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe('RoleEscalationError');
    });

    it('should have custom message', () => {
      const customMessage = 'Custom escalation message';
      const error = new RoleEscalationError(customMessage);
      expect(error.message).toBe(customMessage);
    });

    it('should have default message', () => {
      const error = new RoleEscalationError();
      expect(error.message).toBe('Role escalation attempt detected');
    });
  });
});
