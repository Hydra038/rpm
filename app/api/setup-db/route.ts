import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST() {
  try {
    // Use service role key for admin operations
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    console.log('Creating tables...');
    
    // Create the parts table
    const { error: createTableError } = await supabase.rpc('exec_sql', {
      query: `
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
        
        CREATE INDEX IF NOT EXISTS idx_parts_category ON parts(category);
        CREATE INDEX IF NOT EXISTS idx_parts_price ON parts(price);
        CREATE INDEX IF NOT EXISTS idx_parts_name ON parts(name);
        
        ALTER TABLE parts ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "Anyone can view parts" ON parts;
        CREATE POLICY "Anyone can view parts" ON parts FOR SELECT TO anon, authenticated;
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

    // Test if table exists by trying to count records
    const { data: testData, error: testError } = await supabase
      .from('parts')
      .select('*', { count: 'exact', head: true });

    if (testError) {
      return NextResponse.json({
        success: false,
        error: 'Table test failed',
        details: testError
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Database setup successful',
      partsCount: testData || 0
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