import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

export async function POST() {
  try {
    console.log('Starting to seed database using database function...');
    
    // Call the database function that bypasses RLS
    const { data, error } = await supabase.rpc('seed_parts');
    
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