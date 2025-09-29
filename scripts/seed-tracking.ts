import { createAdminClient } from '../lib/supabase/admin';

const SAMPLE_TRACKING_NUMBERS = [
  'RPM12345678ABC',
  'RPM87654321XYZ',
  'RPM19283746DEF',
  'RPM65432187GHI',
  'RPM98765432JKL'
];

async function seedTrackingNumbers() {
  const supabase = createAdminClient();

  try {
    console.log('🚚 Starting tracking number seeding...');

    // Get existing orders without tracking numbers
    const { data: orders, error: fetchError } = await supabase
      .from('orders')
      .select('id, status')
      .is('tracking_number', null)
      .limit(5);

    if (fetchError) {
      throw fetchError;
    }

    if (!orders || orders.length === 0) {
      console.log('No orders found without tracking numbers. Creating sample orders...');
      
      // Create sample orders with tracking numbers
      const sampleOrders = [
        {
          user_id: '00000000-0000-0000-0000-000000000000', // System user
          total_amount: 299.99,
          status: 'shipped',
          payment_status: 'paid',
          tracking_number: SAMPLE_TRACKING_NUMBERS[0],
          payment_method: 'card',
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
        },
        {
          user_id: '00000000-0000-0000-0000-000000000000',
          total_amount: 459.50,
          status: 'processing',
          payment_status: 'paid',
          tracking_number: null, // Will be assigned when shipped
          payment_method: 'bank_transfer',
          created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
        },
        {
          user_id: '00000000-0000-0000-0000-000000000000',
          total_amount: 125.75,
          status: 'delivered',
          payment_status: 'paid',
          tracking_number: SAMPLE_TRACKING_NUMBERS[1],
          payment_method: 'paypal',
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago
        }
      ];

      const { error: insertError } = await supabase
        .from('orders')
        .insert(sampleOrders);

      if (insertError) {
        console.error('Error creating sample orders:', insertError);
      } else {
        console.log('✅ Created 3 sample orders with tracking information');
      }
    } else {
      // Update existing orders with tracking numbers
      for (let i = 0; i < orders.length && i < SAMPLE_TRACKING_NUMBERS.length; i++) {
        const order = orders[i];
        const trackingNumber = SAMPLE_TRACKING_NUMBERS[i];
        
        // Update status to shipped if it's processing
        const updateData: any = {
          tracking_number: trackingNumber,
          updated_at: new Date().toISOString()
        };
        
        if (order.status === 'pending' || order.status === 'processing') {
          updateData.status = 'shipped';
        }

        const { error: updateError } = await supabase
          .from('orders')
          .update(updateData)
          .eq('id', order.id);

        if (updateError) {
          console.error(`Error updating order ${order.id}:`, updateError);
        } else {
          console.log(`✅ Updated order ${order.id} with tracking number ${trackingNumber}`);
        }
      }
    }

    // Show sample tracking commands for testing
    console.log('\n📦 Sample tracking numbers for testing:');
    SAMPLE_TRACKING_NUMBERS.forEach(tracking => {
      console.log(`- ${tracking}`);
    });

    console.log('\n🔗 Test URLs:');
    console.log('- http://localhost:3001/track');
    console.log(`- http://localhost:3001/track?order=${SAMPLE_TRACKING_NUMBERS[0]}`);
    console.log('- http://localhost:3001/account (to see orders with tracking buttons)');

    console.log('\n✅ Tracking number seeding completed!');

  } catch (error) {
    console.error('❌ Error seeding tracking numbers:', error);
  }
}

// Run if called directly
if (require.main === module) {
  seedTrackingNumbers().then(() => process.exit(0));
}

export { seedTrackingNumbers };