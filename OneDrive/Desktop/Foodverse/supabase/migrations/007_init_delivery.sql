-- 007_init_delivery.sql
-- Delivery assignments and tracking

CREATE TABLE delivery_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  rider_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending',
  accepted_at TIMESTAMP WITH TIME ZONE,
  picked_up_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX delivery_assignments_order_id_idx ON delivery_assignments(order_id);
CREATE INDEX delivery_assignments_rider_id_idx ON delivery_assignments(rider_id);
CREATE INDEX delivery_assignments_status_idx ON delivery_assignments(status);

-- Enable RLS
ALTER TABLE delivery_assignments ENABLE ROW LEVEL SECURITY;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_delivery_assignments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER delivery_assignments_updated_at_trigger
  BEFORE UPDATE ON delivery_assignments
  FOR EACH ROW
  EXECUTE FUNCTION update_delivery_assignments_updated_at();

-- Reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT rating_range CHECK (rating >= 1 AND rating <= 5)
);

CREATE INDEX reviews_restaurant_id_idx ON reviews(restaurant_id);
CREATE INDEX reviews_reviewer_id_idx ON reviews(reviewer_id);
CREATE INDEX reviews_created_at_idx ON reviews(created_at DESC);

-- Enable RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
