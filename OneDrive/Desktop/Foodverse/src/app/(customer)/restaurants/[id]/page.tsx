import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Star, MapPin, Phone, Clock } from 'lucide-react';
import { getRestaurantById } from '@/features/restaurants/search-restaurants';
import { getRestaurantMenu, MenuItem } from '@/features/restaurants/get-menu';

interface RestaurantDetailPageProps {
  params: {
    id: string;
  };
}

export default async function RestaurantDetailPage({ params }: RestaurantDetailPageProps) {
  const restaurant = await getRestaurantById(params.id);

  if (!restaurant) {
    notFound();
  }

  const categories = await getRestaurantMenu(params.id);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header / Navbar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-red-600"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back to Restaurants
            </Link>
          </div>
          <Link href="/" className="text-xl font-bold text-red-600">
            Foodverse
          </Link>
        </div>
      </header>

      {/* Restaurant Hero Banner */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-8">
            <div className="w-full md:w-72 h-48 bg-gray-100 rounded-xl overflow-hidden mb-4 md:mb-0 flex-shrink-0 shadow-sm">
              <img
                src={restaurant.image_url || 'https://via.placeholder.com/400x300?text=Restaurant'}
                alt={restaurant.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-grow space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-extrabold text-gray-900">{restaurant.name}</h1>
                <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                  {restaurant.cuisine_type}
                </span>
                {!restaurant.is_available && (
                  <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                    Closed
                  </span>
                )}
              </div>
              <p className="text-gray-600 text-sm max-w-2xl">
                {restaurant.description || 'Authentic food prepared fresh upon ordering.'}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pt-2">
                <div className="flex items-center text-amber-600 font-semibold bg-amber-50 px-2.5 py-1 rounded-md">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400 mr-1" />
                  <span>{restaurant.average_rating ? restaurant.average_rating.toFixed(1) : 'New'}</span>
                  <span className="text-gray-400 ml-1">({restaurant.total_reviews} reviews)</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                  <span>{restaurant.street_address}, {restaurant.area}, {restaurant.city}</span>
                </div>
                {restaurant.phone_number && (
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-1 text-gray-400" />
                    <span>{restaurant.phone_number}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Menu Section */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories Sidebar / Navigation */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white p-4 rounded-xl border border-gray-200 sticky top-24 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">Menu Categories</h3>
              <ul className="space-y-1">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <a
                      href={`#category-${cat.id}`}
                      className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 font-medium transition"
                    >
                      {cat.name} ({cat.menu_items?.length || 0})
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Menu Items Content */}
          <div className="lg:col-span-3 space-y-8">
            {categories.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">No Menu Available</h3>
                <p className="text-gray-500 text-sm">This restaurant has not added any menu items yet.</p>
              </div>
            ) : (
              categories.map((category) => (
                <div key={category.id} id={`category-${category.id}`} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                    {category.name}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {category.menu_items?.map((item: MenuItem) => (
                      <div
                        key={item.id}
                        className={`bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex flex-col justify-between ${
                          !item.is_available ? 'opacity-75 bg-gray-50' : ''
                        }`}
                      >
                        <div className="flex space-x-4">
                          <div className="flex-grow">
                            <h3 className="font-bold text-gray-900 text-base mb-1">{item.name}</h3>
                            <p className="text-gray-500 text-xs line-clamp-2 mb-3">
                              {item.description || 'Prepared fresh with premium ingredients.'}
                            </p>
                            <span className="font-bold text-red-600 text-sm">
                              Rs. {item.price_pkr.toLocaleString()}
                            </span>
                          </div>
                          {item.image_url && (
                            <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src={item.image_url}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                        </div>
                        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                          {item.is_available ? (
                            <button className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-lg text-xs transition shadow-sm">
                              Add to Cart
                            </button>
                          ) : (
                            <span className="w-full text-center bg-gray-200 text-gray-600 font-semibold py-2 rounded-lg text-xs cursor-not-allowed">
                              Sold Out
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} Foodverse Pakistan. All rights reserved.</p>
      </footer>
    </div>
  );
}
