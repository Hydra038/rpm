-- Add payment system tables and update existing schema
-- Run this in your Supabase SQL Editor

-- Create payment settings table for admin configuration
CREATE TABLE IF NOT EXISTS payment_settings (
  id SERIAL PRIMARY KEY,
  paypal_email VARCHAR(255),
  bank_name VARCHAR(255),
  account_holder_name VARCHAR(255),
  account_number VARCHAR(100),
  sort_code VARCHAR(20),
  swift_code VARCHAR(20),
  bank_address TEXT,
  payment_instructions TEXT,
  iban VARCHAR(34), -- International Bank Account Number for international transfers
  paypal_enabled BOOLEAN DEFAULT true, -- Enable/disable PayPal payment option
  bank_transfer_enabled BOOLEAN DEFAULT true, -- Enable/disable bank transfer payment option
  iban_enabled BOOLEAN DEFAULT false, -- Enable/disable IBAN transfer payment option
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add payment plan and method columns to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50) DEFAULT 'paypal',
ADD COLUMN IF NOT EXISTS payment_plan VARCHAR(20) DEFAULT 'full',
ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS amount_paid DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS remaining_amount DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS payment_due_date DATE,
ADD COLUMN IF NOT EXISTS payment_reference VARCHAR(100),
ADD COLUMN IF NOT EXISTS bank_transfer_proof TEXT,
ADD COLUMN IF NOT EXISTS customer_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS customer_email VARCHAR(255),
ADD COLUMN IF NOT EXISTS customer_phone VARCHAR(50),
ADD COLUMN IF NOT EXISTS delivery_address TEXT,
ADD COLUMN IF NOT EXISTS product_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS product_price DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS quantity INTEGER DEFAULT 1;

-- Create payment transactions table to track all payments
CREATE TABLE IF NOT EXISTS payment_transactions (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  transaction_type VARCHAR(20) DEFAULT 'payment', -- 'payment', 'refund'
  payment_method VARCHAR(50), -- 'paypal', 'bank_transfer'
  amount DECIMAL(10,2) NOT NULL,
  reference_number VARCHAR(100),
  transaction_date TIMESTAMP DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'completed', 'failed'
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert default payment settings
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
) ON CONFLICT DO NOTHING;

-- Enable RLS for new tables
ALTER TABLE payment_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

-- Payment settings policies (admin only)
CREATE POLICY "Admins can manage payment settings" ON payment_settings
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.user_id = auth.uid() 
      AND user_profiles.role = 'admin'
    )
  );

-- Payment transactions policies
CREATE POLICY "Users can view their payment transactions" ON payment_transactions
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = payment_transactions.order_id 
      AND (orders.user_id = auth.uid() OR 
           EXISTS (
             SELECT 1 FROM user_profiles 
             WHERE user_profiles.user_id = auth.uid() 
             AND user_profiles.role = 'admin'
           ))
    )
  );

CREATE POLICY "Admins can manage payment transactions" ON payment_transactions
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.user_id = auth.uid() 
      AND user_profiles.role = 'admin'
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_payment_transactions_order_id ON payment_transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON payment_transactions(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_method ON orders(payment_method);
CREATE INDEX IF NOT EXISTS idx_orders_payment_plan ON orders(payment_plan);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);

-- Function to calculate remaining payment amount
CREATE OR REPLACE FUNCTION calculate_remaining_amount(order_total DECIMAL, amount_paid DECIMAL, payment_plan VARCHAR)
RETURNS DECIMAL AS $$
BEGIN
  IF payment_plan = 'half' THEN
    RETURN (order_total / 2) - COALESCE(amount_paid, 0);
  ELSE
    RETURN order_total - COALESCE(amount_paid, 0);
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to update order payment status based on payments
CREATE OR REPLACE FUNCTION update_order_payment_status()
RETURNS TRIGGER AS $$
DECLARE
  order_total DECIMAL;
  total_paid DECIMAL;
  payment_plan VARCHAR;
  required_amount DECIMAL;
BEGIN
  -- Get order details
  SELECT total_amount, payment_plan INTO order_total, payment_plan
  FROM orders WHERE id = NEW.order_id;
  
  -- Calculate total amount paid for this order
  SELECT COALESCE(SUM(amount), 0) INTO total_paid
  FROM payment_transactions 
  WHERE order_id = NEW.order_id 
  AND status = 'completed'
  AND transaction_type = 'payment';
  
  -- Determine required amount based on payment plan
  IF payment_plan = 'half' THEN
    required_amount := order_total / 2;
  ELSE
    required_amount := order_total;
  END IF;
  
  -- Update order payment status and amounts
  UPDATE orders SET
    amount_paid = total_paid,
    remaining_amount = calculate_remaining_amount(order_total, total_paid, payment_plan),
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