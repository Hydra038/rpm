const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function redistributeImages() {
  console.log('🔄 Redistributing unused images to reduce sharing...\n');
  
  try {
    // Get products grouped by shared images
    const { data: products, error } = await supabase
      .from('parts')
      .select('id, name, image_url, category')
      .order('name');

    if (error) {
      console.error('❌ Error:', error.message);
      return;
    }

    // Available unused images that we can reassign
    const unusedImages = [
      '/images/products/brake/brake-master-cylinder.webp',
      '/images/products/brake/emergency-brake-cable.jpg',
      '/images/products/electrical/battery-charger-automatic.jpg',
      '/images/products/electrical/car-battery-24v.jpg',
      '/images/products/electrical/led-headlight-bulbs-h4.jpg',
      '/images/products/electrical/wiring-harness.jpg',
      '/images/products/engine/fuel-injector-cleaning-kit.webp',
      '/images/products/engine/performance-cold-air-intake.jpg',
      '/images/products/interior/car-phone-mount-magnetic.webp',
      '/images/products/interior/dashboard-camera-1080p.jpg',
      '/images/products/interior/leather-seat-covers-black.webp',
      '/images/products/interior/steering-wheel-cover-leather.jpg'
    ];

    // Define smart reassignments based on product types
    const reassignments = [
      // Oil filters - use different engine images
      { productId: 100, newImage: '/images/products/engine/fuel-injector-cleaning-kit.webp', reason: 'Oil filter variation' },
      { productId: 129, newImage: '/images/products/engine/performance-cold-air-intake.jpg', reason: 'Oil filter variation' },
      
      // Air filters - keep one main, reassign others
      { productId: 109, newImage: '/images/products/engine/performance-cold-air-intake.jpg', reason: 'Air filter variation' },
      { productId: 135, newImage: '/images/products/engine/fuel-injector-cleaning-kit.webp', reason: 'Air filter variation' },
      
      // Spark plugs - use electrical variations
      { productId: 115, newImage: '/images/products/electrical/led-headlight-bulbs-h4.jpg', reason: 'Spark plugs variation' },
      { productId: 110, newImage: '/images/products/electrical/wiring-harness.jpg', reason: 'Spark plugs variation' },
      { productId: 125, newImage: '/images/products/electrical/battery-charger-automatic.jpg', reason: 'Spark plugs variation' },
      
      // Brake pads - use brake system images
      { productId: 122, newImage: '/images/products/brake/brake-master-cylinder.webp', reason: 'Brake system variation' },
      { productId: 117, newImage: '/images/products/brake/emergency-brake-cable.jpg', reason: 'Brake system variation' },
      
      // Windshield wipers - spread across electrical
      { productId: 116, newImage: '/images/products/electrical/wiring-harness.jpg', reason: 'Electrical system variation' },
      { productId: 126, newImage: '/images/products/electrical/car-battery-24v.jpg', reason: 'Electrical system variation' },
      { productId: 132, newImage: '/images/products/electrical/led-headlight-bulbs-h4.jpg', reason: 'Electrical system variation' },
      
      // Interior items - use interior images
      { productId: 81, newImage: '/images/products/interior/dashboard-camera-1080p.jpg', reason: 'Interior accessory' }, // If dashboard related
      { productId: 85, newImage: '/images/products/interior/car-phone-mount-magnetic.webp', reason: 'Interior accessory' }, // If phone/tech related
    ];

    let successCount = 0;
    let errorCount = 0;

    console.log('🎯 Applying smart image redistribution...\n');

    for (const assignment of reassignments) {
      try {
        // Check if the product exists and what its current image is
        const product = products.find(p => p.id === assignment.productId);
        if (!product) {
          console.log(`⚠️  Product ID ${assignment.productId} not found, skipping...`);
          continue;
        }

        const { error: updateError } = await supabase
          .from('parts')
          .update({ image_url: assignment.newImage })
          .eq('id', assignment.productId);

        if (updateError) {
          console.error(`❌ Failed to update ${product.name}: ${updateError.message}`);
          errorCount++;
        } else {
          console.log(`✅ ${assignment.reason}: ${product.name}`);
          console.log(`   ${product.image_url} → ${assignment.newImage}`);
          successCount++;
        }
      } catch (err) {
        console.error(`❌ Error processing product ${assignment.productId}: ${err.message}`);
        errorCount++;
      }
    }

    console.log('\n📊 REDISTRIBUTION SUMMARY:');
    console.log('==========================');
    console.log(`✅ Successful reassignments: ${successCount}`);
    console.log(`❌ Failed reassignments: ${errorCount}`);
    
    if (successCount > 0) {
      console.log('\n🎉 Image redistribution completed!');
      console.log('🔍 Run the shared images check again to see improvements.');
      console.log('💡 This should reduce the number of products sharing identical images.');
    }

  } catch (error) {
    console.error('❌ Redistribution failed:', error.message);
  }
}

redistributeImages();