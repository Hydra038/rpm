-- Simple Schema for RPM Auto Parts Store
-- Uses auth.users with a simple user_profiles table for roles

-- Create the database tables for RPM Auto Parts Store

-- Parts table (already exists but let's ensure proper structure)
CREATE TABLE IF NOT EXISTS parts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  image_url TEXT,
  stock_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  shipping_address JSONB,
  billing_address JSONB,
  payment_status VARCHAR(50) DEFAULT 'pending',
  tracking_number VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Order Items table (junction table)
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  part_id INTEGER REFERENCES parts(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- User Profiles table (simple role management)
CREATE TABLE IF NOT EXISTS user_profiles (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role VARCHAR(50) DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Customer Addresses table (for saved addresses)
CREATE TABLE IF NOT EXISTS customer_addresses (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(20) DEFAULT 'shipping', -- 'shipping' or 'billing'
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  company VARCHAR(150),
  address_line1 VARCHAR(255) NOT NULL,
  address_line2 VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  county VARCHAR(100),
  postcode VARCHAR(20) NOT NULL,
  country VARCHAR(100) DEFAULT 'United Kingdom',
  phone VARCHAR(20),
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_parts_category ON parts(category);
CREATE INDEX IF NOT EXISTS idx_parts_price ON parts(price);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_part_id ON order_items(part_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_customer_addresses_user_id ON customer_addresses(user_id);

-- Enable Row Level Security (RLS) for data protection
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE parts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
DROP POLICY IF EXISTS "Users can create their own orders" ON orders;
DROP POLICY IF EXISTS "Users can update their own orders" ON orders;
DROP POLICY IF EXISTS "Admins can update all orders" ON orders;
DROP POLICY IF EXISTS "Admins can delete orders" ON orders;
DROP POLICY IF EXISTS "Users can update orders" ON orders;

DROP POLICY IF EXISTS "Users can view their own order items" ON order_items;
DROP POLICY IF EXISTS "Admins can view all order items" ON order_items;
DROP POLICY IF EXISTS "Users can create their own order items" ON order_items;
DROP POLICY IF EXISTS "Admins can manage all order items" ON order_items;
DROP POLICY IF EXISTS "Users can view their order items" ON order_items;
DROP POLICY IF EXISTS "Users can create their order items" ON order_items;
DROP POLICY IF EXISTS "Admins can manage order items" ON order_items;

DROP POLICY IF EXISTS "Users can manage their own addresses" ON customer_addresses;
DROP POLICY IF EXISTS "Anyone can view parts" ON parts;

DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can create own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Allow trigger to create profiles" ON user_profiles;

-- Parts table policies
CREATE POLICY "Anyone can view parts" ON parts
  FOR SELECT TO authenticated;

-- User profiles policies
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can create own profile" ON user_profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow trigger to create profiles" ON user_profiles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Orders policies
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT TO authenticated USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.user_id = auth.uid() 
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Users can create their own orders" ON orders
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update orders" ON orders
  FOR UPDATE TO authenticated USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.user_id = auth.uid() 
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete orders" ON orders
  FOR DELETE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.user_id = auth.uid() 
      AND user_profiles.role = 'admin'
    )
  );

-- Order items policies  
CREATE POLICY "Users can view their order items" ON order_items
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND (orders.user_id = auth.uid() OR 
           EXISTS (
             SELECT 1 FROM user_profiles 
             WHERE user_profiles.user_id = auth.uid() 
             AND user_profiles.role = 'admin'
           ))
    )
  );

CREATE POLICY "Users can create their order items" ON order_items
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage order items" ON order_items
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.user_id = auth.uid() 
      AND user_profiles.role = 'admin'
    )
  );

-- Customer addresses policies
CREATE POLICY "Users can manage their own addresses" ON customer_addresses
  FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Insert sample data

