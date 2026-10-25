-- supabase/seed.sql
-- Seed data for Foodverse development and testing
-- This file contains sample users, restaurants, menus, and test data

-- Note: In production, use Supabase Auth API to create users
-- For local development, this seed data can be inserted directly

-- ============================================================================
-- TEST USERS (via direct profile insertion for development)
-- ============================================================================

-- Customer 1: Ali Khan
INSERT INTO profiles (id, email, full_name, phone_number, role, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'ali.khan@example.com',
  'Ali Khan',
  '03001234567',
  'customer',
  NOW(),
  NOW()
) ON CONFLICT DO NOTHING;

-- Customer 2: Fatima Ahmed
INSERT INTO profiles (id, email, full_name, phone_number, role, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000002',
  'fatima.ahmed@example.com',
  'Fatima Ahmed',
  '03009876543',
  'customer',
  NOW(),
  NOW()
) ON CONFLICT DO NOTHING;

-- Customer 3: Hassan Malik
INSERT INTO profiles (id, email, full_name, phone_number, role, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000003',
  'hassan.malik@example.com',
  'Hassan Malik',
  '03005555555',
  'customer',
  NOW(),
  NOW()
) ON CONFLICT DO NOTHING;

-- Restaurant Owner 1: Ahmed Raza
INSERT INTO profiles (id, email, full_name, phone_number, role, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000101',
  'ahmed.raza@example.com',
  'Ahmed Raza',
  '03001111111',
  'restaurant_owner',
  NOW(),
  NOW()
) ON CONFLICT DO NOTHING;

-- Restaurant Owner 2: Zainab Khan
INSERT INTO profiles (id, email, full_name, phone_number, role, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000102',
  'zainab.khan@example.com',
  'Zainab Khan',
  '03002222222',
  'restaurant_owner',
  NOW(),
  NOW()
) ON CONFLICT DO NOTHING;

-- Delivery Rider 1: Muhammad Saleem
INSERT INTO profiles (id, email, full_name, phone_number, role, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000201',
  'saleem.rider@example.com',
  'Muhammad Saleem',
  '03003333333',
  'rider',
  NOW(),
  NOW()
) ON CONFLICT DO NOTHING;

-- Delivery Rider 2: Bilal Hussain
INSERT INTO profiles (id, email, full_name, phone_number, role, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000202',
  'bilal.rider@example.com',
  'Bilal Hussain',
  '03004444444',
  'rider',
  NOW(),
  NOW()
) ON CONFLICT DO NOTHING;

-- Admin User
INSERT INTO profiles (id, email, full_name, phone_number, role, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000301',
  'admin@foodverse.com',
  'Admin User',
  '03000000000',
  'admin',
  NOW(),
  NOW()
) ON CONFLICT DO NOTHING;

-- ============================================================================
-- TEST CUSTOMER ADDRESSES
-- ============================================================================

INSERT INTO addresses (id, user_id, street_address, area, city, postal_code, latitude, longitude, label, is_default)
VALUES
  (
    '10000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'House 123, Street 5',
    'Gulshan',
    'Karachi',
    '75300',
    24.8241,
    67.0370,
    'Home',
    true
  ),
  (
    '10000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'Office 456, Business Plaza',
    'DHA',
    'Karachi',
    '75500',
    24.7914,
    67.0437,
    'Office',
    false
  ),
  (
    '10000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000002',
    'Apartment 789, Twin Towers',
    'Clifton',
    'Karachi',
    '75600',
    24.7645,
    67.0307,
    'Home',
    true
  ),
  (
    '10000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000003',
    'House 321, North Street',
    'Korangi',
    'Karachi',
    '75150',
    24.8447,
    67.1247,
    'Home',
    true
  )
ON CONFLICT DO NOTHING;

-- ============================================================================
-- RESTAURANTS
-- ============================================================================

