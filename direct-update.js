const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  console.log('URL:', supabaseUrl ? 'Set' : 'Missing');
  console.log('Key:', supabaseKey ? 'Set' : 'Missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateProductImages() {
  console.log('🚀 Starting direct database image update...');
  
  try {
    // First, get all products currently using Unsplash
    const { data: products, error: fetchError } = await supabase
      .from('parts')
      .select('id, name, image_url, category')
      .like('image_url', '%unsplash.com%');

    if (fetchError) {
      console.error('❌ Error fetching products:', fetchError.message);
      return;
    }

    console.log(`📋 Found ${products.length} products using Unsplash images`);

    // Manual image mappings based on your uploaded images
    const imageUpdates = [
      // Engine category
      { searchTerms: ['air filter', 'filter air'], newUrl: '/images/products/engine/high-performance-air-filter.webp' },
      { searchTerms: ['oil filter'], newUrl: '/images/products/engine/oil-filter-premium.jpg' },
      { searchTerms: ['spark plug'], newUrl: '/images/products/engine/iridium-spark-plugs-set.webp' },
      { searchTerms: ['engine block', 'block heater'], newUrl: '/images/products/engine/engine-block-heater.jpg' },
      { searchTerms: ['throttle body'], newUrl: '/images/products/engine/throttle-body-assembly.png' },
      { searchTerms: ['turbo', 'wastegate'], newUrl: '/images/products/engine/turbocharger-wastegate.webp' },
      
      // Brake category
      { searchTerms: ['brake pad'], newUrl: '/images/products/brake/ceramic-brake-pads-front.jpg' },
      { searchTerms: ['brake fluid'], newUrl: '/images/products/brake/brake-fluid-dot-4.webp' },
      { searchTerms: ['brake rotor'], newUrl: '/images/products/brake/brake-rotor-vented-front.png' },
      { searchTerms: ['master cylinder'], newUrl: '/images/products/brake/brake-master-cylinder.webp' },
      { searchTerms: ['brake kit'], newUrl: '/images/products/brake/performance-brake-kit-front.jpg' },
      { searchTerms: ['brake lines'], newUrl: '/images/products/brake/stainless-brake-lines-kit.webp' },
      { searchTerms: ['brake booster'], newUrl: '/images/products/brake/vacuum-brake-booster.png' },
      
      // Electrical category
      { searchTerms: ['battery'], newUrl: '/images/products/electrical/car-battery-12v.jpg' },
      { searchTerms: ['alternator'], newUrl: '/images/products/electrical/alternator-120a.jpg' },
      { searchTerms: ['headlight', 'led'], newUrl: '/images/products/electrical/led-headlight-bulbs-h7.webp' },
      { searchTerms: ['starter'], newUrl: '/images/products/electrical/starter-motor-remanufactured.png' },
      { searchTerms: ['ignition coil'], newUrl: '/images/products/electrical/ignition-coil-pack.webp' },
      
      // Interior category
      { searchTerms: ['seat cover'], newUrl: '/images/products/interior/leather-seat-covers-black.webp' },
      { searchTerms: ['floor mat'], newUrl: '/images/products/interior/rubber-floor-mats-black.jpg' },
      { searchTerms: ['dashboard', 'camera'], newUrl: '/images/products/interior/dashboard-camera-1080p.jpg' },
      
      // Suspension category
      { searchTerms: ['shock'], newUrl: '/images/products/suspension/shock-absorbers-front.jpg' },
      { searchTerms: ['strut'], newUrl: '/images/products/suspension/strut-assembly-complete.png' },
      { searchTerms: ['spring'], newUrl: '/images/products/suspension/coil-springs-rear.webp' },
      
      // Exhaust category
      { searchTerms: ['catalytic converter'], newUrl: '/images/products/exhaust/catalytic-converter-universal.jpg' },
      { searchTerms: ['muffler'], newUrl: '/images/products/exhaust/performance-muffler-stainless.webp' }
    ];

    let successCount = 0;
    let errorCount = 0;
    const results = [];

    // Process each image update
    for (const update of imageUpdates) {
      // Find matching products
      const matchingProducts = products.filter(product => 
        update.searchTerms.some(term => 
          product.name.toLowerCase().includes(term.toLowerCase())
        )
      );

      console.log(`🔍 Found ${matchingProducts.length} products matching: ${update.searchTerms.join(' OR ')}`);

      // Update each matching product
      for (const product of matchingProducts) {
        try {
          const { error: updateError } = await supabase
            .from('parts')
            .update({ image_url: update.newUrl })
            .eq('id', product.id);

          if (updateError) {
            console.error(`❌ Failed to update ${product.name}:`, updateError.message);
            errorCount++;
            results.push({
              name: product.name,
              success: false,
              error: updateError.message
            });
          } else {
            console.log(`✅ Updated: ${product.name} -> ${update.newUrl}`);
            successCount++;
            results.push({
              name: product.name,
              success: true,
              oldUrl: product.image_url,
              newUrl: update.newUrl
            });
          }
        } catch (err) {
          console.error(`❌ Error updating ${product.name}:`, err.message);
          errorCount++;
          results.push({
            name: product.name,
            success: false,
            error: err.message
          });
        }
      }
    }

    console.log('\n📊 UPDATE SUMMARY:');
    console.log('==================');
    console.log(`✅ Successful updates: ${successCount}`);
    console.log(`❌ Failed updates: ${errorCount}`);
    console.log(`📝 Total products processed: ${successCount + errorCount}`);

    if (successCount > 0) {
      console.log('\n🎉 Image update completed successfully!');
      console.log('Your products now use local images instead of Unsplash.');
    }

  } catch (error) {
    console.error('❌ Update failed:', error.message);
  }
}

updateProductImages();