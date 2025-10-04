-- Verify database schema for orders table
-- Run this in your Supabase SQL Editor to check if required columns exist

-- Check orders table structure
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'orders' 
ORDER BY ordinal_position;

-- Check if billing_address column exists specifically
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'orders' AND column_name = 'billing_address'
    ) 
    THEN 'billing_address column EXISTS' 
    ELSE 'billing_address column MISSING - Run migration!' 
  END as billing_address_status;

-- Check payment_settings table structure
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'payment_settings' 
ORDER BY ordinal_position;