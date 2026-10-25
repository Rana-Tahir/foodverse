'use client';

import { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Restaurant } from '@/features/restaurants/search-restaurants';
import { RestaurantCard } from './restaurant-card';

interface RestaurantGridProps {
  initialRestaurants: Restaurant[];
}

export function RestaurantGrid({ initialRestaurants }: RestaurantGridProps) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>(initialRestaurants);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('all');
  const [selectedArea, setSelectedArea] = useState('all');
  const [loading, setLoading] = useState(false);

  const cuisines = ['all', 'Pakistani', 'Italian', 'American', 'Chinese', 'Fast Food'];
  const areas = ['all', 'Gulshan', 'DHA', 'Clifton', 'Korangi'];

  const handleFilter = async (search: string, cuisine: string, area: string) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.set('search', search);
      if (cuisine && cuisine !== 'all') queryParams.set('cuisine', cuisine);
      if (area && area !== 'all') queryParams.set('area', area);

      const res = await fetch(`/api/restaurants/search?${queryParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setRestaurants(data);
      }
    } catch (error) {
      console.error('Filter error:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    handleFilter(val, selectedCuisine, selectedArea);
  };

  const onCuisineChange = (cuisine: string) => {
    setSelectedCuisine(cuisine);
    handleFilter(searchQuery, cuisine, selectedArea);
  };

  const onAreaChange = (area: string) => {
    setSelectedArea(area);
    handleFilter(searchQuery, selectedCuisine, area);
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="Search restaurants by name (e.g. Biryani House)..."
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-gray-100">
          <div className="flex items-center space-x-1 text-xs font-medium text-gray-500 mr-2">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          {/* Cuisine Filter */}
          <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs text-gray-400 mr-1">Cuisine:</span>
            {cuisines.map((cuisine) => (
              <button
                key={cuisine}
                onClick={() => onCuisineChange(cuisine)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                  selectedCuisine === cuisine
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cuisine.charAt(0).toUpperCase() + cuisine.slice(1)}
              </button>
            ))}
          </div>

          {/* Area Filter */}
          <div className="flex items-center space-x-1 ml-auto">
            <span className="text-xs text-gray-400 mr-1">Area:</span>
            <select
              value={selectedArea}
              onChange={(e) => onAreaChange(e.target.value)}
              className="bg-gray-50 border border-gray-200 text-gray-700 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-red-500"
            >
              {areas.map((area) => (
                <option key={area} value={area}>
                  {area === 'all' ? 'All Areas' : area}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid Results */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-xl border border-gray-200 h-72 animate-pulse p-4">
              <div className="bg-gray-200 h-40 rounded-lg mb-4"></div>
              <div className="bg-gray-200 h-5 w-3/4 rounded mb-2"></div>
              <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
            </div>
          ))}
        </div>
      ) : restaurants.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">No restaurants found</h3>
          <p className="text-gray-500 text-sm">
            Try adjusting your search query or filters to find what you are looking for.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      )}
    </div>
  );
}
