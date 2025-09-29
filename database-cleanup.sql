-- Database Cleanup Script
-- Remove unused tables and objects

-- Drop unused tables (if they exist)
DROP TABLE IF EXISTS brands CASCADE;
DROP TABLE IF EXISTS inventory CASCADE; 
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS vehicles CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;

-- Remove customer_addresses table since we're not using saved addresses
DROP TABLE IF EXISTS customer_addresses CASCADE;

-- Clean up any unused indexes
DROP INDEX IF EXISTS idx_brands_name;
DROP INDEX IF EXISTS idx_inventory_part_id;
DROP INDEX IF EXISTS idx_reviews_part_id;
DROP INDEX IF EXISTS idx_reviews_user_id;
DROP INDEX IF EXISTS idx_vehicles_make;
DROP INDEX IF EXISTS idx_vehicles_model;
DROP INDEX IF EXISTS idx_admin_users_email;
DROP INDEX IF EXISTS idx_customer_addresses_user_id;

-- Clean up any unused RLS policies for removed tables
DROP POLICY IF EXISTS "Users can view reviews" ON reviews;
DROP POLICY IF EXISTS "Users can create reviews" ON reviews;
DROP POLICY IF EXISTS "Users can view their addresses" ON customer_addresses;
DROP POLICY IF EXISTS "Users can manage their addresses" ON customer_addresses;

-- Keep only essential tables:
-- ✅ parts (products catalog)
-- ✅ orders (order records) 
-- ✅ order_items (order details)
-- ✅ user_profiles (user management with roles)

COMMENT ON SCHEMA public IS 'Cleaned RPM Auto Parts Database - Essential tables only';