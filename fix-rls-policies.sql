-- Fix Row Level Security policies for parts and orders tables
-- Run this in your Supabase SQL Editor

-- First, let's check if RLS is enabled and fix the parts table policies
ALTER TABLE parts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies for parts table if they exist
DROP POLICY IF EXISTS "Enable read access for all users" ON parts;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON parts;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON parts;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON parts;
DROP POLICY IF EXISTS "Parts are viewable by everyone" ON parts;
DROP POLICY IF EXISTS "Only admins can insert parts" ON parts;
DROP POLICY IF EXISTS "Only admins can update parts" ON parts;
DROP POLICY IF EXISTS "Only admins can delete parts" ON parts;

-- Create comprehensive parts policies
-- Allow everyone to view parts (public read access)
CREATE POLICY "Parts are viewable by everyone" ON parts
    FOR SELECT USING (true);

-- Allow admins to insert parts
CREATE POLICY "Only admins can insert parts" ON parts
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.user_id = auth.uid() 
            AND user_profiles.role = 'admin'
        )
    );

-- Allow admins to update parts
CREATE POLICY "Only admins can update parts" ON parts
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.user_id = auth.uid() 
            AND user_profiles.role = 'admin'
        )
    );

-- Allow admins to delete parts
CREATE POLICY "Only admins can delete parts" ON parts
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.user_id = auth.uid() 
            AND user_profiles.role = 'admin'
        )
    );

-- Fix orders table RLS policies
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Drop existing policies for orders table if they exist
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can insert own orders" ON orders;
DROP POLICY IF EXISTS "Users can update own orders" ON orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
DROP POLICY IF EXISTS "Admins can manage all orders" ON orders;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON orders;
DROP POLICY IF EXISTS "System can insert orders" ON orders;

-- Create comprehensive orders policies
-- Users can view their own orders
CREATE POLICY "Users can view own orders" ON orders
    FOR SELECT USING (auth.uid() = user_id);

-- Users can create their own orders
CREATE POLICY "Users can insert own orders" ON orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own orders (limited scenarios)
CREATE POLICY "Users can update own orders" ON orders
    FOR UPDATE USING (auth.uid() = user_id);

-- Admins can view all orders
CREATE POLICY "Admins can view all orders" ON orders
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.user_id = auth.uid() 
            AND user_profiles.role = 'admin'
        )
    );

-- Admins can manage all orders (insert, update, delete)
CREATE POLICY "Admins can manage all orders" ON orders
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.user_id = auth.uid() 
            AND user_profiles.role = 'admin'
        )
    );

-- Allow system/service role to insert orders (for seeding and API operations)
DROP POLICY IF EXISTS "System can insert orders" ON orders;
CREATE POLICY "System can insert orders" ON orders
    FOR INSERT WITH CHECK (
        -- Allow if no auth context (service role) or if user owns the order
        auth.uid() IS NULL OR auth.uid() = user_id
    );

-- Ensure user_profiles table has proper RLS policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies for user_profiles if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "System can manage profiles" ON user_profiles;

-- Create user_profiles policies
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON user_profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles up
            WHERE up.user_id = auth.uid() 
            AND up.role = 'admin'
        )
    );

-- Allow system to create profiles (for initial admin setup)
DROP POLICY IF EXISTS "System can manage profiles" ON user_profiles;
CREATE POLICY "System can manage profiles" ON user_profiles
    FOR ALL WITH CHECK (
        -- Allow if no auth context (service role) or if admin
        auth.uid() IS NULL OR 
        EXISTS (
            SELECT 1 FROM user_profiles up
            WHERE up.user_id = auth.uid() 
            AND up.role = 'admin'
        )
    );

-- Ensure order_items table has proper RLS policies (these may be missing)
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies for order_items if they exist
DROP POLICY IF EXISTS "Users can view their order items" ON order_items;
DROP POLICY IF EXISTS "Users can create order items for their orders" ON order_items;
DROP POLICY IF EXISTS "Admins can manage all order items" ON order_items;

-- Create order_items policies
-- Users can view order items for their own orders
CREATE POLICY "Users can view their order items" ON order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_items.order_id 
            AND orders.user_id = auth.uid()
        )
    );

-- Users can create order items for their own orders
CREATE POLICY "Users can create order items for their orders" ON order_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_items.order_id 
            AND orders.user_id = auth.uid()
        )
    );

-- Admins can manage all order items
CREATE POLICY "Admins can manage all order items" ON order_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.user_id = auth.uid() 
            AND user_profiles.role = 'admin'
        )
    );

-- Allow system to create order items (for seeding and API operations)
CREATE POLICY "System can manage order items" ON order_items
    FOR ALL WITH CHECK (
        -- Allow if no auth context (service role) or if user owns the order
        auth.uid() IS NULL OR 
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_items.order_id 
            AND orders.user_id = auth.uid()
        )
    );

-- Comments for documentation
COMMENT ON POLICY "Parts are viewable by everyone" ON parts IS 'Allow public read access to all parts/products';
COMMENT ON POLICY "Only admins can insert parts" ON parts IS 'Only admin users can add new parts';
COMMENT ON POLICY "Only admins can update parts" ON parts IS 'Only admin users can modify existing parts';
COMMENT ON POLICY "Only admins can delete parts" ON parts IS 'Only admin users can delete parts';

COMMENT ON POLICY "Users can view own orders" ON orders IS 'Users can only see their own orders';
COMMENT ON POLICY "Users can insert own orders" ON orders IS 'Users can create orders for themselves';
COMMENT ON POLICY "Admins can view all orders" ON orders IS 'Admin users can see all orders';
COMMENT ON POLICY "Admins can manage all orders" ON orders IS 'Admin users can perform all operations on orders';
COMMENT ON POLICY "System can insert orders" ON orders IS 'Allow service role to create orders for seeding and API operations';

COMMENT ON POLICY "Users can view their order items" ON order_items IS 'Users can view order items for their own orders';
COMMENT ON POLICY "System can manage order items" ON order_items IS 'Allow service role to manage order items for seeding and API operations';