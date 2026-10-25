-- 009_rls_policies.sql
-- Row Level Security policies for all tables

-- ============================================================================
-- PROFILES TABLE POLICIES
-- ============================================================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (id = auth.uid());

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (id = auth.uid());

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- ============================================================================
-- ADDRESSES TABLE POLICIES
-- ============================================================================

-- Customers can view their own addresses
CREATE POLICY "Customers can view own addresses" ON addresses
  FOR SELECT USING (user_id = auth.uid());

-- Customers can insert their own addresses
CREATE POLICY "Customers can insert own addresses" ON addresses
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Customers can update their own addresses
CREATE POLICY "Customers can update own addresses" ON addresses
  FOR UPDATE USING (user_id = auth.uid());

-- Customers can delete their own addresses
CREATE POLICY "Customers can delete own addresses" ON addresses
  FOR DELETE USING (user_id = auth.uid());

-- ============================================================================
-- RESTAURANTS TABLE POLICIES
-- ============================================================================

-- Customers can view approved restaurants
CREATE POLICY "Customers can view approved restaurants" ON restaurants
  FOR SELECT USING (is_approved = TRUE);

-- Restaurant owners can view their own restaurant
CREATE POLICY "Owners can view own restaurant" ON restaurants
  FOR SELECT USING (owner_id = auth.uid());

-- Restaurant owners can update their own restaurant
CREATE POLICY "Owners can update own restaurant" ON restaurants
  FOR UPDATE USING (owner_id = auth.uid());

-- Restaurant owners can insert restaurants
CREATE POLICY "Owners can create restaurants" ON restaurants
  FOR INSERT WITH CHECK (owner_id = auth.uid());

-- Admins can view all restaurants
CREATE POLICY "Admins can view all restaurants" ON restaurants
  FOR SELECT USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- ============================================================================
-- RIDER PROFILES TABLE POLICIES
-- ============================================================================

-- Riders can view their own profile
CREATE POLICY "Riders can view own profile" ON rider_profiles
  FOR SELECT USING (user_id = auth.uid());

-- Riders can update their own profile
CREATE POLICY "Riders can update own profile" ON rider_profiles
  FOR UPDATE USING (user_id = auth.uid());

-- ============================================================================
-- CATEGORIES TABLE POLICIES
-- ============================================================================

-- Customers can view categories for approved restaurants
CREATE POLICY "Customers can view categories" ON categories
  FOR SELECT USING (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE is_approved = TRUE
    )
  );

-- Restaurant owners can manage their own categories
CREATE POLICY "Owners can manage own categories" ON categories
  FOR ALL USING (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE owner_id = auth.uid()
    )
  );

-- ============================================================================
-- MENU ITEMS TABLE POLICIES
-- ============================================================================

-- Customers can view available menu items from approved restaurants
CREATE POLICY "Customers can view menu items" ON menu_items
  FOR SELECT USING (
    is_available = TRUE
    AND restaurant_id IN (
      SELECT id FROM restaurants WHERE is_approved = TRUE
    )
  );

-- Restaurant owners can manage their menu items
CREATE POLICY "Owners can manage own menu items" ON menu_items
  FOR ALL USING (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE owner_id = auth.uid()
    )
  );

-- ============================================================================
-- ORDERS TABLE POLICIES
-- ============================================================================

-- Customers can view their own orders
CREATE POLICY "Customers can view own orders" ON orders
  FOR SELECT USING (customer_id = auth.uid());

-- Customers can create orders
CREATE POLICY "Customers can create orders" ON orders
  FOR INSERT WITH CHECK (customer_id = auth.uid());

-- Restaurant owners can view orders for their restaurant
CREATE POLICY "Owners can view their restaurant orders" ON orders
  FOR SELECT USING (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE owner_id = auth.uid()
    )
  );

-- Restaurant owners can update order status for their restaurant
CREATE POLICY "Owners can update their restaurant orders" ON orders
  FOR UPDATE USING (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE owner_id = auth.uid()
    )
  );

-- Riders can view orders assigned to them
CREATE POLICY "Riders can view assigned orders" ON orders
  FOR SELECT USING (rider_id = auth.uid());

-- Riders can update orders assigned to them
CREATE POLICY "Riders can update assigned orders" ON orders
  FOR UPDATE USING (rider_id = auth.uid());

-- Admins can view all orders
CREATE POLICY "Admins can view all orders" ON orders
  FOR SELECT USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- ============================================================================