-- Restaurant 1: Biryani House
INSERT INTO restaurants (
  id, owner_id, name, description, image_url, cuisine_type, phone_number,
  street_address, area, city, latitude, longitude, is_approved, is_available,
  average_rating, total_reviews, created_at, updated_at
)
VALUES (
  '20000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000101',
  'Biryani House',
  'Authentic Pakistani biryani and traditional dishes',
  'https://via.placeholder.com/400x300?text=Biryani+House',
  'Pakistani',
  '02135123456',
  'Shop 12, Food Court',
  'Gulshan',
  'Karachi',
  24.8241,
  67.0370,
  true,
  true,
  4.5,
  42,
  NOW(),
  NOW()
) ON CONFLICT DO NOTHING;

-- Restaurant 2: Pizza Palace
INSERT INTO restaurants (
  id, owner_id, name, description, image_url, cuisine_type, phone_number,
  street_address, area, city, latitude, longitude, is_approved, is_available,
  average_rating, total_reviews, created_at, updated_at
)
VALUES (
  '20000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000101',
  'Pizza Palace',
  'Italian pizzas, pastas, and continental cuisine',
  'https://via.placeholder.com/400x300?text=Pizza+Palace',
  'Italian',
  '02135654321',
  'Block 5, Phase 2',
  'DHA',
  'Karachi',
  24.7914,
  67.0437,
  true,
  true,
  4.2,
  28,
  NOW(),
  NOW()
) ON CONFLICT DO NOTHING;

-- Restaurant 3: Burger King
INSERT INTO restaurants (
  id, owner_id, name, description, image_url, cuisine_type, phone_number,
  street_address, area, city, latitude, longitude, is_approved, is_available,
  average_rating, total_reviews, created_at, updated_at
)
VALUES (
  '20000000-0000-0000-0000-000000000003',
  '00000000-0000-0000-0000-000000000102',
  'Burger King',
  'Gourmet burgers, fries, and fast food favorites',
  'https://via.placeholder.com/400x300?text=Burger+King',
  'American',
  '02135999999',
  'Marina Complex',
  'Clifton',
  'Karachi',
  24.7645,
  67.0307,
  true,
  true,
  4.7,
  35,
  NOW(),
  NOW()
) ON CONFLICT DO NOTHING;

-- ============================================================================
-- MENU CATEGORIES
-- ============================================================================

