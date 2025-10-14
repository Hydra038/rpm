import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST() {
  try {
    console.log('Starting to seed sample orders...');
    
    // Use service role to bypass RLS and create orders
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Use fixed sample user IDs and ensure they exist in user_profiles
    const sampleUserIds = [
      '11111111-1111-1111-1111-111111111111',
      '22222222-2222-2222-2222-222222222222',
      '33333333-3333-3333-3333-333333333333'
    ];

    console.log('Ensuring sample user profiles exist...');
    
    // Create/ensure sample user profiles exist (ignore errors if they already exist)
    const sampleUsers = [
      { user_id: sampleUserIds[0], email: 'customer1@example.com', first_name: 'John', last_name: 'Smith', role: 'customer' },
      { user_id: sampleUserIds[1], email: 'customer2@example.com', first_name: 'Jane', last_name: 'Doe', role: 'customer' },
      { user_id: sampleUserIds[2], email: 'customer3@example.com', first_name: 'Mike', last_name: 'Johnson', role: 'customer' }
    ];
    
    // Try to create each user profile, ignore errors if they already exist
    for (const user of sampleUsers) {
      try {
        const { error: insertError } = await supabase
          .from('user_profiles')
          .insert(user);
        
        if (insertError && insertError.code !== '23505') {
          console.log('User profile insert result for', user.email, ':', insertError.message);
        } else {
          console.log('User profile ready for', user.email);
        }
      } catch (error) {
        console.log('User profile setup for', user.email, '- probably already exists');
      }
    }

    const userIds = sampleUserIds;
    console.log('Using', userIds.length, 'sample user IDs for order creation');

    // Get some products to create orders with
    const { data: products, error: productsError } = await supabase
      .from('parts')
      .select('id, name, price')
      .limit(10);

    if (productsError || !products || products.length === 0) {
      console.error('Products error:', productsError);
      return NextResponse.json({
        error: 'No products found to create orders with'
      }, { status: 400 });
    }

    console.log('Found products:', products.length);

    // Sample orders data - distribute among sample users
    const sampleOrders = [
      {
        user_id: userIds[0],
        total_amount: 156.48,
        status: 'delivered',
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        items: [
          { part_id: products[0].id, quantity: 2, price: products[0].price },
          { part_id: products[1] ? products[1].id : products[0].id, quantity: 1, price: products[1] ? products[1].price : products[0].price }
        ]
      },
      {
        user_id: userIds[1],
        total_amount: 89.99,
        status: 'processing',
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        items: [
          { part_id: products[2] ? products[2].id : products[0].id, quantity: 1, price: products[2] ? products[2].price : products[0].price }
        ]
      },
      {
        user_id: userIds[2],
        total_amount: 234.50,
        status: 'pending',
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        items: [
          { part_id: products[3] ? products[3].id : products[0].id, quantity: 1, price: products[3] ? products[3].price : products[0].price }
        ]
      }
    ];

    // Create orders and order items
    const createdOrders = [];
    
    for (const orderData of sampleOrders) {
      console.log('Creating order for user:', orderData.user_id);
      
      // Create the order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: orderData.user_id,
          total_amount: orderData.total_amount,
          status: orderData.status,
          created_at: orderData.created_at
        })
        .select()
        .single();

      if (orderError) {
        console.error('Error creating order:', orderError);
        continue;
      }

      console.log('Created order:', order.id);

      // Create order items
      const orderItems = orderData.items.map(item => ({
        order_id: order.id,
        part_id: item.part_id,
        quantity: item.quantity,
        price: item.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('Error creating order items:', itemsError);
      } else {
        console.log('Created', orderItems.length, 'order items');
        createdOrders.push(order);
      }
    }

    // Verify the orders were created and are visible
    const { data: verifyOrders, error: verifyError } = await supabase
      .from('orders')
      .select('id, user_id, status')
      .in('id', createdOrders.map(o => o.id));
    
    if (verifyError) {
      console.error('Error verifying orders:', verifyError);
    } else {
      console.log('Verification: Orders visible after creation:', verifyOrders?.length || 0);
    }

    console.log(`Successfully seeded ${createdOrders.length} sample orders!`);
    
    return NextResponse.json({ 
      message: `Successfully seeded ${createdOrders.length} sample orders!`,
      orders: createdOrders.length,
      userIds: userIds.length,
      verified: verifyOrders?.length || 0
    });
  } catch (error: any) {
    console.error('Error seeding orders:', error);
    return NextResponse.json({
      error: 'Failed to seed orders: ' + error.message
    }, { status: 500 });
  }
}