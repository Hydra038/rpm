-- Fix account page order fetching issues AND admin role detection
-- Run this in your Supabase SQL Editor to resolve user order access problems

-- CRITICAL: Fix user_profiles table first (needed for admin role detection)
-- Drop existing user_profiles policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Authenticated users can read profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users can manage own profile" ON user_profiles;
DROP POLICY IF EXISTS "Service role can manage profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "System can manage profiles" ON user_profiles;

-- Ensure user_profiles RLS is enabled
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- CRITICAL: Allow authenticated users to read profiles (needed for admin role checks)
CREATE POLICY "Authenticated users can read profiles" ON user_profiles
    FOR SELECT USING (auth.role() = 'authenticated');

-- Users can manage their own profile
CREATE POLICY "Users can manage own profile" ON user_profiles
    FOR ALL USING (auth.uid() = user_id);

-- Service role can manage all profiles
CREATE POLICY "Service role can manage profiles" ON user_profiles
    FOR ALL USING (auth.role() = 'service_role');

-- Drop existing order policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can insert own orders" ON orders;
DROP POLICY IF EXISTS "Authenticated users can read orders" ON orders;
DROP POLICY IF EXISTS "Service role can manage orders" ON orders;
DROP POLICY IF EXISTS "Users can view their order items" ON order_items;
DROP POLICY IF EXISTS "Authenticated users can read order items" ON order_items;
DROP POLICY IF EXISTS "Users can create order items" ON order_items;
DROP POLICY IF EXISTS "Service role can manage order items" ON order_items;
DROP POLICY IF EXISTS "Everyone can read parts" ON parts;
DROP POLICY IF EXISTS "Authenticated users can manage parts" ON parts;
DROP POLICY IF EXISTS "Service role can manage parts" ON parts;

-- Ensure RLS is enabled on all tables
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE parts ENABLE ROW LEVEL SECURITY;

-- ORDERS TABLE - Fix user access for account page
-- Users can view their own orders
CREATE POLICY "Users can view own orders" ON orders
    FOR SELECT USING (auth.uid() = user_id);

-- Users can create their own orders
CREATE POLICY "Users can insert own orders" ON orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow authenticated users to read all orders (needed for admin dashboard)
CREATE POLICY "Authenticated users can read orders" ON orders
    FOR SELECT USING (auth.role() = 'authenticated');

-- Service role can manage all orders
CREATE POLICY "Service role can manage orders" ON orders
    FOR ALL USING (auth.role() = 'service_role');

-- ORDER_ITEMS TABLE - Make sure users can see their order items
-- Users can view order items for their own orders
CREATE POLICY "Users can view their order items" ON order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_items.order_id 
            AND orders.user_id = auth.uid()
        )
    );

-- Allow authenticated users to read all order items (needed for admin and joins)
CREATE POLICY "Authenticated users can read order items" ON order_items
    FOR SELECT USING (auth.role() = 'authenticated');

-- Users can create order items for their orders
CREATE POLICY "Users can create order items" ON order_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_items.order_id 
            AND orders.user_id = auth.uid()
        )
    );

-- Service role can manage all order items
CREATE POLICY "Service role can manage order items" ON order_items
    FOR ALL USING (auth.role() = 'service_role');

-- PARTS TABLE - Make sure parts table allows reading for order item joins
-- Everyone can read parts (needed for order item details)
CREATE POLICY "Everyone can read parts" ON parts
    FOR SELECT USING (true);

-- Authenticated users can manage parts (admin operations)
CREATE POLICY "Authenticated users can manage parts" ON parts
    FOR ALL USING (auth.role() = 'authenticated');

-- Service role can manage parts
CREATE POLICY "Service role can manage parts" ON parts
    FOR ALL USING (auth.role() = 'service_role');

-- Add helpful comments
COMMENT ON POLICY "Users can view own orders" ON orders IS 'Allow users to see their own orders on account page';
COMMENT ON POLICY "Authenticated users can read orders" ON orders IS 'Allow authenticated users to read orders for admin dashboard';
COMMENT ON POLICY "Users can view their order items" ON order_items IS 'Allow users to see order items for their orders';
COMMENT ON POLICY "Everyone can read parts" ON parts IS 'Public read access for order item details and product catalog';