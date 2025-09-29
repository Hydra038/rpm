import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    console.log('Admin stats API called - using service role if available');

    // Use service role if available, otherwise fall back to anon key
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    
    const supabase = createClient(supabaseUrl, serviceRoleKey || anonKey);
    
    console.log('Service role available:', !!serviceRoleKey);

    // Try to get orders with simplified query
    const { data: orders, error: orderError } = await supabase
      .from('orders')
      .select('id, total_amount, status, created_at, user_id');

    console.log('Orders query result:', { 
      ordersFound: orders?.length || 0, 
      error: orderError,
      sampleOrder: orders?.[0]
    });

    const { data: parts, error: partsError } = await supabase
      .from('parts')
      .select('id');

    console.log('Parts query result:', { 
      partsFound: parts?.length || 0, 
      error: partsError
    });

    // Calculate stats
    const orderCount = orders?.length || 0;
    const totalRevenue = orders?.reduce((sum, order) => {
      const amount = Number(order.total_amount) || 0;
      return sum + amount;
    }, 0) || 0;

    // Get recent orders with basic info
    const recentOrders = orders
      ?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      ?.slice(0, 5)
      ?.map(order => ({
        id: order.id,
        total_amount: order.total_amount,
        status: order.status,
        created_at: order.created_at,
        user_id: order.user_id
      })) || [];

    const result = {
      totalProducts: parts?.length || 0,
      totalOrders: orderCount,
      totalRevenue,
      recentOrders
    };

    console.log('Admin stats final result:', result);
    return NextResponse.json(result);
    
  } catch (error: any) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch admin stats: ' + error.message,
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
        recentOrders: []
      },
      { status: 500 }
    );
  }
}