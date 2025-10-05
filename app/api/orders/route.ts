import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Disable static optimization for this route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Initialize Supabase client at runtime
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({
        success: false,
        message: 'Server configuration error'
      }, { status: 500 });
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    let query = supabase
      .from('orders')
      .select(`
        *,
        order_items (
          quantity,
          price,
          parts (
            name,
            image_url
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data: orders, error } = await query;

    if (error) {
      console.error('Orders fetch error:', error);
      return NextResponse.json({
        success: false,
        message: 'Failed to fetch orders',
        error: error.message
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      orders: orders || []
    });
  } catch (error) {
    console.error('Orders API error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
