import { createAdminClient } from '../lib/supabase/admin';

const SAMPLE_TRACKING_NUMBERS = [
  'RPM12345678ABC',
  'RPM87654321XYZ', 
  'RPM19283746DEF',
  'RPM65432187GHI',
  'RPM98765432JKL'
];

async function createTestOrders() {
  const supabase = createAdminClient();

  try {
    console.log('🚚 Creating test orders with tracking numbers...');

    // Create sample orders with tracking numbers
    const sampleOrders = [
      {
        user_id: '00000000-0000-0000-0000-000000000000', // System user
        total_amount: 299.99,
        status: 'shipped',
        payment_status: 'paid',
        tracking_number: SAMPLE_TRACKING_NUMBERS[0],
        payment_method: 'card',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        shipping_address: {
          address_line1: '123 Main Street',
          city: 'London',
          postcode: 'SW1A 1AA',
          country: 'United Kingdom'
        },
        billing_address: {
          address_line1: '123 Main Street',
          city: 'London', 
          postcode: 'SW1A 1AA',
          country: 'United Kingdom'
        }
      },
      {
        user_id: '00000000-0000-0000-0000-000000000000',
        total_amount: 459.50,
        status: 'processing',
        payment_status: 'paid',
        tracking_number: null, // Will be assigned when shipped
        payment_method: 'bank_transfer',
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        shipping_address: {
          address_line1: '456 Oak Avenue',
          city: 'Manchester',
          postcode: 'M1 1AA',
          country: 'United Kingdom'
        }
      },
      {
        user_id: '00000000-0000-0000-0000-000000000000',
        total_amount: 125.75,
        status: 'delivered',
        payment_status: 'paid',
        tracking_number: SAMPLE_TRACKING_NUMBERS[1],
        payment_method: 'paypal',
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        shipping_address: {
          address_line1: '789 Pine Road',
          city: 'Birmingham',
          postcode: 'B1 1AA',
          country: 'United Kingdom'
        }
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

    // Show sample tracking commands for testing
    console.log('\n📦 Sample tracking numbers for testing:');
    SAMPLE_TRACKING_NUMBERS.forEach(tracking => {
      console.log(`- ${tracking}`);
    });

    console.log('\n🔗 Test URLs:');
    console.log('- http://localhost:3002/track');
    console.log(`- http://localhost:3002/track?order=${SAMPLE_TRACKING_NUMBERS[0]}`);
    console.log('- http://localhost:3002/account (to see orders with tracking buttons)');

    console.log('\n✅ Test orders created successfully!');

  } catch (error) {
    console.error('❌ Error creating test orders:', error);
  }
}

// Run the function
createTestOrders();