const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixDuplicatesAnd404s() {
  console.log('🔧 Fixing 404s and reducing duplicates...\n');
  
  try {
    // Get all products
    const { data: products, error: fetchError } = await supabase
      .from('parts')
      .select('id, name, image_url')
      .order('name');

    if (fetchError) {
      console.error('❌ Error fetching products:', fetchError.message);
      return;
    }

    // Get all available images
    const imagesPath = path.join(process.cwd(), 'public', 'images', 'products');
    const categories = fs.readdirSync(imagesPath).filter(f => fs.statSync(path.join(imagesPath, f)).isDirectory());
    const availableImages = [];
    
    for (const category of categories) {
      const files = fs.readdirSync(path.join(imagesPath, category))
        .filter(f => /\.(jpg|jpeg|png|webp|avif)$/i.test(f));
      files.forEach(file => {
        availableImages.push(`/images/products/${category}/${file}`);
      });
    }

    console.log(`📁 Found ${availableImages.length} available images`);

    // Define specific mappings to fix 404s and reduce duplicates
    const imageUpdates = [
      // Fix 404s by mapping to existing unused images
      { productName: 'All-Weather Floor Mats', newUrl: '/images/products/interior/all-weather-floor-mats.webp' },
      { productName: 'Starter Motor', newUrl: '/images/products/electrical/alternator-80a.jpg' }, // Close match
      
      // Reduce duplicates by using specific unused images
      { productName: 'Car Battery 12V', newUrl: '/images/products/electrical/car-battery-12v.jpg' },
      { productName: 'Alternator 140A', newUrl: '/images/products/electrical/alternator-80a.jpg' },
      { productName: 'LED Headlight Bulbs', newUrl: '/images/products/electrical/led-headlight-bulbs-h7.webp' },
      { productName: 'Leather Seat Covers', newUrl: '/images/products/interior/leather-seat-covers-brown.jpg' },
      { productName: 'Steering Wheel Cover', newUrl: '/images/products/interior/steering-wheel-cover.png' },
      
      // Brake system - use different brake images for different products
      { productName: 'Brake Master Cylinder', newUrl: '/images/products/brake/brake-master-cylinder.webp' },
      { productName: 'Emergency Brake Cable', newUrl: '/images/products/brake/emergency-brake-cable.jpg' },
      { productName: 'Brake Pads - Rear Set', newUrl: '/images/products/brake/ceramic-brake-pads-rear.jpg' },
      
      // Engine - distribute engine images better
      { productName: 'Engine Block Heater', newUrl: '/images/products/engine/engine-block-heater.jpg' },
      { productName: 'Cold Air Intake', newUrl: '/images/products/engine/performance-cold-air-intake.jpg' },
      { productName: 'Fuel Injector Set', newUrl: '/images/products/engine/fuel-injector-set.webp' },
      
      // Interior - use dashboard camera for appropriate product
      { productName: 'Dashboard Camera', newUrl: '/images/products/interior/dashboard-camera-1080p.jpg' },
      { productName: 'Phone Mount', newUrl: '/images/products/interior/car-phone-mount-magnetic.webp' },
      
      // Exhaust - use muffler image
      { productName: 'Muffler', newUrl: '/images/products/exhaust/muffler-assembly-stainless.webp' },
      { productName: 'Performance Muffler', newUrl: '/images/products/exhaust/muffler-assembly-stainless.webp' },
      
      // Suspension
      { productName: 'Shock Absorber Set', newUrl: '/images/products/suspension/shock-absorbers-rear.png' },
      
      // Electrical wiring
      { productName: 'Wiring Harness', newUrl: '/images/products/electrical/electrical-wire-kit.webp' },
    ];

    const updates = [];
    let fixedCount = 0;
    let duplicatesReducedCount = 0;

    // Process each update
    for (const update of imageUpdates) {
      // Find products that match the name pattern
      const matchingProducts = products.filter(product => 
        product.name.toLowerCase().includes(update.productName.toLowerCase()) ||
        update.productName.toLowerCase().includes(product.name.toLowerCase().substring(0, 10))
      );

      if (matchingProducts.length > 0) {
        // For products with missing images (404s) - update all matches
        const missing404Products = matchingProducts.filter(p => 
          p.image_url && !availableImages.includes(p.image_url)
        );
        
        // For products using duplicate images - update only the first one found
        const duplicateProducts = matchingProducts.filter(p => 
          p.image_url && availableImages.includes(p.image_url) && p.image_url !== update.newUrl
        );

        // Update 404 products first
        missing404Products.forEach(product => {
          if (availableImages.includes(update.newUrl)) {
            updates.push({
              id: product.id,
              name: product.name,
              oldUrl: product.image_url,
              newUrl: update.newUrl,
              reason: '404 Fix'
            });
            fixedCount++;
          }
        });

        // Update one duplicate product to reduce duplicates
        if (duplicateProducts.length > 0 && availableImages.includes(update.newUrl)) {
          const productToUpdate = duplicateProducts[0];
          updates.push({
            id: productToUpdate.id,
            name: productToUpdate.name,
            oldUrl: productToUpdate.image_url,
            newUrl: update.newUrl,
            reason: 'Duplicate Reduction'
          });
          duplicatesReducedCount++;
        }
      }
    }

    console.log(`🎯 Found ${updates.length} updates to make:`);
    console.log(`   • 404 fixes: ${fixedCount}`);
    console.log(`   • Duplicate reductions: ${duplicatesReducedCount}\n`);

    if (updates.length === 0) {
      console.log('✅ No updates needed!');
      return;
    }

    // Execute updates
    let successCount = 0;
    let errorCount = 0;

    console.log('🔄 Applying updates...\n');
    
    for (const update of updates) {
      try {
        const { error: updateError } = await supabase
          .from('parts')
          .update({ image_url: update.newUrl })
          .eq('id', update.id);

        if (updateError) {
          console.error(`❌ Failed to update ${update.name}: ${updateError.message}`);
          errorCount++;
        } else {
          console.log(`✅ ${update.reason}: ${update.name}`);
          console.log(`   ${update.oldUrl} → ${update.newUrl}`);
          successCount++;
        }
      } catch (err) {
        console.error(`❌ Error updating ${update.name}: ${err.message}`);
        errorCount++;
      }
    }

    console.log('\n📊 UPDATE SUMMARY:');
    console.log('==================');
    console.log(`✅ Successful updates: ${successCount}`);
    console.log(`❌ Failed updates: ${errorCount}`);
    console.log(`🎯 404s fixed: ${fixedCount}`);
    console.log(`🔄 Duplicates reduced: ${duplicatesReducedCount}`);

    if (successCount > 0) {
      console.log('\n🎉 Images fixed successfully!');
      console.log('🌟 Your products page should now have fewer 404s and better image variety!');
    }

  } catch (error) {
    console.error('❌ Fix failed:', error.message);
  }
}

fixDuplicatesAnd404s();