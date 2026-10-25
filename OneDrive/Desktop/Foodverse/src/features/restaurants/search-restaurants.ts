'use server';

import { createClient } from '@/lib/supabase/server';

export interface Restaurant {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  cuisine_type: string;
  phone_number: string | null;
  street_address: string | null;
  area: string | null;
  city: string | null;
  is_approved: boolean;
  is_available: boolean;
  average_rating: number;
  total_reviews: number;
}

export interface SearchRestaurantsParams {
  search?: string;
  cuisine?: string;
  area?: string;
  skip?: number;
  limit?: number;
}

export async function searchRestaurants(params: SearchRestaurantsParams = {}): Promise<Restaurant[]> {
  const { search, cuisine, area, skip = 0, limit = 20 } = params;
  const supabase = createClient();

  let query = supabase
    .from('restaurants')
    .select('*')
    .eq('is_approved', true)
    .range(skip, skip + limit - 1);

  if (search) {
    query = query.ilike('name', `%${search}%`);
  }

  if (cuisine && cuisine !== 'all') {
    query = query.eq('cuisine_type', cuisine);
  }

  if (area && area !== 'all') {
    query = query.eq('area', area);
  }

  const { data, error } = await query.order('average_rating', { ascending: false });

  if (error) {
    console.error('Error searching restaurants:', error);
    return [];
  }

  return data as Restaurant[];
}

export async function getRestaurantById(id: string): Promise<Restaurant | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .eq('id', id)
    .eq('is_approved', true)
    .single();

  if (error || !data) {
    return null;
  }

  return data as Restaurant;
}
