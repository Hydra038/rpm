import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    console.log('=== ADMIN ORDERS DEBUG ===');
    console.log('Service role key available:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
    console.log('Using key type:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'service_role' : 'anon_key');
    
    // Use service role to bypass RLS
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

    // First test: Simple order count
    const { count, error: countError } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });
    
    console.log('Total orders count:', count, 'Error:', countError?.message);

    // Second test: Basic order fetch
    const { data: basicOrders, error: basicError } = await supabase
      .from('orders')
      .select('id, user_id, status, created_at, total_amount')
      .limit(5);
    
    console.log('Basic orders fetch:', {
      found: basicOrders?.length || 0,
      error: basicError?.message,
      sample: basicOrders?.[0]
    });

    // Get orders with items and part details
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          quantity,
          price,
          parts (
            id,
            name,
            image_url,
            category
          )
        )
      `)
      .order('created_at', { ascending: false });

    console.log('Final orders query result:', {
      ordersFound: orders?.length || 0,
      error: error?.message,
      hasOrderItems: orders?.[0]?.order_items?.length > 0
    });

    if (error) {
      console.error('Orders query error:', error);
      throw error;
    }

    return NextResponse.json({ orders: orders || [] });
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders: ' + error.message, orders: [] },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { orderId, updates } = await request.json();

    // Use service role to bypass RLS
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Only update the fields that exist in the orders table
    const allowedUpdates: any = {};
    
    // Only include fields that exist in the orders table
    if (updates.status !== undefined) allowedUpdates.status = updates.status;
    if (updates.payment_status !== undefined) allowedUpdates.payment_status = updates.payment_status;
    if (updates.tracking_number !== undefined) allowedUpdates.tracking_number = updates.tracking_number;
    if (updates.notes !== undefined) allowedUpdates.notes = updates.notes;

    const { data, error } = await supabase
      .from('orders')
      .update(allowedUpdates)
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      console.error('Order update error:', error);
      throw error;
    }

    return NextResponse.json({ order: data });
  } catch (error: any) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order: ' + error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { orderId } = await request.json();

    // Use service role to bypass RLS
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // First, delete all order items for this order
    const { error: orderItemsError } = await supabase
      .from('order_items')
      .delete()
      .eq('order_id', orderId);

    if (orderItemsError) {
      console.error('Error deleting order items:', orderItemsError);
      throw orderItemsError;
    }

    // Then delete the order itself
    const { error: orderError } = await supabase
      .from('orders')
      .delete()
      .eq('id', orderId);

    if (orderError) {
      console.error('Error deleting order:', orderError);
      throw orderError;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting order:', error);
    return NextResponse.json(
      { error: 'Failed to delete order: ' + error.message },
      { status: 500 }
    );
  }
}