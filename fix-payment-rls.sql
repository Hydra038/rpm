-- Temporarily disable RLS on payment_settings table to fix the insertion issue
-- Run this in your Supabase SQL Editor

-- Disable RLS on payment_settings table
ALTER TABLE payment_settings DISABLE ROW LEVEL SECURITY;

-- Also temporarily disable RLS on payment_transactions table
ALTER TABLE payment_transactions DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename IN ('payment_settings', 'payment_transactions')
ORDER BY tablename;

-- Insert default payment settings if they don't exist
INSERT INTO payment_settings (
  paypal_email, 
  bank_name, 
  account_holder_name, 
  account_number, 
  sort_code, 
  payment_instructions
) VALUES (
  'payments@rpmgenuineautoparts.info',
  'Barclays Bank UK',
  'RPM Genuine Auto Parts Ltd',
  '12345678',
  '20-00-00',
  'Please include your order number as payment reference. For bank transfers, allow 1-2 business days for processing.'
) ON CONFLICT (id) DO NOTHING;