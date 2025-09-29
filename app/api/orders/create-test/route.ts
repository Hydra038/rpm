import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
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

    console.log('Creating test order...');
    
    // Create a test order with all payment-related fields
    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        user_id: '00000000-0000-0000-0000-000000000000', // Dummy UUID
        total_amount: 99.99,
        status: 'confirmed',
        payment_status: 'pending',
        payment_method: 'paypal',
        payment_plan: 'full',
        amount_paid: 0,
        remaining_amount: 99.99,
        customer_name: 'John Smith',
        customer_email: 'john.smith@example.com',
        customer_phone: '+44 7700 900123',
        delivery_address: '123 Test Street, Manchester, M1 1AA, UK',
        product_name: 'Premium Brake Pads Set',
        product_price: 99.99,
        quantity: 1,
        notes: 'Test order for invoice generation'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating test order:', error);
      return NextResponse.json(
        { error: 'Failed to create test order: ' + error.message },
        { status: 500 }
      );
    }

    console.log('Test order created:', order);
    
    return NextResponse.json({
      success: true,
      message: 'Test order created successfully',
      order: order,
      invoice_url: `/api/orders/${order.id}/invoice`
    });

  } catch (error: any) {
    console.error('Error creating test order:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}