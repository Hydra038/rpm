import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Use admin client with service role for seeding
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function POST() {
  try {
    console.log('Starting to seed database using database function...');
    
    // Call the database function that bypasses RLS using admin client
    const { data, error } = await supabaseAdmin.rpc('seed_parts');
    
    if (error) {
      console.error('Error calling seed function:', error);
      return NextResponse.json(
        { error: 'Failed to seed products: ' + error.message },
        { status: 500 }
      );
    }
    
    console.log('Seed function result:', data);
    
    if (data.success) {
      return NextResponse.json({ 
        message: data.message,
        count: data.count
      });
    } else {
      return NextResponse.json(
        { error: data.message },
        { status: 500 }
      );
    }
    
  } catch (error: any) {
    console.error('Error seeding products:', error);
    return NextResponse.json(
      { error: 'Failed to seed products: ' + error.message },
      { status: 500 }
    );
  }
}