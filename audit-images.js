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

async function auditImages() {
  console.log('🔍 Auditing images for duplicates and 404s...\n');
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
    // Scan all available images
    const imagesPath = path.join(process.cwd(), 'public', 'images', 'products');
    const categories = fs.readdirSync(imagesPath).filter(f => fs.statSync(path.join(imagesPath, f)).isDirectory());
    const allImages = [];
    for (const category of categories) {
      const files = fs.readdirSync(path.join(imagesPath, category)).filter(f => /\.(jpg|jpeg|png|webp|avif)$/i.test(f));
      files.forEach(file => {
        allImages.push(`/images/products/${category}/${file}`);
      });
    }
    // Find duplicates in DB
    const imageCount = {};
    products.forEach(p => {
      if (p.image_url) {
        imageCount[p.image_url] = (imageCount[p.image_url] || 0) + 1;
      }
    });
    const duplicates = Object.entries(imageCount).filter(([url, count]) => count > 1);
    // Find 404s (missing files)
    const missingImages = products.filter(p => p.image_url && !allImages.includes(p.image_url));
    // Find unused images
    const usedImages = products.map(p => p.image_url).filter(Boolean);
    const unusedImages = allImages.filter(img => !usedImages.includes(img));
    // Output
    console.log('--- Duplicates in DB ---');
    duplicates.forEach(([url, count]) => console.log(`${url} used ${count} times`));
    console.log('\n--- 404 (Missing) Images ---');
    missingImages.forEach(p => console.log(`${p.name}: ${p.image_url}`));
    console.log('\n--- Unused Images ---');
    unusedImages.forEach(img => console.log(img));
    // Write report
    let report = '# Image Audit Report\n\n';
    report += '## Duplicates\n';
    duplicates.forEach(([url, count]) => report += `- ${url} used ${count} times\n`);
    report += '\n## Missing Images (404)\n';
    missingImages.forEach(p => report += `- ${p.name}: ${p.image_url}\n`);
    report += '\n## Unused Images\n';
    unusedImages.forEach(img => report += `- ${img}\n`);
    fs.writeFileSync('IMAGE_AUDIT.md', report);
    console.log('\n✅ Audit complete. See IMAGE_AUDIT.md for details.');
  } catch (error) {
    console.error('❌ Audit failed:', error.message);
  }
}

auditImages();