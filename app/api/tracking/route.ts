import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, trackingNumber, status } = body;

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

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

    // Update order with tracking number and status
    const updateData: any = { updated_at: new Date().toISOString() };
    
    if (trackingNumber) {
      updateData.tracking_number = trackingNumber.toUpperCase();
    }
    
    if (status) {
      updateData.status = status;
    }

    const { data, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', orderId)
      .select('*')
      .single();

    if (error) {
      console.error('Error updating order:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // If status is being updated to shipped, automatically generate tracking number if not provided
    if (status === 'shipped' && !trackingNumber && !data.tracking_number) {
      const generatedTracking = `RPM${Date.now().toString().slice(-8)}${Math.random().toString(36).substr(2, 3).toUpperCase()}`;
      
      const { data: updatedData, error: trackingError } = await supabase
        .from('orders')
        .update({ tracking_number: generatedTracking })
        .eq('id', orderId)
        .select('*')
        .single();

      if (trackingError) {
        console.error('Error generating tracking number:', trackingError);
      } else {
        return NextResponse.json({ 
          success: true, 
          order: updatedData,
          message: `Order updated and tracking number generated: ${generatedTracking}`
        });
      }
    }

    return NextResponse.json({ 
      success: true, 
      order: data,
      message: 'Order updated successfully'
    });

  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const trackingNumber = searchParams.get('tracking');
    const orderId = searchParams.get('order');

    if (!trackingNumber && !orderId) {
      return NextResponse.json({ error: 'Tracking number or order ID is required' }, { status: 400 });
    }

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

    let query = supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          quantity,
          price,
          parts (
            name,
            image_url
          )
        )
      `);

    if (trackingNumber) {
      query = query.eq('tracking_number', trackingNumber.toUpperCase());
    } else if (orderId) {
      query = query.eq('id', orderId);
    }

    const { data, error } = await query.single();

    if (error) {
      console.error('Error fetching order:', error);
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ order: data });

  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}