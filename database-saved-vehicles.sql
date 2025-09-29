-- Create saved_vehicles table for VIN lookup feature
CREATE TABLE IF NOT EXISTS saved_vehicles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    vin VARCHAR(17) NOT NULL,
    nickname VARCHAR(100),
    vehicle_info JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, vin)
);

-- Enable RLS
ALTER TABLE saved_vehicles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own saved vehicles" ON saved_vehicles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved vehicles" ON saved_vehicles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own saved vehicles" ON saved_vehicles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved vehicles" ON saved_vehicles
    FOR DELETE USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_saved_vehicles_user_id ON saved_vehicles(user_id);
CREATE INDEX idx_saved_vehicles_created_at ON saved_vehicles(created_at DESC);

-- Add update trigger
CREATE TRIGGER update_saved_vehicles_updated_at
    BEFORE UPDATE ON saved_vehicles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();