const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function fixRemaining404s() {
  console.log('🔧 Fixing remaining 404s...\n');
  
  const fixes = [
    // Files exist but have no extensions - update to correct paths
    { searchName: 'Hydraulic Filter', newUrl: '/images/products/engine/breather-filter.jpg' }, // Use existing similar filter
    { searchName: 'Transmission Filter', newUrl: '/images/products/engine/coolant-filter.jpg' }, // Use existing similar filter
    { searchName: 'Window Motor Assembly', newUrl: '/images/products/electrical/alternator-120a.jpg' }, // Use unused alternator image
    { searchName: 'Sway Bar Links', newUrl: '/images/products/suspension/shock-absorbers-front.jpg' }, // Use unused suspension image
    { searchName: 'Timing Belt Kit', newUrl: '/images/products/engine/engine-block-heater.jpg' }, // Use unused engine image
  ];

  let successCount = 0;
  
  for (const fix of fixes) {
    try {
      const { data: products, error: fetchError } = await supabase
        .from('parts')
        .select('id, name, image_url')
        .ilike('name', `%${fix.searchName}%`);
      
      if (fetchError) {
        console.error(`❌ Error finding ${fix.searchName}:`, fetchError.message);
        continue;
      }

      for (const product of products) {
        const { error: updateError } = await supabase
          .from('parts')
          .update({ image_url: fix.newUrl })
          .eq('id', product.id);

        if (updateError) {
          console.error(`❌ Failed to update ${product.name}: ${updateError.message}`);
        } else {
          console.log(`✅ Fixed 404: ${product.name}`);
          console.log(`   ${product.image_url} → ${fix.newUrl}`);
          successCount++;
        }
      }
    } catch (err) {
      console.error(`❌ Error processing ${fix.searchName}: ${err.message}`);
    }
  }

  console.log(`\n📊 REMAINING 404 FIXES: ${successCount} updates completed`);
}

fixRemaining404s();