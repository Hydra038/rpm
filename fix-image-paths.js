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

async function fixImagePaths() {
  console.log('🔧 Fixing image paths to match your saved images...\n');
  
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

    console.log(`📋 Found ${products.length} total products`);

    // Scan all available images
    const imagesPath = path.join(process.cwd(), 'public', 'images', 'products');
    const availableImages = {};
    const categories = ['body', 'brake', 'electrical', 'engine', 'exhaust', 'filters', 'interior', 'suspension'];
    
    for (const category of categories) {
      const categoryPath = path.join(imagesPath, category);
      availableImages[category] = [];
      try {
        if (fs.existsSync(categoryPath)) {
          const files = fs.readdirSync(categoryPath)
            .filter(file => /\.(jpg|jpeg|png|webp|avif)$/i.test(file));
          availableImages[category] = files;
        }
      } catch (err) {
        console.log(`⚠️  Could not read ${category} directory`);
      }
    }

    console.log('\n📁 Available images by category:');
    for (const [category, files] of Object.entries(availableImages)) {
      console.log(`   ${category}: ${files.length} images`);
      files.forEach(file => console.log(`      • ${file}`));
    }

    // Image mapping based on your actual files
    const imageMap = new Map();
    
    // Build image map from actual files
    for (const [category, files] of Object.entries(availableImages)) {
      for (const file of files) {
        const baseName = file.replace(/\.[^/.]+$/, ''); // Remove extension
        const fullPath = `/images/products/${category}/${file}`;
        imageMap.set(baseName, fullPath);
      }
    }

    console.log(`\n🔍 Built image map with ${imageMap.size} images`);

    // Enhanced product matching
    const updates = [];
    let matchCount = 0;

    for (const product of products) {
      const productName = product.name.toLowerCase();
      let matchedImage = null;

      // Direct filename matching
      for (const [imageName, imagePath] of imageMap.entries()) {
        const imageNameLower = imageName.toLowerCase().replace(/-/g, ' ');
        const productNameFormatted = productName.replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim();
        
        if (imageNameLower.includes(productNameFormatted.substring(0, 8)) ||
            productNameFormatted.includes(imageNameLower.substring(0, 8))) {
          matchedImage = imagePath;
          break;
        }
      }

      // Keyword-based matching if no direct match
      if (!matchedImage) {
        // Body parts
        if (productName.includes('door handle')) matchedImage = imageMap.get('door-handle-set');
        else if (productName.includes('bumper') && productName.includes('front')) matchedImage = imageMap.get('front-bumper-cover');
        else if (productName.includes('grille')) matchedImage = imageMap.get('front-grille');
        else if (productName.includes('spoiler')) matchedImage = imageMap.get('rear-spoiler');
        else if (productName.includes('mirror')) matchedImage = imageMap.get('side-mirror-assembly');
        else if (productName.includes('side skirt')) matchedImage = imageMap.get('side-skirts');
        else if (productName.includes('tail light')) matchedImage = imageMap.get('tail-light-assembly');
        
        // Brake parts
        else if (productName.includes('anti-lock') || productName.includes('abs')) matchedImage = imageMap.get('antilock-brake-sensor');
        else if (productName.includes('caliper') && productName.includes('rebuild')) matchedImage = imageMap.get('brake-caliper-rebuild-kit');
        
        // Electrical
        else if (productName.includes('sunroof switch')) matchedImage = imageMap.get('sunroof-switch');
        else if (productName.includes('window motor')) matchedImage = imageMap.get('window-motor-assembly');
        else if (productName.includes('windshield wiper')) matchedImage = imageMap.get('windshield-wipers');
        else if (productName.includes('wiring harness')) matchedImage = imageMap.get('wiring-harness');
        
        // Filters
        else if (productName.includes('hydraulic filter')) matchedImage = imageMap.get('hydraulic-filter');
        else if (productName.includes('transmission filter')) matchedImage = imageMap.get('transmission-filter-kit');
      }

      if (matchedImage && product.image_url !== matchedImage) {
        updates.push({
          id: product.id,
          name: product.name,
          oldUrl: product.image_url,
          newUrl: matchedImage
        });
        matchCount++;
      }
    }

    console.log(`\n🎯 Found ${matchCount} products that can use your new images`);

    if (updates.length === 0) {
      console.log('✅ All products are already using the correct image paths!');
      return;
    }

    // Execute updates
    let successCount = 0;
    let errorCount = 0;

    console.log('\n🔄 Updating database...');
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
          console.log(`✅ Updated: ${update.name} -> ${update.newUrl}`);
          successCount++;
        }
      } catch (err) {
        console.error(`❌ Error updating ${update.name}: ${err.message}`);
        errorCount++;
      }
    }

    console.log('\n📊 IMAGE FIX SUMMARY:');
    console.log('=====================');
    console.log(`✅ Successful updates: ${successCount}`);
    console.log(`❌ Failed updates: ${errorCount}`);
    console.log(`📝 Total attempts: ${updates.length}`);

    if (successCount > 0) {
      console.log('\n🎉 Image paths fixed successfully!');
      console.log('🌟 Your products page should now display all your saved images!');
      console.log('🚀 Visit http://localhost:3000/products to see the results!');
    }

  } catch (error) {
    console.error('❌ Image fix failed:', error.message);
  }
}

fixImagePaths();