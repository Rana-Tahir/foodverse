-- 003_init_restaurants.sql
-- Restaurant profiles and metadata

CREATE TABLE restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  cuisine_type TEXT,
  phone_number TEXT,
  street_address TEXT NOT NULL,
  area TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Karachi',
  opening_hours JSONB DEFAULT '{"monday":{"open":"09:00","close":"23:00"},"tuesday":{"open":"09:00","close":"23:00"},"wednesday":{"open":"09:00","close":"23:00"},"thursday":{"open":"09:00","close":"23:00"},"friday":{"open":"09:00","close":"23:00"},"saturday":{"open":"09:00","close":"23:00"},"sunday":{"open":"09:00","close":"23:00"}}'::jsonb,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  is_approved BOOLEAN DEFAULT FALSE,
  is_available BOOLEAN DEFAULT TRUE,
  average_rating DECIMAL(3, 2) DEFAULT 0.00,
  total_reviews INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT average_rating_range CHECK (average_rating >= 0 AND average_rating <= 5)
);

-- Create indexes
CREATE INDEX restaurants_owner_id_idx ON restaurants(owner_id);
CREATE INDEX restaurants_is_approved_idx ON restaurants(is_approved);
CREATE INDEX restaurants_is_available_idx ON restaurants(is_available);
CREATE INDEX restaurants_area_idx ON restaurants(area, city);

-- Enable RLS
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_restaurants_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER restaurants_updated_at_trigger
  BEFORE UPDATE ON restaurants
  FOR EACH ROW
  EXECUTE FUNCTION update_restaurants_updated_at();
