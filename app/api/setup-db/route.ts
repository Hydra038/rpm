import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST() {
  try {
    // Check if required environment variables are available
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || (!serviceRoleKey && !anonKey)) {
      return NextResponse.json({
        success: false,
        error: 'Supabase configuration missing',
        message: 'Please check your environment variables',
        required: [
          'NEXT_PUBLIC_SUPABASE_URL',
          'SUPABASE_SERVICE_ROLE_KEY (recommended) or NEXT_PUBLIC_SUPABASE_ANON_KEY'
        ]
      });
    }

    // Use service role key for admin operations, fallback to anon key
    const supabase = createClient(
      supabaseUrl,
      serviceRoleKey || anonKey!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    console.log('Setup DB using key type:', serviceRoleKey ? 'service_role' : 'anon');

    console.log('Creating tables...');
    
    // Create the database tables
    const { error: createTableError } = await supabase.rpc('exec_sql', {
      query: `
        -- Parts table
        CREATE TABLE IF NOT EXISTS parts (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          category VARCHAR(100),
          price DECIMAL(10,2) NOT NULL,
          description TEXT,
          image_url TEXT,
          stock_quantity INTEGER DEFAULT 0,
          part_number VARCHAR(100),
          manufacturer VARCHAR(100),
          weight DECIMAL(8,2),
          dimensions VARCHAR(100),
          compatible_vehicles TEXT,
          make VARCHAR(50),
          model VARCHAR(50),
          year_from INTEGER,
          year_to INTEGER,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
        
        -- Orders table with extended payment fields
        CREATE TABLE IF NOT EXISTS orders (
          id SERIAL PRIMARY KEY,
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
          total_amount DECIMAL(10,2) NOT NULL,
          status VARCHAR(50) DEFAULT 'pending',
          payment_status VARCHAR(50) DEFAULT 'pending',
          payment_method VARCHAR(50),
          payment_plan VARCHAR(50) DEFAULT 'full',
          amount_paid DECIMAL(10,2) DEFAULT 0,
          remaining_amount DECIMAL(10,2),
          payment_due_date DATE,
          shipping_address JSONB,
          billing_address JSONB,
          tracking_number VARCHAR(100),
          notes TEXT,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
        
        -- Add billing_address column if it doesn't exist (for existing tables)
        DO $$ 
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'orders' AND column_name = 'billing_address'
          ) THEN
            ALTER TABLE orders ADD COLUMN billing_address JSONB;
          END IF;
        END $$;
        
        -- Order Items table
        CREATE TABLE IF NOT EXISTS order_items (
          id SERIAL PRIMARY KEY,
          order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
          part_id INTEGER REFERENCES parts(id) ON DELETE CASCADE,
          quantity INTEGER NOT NULL DEFAULT 1,
          price DECIMAL(10,2) NOT NULL,
          created_at TIMESTAMP DEFAULT NOW()
        );
        
        -- Payment Transactions table
        CREATE TABLE IF NOT EXISTS payment_transactions (
          id SERIAL PRIMARY KEY,
          order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
          transaction_type VARCHAR(50) NOT NULL,
          payment_method VARCHAR(50),
          amount DECIMAL(10,2) NOT NULL,
          status VARCHAR(50) DEFAULT 'pending',
          notes TEXT,
          created_at TIMESTAMP DEFAULT NOW()
        );
        
        -- Create indexes
        CREATE INDEX IF NOT EXISTS idx_parts_category ON parts(category);
        CREATE INDEX IF NOT EXISTS idx_parts_price ON parts(price);
        CREATE INDEX IF NOT EXISTS idx_parts_name ON parts(name);
        CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
        CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
        CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
        
        -- Enable RLS
        ALTER TABLE parts ENABLE ROW LEVEL SECURITY;
        ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
        ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
        
        -- Drop existing policies
        DROP POLICY IF EXISTS "Anyone can view parts" ON parts;
        DROP POLICY IF EXISTS "Users can view their orders" ON orders;
        DROP POLICY IF EXISTS "Users can create orders" ON orders;
        DROP POLICY IF EXISTS "Users can view their order items" ON order_items;
        DROP POLICY IF EXISTS "Users can create order items" ON order_items;
        
        -- Create policies
        CREATE POLICY "Anyone can view parts" ON parts FOR SELECT TO anon, authenticated;
        CREATE POLICY "Users can view their orders" ON orders FOR SELECT TO authenticated USING (auth.uid() = user_id);
        CREATE POLICY "Users can create orders" ON orders FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
        CREATE POLICY "Users can view their order items" ON order_items FOR SELECT TO authenticated USING (
          EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
        );
        CREATE POLICY "Users can create order items" ON order_items FOR INSERT TO authenticated WITH CHECK (
          EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
        );
      `
    });

    if (createTableError) {
      console.error('Error creating table:', createTableError);
      // If exec_sql doesn't exist, try direct SQL execution
      const { error: directError } = await supabase
        .from('parts')
        .select('id')
        .limit(1);
        
      if (directError && directError.message.includes('relation "parts" does not exist')) {
        return NextResponse.json({
          success: false,
          error: 'Database schema not applied',
          message: 'Please apply the schema in Supabase SQL Editor first',
          instructions: [
            '1. Go to https://supabase.com/dashboard',
            '2. Select your project',
            '3. Go to SQL Editor',
            '4. Copy the schema from lib/supabase/schema-simple.sql',
            '5. Run the query to create tables'
          ]
        });
      }
    }

    // Test if tables exist by trying to count records
    const { count: partsCount, error: partsError } = await supabase
      .from('parts')
      .select('*', { count: 'exact', head: true });

    const { count: ordersCount, error: ordersError } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });

    if (partsError || ordersError) {
      return NextResponse.json({
        success: false,
        error: 'Table test failed',
        details: { partsError, ordersError }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Database setup successful - all tables ready for checkout',
      tables: {
        parts: partsCount || 0,
        orders: ordersCount || 0
      }
    });

  } catch (error: any) {
    console.error('Setup error:', error);
    return NextResponse.json({
      success: false,
      error: 'Setup failed',
      message: error.message
    });
  }
}