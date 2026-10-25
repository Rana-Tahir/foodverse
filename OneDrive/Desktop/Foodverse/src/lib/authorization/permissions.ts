import { UserRole } from './auth-helpers';

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  customer: [
    'browse_restaurants',
    'place_order',
    'view_own_orders',
    'track_delivery',
    'leave_review',
    'manage_own_addresses',
  ],
  restaurant_owner: [
    'manage_restaurant',
    'manage_menu',
    'view_restaurant_orders',
    'update_order_status',
    'view_analytics',
  ],
  rider: [
    'view_available_orders',
    'accept_delivery',
    'update_delivery_status',
    'view_delivery_earnings',
  ],
  admin: [
    'manage_users',
    'manage_restaurants',
    'view_all_orders',
    'view_platform_analytics',
    'manage_platform_settings',
    'moderate_reviews',
  ],
};

export const ROUTE_ROLE_REQUIREMENTS: Record<string, UserRole[]> = {
  '/restaurant': ['restaurant_owner'],
  '/restaurant/dashboard': ['restaurant_owner'],
  '/restaurant/menu': ['restaurant_owner'],
  '/restaurant/orders': ['restaurant_owner'],
  '/rider': ['rider'],
  '/rider/dashboard': ['rider'],
  '/rider/deliveries': ['rider'],
  '/rider/earnings': ['rider'],
  '/admin': ['admin'],
  '/admin/dashboard': ['admin'],
  '/admin/users': ['admin'],
  '/admin/restaurants': ['admin'],
  '/admin/orders': ['admin'],
  '/admin/settings': ['admin'],
};

export function checkPermission(role: UserRole, permission: string): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}

export function getRequiredRolesForRoute(pathname: string): UserRole[] {
  // Check for exact match first
  if (ROUTE_ROLE_REQUIREMENTS[pathname]) {
    return ROUTE_ROLE_REQUIREMENTS[pathname];
  }

  // Check for prefix match
  for (const [route, roles] of Object.entries(ROUTE_ROLE_REQUIREMENTS)) {
    if (pathname.startsWith(route)) {
      return roles;
    }
  }

  // Public routes
  return [];
}
