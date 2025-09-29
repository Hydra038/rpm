import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    console.log('Admin orders API called');
    
    // Use service role to bypass RLS
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

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

    console.log('Orders query result:', { 
      ordersFound: orders?.length || 0, 
      error: error,
      sampleOrder: orders?.[0]
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

    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', orderId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting order:', error);
    return NextResponse.json(
      { error: 'Failed to delete order' },
      { status: 500 }
    );
  }
}