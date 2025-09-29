-- Temporary fix: Disable RLS policies for testing
-- This will allow all queries to work without authentication issues
-- You can run this in your Supabase SQL Editor

-- Temporarily disable RLS on all tables for testing
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE parts DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- This should show 'false' for all tables, meaning RLS is disabled