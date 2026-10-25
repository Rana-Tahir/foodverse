import { searchRestaurants } from '@/features/restaurants/search-restaurants';
import { RestaurantGrid } from '@/components/restaurants/restaurant-grid';

export default async function CustomerHomePage() {
  const restaurants = await searchRestaurants();

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Featured Restaurants</h1>
          <p className="text-sm text-gray-500">Discover top-rated food spots delivering near you</p>
        </div>
      </div>

      <RestaurantGrid initialRestaurants={restaurants} />
    </div>
  );
}
