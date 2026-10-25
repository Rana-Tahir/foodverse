'use server';

import { createClient } from '@/lib/supabase/server';

export interface MenuItem {
  id: string;
  restaurant_id: string;
  category_id: string;
  name: string;
  description: string | null;
  price_pkr: number;
  image_url: string | null;
  is_available: boolean;
}

export interface Category {
  id: string;
  restaurant_id: string;
  name: string;
  display_order: number;
  menu_items?: MenuItem[];
}

export async function getRestaurantMenu(restaurantId: string): Promise<Category[]> {
  const supabase = createClient();

  // Fetch categories
  const { data: categoriesData, error: catError } = await (supabase as any)
    .from('categories')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .order('display_order', { ascending: true });

  if (catError || !categoriesData) {
    console.error('Error fetching categories:', catError);
    return [];
  }

  // Fetch menu items
  const { data: itemsData, error: itemsError } = await (supabase as any)
    .from('menu_items')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .order('name', { ascending: true });

  if (itemsError || !itemsData) {
    console.error('Error fetching menu items:', itemsError);
    return [];
  }

  // Group items by category
  const categories: Category[] = (categoriesData as any[]).map((cat) => ({
    id: cat.id,
    restaurant_id: cat.restaurant_id,
    name: cat.name,
    display_order: cat.display_order,
    menu_items: (itemsData as any[]).filter((item) => item.category_id === cat.id),
  }));

  return categories;
}