-- ORDER ITEMS TABLE POLICIES
-- ============================================================================

-- Users can view items for their own orders (inherited via orders policy)
CREATE POLICY "Customers can view own order items" ON order_items
  FOR SELECT USING (
    order_id IN (
      SELECT id FROM orders WHERE customer_id = auth.uid()
    )
  );

-- Restaurant owners can view items in their restaurant's orders
CREATE POLICY "Owners can view their restaurant order items" ON order_items
  FOR SELECT USING (
    order_id IN (
      SELECT id FROM orders WHERE restaurant_id IN (
        SELECT id FROM restaurants WHERE owner_id = auth.uid()
      )
    )
  );

-- Riders can view items in assigned orders
CREATE POLICY "Riders can view assigned order items" ON order_items
  FOR SELECT USING (
    order_id IN (
      SELECT id FROM orders WHERE rider_id = auth.uid()
    )
  );

-- ============================================================================
-- ORDER STATUS HISTORY TABLE POLICIES
-- ============================================================================

-- Customers can view status history for their orders
CREATE POLICY "Customers can view own order history" ON order_status_history
  FOR SELECT USING (
    order_id IN (
      SELECT id FROM orders WHERE customer_id = auth.uid()
    )
  );

-- Restaurant owners can view status history for their orders
CREATE POLICY "Owners can view their order history" ON order_status_history
  FOR SELECT USING (
    order_id IN (
      SELECT id FROM orders WHERE restaurant_id IN (
        SELECT id FROM restaurants WHERE owner_id = auth.uid()
      )
    )
  );

-- ============================================================================
-- DELIVERY ASSIGNMENTS TABLE POLICIES
-- ============================================================================

-- Riders can view their own assignments
CREATE POLICY "Riders can view own assignments" ON delivery_assignments
  FOR SELECT USING (rider_id = auth.uid());

-- Riders can update their own assignments
CREATE POLICY "Riders can update own assignments" ON delivery_assignments
  FOR UPDATE USING (rider_id = auth.uid());

-- Restaurant owners can view delivery assignments for their orders
CREATE POLICY "Owners can view delivery assignments" ON delivery_assignments
  FOR SELECT USING (
    order_id IN (
      SELECT id FROM orders WHERE restaurant_id IN (
        SELECT id FROM restaurants WHERE owner_id = auth.uid()
      )
    )
  );

-- Customers can view delivery assignments for their orders
CREATE POLICY "Customers can view delivery assignments" ON delivery_assignments
  FOR SELECT USING (
    order_id IN (
      SELECT id FROM orders WHERE customer_id = auth.uid()
    )
  );

-- ============================================================================
-- REVIEWS TABLE POLICIES
-- ============================================================================

-- Customers can create reviews for completed orders
CREATE POLICY "Customers can create reviews" ON reviews
  FOR INSERT WITH CHECK (
    reviewer_id = auth.uid()
    AND order_id IN (
      SELECT id FROM orders WHERE customer_id = auth.uid()
    )
  );

-- Anyone can view reviews
CREATE POLICY "Anyone can view reviews" ON reviews
  FOR SELECT USING (TRUE);

-- Customers can update their own reviews
CREATE POLICY "Customers can update own reviews" ON reviews
  FOR UPDATE USING (reviewer_id = auth.uid());

-- ============================================================================
-- SUPPORT CONVERSATIONS TABLE POLICIES
-- ============================================================================

-- Users can view their own conversations
CREATE POLICY "Users can view own conversations" ON support_conversations
  FOR SELECT USING (user_id = auth.uid());

-- Users can create their own conversations
CREATE POLICY "Users can create conversations" ON support_conversations
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Users can update their own conversations
CREATE POLICY "Users can update own conversations" ON support_conversations
  FOR UPDATE USING (user_id = auth.uid());

-- ============================================================================
-- SUPPORT MESSAGES TABLE POLICIES
-- ============================================================================

-- Users can view messages in their conversations
CREATE POLICY "Users can view own messages" ON support_messages
  FOR SELECT USING (
    conversation_id IN (
      SELECT id FROM support_conversations WHERE user_id = auth.uid()
    )
  );

-- Users can insert messages in their conversations
CREATE POLICY "Users can create messages" ON support_messages
  FOR INSERT WITH CHECK (
    conversation_id IN (
      SELECT id FROM support_conversations WHERE user_id = auth.uid()
    )
  );