-- Biryani House Categories
INSERT INTO categories (id, restaurant_id, name, display_order)
VALUES
  ('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'Biryani', 1),
  ('30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', 'Karahi', 2),
  ('30000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000001', 'Drinks', 3)
ON CONFLICT DO NOTHING;

-- Pizza Palace Categories
INSERT INTO categories (id, restaurant_id, name, display_order)
VALUES
  ('30000000-0000-0000-0000-000000000011', '20000000-0000-0000-0000-000000000002', 'Pizza', 1),
  ('30000000-0000-0000-0000-000000000012', '20000000-0000-0000-0000-000000000002', 'Pasta', 2),
  ('30000000-0000-0000-0000-000000000013', '20000000-0000-0000-0000-000000000002', 'Desserts', 3)
ON CONFLICT DO NOTHING;

-- Burger King Categories
INSERT INTO categories (id, restaurant_id, name, display_order)
VALUES
  ('30000000-0000-0000-0000-000000000021', '20000000-0000-0000-0000-000000000003', 'Burgers', 1),
  ('30000000-0000-0000-0000-000000000022', '20000000-0000-0000-0000-000000000003', 'Sides', 2),
  ('30000000-0000-0000-0000-000000000023', '20000000-0000-0000-0000-000000000003', 'Beverages', 3)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- MENU ITEMS - Biryani House
-- ============================================================================

INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price_pkr, image_url, is_available)
VALUES
  ('40000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'Chicken Biryani', 'Fragrant rice with tender chicken pieces', 450, 'https://via.placeholder.com/300x200?text=Chicken+Biryani', true),
  ('40000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'Mutton Biryani', 'Premium biryani with tender mutton', 550, 'https://via.placeholder.com/300x200?text=Mutton+Biryani', true),
  ('40000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'Fish Biryani', 'Aromatic rice with fresh fish', 500, 'https://via.placeholder.com/300x200?text=Fish+Biryani', true),
  ('40000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000002', 'Chicken Karahi', 'Succulent chicken cooked in traditional karahi', 400, 'https://via.placeholder.com/300x200?text=Chicken+Karahi', true),
  ('40000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000002', 'Mutton Karahi', 'Tender mutton in aromatic karahi gravy', 480, 'https://via.placeholder.com/300x200?text=Mutton+Karahi', true),
  ('40000000-0000-0000-0000-000000000006', '20000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000003', 'Mango Lassi', 'Refreshing yogurt drink with mango pulp', 120, 'https://via.placeholder.com/300x200?text=Mango+Lassi', true),
  ('40000000-0000-0000-0000-000000000007', '20000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000003', 'Complimentary Kheer', 'Sweet rice pudding dessert', 100, 'https://via.placeholder.com/300x200?text=Kheer', true)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- MENU ITEMS - Pizza Palace
-- ============================================================================

INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price_pkr, image_url, is_available)
VALUES
  ('40000000-0000-0000-0000-000000000011', '20000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000011', 'Margherita Pizza', 'Classic pizza with fresh mozzarella and basil', 750, 'https://via.placeholder.com/300x200?text=Margherita+Pizza', true),
  ('40000000-0000-0000-0000-000000000012', '20000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000011', 'Pepperoni Pizza', 'Pizza topped with pepperoni and cheese', 850, 'https://via.placeholder.com/300x200?text=Pepperoni+Pizza', true),
  ('40000000-0000-0000-0000-000000000013', '20000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000011', 'Veggie Supreme Pizza', 'Mixed vegetables with mozzarella', 800, 'https://via.placeholder.com/300x200?text=Veggie+Pizza', true),
  ('40000000-0000-0000-0000-000000000014', '20000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000012', 'Fettuccini Alfredo', 'Creamy alfredo pasta with garlic bread', 550, 'https://via.placeholder.com/300x200?text=Fettuccini+Alfredo', true),
  ('40000000-0000-0000-0000-000000000015', '20000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000012', 'Spaghetti Carbonara', 'Italian spaghetti with bacon and cream sauce', 600, 'https://via.placeholder.com/300x200?text=Carbonara', true),
  ('40000000-0000-0000-0000-000000000016', '20000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000013', 'Tiramisu', 'Classic Italian dessert', 350, 'https://via.placeholder.com/300x200?text=Tiramisu', true),
  ('40000000-0000-0000-0000-000000000017', '20000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000013', 'Chocolate Cake', 'Rich chocolate cake slice', 300, 'https://via.placeholder.com/300x200?text=Chocolate+Cake', true)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- MENU ITEMS - Burger King
-- ============================================================================

INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price_pkr, image_url, is_available)
VALUES
  ('40000000-0000-0000-0000-000000000021', '20000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000021', 'Classic Burger', 'Beef patty with lettuce, tomato, and sauce', 350, 'https://via.placeholder.com/300x200?text=Classic+Burger', true),
  ('40000000-0000-0000-0000-000000000022', '20000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000021', 'Double Cheese Burger', 'Double beef patties with extra cheese', 450, 'https://via.placeholder.com/300x200?text=Double+Cheese+Burger', true),
  ('40000000-0000-0000-0000-000000000023', '20000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000021', 'Crispy Chicken Burger', 'Crispy fried chicken breast burger', 400, 'https://via.placeholder.com/300x200?text=Chicken+Burger', true),
  ('40000000-0000-0000-0000-000000000024', '20000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000022', 'French Fries', 'Golden crispy fries', 180, 'https://via.placeholder.com/300x200?text=French+Fries', true),
  ('40000000-0000-0000-0000-000000000025', '20000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000022', 'Onion Rings', 'Crispy fried onion rings', 200, 'https://via.placeholder.com/300x200?text=Onion+Rings', true),
  ('40000000-0000-0000-0000-000000000026', '20000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000023', 'Coca Cola (330ml)', 'Cold Coca Cola', 80, 'https://via.placeholder.com/300x200?text=Cola', true),
  ('40000000-0000-0000-0000-000000000027', '20000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000023', 'Lemonade (330ml)', 'Fresh lemonade', 90, 'https://via.placeholder.com/300x200?text=Lemonade', true)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- RIDER PROFILES
-- ============================================================================

INSERT INTO rider_profiles (id, user_id, license_number, vehicle_type, is_available, is_verified, average_rating, total_deliveries, total_earnings_pkr)
VALUES
  ('50000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000201', 'DL-2024-001', 'motorcycle', true, true, 4.8, 145, 35000),
  ('50000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000202', 'DL-2024-002', 'motorcycle', true, true, 4.6, 98, 23500)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- PLATFORM SETTINGS
-- ============================================================================

UPDATE platform_settings
SET
  delivery_fee_base_pkr = 150.00,
  delivery_fee_per_km = 10.00,
  min_order_value_pkr = 500.00,
  commission_percentage = 15.00,
  support_email = 'support@foodverse.com',
  support_phone = '03000000000',
  updated_at = NOW()
WHERE id IS NOT NULL;

-- ============================================================================
-- SUPPORT FAQS
-- ============================================================================

INSERT INTO support_faqs (id, question, answer, intent, keywords, priority, is_active)
VALUES
  (
    '60000000-0000-0000-0000-000000000001',
    'How much is the delivery fee?',
    'The standard delivery fee in Karachi is PKR 150. Additional charges may apply for orders from distant areas.',
    'delivery_fee',
    ARRAY['delivery', 'fee', 'cost', 'charge'],
    1,
    true
  ),
  (
    '60000000-0000-0000-0000-000000000002',
    'What payment methods do you accept?',
    'Currently, we accept cash on delivery (COD) for all orders.',
    'payment_help',
    ARRAY['payment', 'method', 'accept', 'card', 'cash'],
    2,
    true
  ),
  (
    '60000000-0000-0000-0000-000000000003',
    'How do I track my order?',
    'You can track your order in real-time through the app. Once the order is confirmed, you will see the rider location and estimated delivery time.',
    'order_status',
    ARRAY['track', 'order', 'status', 'delivery', 'location'],
    3,
    true
  ),
  (
    '60000000-0000-0000-0000-000000000004',
    'Can I cancel my order?',
    'You can cancel your order before the restaurant starts preparing it. Once preparation has begun, cancellation is not possible.',
    'cancellation',
    ARRAY['cancel', 'refund', 'change', 'modify'],
    2,
    true
  ),
  (
    '60000000-0000-0000-0000-000000000005',
    'What restaurants are available?',
    'You can browse all available restaurants in your area through the Foodverse app. Filter by cuisine type to find what you like.',
    'restaurant_search',
    ARRAY['restaurant', 'browse', 'available', 'find', 'search'],
    1,
    true
  ),
  (
    '60000000-0000-0000-0000-000000000006',
    'How do I contact support?',
    'You can reach our support team at support@foodverse.com or call us at 0300-0000000. We are available 24/7.',
    'general_faq',
    ARRAY['support', 'help', 'contact', 'customer', 'service'],
    0,
    true
  )
ON CONFLICT DO NOTHING;

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================
-- Seed data successfully inserted!
-- Test credentials for manual testing:
--   Customer: ali.khan@example.com
--   Owner: ahmed.raza@example.com
--   Rider: saleem.rider@example.com
--   Admin: admin@foodverse.com
