const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function consolidateProducts() {
  console.log('🔍 Analyzing products for consolidation...\n');
  
  try {
    // Get all products
    const { data: products, error } = await supabase
      .from('parts')
      .select('id, name, image_url, category, price, description')
      .order('name');

    if (error) {
      console.error('❌ Error:', error.message);
      return;
    }

    console.log(`📊 Found ${products.length} products to analyze\n`);

    // Group products by similar names (indicating duplicates)
    const productGroups = {};
    
    products.forEach(product => {
      // Normalize product name for grouping
      const normalizedName = product.name
        .toLowerCase()
        .replace(/\s*-\s*/g, ' ')
        .replace(/\s+/g, ' ')
        .replace(/\(.*?\)/g, '') // Remove parentheses content
        .trim();
      
      if (!productGroups[normalizedName]) {
        productGroups[normalizedName] = [];
      }
      productGroups[normalizedName].push(product);
    });

    // Find groups with multiple products (duplicates)
    const duplicateGroups = Object.entries(productGroups)
      .filter(([name, products]) => products.length > 1)
      .sort((a, b) => b[1].length - a[1].length);

    console.log('🔍 DUPLICATE PRODUCT GROUPS:');
    console.log('=' .repeat(60));

    const productsToDelete = [];
    const productsToKeep = [];

    duplicateGroups.forEach(([normalizedName, products], index) => {
      console.log(`\n${index + 1}. "${normalizedName}" (${products.length} duplicates):`);
      
      // Sort by ID to keep the first one (original)
      products.sort((a, b) => a.id - b.id);
      
      const keeper = products[0]; // Keep the first one
      const toDelete = products.slice(1); // Delete the rest
      
      console.log(`   ✅ KEEP: ${keeper.name} (ID: ${keeper.id}) - $${keeper.price}`);
      console.log(`      Image: ${keeper.image_url}`);
      
      toDelete.forEach(product => {
        console.log(`   ❌ DELETE: ${product.name} (ID: ${product.id}) - $${product.price}`);
        productsToDelete.push(product);
      });
      
      productsToKeep.push(keeper);
    });

    console.log(`\n📊 CONSOLIDATION PLAN:`);
    console.log(`✅ Products to keep: ${productsToKeep.length}`);
    console.log(`❌ Products to delete: ${productsToDelete.length}`);
    console.log(`📉 Total reduction: ${products.length} → ${products.length - productsToDelete.length}`);

    if (productsToDelete.length === 0) {
      console.log('\n✅ No duplicate products found to delete!');
      return;
    }

    // Execute deletions
    console.log('\n🗑️  Deleting duplicate products...');
    
    let deleteCount = 0;
    let errorCount = 0;

    for (const product of productsToDelete) {
      try {
        const { error: deleteError } = await supabase
          .from('parts')
          .delete()
          .eq('id', product.id);

        if (deleteError) {
          console.error(`❌ Failed to delete ${product.name} (ID: ${product.id}): ${deleteError.message}`);
          errorCount++;
        } else {
          console.log(`🗑️  Deleted: ${product.name} (ID: ${product.id})`);
          deleteCount++;
        }
      } catch (err) {
        console.error(`❌ Error deleting product ${product.id}: ${err.message}`);
        errorCount++;
      }
    }

    console.log('\n📊 DELETION SUMMARY:');
    console.log('====================');
    console.log(`✅ Successfully deleted: ${deleteCount}`);
    console.log(`❌ Failed deletions: ${errorCount}`);
    console.log(`📈 Products remaining: ${products.length - deleteCount}`);

    // Now ensure unique images for remaining products
    console.log('\n🎨 Ensuring unique images for remaining products...');
    
    // Get updated product list
    const { data: remainingProducts, error: fetchError } = await supabase
      .from('parts')
      .select('id, name, image_url')
      .order('id');

    if (fetchError) {
      console.error('❌ Error fetching remaining products:', fetchError.message);
      return;
    }

    // Group by image URL to find sharing
    const imageGroups = {};
    remainingProducts.forEach(product => {
      if (product.image_url) {
        if (!imageGroups[product.image_url]) {
          imageGroups[product.image_url] = [];
        }
        imageGroups[product.image_url].push(product);
      }
    });

    const sharedImages = Object.entries(imageGroups)
      .filter(([url, products]) => products.length > 1);

    console.log(`\n🔍 Found ${sharedImages.length} images still being shared`);

    if (sharedImages.length > 0) {
      console.log('\n⚠️  Products still sharing images:');
      sharedImages.forEach(([imageUrl, products]) => {
        console.log(`\n📸 ${imageUrl} (${products.length} products):`);
        products.forEach(p => console.log(`   • ${p.name} (ID: ${p.id})`));
      });
      
      console.log('\n💡 Recommendation: Run the image redistribution script again to assign unique images.');
    }

    if (deleteCount > 0) {
      console.log('\n🎉 Product consolidation completed!');
      console.log('📈 Your catalog is now cleaner with fewer duplicate products.');
      console.log('🎯 Each remaining product should ideally have its own unique image.');
    }

  } catch (error) {
    console.error('❌ Consolidation failed:', error.message);
  }
}

consolidateProducts();