import Link from 'next/link';
import { Star, MapPin } from 'lucide-react';
import { Restaurant } from '@/features/restaurants/search-restaurants';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Link
      href={`/restaurants/${restaurant.id}`}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition flex flex-col group"
    >
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        <img
          src={restaurant.image_url || 'https://via.placeholder.com/400x300?text=Foodverse+Restaurant'}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />
        {!restaurant.is_available && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-600 text-white font-semibold px-3 py-1 rounded-md text-sm">
              Currently Closed
            </span>
          </div>
        )}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-semibold text-gray-800 flex items-center space-x-1 shadow-sm">
          <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
          <span>{restaurant.average_rating ? restaurant.average_rating.toFixed(1) : 'New'}</span>
          {restaurant.total_reviews > 0 && (
            <span className="text-gray-500 text-[10px]">({restaurant.total_reviews})</span>
          )}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow justify-between">
        <div>
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-bold text-gray-900 text-lg group-hover:text-red-600 transition">
              {restaurant.name}
            </h3>
            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-medium">
              {restaurant.cuisine_type}
            </span>
          </div>
          <p className="text-gray-500 text-xs line-clamp-2 mb-3">
            {restaurant.description || 'Delicious food prepared fresh for you.'}
          </p>
        </div>
        <div className="flex items-center text-xs text-gray-500 pt-3 border-t border-gray-100">
          <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400 flex-shrink-0" />
          <span className="truncate">
            {restaurant.area}, {restaurant.city}
          </span>
        </div>
      </div>
    </Link>
  );
}
