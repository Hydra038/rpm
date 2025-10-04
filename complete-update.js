const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateProductImagesComplete() {
  console.log('🚀 Starting COMPLETE database image update...');
  console.log('🎯 This will update ALL remaining products with new images\n');
  
  try {
    // Get all products currently using Unsplash
    const { data: products, error: fetchError } = await supabase
      .from('parts')
      .select('id, name, image_url, category')
      .like('image_url', '%unsplash.com%');

    if (fetchError) {
      console.error('❌ Error fetching products:', fetchError.message);
      return;
    }

    console.log(`📋 Found ${products.length} products using Unsplash images`);

    // Complete image mappings including new categories
    const imageUpdates = [
      // EXISTING CATEGORIES (Enhanced)
      
      // Engine category
      { searchTerms: ['air filter', 'filter air'], newUrl: '/images/products/engine/high-performance-air-filter.webp' },
      { searchTerms: ['oil filter'], newUrl: '/images/products/engine/oil-filter-premium.jpg' },
      { searchTerms: ['spark plug'], newUrl: '/images/products/engine/iridium-spark-plugs-set.webp' },
      { searchTerms: ['engine block', 'block heater'], newUrl: '/images/products/engine/engine-block-heater.jpg' },
      { searchTerms: ['throttle body'], newUrl: '/images/products/engine/throttle-body-assembly.png' },
      { searchTerms: ['turbo', 'wastegate'], newUrl: '/images/products/engine/turbocharger-wastegate.webp' },
      { searchTerms: ['fuel injector'], newUrl: '/images/products/engine/fuel-injector-set.jpg' },
      { searchTerms: ['timing belt'], newUrl: '/images/products/engine/timing-belt-kit.jpg' },
      { searchTerms: ['manifold gasket'], newUrl: '/images/products/engine/manifold-gasket-set.jpg' },
      
      // Brake category
      { searchTerms: ['brake pad'], newUrl: '/images/products/brake/ceramic-brake-pads-front.jpg' },
      { searchTerms: ['brake fluid'], newUrl: '/images/products/brake/brake-fluid-dot-4.webp' },
      { searchTerms: ['brake rotor'], newUrl: '/images/products/brake/brake-rotor-vented-front.png' },
      { searchTerms: ['master cylinder'], newUrl: '/images/products/brake/brake-master-cylinder.webp' },
      { searchTerms: ['brake kit'], newUrl: '/images/products/brake/performance-brake-kit-front.jpg' },
      { searchTerms: ['brake lines'], newUrl: '/images/products/brake/stainless-brake-lines-kit.webp' },
      { searchTerms: ['brake booster'], newUrl: '/images/products/brake/vacuum-brake-booster.png' },
      { searchTerms: ['anti-lock brake', 'abs sensor'], newUrl: '/images/products/brake/anti-lock-brake-sensor.jpg' },
      { searchTerms: ['brake caliper', 'caliper rebuild'], newUrl: '/images/products/brake/brake-caliper-rebuild-kit.jpg' },
      
      // Electrical category
      { searchTerms: ['battery'], newUrl: '/images/products/electrical/car-battery-12v.jpg' },
      { searchTerms: ['alternator'], newUrl: '/images/products/electrical/alternator-120a.jpg' },
      { searchTerms: ['headlight', 'led'], newUrl: '/images/products/electrical/led-headlight-bulbs-h7.webp' },
      { searchTerms: ['starter'], newUrl: '/images/products/electrical/starter-motor-remanufactured.png' },
      { searchTerms: ['ignition coil'], newUrl: '/images/products/electrical/ignition-coil-pack.webp' },
      { searchTerms: ['window motor'], newUrl: '/images/products/electrical/window-motor-assembly.jpg' },
      { searchTerms: ['windshield wiper'], newUrl: '/images/products/electrical/windshield-wipers.jpg' },
      { searchTerms: ['wiring harness'], newUrl: '/images/products/electrical/wiring-harness.jpg' },
      
      // Interior category
      { searchTerms: ['seat cover'], newUrl: '/images/products/interior/leather-seat-covers-black.webp' },
      { searchTerms: ['floor mat'], newUrl: '/images/products/interior/rubber-floor-mats-black.jpg' },
      { searchTerms: ['dashboard', 'camera'], newUrl: '/images/products/interior/dashboard-camera-1080p.jpg' },
      { searchTerms: ['console organizer'], newUrl: '/images/products/interior/centre-console-organizer.jpg' },
      { searchTerms: ['cup holder'], newUrl: '/images/products/interior/cup-holder-insert.jpg' },
      { searchTerms: ['gear shift', 'shift knob'], newUrl: '/images/products/interior/gear-shift-knob.jpg' },
      { searchTerms: ['steering wheel cover'], newUrl: '/images/products/interior/steering-wheel-cover.jpg' },
      { searchTerms: ['sunroof switch'], newUrl: '/images/products/interior/sunroof-switch.jpg' },
      
      // Suspension category
      { searchTerms: ['shock'], newUrl: '/images/products/suspension/shock-absorbers-front.jpg' },
      { searchTerms: ['strut'], newUrl: '/images/products/suspension/strut-assembly-complete.png' },
      { searchTerms: ['spring'], newUrl: '/images/products/suspension/coil-springs-rear.webp' },
      { searchTerms: ['air suspension'], newUrl: '/images/products/suspension/air-suspension-compressor.jpg' },
      { searchTerms: ['control arm', 'bushing kit'], newUrl: '/images/products/suspension/control-arm-bushing-kit.jpg' },
      { searchTerms: ['sway bar'], newUrl: '/images/products/suspension/sway-bar-links.jpg' },
      
      // Exhaust category
      { searchTerms: ['catalytic converter'], newUrl: '/images/products/exhaust/catalytic-converter-universal.jpg' },
      { searchTerms: ['muffler'], newUrl: '/images/products/exhaust/performance-muffler-stainless.webp' },
      { searchTerms: ['exhaust clamp'], newUrl: '/images/products/exhaust/exhaust-clamp-set.jpg' },
      { searchTerms: ['exhaust tips'], newUrl: '/images/products/exhaust/exhaust-tips-pair.jpg' },
      { searchTerms: ['heat shield'], newUrl: '/images/products/exhaust/heat-shield.jpg' },
      { searchTerms: ['performance exhaust'], newUrl: '/images/products/exhaust/performance-exhaust-system.jpg' },
      { searchTerms: ['resonator'], newUrl: '/images/products/exhaust/resonator-delete-pipe.jpg' },
      
      // NEW CATEGORIES
      
      // Body Parts category
      { searchTerms: ['door handle'], newUrl: '/images/products/body/door-handle-set.jpg' },
      { searchTerms: ['bumper cover', 'front bumper'], newUrl: '/images/products/body/front-bumper-cover.jpg' },
      { searchTerms: ['grille', 'front grille'], newUrl: '/images/products/body/front-grille.jpg' },
      { searchTerms: ['spoiler', 'rear spoiler'], newUrl: '/images/products/body/rear-spoiler.jpg' },
      { searchTerms: ['mirror', 'side mirror'], newUrl: '/images/products/body/side-mirror-assembly.jpg' },
      { searchTerms: ['side skirts'], newUrl: '/images/products/body/side-skirts.jpg' },
      { searchTerms: ['tail light'], newUrl: '/images/products/body/tail-light-assembly.jpg' },
      
      // Filters category
      { searchTerms: ['fuel filter'], newUrl: '/images/products/filters/fuel-filter.jpg' },
      { searchTerms: ['transmission filter'], newUrl: '/images/products/filters/transmission-filter-kit.jpg' },
      { searchTerms: ['breather filter'], newUrl: '/images/products/filters/breather-filter.jpg' },
      { searchTerms: ['coolant filter'], newUrl: '/images/products/filters/coolant-filter.jpg' },
      { searchTerms: ['hydraulic filter'], newUrl: '/images/products/filters/hydraulic-filter.jpg' }
    ];

    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0;
    const results = [];

    // Process each image update
    for (const update of imageUpdates) {
      // Find matching products
      const matchingProducts = products.filter(product => 
        update.searchTerms.some(term => 
          product.name.toLowerCase().includes(term.toLowerCase())
        )
      );

      if (matchingProducts.length === 0) {
        skippedCount++;
        continue;
      }

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

    console.log('\n📊 COMPLETE UPDATE SUMMARY:');
    console.log('==========================');
    console.log(`✅ Successful updates: ${successCount}`);
    console.log(`❌ Failed updates: ${errorCount}`);
    console.log(`⏭️  Skipped (no matches): ${skippedCount}`);
    console.log(`📝 Total products processed: ${successCount + errorCount}`);

    // Check remaining Unsplash images
    const { data: remainingProducts } = await supabase
      .from('parts')
      .select('id, name, image_url')
      .like('image_url', '%unsplash.com%');

    console.log(`\n🎯 REMAINING WORK:`);
    console.log(`📸 Products still using Unsplash: ${remainingProducts?.length || 0}`);

    if (remainingProducts && remainingProducts.length > 0) {
      console.log('\n🚨 Products still needing images:');
      remainingProducts.slice(0, 10).forEach((product, index) => {
        console.log(`   ${index + 1}. ${product.name}`);
      });
      if (remainingProducts.length > 10) {
        console.log(`   ... and ${remainingProducts.length - 10} more`);
      }
    }

    if (successCount > 0) {
      console.log('\n🎉 Enhanced image update completed successfully!');
      console.log('🌟 Your RPM catalog now has even more professional images!');
    }

  } catch (error) {
    console.error('❌ Complete update failed:', error.message);
  }
}

updateProductImagesComplete();