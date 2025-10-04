-- Check if the boolean columns exist in payment_settings table
-- Run this in your Supabase SQL Editor to verify the table structure

SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'payment_settings' 
ORDER BY ordinal_position;

-- This will show you all columns in the payment_settings table
-- Look for: paypal_enabled, bank_transfer_enabled, iban_enabled
-- If they're missing, you need to run the migration script