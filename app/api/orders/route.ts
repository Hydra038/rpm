import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    // Create service role client to bypass RLS for order creation
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

    const body = await request.json();
    console.log('Creating order with data:', body);

    const {
      user_id,
      items,
      total_amount,
      shipping_address,
      billing_address,
      payment_method,
      payment_plan,
      notes
    } = body;

    // Validate required fields
    if (!user_id || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: user_id, items' },
        { status: 400 }
      );
    }

    // Check if orders table exists and what columns it has
    const { data: existingOrders, error: tableError } = await supabase
      .from('orders')
      .select('*')
      .limit(1);

    console.log('Orders table test:', { exists: !tableError, error: tableError });

    // Create the order with the fields that exist in the current schema
    const orderData: any = {
      user_id,
      total_amount,
      status: 'pending',
      payment_status: 'pending',
      shipping_address,
      billing_address,
      notes: notes || `Payment method: ${payment_method}. Payment plan: ${payment_plan}.`
    };

    // Add extended fields if they exist in the database
    const extendedFields = [
      'payment_method',
      'payment_plan', 
      'amount_paid',
      'remaining_amount',
      'payment_due_date'
    ];

    // Try to determine if extended fields exist by attempting an insert with them
    try {
      // Calculate payment amounts
      const paymentAmount = payment_plan === 'half' ? total_amount / 2 : total_amount;
      const paymentDueDate = payment_plan === 'half' 
        ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        : null;

      const extendedOrderData = {
        ...orderData,
        payment_method,
        payment_plan,
        amount_paid: 0,
        remaining_amount: paymentAmount,
        payment_due_date: paymentDueDate
      };

      console.log('Attempting order creation with extended fields:', extendedOrderData);

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert(extendedOrderData)
        .select()
        .single();

      if (orderError) {
        console.log('Extended fields failed, trying basic fields:', orderError);
        
        // Fallback to basic fields only
        const { data: basicOrder, error: basicError } = await supabase
          .from('orders')
          .insert(orderData)
          .select()
          .single();

        if (basicError) {
          console.error('Basic order creation failed:', basicError);
          return NextResponse.json(
            { error: 'Failed to create order: ' + basicError.message },
            { status: 500 }
          );
        }

        console.log('Order created with basic fields:', basicOrder);
        
        // Create order items
        await createOrderItems(supabase, basicOrder.id, items);
        
        return NextResponse.json({
          success: true,
          order: basicOrder,
          message: 'Order created successfully (basic mode)'
        });
      }

      console.log('Order created with extended fields:', order);
      
      // Create order items
      await createOrderItems(supabase, order.id, items);

      // Create payment transaction record if we have payment tables
      try {
        await supabase
          .from('payment_transactions')
          .insert({
            order_id: order.id,
            transaction_type: 'payment',
            payment_method,
            amount: paymentAmount,
            status: 'pending',
            notes: `Initial ${payment_plan} payment. ${payment_method === 'bank_transfer' ? 'Awaiting bank transfer.' : 'PayPal payment pending.'}`
          });
      } catch (paymentError) {
        console.log('Payment transaction creation failed (table may not exist):', paymentError);
      }

      return NextResponse.json({
        success: true,
        order,
        message: 'Order created successfully'
      });

    } catch (createError) {
      console.error('Order creation error:', createError);
      return NextResponse.json(
        { error: 'Failed to create order: ' + createError.message },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

async function createOrderItems(supabase: any, orderId: number, items: any[]) {
  const orderItems = items.map(item => ({
    order_id: orderId,
    part_id: parseInt(item.id),
    quantity: item.quantity,
    price: item.price
  }));

  const { error } = await supabase
    .from('order_items')
    .insert(orderItems);

  if (error) {
    console.error('Order items creation error:', error);
    throw new Error('Failed to create order items: ' + error.message);
  }

  console.log('Order items created successfully');
}

export async function GET() {
  return NextResponse.json({
    message: 'Orders API endpoint - use POST to create orders'
  });
}