-- 006_init_ordering.sql
-- Orders and order items tables

CREATE TYPE order_status AS ENUM (
  'pending_confirmation',
  'confirmed',
  'preparing',
  'ready_for_pickup',
  'picked_up',
  'delivered',
  'rejected',
  'cancelled'
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  rider_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  delivery_address_snapshot JSONB NOT NULL,
  payment_method TEXT DEFAULT 'cash',
  subtotal_pkr DECIMAL(10, 2) NOT NULL,
  delivery_fee_pkr DECIMAL(10, 2) NOT NULL,
  total_pkr DECIMAL(10, 2) NOT NULL,
  current_status order_status DEFAULT 'pending_confirmation',
  estimated_delivery_minutes INTEGER,
  rejection_reason TEXT,
  cancellation_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT subtotal_positive CHECK (subtotal_pkr > 0),
  CONSTRAINT delivery_fee_non_negative CHECK (delivery_fee_pkr >= 0),
  CONSTRAINT total_positive CHECK (total_pkr > 0)
);

CREATE INDEX orders_customer_id_idx ON orders(customer_id);
CREATE INDEX orders_restaurant_id_idx ON orders(restaurant_id);
CREATE INDEX orders_rider_id_idx ON orders(rider_id);
CREATE INDEX orders_current_status_idx ON orders(current_status);
CREATE INDEX orders_created_at_idx ON orders(created_at DESC);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER orders_updated_at_trigger
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_orders_updated_at();

-- Order items (preserves menu item snapshot)
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES menu_items(id) ON DELETE SET NULL,
  item_name TEXT NOT NULL,
  item_price_pkr DECIMAL(10, 2) NOT NULL,
  quantity INTEGER NOT NULL,
  line_total_pkr DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT quantity_positive CHECK (quantity > 0),
  CONSTRAINT item_price_positive CHECK (item_price_pkr > 0),
  CONSTRAINT line_total_positive CHECK (line_total_pkr > 0)
);

CREATE INDEX order_items_order_id_idx ON order_items(order_id);
CREATE INDEX order_items_menu_item_id_idx ON order_items(menu_item_id);

-- Enable RLS
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Order status history (audit trail)
CREATE TABLE order_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  from_status order_status,
  to_status order_status NOT NULL,
  changed_by_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX order_status_history_order_id_idx ON order_status_history(order_id);
CREATE INDEX order_status_history_created_at_idx ON order_status_history(created_at DESC);

-- Enable RLS
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;
