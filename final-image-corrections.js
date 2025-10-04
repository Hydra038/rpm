require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function finalImageCorrections() {
  console.log('🎯 Applying final image corrections for perfect matching...\n');
  
  try {
    // Final corrections for the remaining 7 mismatched products
    const finalCorrections = [
      {
        id: 57,
        name: 'Timing Belt Kit',
        currentImage: '/images/products/engine/engine-block-heater.jpg',
        suggestedImage: '/images/products/engine/fuel-injector-cleaning-kit.webp' // Closer engine component
      },
      {
        id: 68,
        name: 'Sway Bar Links',
        currentImage: '/images/products/suspension/shock-absorbers-front.jpg',
        suggestedImage: '/images/products/suspension/shock-absorbers-front.jpg' // Keep - related suspension
      },
      {
        id: 75,
        name: 'Window Motor Assembly',
        currentImage: '/images/products/electrical/alternator-120a.jpg',
        suggestedImage: '/images/products/electrical/car-battery-24v.jpg' // Available unused electrical
      },
      {
        id: 77,
        name: 'Starter Motor',
        currentImage: '/images/products/electrical/battery-charger-automatic.jpg',
        suggestedImage: '/images/products/electrical/car-battery-24v.jpg' // Better electrical match
      },
      {
        id: 78,
        name: 'Wiring Harness',
        currentImage: '/images/products/electrical/electrical-wire-kit.webp',
        suggestedImage: '/images/products/electrical/wiring-harness.jpg' // Perfect match available!
      },
      {
        id: 93,
        name: 'Performance Exhaust System',
        currentImage: '/images/products/exhaust/muffler-assembly-stainless.webp',
        suggestedImage: '/images/products/exhaust/muffler-assembly-stainless.webp' // Actually good match
      },
      {
        id: 110,
        name: 'Spark Plugs Set',
        currentImage: '/images/products/electrical/led-headlight-bulbs-h4.jpg',
        suggestedImage: '/images/products/electrical/spark-plugs-set.jpg' // Use the existing spark plugs image (might need to check if it's shared)
      }
    ];

    console.log('🎯 FINAL CORRECTIONS:');
    console.log('============================================================\n');
    
    for (const correction of finalCorrections) {
      console.log(`🔄 ${correction.name} (ID: ${correction.id})`);
      console.log(`   FROM: ${correction.currentImage}`);
      console.log(`   TO:   ${correction.suggestedImage}`);
      
      // Skip if no change needed
      if (correction.currentImage === correction.suggestedImage) {
        console.log(`   ⏭️  No change needed\n`);
        continue;
      }
      
      try {
        const { error } = await supabase
          .from('parts')
          .update({ image_url: correction.suggestedImage })
          .eq('id', correction.id);

        if (error) throw error;

        console.log(`   ✅ Updated successfully\n`);

      } catch (error) {
        console.log(`   ❌ Failed: ${error.message}\n`);
      }
    }

    // Special handling for the spark plugs image sharing issue
    console.log('🔧 Checking for spark plugs image sharing...');
    
    const { data: sparkPlugsProducts } = await supabase
      .from('parts')
      .select('id, name')
      .eq('image_url', '/images/products/electrical/spark-plugs-set.jpg');

    if (sparkPlugsProducts && sparkPlugsProducts.length > 1) {
      console.log(`⚠️  Found ${sparkPlugsProducts.length} products using spark-plugs-set.jpg:`);
      sparkPlugsProducts.forEach(p => {
        console.log(`   • ${p.name} (ID: ${p.id})`);
      });
      
      // Update one of them to use a different image
      console.log('\n🔄 Resolving spark plugs image sharing...');
      const { error } = await supabase
        .from('parts')
        .update({ image_url: '/images/products/electrical/ignition-coil-set.jpg' })
        .eq('id', 110); // Spark Plugs Set

      if (!error) {
        console.log('✅ Moved Spark Plugs Set to ignition-coil-set.jpg');
      }
    }

    console.log('\n🎉 Final image corrections completed!');
    console.log('\n🔍 Running final analysis...');

  } catch (error) {
    console.error('❌ Error applying final corrections:', error);
    throw error;
  }
}

if (require.main === module) {
  finalImageCorrections()
    .then(() => console.log('\n✨ All corrections applied!'))
    .catch(console.error);
}

module.exports = { finalImageCorrections };