-- Sample parts data
INSERT INTO parts (name, category, price, description, image_url) VALUES
('Brake Pads - Front Set', 'Brakes', 45.99, 'High-quality ceramic brake pads for front wheels', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'),
('Oil Filter', 'Engine', 12.99, 'Premium oil filter for most vehicle models', 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400'),
('Air Filter', 'Engine', 19.99, 'High-flow air filter for improved performance', 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400'),
('Spark Plugs Set', 'Engine', 35.99, 'Set of 4 platinum spark plugs', 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=400'),
('Windshield Wipers', 'Electrical', 24.99, 'All-weather windshield wipers pair', 'https://images.unsplash.com/photo-1544552866-d3ed42536cfd?w=400')
ON CONFLICT DO NOTHING;

-- Note: Admin users will be created through the signup process
-- The designated admin email 'support@rpmgenuineautoparts.info' will get admin privileges
-- through the admin setup API when they first sign up.

-- Sample orders (will be added after users sign up)
-- This is just a placeholder to show the structure

-- Create a function to automatically create user profiles when users sign up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, email, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    CASE 
      WHEN NEW.email = 'support@rpmgenuineautoparts.info' THEN 'admin'
      ELSE 'customer'
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to manually create profiles (bypasses RLS)
CREATE OR REPLACE FUNCTION public.create_user_profile(user_id UUID, user_email TEXT)
RETURNS JSON AS $$
DECLARE
  profile_role TEXT;
  result JSON;
BEGIN
  -- Determine role based on email
  profile_role := CASE 
    WHEN user_email = 'support@rpmgenuineautoparts.info' THEN 'admin'
    ELSE 'customer'
  END;
  
  -- Insert the profile
  INSERT INTO public.user_profiles (user_id, email, role)
  VALUES (user_id, user_email, profile_role)
  RETURNING json_build_object(
    'id', id,
    'user_id', user_id,
    'email', email,
    'role', role,
    'created_at', created_at
  ) INTO result;
  
  RETURN result;
EXCEPTION
  WHEN unique_violation THEN
    -- Profile already exists, return existing one
    SELECT json_build_object(
      'id', id,
      'user_id', user_id,
      'email', email,
      'role', role,
      'created_at', created_at
    ) INTO result
    FROM public.user_profiles
    WHERE user_profiles.user_id = create_user_profile.user_id;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profiles
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create a function to seed parts (bypasses RLS)
CREATE OR REPLACE FUNCTION public.seed_parts()
RETURNS JSON AS $$
DECLARE
  result JSON;
  products_count INTEGER;
BEGIN
  -- Instead of deleting, we'll insert new products with ON CONFLICT DO NOTHING
  -- First, let's check if we already have products
  SELECT COUNT(*) INTO products_count FROM public.parts;
  
  -- If we already have products, just return success
  IF products_count > 5 THEN
    SELECT json_build_object(
      'success', true,
      'message', 'Products already exist! Found ' || products_count || ' products.',
      'count', products_count
    ) INTO result;
    
    RETURN result;
  END IF;
  
  -- Insert sample products (will skip if they already exist due to name uniqueness)
  INSERT INTO public.parts (name, category, price, description, image_url) VALUES
  ('High Performance Air Filter', 'Engine Parts', 38.99, 'Premium cotton air filter for improved airflow and engine performance.', 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop&random=1'),
  ('Spark Plug Set (4-Pack)', 'Engine Parts', 27.50, 'Iridium spark plugs for enhanced ignition and fuel efficiency.', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&random=2'),
  ('Premium Engine Oil Filter', 'Engine Parts', 10.99, 'OEM-quality oil filter for optimal engine protection.', 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop&random=3'),
  ('Timing Belt Kit', 'Engine Parts', 159.99, 'Complete timing belt replacement kit with tensioner and pulleys.', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&random=4'),
  ('Fuel Injector Set', 'Engine Parts', 235.00, 'Professional-grade fuel injectors for improved fuel delivery.', 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop&random=5'),
  ('Turbocharger', 'Engine Parts', 1249.99, 'High-performance turbocharger for increased power output.', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&random=6'),
  
  ('Ceramic Brake Pads Front', 'Brake System', 76.99, 'Low-dust ceramic brake pads for superior stopping power.', 'https://images.unsplash.com/photo-1625328303518-8d84a7d60d73?w=400&h=300&fit=crop&random=7'),
  ('Brake Rotor Set (2-Pack)', 'Brake System', 133.00, 'Vented brake rotors for enhanced heat dissipation.', 'https://images.unsplash.com/photo-1582996542635-e48f80a3e5ab?w=400&h=300&fit=crop&random=8'),
  ('Brake Fluid DOT 4', 'Brake System', 7.99, 'High-performance brake fluid for all weather conditions.', 'https://images.unsplash.com/photo-1625328303518-8d84a7d60d73?w=400&h=300&fit=crop&random=9'),
  ('Brake Caliper Rebuild Kit', 'Brake System', 36.50, 'Complete rebuild kit with seals and hardware.', 'https://images.unsplash.com/photo-1582996542635-e48f80a3e5ab?w=400&h=300&fit=crop&random=10'),
  
  ('Shock Absorber Set', 'Suspension', 209.99, 'Gas-filled shock absorbers for smooth ride comfort.', 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=400&h=300&fit=crop&random=13'),
  ('Coil Spring Pair', 'Suspension', 107.99, 'Heavy-duty coil springs for load support and stability.', 'https://images.unsplash.com/photo-1625328303518-8d84a7d60d73?w=400&h=300&fit=crop&random=14'),
  ('Sway Bar Links', 'Suspension', 29.99, 'Stabilizer bar end links for reduced body roll.', 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=400&h=300&fit=crop&random=15'),
  
  ('Car Battery 12V', 'Electrical', 110.99, 'Maintenance-free lead-acid battery with 3-year warranty.', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop&random=19'),
  ('Alternator 140A', 'Electrical', 169.99, 'High-output alternator for reliable charging system.', 'https://images.unsplash.com/photo-1558222218-b7b54eede3f3?w=400&h=300&fit=crop&random=20'),
  ('LED Headlight Bulbs', 'Electrical', 56.99, 'Bright LED headlight conversion kit with cooling fan.', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop&random=21'),
  
  ('Front Bumper Cover', 'Body Parts', 189.99, 'OEM-style front bumper cover with fog light openings.', 'https://images.unsplash.com/photo-1627634377411-8da5f4f09cd8?w=400&h=300&fit=crop&random=26'),
  ('Side Mirror Assembly', 'Body Parts', 87.50, 'Complete side mirror with heating and indicator.', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop&random=27'),
  
  ('Leather Seat Covers', 'Interior', 78.99, 'Premium leather seat covers with custom fit.', 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop&random=33'),
  ('All-Weather Floor Mats', 'Interior', 34.99, 'Heavy-duty rubber floor mats for year-round protection.', 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=400&h=300&fit=crop&random=34'),
  
  ('Performance Exhaust System', 'Exhaust', 299.99, 'Cat-back exhaust system for improved sound and performance.', 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400&h=300&fit=crop&random=40'),
  ('Catalytic Converter', 'Exhaust', 234.99, 'High-flow catalytic converter meeting Euro 6 standards.', 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400&h=300&fit=crop&random=41'),
  
  ('Premium Engine Oil Filter', 'Filters', 8.99, 'High-efficiency oil filter for extended engine life.', 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop&random=47'),
  ('Cabin Air Filter', 'Filters', 14.99, 'HEPA cabin air filter for clean interior air.', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&random=48'),
  ('Fuel Filter', 'Filters', 16.50, 'Inline fuel filter for clean fuel delivery.', 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop&random=49'),
  
  -- Additional products to reach a good inventory size
  ('Radiator Assembly', 'Engine Parts', 145.99, 'Aluminum radiator for optimal engine cooling.', 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop&random=60'),
  ('Water Pump', 'Engine Parts', 89.99, 'High-flow water pump for cooling system.', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&random=61'),
  ('Thermostat Kit', 'Engine Parts', 24.99, 'Engine thermostat with housing and gasket.', 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop&random=62'),
  
  ('Brake Master Cylinder', 'Brake System', 124.99, 'OEM replacement brake master cylinder.', 'https://images.unsplash.com/photo-1625328303518-8d84a7d60d73?w=400&h=300&fit=crop&random=63'),
  ('Brake Hoses Set', 'Brake System', 45.99, 'Flexible brake hoses for all four wheels.', 'https://images.unsplash.com/photo-1582996542635-e48f80a3e5ab?w=400&h=300&fit=crop&random=64'),
  
  ('Wheel Bearings', 'Suspension', 67.50, 'Precision wheel bearings for smooth rotation.', 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=400&h=300&fit=crop&random=65'),
  ('Ball Joints', 'Suspension', 89.99, 'Heavy-duty ball joints for steering control.', 'https://images.unsplash.com/photo-1625328303518-8d84a7d60d73?w=400&h=300&fit=crop&random=66'),
  
  ('Headlight Assembly', 'Electrical', 234.99, 'Complete headlight assembly with LED DRL.', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop&random=67'),
  ('Tail Light Set', 'Electrical', 156.99, 'LED tail light set with sequential indicators.', 'https://images.unsplash.com/photo-1558222218-b7b54eede3f3?w=400&h=300&fit=crop&random=68');
  
  -- Get final count of products
  SELECT COUNT(*) INTO products_count FROM public.parts;
  
  -- Return success result
  SELECT json_build_object(
    'success', true,
    'message', 'Products seeded successfully!',
    'count', products_count
  ) INTO result;
  
  RETURN result;
EXCEPTION
  WHEN OTHERS THEN
    -- Return error result
    SELECT json_build_object(
      'success', false,
      'message', 'Error seeding products: ' || SQLERRM
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;