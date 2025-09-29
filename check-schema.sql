-- Check the actual table structure to see what columns exist
-- Run this in your Supabase SQL Editor

-- Check orders table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'orders'
ORDER BY ordinal_position;

-- Check if updated_at column exists
SELECT EXISTS(
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'orders' 
    AND column_name = 'updated_at'
) AS updated_at_exists;

-- Check RLS status
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- Count existing records
SELECT 
    'parts' as table_name, COUNT(*) as record_count 
FROM parts
UNION ALL
SELECT 
    'orders' as table_name, COUNT(*) as record_count 
FROM orders
UNION ALL
SELECT 
    'order_items' as table_name, COUNT(*) as record_count 
FROM order_items
UNION ALL
SELECT 
    'user_profiles' as table_name, COUNT(*) as record_count 
FROM user_profiles;