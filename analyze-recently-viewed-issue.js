require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function analyzeRecentlyViewedIssue() {
  console.log('🔍 Analyzing Recently Viewed caching issue...\n');
  
  try {
    // Get current database state for the problematic products
    const { data: products, error } = await supabase
      .from('parts')
      .select('id, name, image_url, price, category')
      .in('name', ['Windshield Wipers', 'Spark Plugs Set', 'Spark Plug Set (4-Pack)']);
    
    if (error) throw error;

    console.log('📊 CURRENT DATABASE STATE:');
    console.log('============================================================');
    products.forEach(product => {
      console.log(`🔵 ${product.name} (ID: ${product.id})`);
      console.log(`   Image URL: ${product.image_url}`);
      console.log(`   Price: £${product.price}`);
      console.log(`   Category: ${product.category}`);
      console.log('');
    });

    console.log('❓ PROBLEM IDENTIFIED:');
    console.log('============================================================');
    console.log('The "Recently Viewed" section is showing cached data from localStorage.');
    console.log('Even though the database has correct image URLs, the cached localStorage');
    console.log('data still contains the old corrupted image URLs from when products');
    console.log('were first viewed/added to cart.');
    
    console.log('\n💡 SOLUTION:');
    console.log('============================================================');
    console.log('Option 1: Clear browser localStorage for the RPM site');
    console.log('Option 2: Update the ProductCard component to always fetch fresh data');
    console.log('Option 3: Create a cache invalidation mechanism');
    
    console.log('\n🛠️  IMMEDIATE FIX:');
    console.log('============================================================');
    console.log('1. Open browser DevTools (F12)');
    console.log('2. Go to Application/Storage tab');
    console.log('3. Find localStorage > localhost:3000');
    console.log('4. Delete the "rpm-recently-viewed" key');
    console.log('5. Refresh the page');
    
    console.log('\n🔧 OR run this in browser console:');
    console.log('localStorage.removeItem("rpm-recently-viewed");');
    console.log('location.reload();');

    console.log('\n📋 TECHNICAL EXPLANATION:');
    console.log('============================================================');
    console.log('• ProductCard component caches product data in localStorage');
    console.log('• Recently viewed products use this cached data');
    console.log('• Database updates don\'t affect cached localStorage data');
    console.log('• Need to invalidate cache when product data changes');

  } catch (error) {
    console.error('❌ Error analyzing recently viewed issue:', error);
    throw error;
  }
}

if (require.main === module) {
  analyzeRecentlyViewedIssue()
    .then(() => console.log('\n🎯 Analysis completed!'))
    .catch(console.error);
}

module.exports = { analyzeRecentlyViewedIssue };