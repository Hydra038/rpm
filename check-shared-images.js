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

async function analyzeSharedImages() {
  console.log('🔍 Analyzing recently viewed images and shared image usage...\n');
  
  try {
    // Get all products with their images
    const { data: products, error: fetchError } = await supabase
      .from('parts')
      .select('id, name, image_url, category, price')
      .order('name');

    if (fetchError) {
      console.error('❌ Error fetching products:', fetchError.message);
      return;
    }

    console.log(`📊 Analyzing ${products.length} products...\n`);

    // Check which images exist vs missing
    const imagesPath = path.join(process.cwd(), 'public', 'images', 'products');
    const existingImages = [];
    const categories = ['body', 'brake', 'electrical', 'engine', 'exhaust', 'filters', 'interior', 'suspension'];
    
    for (const category of categories) {
      const categoryPath = path.join(imagesPath, category);
      if (fs.existsSync(categoryPath)) {
        const files = fs.readdirSync(categoryPath)
          .filter(f => /\.(jpg|jpeg|png|webp|avif)$/i.test(f))
          .map(f => `/images/products/${category}/${f}`);
        existingImages.push(...files);
      }
    }

    // Group products by image URL
    const imageGroups = {};
    const missingImages = [];
    
    products.forEach(product => {
      if (!product.image_url) {
        missingImages.push(product);
        return;
      }

      // Check if image file exists
      const imageExists = existingImages.includes(product.image_url);
      if (!imageExists) {
        missingImages.push(product);
        return;
      }

      if (!imageGroups[product.image_url]) {
        imageGroups[product.image_url] = [];
      }
      imageGroups[product.image_url].push(product);
    });

    // Find shared images (used by multiple products)
    const sharedImages = Object.entries(imageGroups)
      .filter(([url, products]) => products.length > 1)
      .sort((a, b) => b[1].length - a[1].length);

    console.log('🔗 PRODUCTS SHARING IMAGES:');
    console.log('=' .repeat(60));
    
    sharedImages.forEach(([imageUrl, products], index) => {
      console.log(`\n${index + 1}. Image: ${imageUrl}`);
      console.log(`   Used by ${products.length} products:`);
      products.forEach((product, i) => {
        console.log(`   ${i + 1}. ${product.name} (ID: ${product.id}) - $${product.price || 'N/A'}`);
      });
    });

    console.log('\n\n❌ MISSING IMAGES:');
    console.log('=' .repeat(40));
    if (missingImages.length > 0) {
      missingImages.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name}`);
        console.log(`   URL: ${product.image_url || 'NULL'}`);
      });
    } else {
      console.log('✅ No missing images found!');
    }

    // Analyze recently viewed images (check server logs for 404s vs successful loads)
    console.log('\n\n📈 IMAGE USAGE STATISTICS:');
    console.log('=' .repeat(50));
    
    const imageStats = {};
    Object.entries(imageGroups).forEach(([url, products]) => {
      const category = url.split('/')[3]; // Extract category from path
      if (!imageStats[category]) {
        imageStats[category] = { used: 0, products: 0 };
      }
      imageStats[category].used += 1;
      imageStats[category].products += products.length;
    });

    Object.entries(imageStats).forEach(([category, stats]) => {
      console.log(`📁 ${category.toUpperCase()}: ${stats.used} images used by ${stats.products} products`);
    });

    // Generate recommendations for fixing shared images
    console.log('\n\n💡 RECOMMENDATIONS:');
    console.log('=' .repeat(40));
    
    const highPriorityShared = sharedImages.filter(([url, products]) => products.length >= 5);
    const mediumPriorityShared = sharedImages.filter(([url, products]) => products.length >= 3 && products.length < 5);
    
    if (highPriorityShared.length > 0) {
      console.log('\n🚨 HIGH PRIORITY (5+ products sharing):');
      highPriorityShared.forEach(([url, products]) => {
        console.log(`   • ${url} (${products.length} products)`);
        console.log(`     Suggestion: Create ${products.length - 1} additional similar images`);
      });
    }

    if (mediumPriorityShared.length > 0) {
      console.log('\n⚠️  MEDIUM PRIORITY (3-4 products sharing):');
      mediumPriorityShared.forEach(([url, products]) => {
        console.log(`   • ${url} (${products.length} products)`);
        console.log(`     Suggestion: Create ${products.length - 1} additional variations`);
      });
    }

    // Check for unused images
    const usedImageUrls = Object.keys(imageGroups);
    const unusedImages = existingImages.filter(img => !usedImageUrls.includes(img));
    
    console.log(`\n📦 UNUSED IMAGES (${unusedImages.length} total):`);
    if (unusedImages.length > 0) {
      unusedImages.slice(0, 10).forEach((img, i) => {
        console.log(`   ${i + 1}. ${img}`);
      });
      if (unusedImages.length > 10) {
        console.log(`   ... and ${unusedImages.length - 10} more`);
      }
    }

    // Summary
    console.log('\n\n📋 SUMMARY:');
    console.log('=' .repeat(30));
    console.log(`✅ Products with unique images: ${Object.values(imageGroups).filter(p => p.length === 1).length}`);
    console.log(`🔗 Products sharing images: ${Object.values(imageGroups).filter(p => p.length > 1).reduce((sum, p) => sum + p.length, 0)}`);
    console.log(`❌ Products with missing images: ${missingImages.length}`);
    console.log(`📦 Unused images available: ${unusedImages.length}`);
    console.log(`🎯 Total shared image groups: ${sharedImages.length}`);

    // Write detailed report
    let report = '# Image Sharing Analysis Report\n\n';
    report += `## Summary\n`;
    report += `- Total products: ${products.length}\n`;
    report += `- Shared image groups: ${sharedImages.length}\n`;
    report += `- Missing images: ${missingImages.length}\n`;
    report += `- Unused images: ${unusedImages.length}\n\n`;

    report += `## Products Sharing Images\n\n`;
    sharedImages.forEach(([url, products]) => {
      report += `### ${url} (${products.length} products)\n`;
      products.forEach(p => {
        report += `- ${p.name} (ID: ${p.id})\n`;
      });
      report += '\n';
    });

    if (missingImages.length > 0) {
      report += `## Missing Images\n\n`;
      missingImages.forEach(p => {
        report += `- ${p.name}: ${p.image_url || 'NULL'}\n`;
      });
    }

    fs.writeFileSync('IMAGE_SHARING_ANALYSIS.md', report);
    console.log('\n✅ Detailed report saved to IMAGE_SHARING_ANALYSIS.md');

  } catch (error) {
    console.error('❌ Analysis failed:', error.message);
  }
}

analyzeSharedImages();