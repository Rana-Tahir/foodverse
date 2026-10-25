-- 004_init_rider_profiles.sql
-- Rider delivery personnel profiles

CREATE TABLE rider_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  license_number TEXT UNIQUE,
  vehicle_type TEXT,
  is_available BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  average_rating DECIMAL(3, 2) DEFAULT 0.00,
  total_deliveries INTEGER DEFAULT 0,
  total_earnings_pkr DECIMAL(10, 2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT average_rating_range CHECK (average_rating >= 0 AND average_rating <= 5)
);

-- Create indexes
CREATE INDEX rider_profiles_user_id_idx ON rider_profiles(user_id);
CREATE INDEX rider_profiles_is_available_idx ON rider_profiles(is_available);
CREATE INDEX rider_profiles_is_verified_idx ON rider_profiles(is_verified);

-- Enable RLS
ALTER TABLE rider_profiles ENABLE ROW LEVEL SECURITY;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_rider_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER rider_profiles_updated_at_trigger
  BEFORE UPDATE ON rider_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_rider_profiles_updated_at();
