-- Fix admin access issues
-- Run this in your Supabase SQL Editor to restore admin functionality

-- First, let's temporarily disable RLS on user_profiles to allow admin access
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS with simpler policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop all existing user_profiles policies
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "System can manage profiles" ON user_profiles;

-- Create simpler, more permissive policies for user_profiles
-- Allow all authenticated users to read profiles (needed for admin role checks)
CREATE POLICY "Authenticated users can read profiles" ON user_profiles
    FOR SELECT USING (auth.role() = 'authenticated');

-- Allow users to manage their own profile
CREATE POLICY "Users can manage own profile" ON user_profiles
    FOR ALL USING (auth.uid() = user_id);

-- Allow service role (system) to manage all profiles
CREATE POLICY "Service role can manage profiles" ON user_profiles
    FOR ALL USING (auth.role() = 'service_role');

-- Temporarily make orders more permissive for admin access
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Drop existing order policies
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can insert own orders" ON orders;
DROP POLICY IF EXISTS "Users can update own orders" ON orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
DROP POLICY IF EXISTS "Admins can manage all orders" ON orders;
DROP POLICY IF EXISTS "System can insert orders" ON orders;

-- Create simpler order policies
-- Users can view their own orders
CREATE POLICY "Users can view own orders" ON orders
    FOR SELECT USING (auth.uid() = user_id);

-- Users can create their own orders  
CREATE POLICY "Users can insert own orders" ON orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow service role to manage all orders (for admin operations)
CREATE POLICY "Service role can manage orders" ON orders
    FOR ALL USING (auth.role() = 'service_role');

-- Allow authenticated users to read orders (admins need this)
CREATE POLICY "Authenticated users can read orders" ON orders
    FOR SELECT USING (auth.role() = 'authenticated');

-- Make order_items more permissive
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Drop existing order_items policies
DROP POLICY IF EXISTS "Users can view their order items" ON order_items;
DROP POLICY IF EXISTS "Users can create order items for their orders" ON order_items;
DROP POLICY IF EXISTS "Admins can manage all order items" ON order_items;
DROP POLICY IF EXISTS "System can manage order items" ON order_items;

-- Create simpler order_items policies
-- Allow authenticated users to read order items
CREATE POLICY "Authenticated users can read order items" ON order_items
    FOR SELECT USING (auth.role() = 'authenticated');

-- Allow users to create order items for their orders
CREATE POLICY "Users can create order items" ON order_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_items.order_id 
            AND orders.user_id = auth.uid()
        )
    );

-- Allow service role to manage all order items
CREATE POLICY "Service role can manage order items" ON order_items
    FOR ALL USING (auth.role() = 'service_role');

-- Keep parts table simple and open for reading
ALTER TABLE parts DISABLE ROW LEVEL SECURITY;
ALTER TABLE parts ENABLE ROW LEVEL SECURITY;

-- Drop existing parts policies
DROP POLICY IF EXISTS "Parts are viewable by everyone" ON parts;
DROP POLICY IF EXISTS "Only admins can insert parts" ON parts;
DROP POLICY IF EXISTS "Only admins can update parts" ON parts;
DROP POLICY IF EXISTS "Only admins can delete parts" ON parts;

-- Create simple parts policies
-- Allow everyone to read parts
CREATE POLICY "Everyone can read parts" ON parts
    FOR SELECT USING (true);

-- Allow authenticated users to manage parts (admin check will be done in app)
CREATE POLICY "Authenticated users can manage parts" ON parts
    FOR ALL USING (auth.role() = 'authenticated');

-- Allow service role to manage parts
CREATE POLICY "Service role can manage parts" ON parts
    FOR ALL USING (auth.role() = 'service_role');

-- Add comments
COMMENT ON POLICY "Authenticated users can read profiles" ON user_profiles IS 'Allow authenticated users to read profiles for admin role checks';
COMMENT ON POLICY "Everyone can read parts" ON parts IS 'Public read access to all parts/products';
COMMENT ON POLICY "Authenticated users can manage parts" ON parts IS 'Authenticated users can manage parts - admin check in application';