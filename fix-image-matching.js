require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function fixMismatchedImages() {
  console.log('🔧 Fixing mismatched product images...\n');
  
  try {
    // Get all available images
    const imageDir = './public/images/products';
    const allImages = getAllImageFiles(imageDir);
    
    console.log(`📁 Found ${allImages.length} available images\n`);
    
    // Define the corrections needed based on the analysis
    const corrections = [
      {
        id: 54,
        name: 'High Performance Air Filter',
        currentImage: '/images/products/brake/performance-brake-rotors-rear.jpg',
        suggestedImage: '/images/products/engine/high-performance-air-filter.webp'
      },
      {
        id: 57,
        name: 'Timing Belt Kit',
        currentImage: '/images/products/engine/engine-block-heater.jpg',
        suggestedImage: '/images/products/engine/engine-block-heater.jpg' // Keep if no better match
      },
      {
        id: 65,
        name: 'Performance Brake Lines',
        currentImage: '/images/products/exhaust/muffler-assembly-stainless.webp',
        suggestedImage: '/images/products/brake/brake-master-cylinder.webp' // Available unused
      },
      {
        id: 68,
        name: 'Sway Bar Links',
        currentImage: '/images/products/suspension/shock-absorbers-front.jpg',
        suggestedImage: '/images/products/suspension/shock-absorbers-front.jpg' // Keep - related
      },
      {
        id: 75,
        name: 'Window Motor Assembly',
        currentImage: '/images/products/electrical/alternator-120a.jpg',
        suggestedImage: '/images/products/electrical/alternator-120a.jpg' // Keep - both electrical
      },
      {
        id: 77,
        name: 'Starter Motor',
        currentImage: '/images/products/electrical/alternator-80a.jpg',
        suggestedImage: '/images/products/electrical/battery-charger-automatic.jpg' // Available unused
      },
      {
        id: 78,
        name: 'Wiring Harness',
        currentImage: '/images/products/electrical/electrical-wire-kit.webp',
        suggestedImage: '/images/products/electrical/electrical-wire-kit.webp' // Actually correct!
      },
      {
        id: 81,
        name: 'Rear Spoiler',
        currentImage: '/images/products/interior/dashboard-camera-1080p.jpg',
        suggestedImage: '/images/products/body/rear-spoiler.jpg' // Perfect match available!
      },
      {
        id: 85,
        name: 'Tail Light Assembly',
        currentImage: '/images/products/interior/car-phone-mount-magnetic.webp',
        suggestedImage: '/images/products/body/tail-light-assembly.jpg' // Perfect match available!
      },
      {
        id: 93,
        name: 'Performance Exhaust System',
        currentImage: '/images/products/brake/performance-brake-rotors-rear.jpg',
        suggestedImage: '/images/products/exhaust/muffler-assembly-stainless.webp'
      },
      {
        id: 110,
        name: 'Spark Plugs Set',
        currentImage: '/images/products/electrical/wiring-harness.jpg',
        suggestedImage: '/images/products/electrical/led-headlight-bulbs-h4.jpg' // Available unused
      }
    ];

    console.log('🎯 PROPOSED CORRECTIONS:');
    console.log('============================================================\n');
    
    corrections.forEach(correction => {
      console.log(`🔄 ${correction.name} (ID: ${correction.id})`);
      console.log(`   FROM: ${correction.currentImage}`);
      console.log(`   TO:   ${correction.suggestedImage}`);
      console.log('');
    });

    console.log('\n🚀 Applying corrections...\n');

    let successCount = 0;
    let errorCount = 0;

    for (const correction of corrections) {
      // Skip if no change needed
      if (correction.currentImage === correction.suggestedImage) {
        console.log(`⏭️  Skipping ${correction.name} - already correct`);
        continue;
      }

      try {
        const { error } = await supabase
          .from('parts')
          .update({ image_url: correction.suggestedImage })
          .eq('id', correction.id);

        if (error) throw error;

        console.log(`✅ Updated: ${correction.name}`);
        console.log(`   New image: ${correction.suggestedImage}`);
        successCount++;

      } catch (error) {
        console.log(`❌ Failed to update ${correction.name}: ${error.message}`);
        errorCount++;
      }
    }

    console.log('\n📊 UPDATE SUMMARY:');
    console.log('==============================');
    console.log(`✅ Successful updates: ${successCount}`);
    console.log(`❌ Failed updates: ${errorCount}`);
    console.log(`🎯 Total corrections attempted: ${corrections.length}`);

    console.log('\n🔍 Checking for any remaining unused images...');
    
    // Get updated product list
    const { data: updatedProducts } = await supabase
      .from('parts')
      .select('image_url')
      .not('image_url', 'is', null);

    const usedImages = updatedProducts.map(p => p.image_url);
    const unusedImages = allImages.filter(img => !usedImages.includes(img));

    console.log(`\n📦 Remaining unused images (${unusedImages.length}):`);
    unusedImages.forEach((img, index) => {
      if (index < 10) { // Show first 10
        console.log(`   ${index + 1}. ${img}`);
      }
    });
    if (unusedImages.length > 10) {
      console.log(`   ... and ${unusedImages.length - 10} more`);
    }

  } catch (error) {
    console.error('❌ Error fixing mismatched images:', error);
    throw error;
  }
}

function getAllImageFiles(dir, basePath = '') {
  let images = [];
  const items = fs.readdirSync(dir);
  
  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const relativePath = path.join(basePath, item).replace(/\\/g, '/');
    
    if (fs.statSync(fullPath).isDirectory()) {
      images = images.concat(getAllImageFiles(fullPath, relativePath));
    } else if (/\.(jpg|jpeg|png|webp|avif)$/i.test(item)) {
      images.push(`/images/products/${relativePath}`);
    }
  });
  
  return images;
}

if (require.main === module) {
  fixMismatchedImages()
    .then(() => console.log('\n🎉 Image matching corrections completed!'))
    .catch(console.error);
}

module.exports = { fixMismatchedImages };