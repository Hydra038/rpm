require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function fixCorruptedImages() {
  console.log('🔧 Fixing corrupted image files...\n');
  
  // The problematic images from the screenshot
  const problemImages = [
    {
      productName: 'Windshield Wipers',
      currentFile: 'windshield-wipers.jpg',
      description: 'Should show windshield wipers, currently shows fish/coral'
    },
    {
      productName: 'Spark Plugs Set',
      currentFile: 'spark-plugs-set.jpg',
      description: 'Should show spark plugs, currently shows dental braces'
    },
    {
      productName: 'Ignition Coil Set',
      currentFile: 'ignition-coil-set.jpg',
      description: 'May also be corrupted'
    }
  ];

  console.log('⚠️  IDENTIFIED CORRUPTED IMAGE FILES:');
  console.log('============================================================\n');
  
  problemImages.forEach((img, index) => {
    console.log(`${index + 1}. ${img.currentFile}`);
    console.log(`   Product: ${img.productName}`);
    console.log(`   Issue: ${img.description}`);
    console.log('');
  });

  console.log('🔍 SOLUTION STRATEGY:');
  console.log('============================================================\n');
  
  // Check if we have any good automotive images we can use as replacements
  const electricalDir = './public/images/products/electrical';
  const availableImages = fs.readdirSync(electricalDir)
    .filter(file => file.match(/\.(jpg|jpeg|png|webp)$/i));
    
  console.log('Available electrical images:');
  availableImages.forEach(img => {
    console.log(`   • ${img}`);
  });
  
  console.log('\n💡 RECOMMENDED ACTIONS:');
  console.log('============================================================\n');
  
  console.log('1. 🔄 Replace windshield-wipers.jpg with a proper automotive wiper image');
  console.log('2. 🔄 Replace spark-plugs-set.jpg with a proper spark plug image'); 
  console.log('3. 🔍 Verify ignition-coil-set.jpg shows actual ignition coils');
  console.log('4. 🗄️  Consider using backup images from other categories if available');
  
  // Let's reassign these products to use different existing images temporarily
  console.log('\n🚀 TEMPORARY FIX - Reassigning to working images:');
  console.log('============================================================\n');
  
  const temporaryFixes = [
    {
      productId: 111, // Windshield Wipers
      productName: 'Windshield Wipers',
      newImage: '/images/products/electrical/electrical-wire-kit.webp'
    },
    {
      productId: 55, // Spark Plug Set (4-Pack)
      productName: 'Spark Plug Set (4-Pack)',
      newImage: '/images/products/electrical/ignition-coil-set.jpg'
    },
    {
      productId: 110, // Spark Plugs Set
      productName: 'Spark Plugs Set',
      newImage: '/images/products/electrical/led-headlight-bulbs-h7.webp'
    }
  ];

  for (const fix of temporaryFixes) {
    try {
      const { error } = await supabase
        .from('parts')
        .update({ image_url: fix.newImage })
        .eq('id', fix.productId);

      if (error) throw error;

      console.log(`✅ ${fix.productName} → ${fix.newImage}`);
    } catch (error) {
      console.log(`❌ Failed to update ${fix.productName}: ${error.message}`);
    }
  }

  console.log('\n🎯 NEXT STEPS:');
  console.log('============================================================\n');
  console.log('1. 📷 Download proper automotive images for these products');
  console.log('2. 🔄 Replace the corrupted image files in /public/images/products/electrical/');
  console.log('3. 🔄 Update the database to use the correct image paths');
  console.log('4. 🧪 Test the products page to verify images display correctly');
  
  console.log('\n✅ Temporary fixes applied to prevent showing inappropriate images!');
}

fixCorruptedImages().catch(console.error);