'use server';

import { createClient } from '@/lib/supabase/server';

export interface DashboardMetrics {
  totalCustomers: number;
  activeRestaurants: number;
  activeRiders: number;
  totalOrdersToday: number;
  totalRevenueToday: number;
  pendingRestaurants: number;
  averageOrderValue: number;
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
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

  // Get total customers
  const { count: customerCount } = await (supabase as any)
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'customer');

  // Get active restaurants (approved and available)
  const { count: restaurantCount } = await (supabase as any)
    .from('restaurants')
    .select('*', { count: 'exact', head: true })
    .eq('is_approved', true)
    .eq('is_available', true);

  // Get active riders
  const { count: riderCount } = await (supabase as any)
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'rider');

  // Get pending restaurants
  const { count: pendingCount } = await (supabase as any)
    .from('restaurants')
    .select('*', { count: 'exact', head: true })
    .eq('is_approved', false);

  // Get today's orders and revenue
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayISO = today.toISOString();

  const { data: todaysOrders } = await (supabase as any)
    .from('orders')
    .select('total_amount_pkr')
    .gte('created_at', todayISO);

  const totalOrdersToday = todaysOrders?.length || 0;
  const totalRevenueToday = todaysOrders?.reduce((sum: number, order: any) => sum + order.total_amount_pkr, 0) || 0;
  const averageOrderValue = totalOrdersToday > 0 ? Math.round(totalRevenueToday / totalOrdersToday) : 0;

  return {
    totalCustomers: customerCount || 0,
    activeRestaurants: restaurantCount || 0,
    activeRiders: riderCount || 0,
    totalOrdersToday,
    totalRevenueToday,
    pendingRestaurants: pendingCount || 0,
    averageOrderValue,
  };
}
