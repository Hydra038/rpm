import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    // Create service role client to bypass RLS
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    console.log('Fetching orders list...');
    
    // Get all orders
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching orders:', error);
      return NextResponse.json(
        { error: 'Failed to fetch orders: ' + error.message },
        { status: 500 }
      );
    }

    console.log('Orders found:', orders?.length || 0);
    
    return NextResponse.json({
      success: true,
      orders: orders || [],
      count: orders?.length || 0
    });

  } catch (error: any) {
    console.error('Error in orders list:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}