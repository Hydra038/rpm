-- Add IBAN column to existing payment_settings table
-- Run this in your Supabase SQL Editor if you already have payment_settings table

-- Add IBAN column to payment_settings table
ALTER TABLE payment_settings 
ADD COLUMN IF NOT EXISTS iban VARCHAR(34);

-- Add payment method enable/disable columns
ALTER TABLE payment_settings 
ADD COLUMN IF NOT EXISTS paypal_enabled BOOLEAN DEFAULT true;

ALTER TABLE payment_settings 
ADD COLUMN IF NOT EXISTS bank_transfer_enabled BOOLEAN DEFAULT true;

ALTER TABLE payment_settings 
ADD COLUMN IF NOT EXISTS iban_enabled BOOLEAN DEFAULT false;

-- Add missing billing_address column to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS billing_address TEXT;

-- Add missing notes column to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Add missing delivery_address column to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS delivery_address TEXT;

-- Add missing tracking_number column to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS tracking_number VARCHAR(100);

-- Add missing payment_plan column to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_plan VARCHAR(20) DEFAULT 'full';

-- Add missing payment status columns to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS amount_paid DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS remaining_amount DECIMAL(10,2) DEFAULT 0;

-- Add comments to the columns
COMMENT ON COLUMN payment_settings.iban IS 'International Bank Account Number for international transfers (up to 34 characters)';
COMMENT ON COLUMN payment_settings.paypal_enabled IS 'Enable/disable PayPal payment option';
COMMENT ON COLUMN payment_settings.bank_transfer_enabled IS 'Enable/disable bank transfer payment option';
COMMENT ON COLUMN payment_settings.iban_enabled IS 'Enable/disable IBAN transfer payment option';

-- Update trigger for updated_at column if not exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to payment_settings table
DROP TRIGGER IF EXISTS update_payment_settings_updated_at ON payment_settings;
CREATE TRIGGER update_payment_settings_updated_at
    BEFORE UPDATE ON payment_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create support_messages table for real-time chat
CREATE TABLE IF NOT EXISTS support_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for support_messages
ALTER TABLE support_messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own messages" ON support_messages;
DROP POLICY IF EXISTS "Users can insert own messages" ON support_messages;
DROP POLICY IF EXISTS "Admins can view all messages" ON support_messages;
DROP POLICY IF EXISTS "Admins can insert messages for any user" ON support_messages;

-- Users can only see their own messages
CREATE POLICY "Users can view own messages" ON support_messages
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own messages
CREATE POLICY "Users can insert own messages" ON support_messages
    FOR INSERT WITH CHECK (auth.uid() = user_id AND is_admin = false);

-- Admins can view all messages
CREATE POLICY "Admins can view all messages" ON support_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.user_id = auth.uid() 
            AND user_profiles.role = 'admin'
        )
    );

-- Admins can insert messages for any user
CREATE POLICY "Admins can insert messages for any user" ON support_messages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.user_id = auth.uid() 
            AND user_profiles.role = 'admin'
        )
    );

-- Add trigger for updated_at
DROP TRIGGER IF EXISTS update_support_messages_updated_at ON support_messages;
CREATE TRIGGER update_support_messages_updated_at
    BEFORE UPDATE ON support_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_support_messages_user_id ON support_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_support_messages_created_at ON support_messages(created_at);

-- Comments
COMMENT ON TABLE support_messages IS 'Real-time support chat messages between users and admin';
COMMENT ON COLUMN support_messages.user_id IS 'Reference to the user sending or receiving the message';
COMMENT ON COLUMN support_messages.message IS 'The chat message content';
COMMENT ON COLUMN support_messages.is_admin IS 'True if message is from admin, false if from user';

-- Create payment_transactions table for order payment tracking
CREATE TABLE IF NOT EXISTS payment_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    transaction_type VARCHAR(20) NOT NULL DEFAULT 'payment', -- 'payment', 'refund', 'partial_payment'
    payment_method VARCHAR(20) NOT NULL, -- 'paypal', 'bank_transfer', 'iban'
    amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'cancelled'
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing columns to payment_transactions table if they don't exist
ALTER TABLE payment_transactions 
ADD COLUMN IF NOT EXISTS transaction_reference VARCHAR(100);

-- Add RLS policies for payment_transactions
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own payment transactions" ON payment_transactions;
DROP POLICY IF EXISTS "Admins can view all payment transactions" ON payment_transactions;
DROP POLICY IF EXISTS "System can insert payment transactions" ON payment_transactions;

-- Users can view their own payment transactions
CREATE POLICY "Users can view own payment transactions" ON payment_transactions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = payment_transactions.order_id 
            AND orders.user_id = auth.uid()
        )
    );

-- Admins can view all payment transactions
CREATE POLICY "Admins can view all payment transactions" ON payment_transactions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.user_id = auth.uid() 
            AND user_profiles.role = 'admin'
        )
    );

