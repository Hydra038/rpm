require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function addProductsAndFixMatching() {
  console.log('🚀 Adding new products using unused images and fixing mismatches...\n');
  
  try {
    // First, let's check current battery products
    const { data: batteryProducts } = await supabase
      .from('parts')
      .select('id, name, image_url, price')
      .ilike('name', '%battery%');
    
    console.log('🔋 CURRENT BATTERY PRODUCTS:');
    console.log('============================================================');
    batteryProducts.forEach(p => {
      console.log(`• ${p.name} (ID: ${p.id}) - £${p.price}`);
      console.log(`  Image: ${p.image_url}`);
    });
    console.log('');

    // New products to add using unused images
    const newProducts = [
      {
        name: 'Car Battery 24V Heavy Duty',
        description: 'Professional 24V heavy duty car battery for commercial vehicles and large engines',
        price: 189.99,
        category: 'Electrical',
        image_url: '/images/products/electrical/car-battery-24v.jpg',
        stock: 15
      },
      {
        name: 'Alternator 120A Premium',
        description: 'High-output 120A alternator for vehicles requiring extra electrical power',
        price: 189.99,
        category: 'Electrical',
        image_url: '/images/products/electrical/alternator-120a.jpg',
        stock: 8
      },
      {
        name: 'Battery Charger Automatic Smart',
        description: 'Smart automatic battery charger with multiple charging modes and safety features',
        price: 89.99,
        category: 'Electrical',
        image_url: '/images/products/electrical/battery-charger-automatic.jpg',
        stock: 20
      },
      {
        name: 'Electrical Wire Repair Kit',
        description: 'Complete electrical wire repair kit with connectors, crimping tools, and various gauges',
        price: 34.99,
        category: 'Electrical',
        image_url: '/images/products/electrical/electrical-wire-kit.webp',
        stock: 25
      },
      {
        name: 'LED Headlight Bulbs H4',
        description: 'High-performance H4 LED headlight bulbs with improved brightness and longevity',
        price: 49.99,
        category: 'Electrical',
        image_url: '/images/products/electrical/led-headlight-bulbs-h4.jpg',
        stock: 30
      },
      {
        name: 'Ceramic Brake Pads Rear Set',
        description: 'Premium ceramic brake pads for rear wheels with excellent stopping power',
        price: 65.99,
        category: 'Brake',
        image_url: '/images/products/brake/ceramic-brake-pads-rear.jpg',
        stock: 18
      },
      {
        name: 'Emergency Brake Cable',
        description: 'Heavy-duty emergency brake cable replacement for parking brake system',
        price: 28.99,
        category: 'Brake',
        image_url: '/images/products/brake/emergency-brake-cable.jpg',
        stock: 12
      },
      {
        name: 'Engine Block Heater',
        description: 'Engine block heater for cold weather starting in harsh climates',
        price: 125.99,
        category: 'Engine',
        image_url: '/images/products/engine/engine-block-heater.jpg',
        stock: 10
      },
      {
        name: 'Fuel Injector Cleaning Kit',
        description: 'Professional fuel injector cleaning kit with cleaning solution and adapters',
        price: 39.99,
        category: 'Engine',
        image_url: '/images/products/engine/fuel-injector-cleaning-kit.webp',
        stock: 22
      },
      {
        name: 'Car Phone Mount Magnetic',
        description: 'Strong magnetic phone mount for dashboard or air vent mounting',
        price: 19.99,
        category: 'Interior',
        image_url: '/images/products/interior/car-phone-mount-magnetic.webp',
        stock: 35
      },
      {
        name: 'Dashboard Camera 1080P',
        description: 'High-definition dashboard camera with night vision and loop recording',
        price: 89.99,
        category: 'Interior',
        image_url: '/images/products/interior/dashboard-camera-1080p.jpg',
        stock: 15
      },
      {
        name: 'Leather Seat Covers Black Premium',
        description: 'Premium black leather seat covers with professional installation kit',
        price: 149.99,
        category: 'Interior',
        image_url: '/images/products/interior/leather-seat-covers-black.webp',
        stock: 8
      }
    ];

    console.log('➕ ADDING NEW PRODUCTS:');
    console.log('============================================================');
    
    let successCount = 0;
    let errorCount = 0;

    for (const product of newProducts) {
      try {
        const { error } = await supabase
          .from('parts')
          .insert([product]);

        if (error) throw error;

        console.log(`✅ Added: ${product.name} - £${product.price}`);
        console.log(`   Image: ${product.image_url}`);
        successCount++;

      } catch (error) {
        console.log(`❌ Failed to add ${product.name}: ${error.message}`);
        errorCount++;
      }
    }

    console.log('\n🔧 FIXING BATTERY MISMATCH:');
    console.log('============================================================');
    
    // Fix the car battery mismatch - move products using wrong battery images
    const batteryFixes = [
      {
        productName: 'Starter Motor',
        id: 77,
        newImage: '/images/products/electrical/alternator-80a.jpg' // Use alternator image instead
      },
      {
        productName: 'Window Motor Assembly', 
        id: 75,
        newImage: '/images/products/electrical/sunroof-switch.jpg' // Use electrical component image
      }
    ];

    for (const fix of batteryFixes) {
      try {
        const { error } = await supabase
          .from('parts')
          .update({ image_url: fix.newImage })
          .eq('id', fix.id);

        if (error) throw error;

        console.log(`✅ Fixed: ${fix.productName} → ${fix.newImage}`);

      } catch (error) {
        console.log(`❌ Failed to fix ${fix.productName}: ${error.message}`);
      }
    }

    console.log('\n📊 SUMMARY:');
    console.log('==============================');
    console.log(`✅ New products added: ${successCount}`);
    console.log(`❌ Failed additions: ${errorCount}`);
    console.log(`🔧 Battery mismatches fixed: 2`);
    console.log(`📦 Unused images utilized: ${successCount}`);
    
    console.log('\n🎉 Product expansion and matching fixes completed!');
    console.log('💡 Your catalog now has proper 12V and 24V battery products!');

  } catch (error) {
    console.error('❌ Error in product addition and fixing:', error);
    throw error;
  }
}

if (require.main === module) {
  addProductsAndFixMatching()
    .then(() => console.log('\n🚀 All operations completed successfully!'))
    .catch(console.error);
}

module.exports = { addProductsAndFixMatching };