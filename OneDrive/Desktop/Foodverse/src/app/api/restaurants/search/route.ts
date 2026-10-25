import { NextResponse } from 'next/server';
import { searchRestaurants } from '@/features/restaurants/search-restaurants';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || undefined;
  const cuisine = searchParams.get('cuisine') || undefined;
  const area = searchParams.get('area') || undefined;

  const restaurants = await searchRestaurants({ search, cuisine, area });
  return NextResponse.json(restaurants);
}