-- System can insert payment transactions (for order creation)
CREATE POLICY "System can insert payment transactions" ON payment_transactions
    FOR INSERT WITH CHECK (true);

-- Add trigger for updated_at
DROP TRIGGER IF EXISTS update_payment_transactions_updated_at ON payment_transactions;
CREATE TRIGGER update_payment_transactions_updated_at
    BEFORE UPDATE ON payment_transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_payment_transactions_order_id ON payment_transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON payment_transactions(status);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_created_at ON payment_transactions(created_at);

-- Comments
COMMENT ON TABLE payment_transactions IS 'Payment transaction history for orders';
COMMENT ON COLUMN payment_transactions.order_id IS 'Reference to the order this transaction belongs to';
COMMENT ON COLUMN payment_transactions.transaction_type IS 'Type of transaction: payment, refund, partial_payment';
COMMENT ON COLUMN payment_transactions.payment_method IS 'Payment method used: paypal, bank_transfer, iban';
COMMENT ON COLUMN payment_transactions.amount IS 'Transaction amount in GBP';
COMMENT ON COLUMN payment_transactions.status IS 'Transaction status: pending, completed, failed, cancelled';
COMMENT ON COLUMN payment_transactions.transaction_reference IS 'External transaction reference (PayPal ID, bank ref, etc.)';
COMMENT ON COLUMN payment_transactions.notes IS 'Additional transaction notes or instructions';

-- Function to calculate remaining amount based on payment plan
CREATE OR REPLACE FUNCTION calculate_remaining_amount(order_total DECIMAL, amount_paid DECIMAL, payment_plan VARCHAR)
RETURNS DECIMAL AS $$
BEGIN
  IF payment_plan = 'half' THEN
    RETURN GREATEST(0, (order_total / 2) - amount_paid);
  ELSE
    RETURN GREATEST(0, order_total - amount_paid);
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to update order payment status based on payments (fixed ambiguous column reference)
CREATE OR REPLACE FUNCTION update_order_payment_status()
RETURNS TRIGGER AS $$
DECLARE
  order_total DECIMAL;
  total_paid DECIMAL;
  order_payment_plan VARCHAR;
  required_amount DECIMAL;
BEGIN
  -- Get order details
  SELECT total_amount, payment_plan INTO order_total, order_payment_plan
  FROM orders WHERE id = NEW.order_id;
  
  -- Calculate total amount paid for this order
  SELECT COALESCE(SUM(amount), 0) INTO total_paid
  FROM payment_transactions 
  WHERE order_id = NEW.order_id 
  AND status = 'completed'
  AND transaction_type = 'payment';
  
  -- Determine required amount based on payment plan
  IF order_payment_plan = 'half' THEN
    required_amount := order_total / 2;
  ELSE
    required_amount := order_total;
  END IF;
  
  -- Update order payment status and amounts
  UPDATE orders SET
    amount_paid = total_paid,
    remaining_amount = calculate_remaining_amount(order_total, total_paid, order_payment_plan),
    payment_status = CASE
      WHEN total_paid >= order_total THEN 'paid'
      WHEN total_paid >= required_amount THEN 'partially_paid'
      WHEN total_paid > 0 THEN 'partial'
      ELSE 'pending'
    END
  WHERE id = NEW.order_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update order payment status
DROP TRIGGER IF EXISTS update_order_payment_status_trigger ON payment_transactions;
CREATE TRIGGER update_order_payment_status_trigger
  AFTER INSERT OR UPDATE OF status ON payment_transactions
  FOR EACH ROW EXECUTE FUNCTION update_order_payment_status();

-- Add performance indexes
CREATE INDEX IF NOT EXISTS idx_orders_payment_plan ON orders(payment_plan);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);

-- Ensure order_items table has proper foreign key constraints
-- This will help catch foreign key violations early
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    part_id INTEGER REFERENCES parts(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add constraints to ensure data integrity
ALTER TABLE order_items 
  ADD CONSTRAINT IF NOT EXISTS check_quantity_positive 
  CHECK (quantity > 0);

ALTER TABLE order_items 
  ADD CONSTRAINT IF NOT EXISTS check_price_positive 
  CHECK (price >= 0);

-- Add index for better performance on part_id lookups
CREATE INDEX IF NOT EXISTS idx_order_items_part_id ON order_items(part_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- Enable RLS on order_items if not already enabled
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for order_items (if they don't exist)
DROP POLICY IF EXISTS "Users can view their order items" ON order_items;
CREATE POLICY "Users can view their order items" ON order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_items.order_id 
            AND orders.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can create order items for their orders" ON order_items;
CREATE POLICY "Users can create order items for their orders" ON order_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_items.order_id 
            AND orders.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Admins can manage all order items" ON order_items;
CREATE POLICY "Admins can manage all order items" ON order_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.user_id = auth.uid() 
            AND user_profiles.role = 'admin'
        )
    );