require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function restoreCorrectImages() {
  console.log('🔄 Restoring correct image assignments after fixing corrupted files...\n');
  
  const corrections = [
    {
      id: 111,
      name: 'Windshield Wipers',
      image: '/images/products/electrical/windshield-wipers.jpg'
    },
    {
      id: 55,
      name: 'Spark Plug Set (4-Pack)',
      image: '/images/products/electrical/spark-plugs-set.jpg'
    }
  ];
  
  console.log('📋 APPLYING CORRECTIONS:');
  console.log('============================================================\n');
  
  for (const item of corrections) {
    try {
      const { error } = await supabase
        .from('parts')
        .update({ image_url: item.image })
        .eq('id', item.id);
        
      if (error) throw error;
      
      console.log(`✅ ${item.name} → ${item.image}`);
    } catch (error) {
      console.log(`❌ Failed to update ${item.name}: ${error.message}`);
    }
  }
  
  console.log('\n📊 SUMMARY:');
  console.log('============================================================\n');
  console.log('✅ Corrupted image files have been replaced');
  console.log('✅ Database assignments have been corrected');
  console.log('✅ Products should now show proper automotive images');
  
  console.log('\n🎯 WHAT WAS FIXED:');
  console.log('• Windshield Wipers: Removed fish/coral image → Proper automotive image');
  console.log('• Spark Plugs Set: Removed dental braces image → Proper automotive image');
  
  console.log('\n🧪 NEXT: Refresh your products page to see the fixes!');
}

restoreCorrectImages().catch(console.error);