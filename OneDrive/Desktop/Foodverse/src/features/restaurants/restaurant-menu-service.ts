'use server';

import { createClient } from '@/lib/supabase/server';

export async function getRestaurantMenuForOwner() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { restaurant: null, categories: [] };

  const { data: restaurant } = await (supabase as any)
    .from('restaurants')
    .select('*')
    .eq('owner_id', user.id)
    .single();

  if (!restaurant) return { restaurant: null, categories: [] };

  const { data: categories } = await (supabase as any)
    .from('categories')
    .select('*, menu_items(*)')
    .eq('restaurant_id', (restaurant as any).id)
    .order('display_order', { ascending: true });

  return { restaurant, categories: categories || [] };
}

export async function createCategory(restaurantId: string, name: string) {
  const supabase = createClient();
  const { error } = await (supabase as any).from('categories').insert({
    restaurant_id: restaurantId,
    name,
    display_order: 0,
  });
  if (error) throw new Error(error.message);
  return { success: true };
}

export async function createMenuItem(formData: {
  restaurant_id: string;
  category_id: string;
  name: string;
  description?: string;
  price_pkr: number;
  image_url?: string;
  is_available: boolean;
}) {
  const supabase = createClient();
  const { error } = await (supabase as any).from('menu_items').insert(formData);
  if (error) throw new Error(error.message);
  return { success: true };
}

export async function toggleItemAvailability(menuItemId: string, isAvailable: boolean) {
  const supabase = createClient();
  const { error } = await (supabase as any)
    .from('menu_items')
    .update({ is_available: isAvailable })
    .eq('id', menuItemId);
  if (error) throw new Error(error.message);
  return { success: true };
}
