require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkProblematicProducts() {
  console.log('🔍 Checking the problematic products from the screenshot...\n');
  
  const { data: products, error } = await supabase
    .from('parts')
    .select('id, name, image_url, price')
    .in('name', ['Windshield Wipers', 'Spark Plugs Set', 'Spark Plug Set (4-Pack)']);
    
  if (error) throw error;
  
  console.log(`Found ${products.length} products:\n`);
  
  products.forEach(product => {
    console.log(`🔴 ${product.name} (ID: ${product.id}) - £${product.price}`);
    console.log(`   Image: ${product.image_url}`);
    console.log('');
  });

  // Let's also check if there are any products with unusual image URLs
  console.log('🔍 Checking for any products with suspicious image URLs...\n');
  
  const { data: allProducts } = await supabase
    .from('parts')
    .select('id, name, image_url')
    .order('id');
    
  const suspiciousImages = allProducts.filter(p => 
    p.image_url && 
    (!p.image_url.includes('/images/products/') || 
     p.image_url.includes('dental') || 
     p.image_url.includes('fish') ||
     p.image_url.includes('coral') ||
     p.image_url.includes('orthodontic'))
  );
  
  if (suspiciousImages.length > 0) {
    console.log('⚠️  Found products with suspicious image URLs:');
    suspiciousImages.forEach(p => {
      console.log(`   • ${p.name} (ID: ${p.id}): ${p.image_url}`);
    });
  } else {
    console.log('✅ All image URLs appear to be from the correct products folder');
  }
}

checkProblematicProducts().catch(console.error);