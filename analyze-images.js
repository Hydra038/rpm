const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function analyzeImageNeeds() {
  console.log('🔍 Analyzing image needs for all categories...\n');
  
  try {
    // Get all products from database
    const { data: products, error } = await supabase
      .from('parts')
      .select('id, name, image_url, category')
      .order('category, name');

    if (error) {
      console.error('❌ Error fetching products:', error.message);
      return;
    }

    // Check existing images
    const imagesPath = path.join(process.cwd(), 'public', 'images', 'products');
    const existingImages = {};
    const categories = ['engine', 'brake', 'electrical', 'interior', 'suspension', 'exhaust'];
    
    for (const category of categories) {
      const categoryPath = path.join(imagesPath, category);
      existingImages[category] = [];
      try {
        if (fs.existsSync(categoryPath)) {
          const files = fs.readdirSync(categoryPath);
          existingImages[category] = files;
        }
      } catch (err) {
        console.log(`⚠️  Could not read ${category} directory`);
      }
    }

    // Analyze by the categories shown in your screenshot
    const categoryGroups = {
      'Body Parts': ['body', 'exterior', 'trim', 'panel', 'bumper', 'fender', 'hood', 'door'],
      'Brake System': ['brake'],
      'Brakes': ['brake'], // Separate from Brake System
      'Electrical': ['electrical', 'battery', 'alternator', 'starter', 'ignition', 'light'],
      'Engine': ['engine', 'motor', 'oil', 'fuel', 'cooling', 'intake', 'exhaust'],
      'Engine Parts': ['engine', 'piston', 'valve', 'gasket', 'belt', 'pump'],
      'Exhaust': ['exhaust', 'muffler', 'catalytic', 'pipe'],
      'Filters': ['filter', 'air filter', 'oil filter', 'fuel filter'],
      'Interior': ['interior', 'seat', 'dashboard', 'floor', 'carpet'],
      'Suspension': ['suspension', 'shock', 'strut', 'spring', 'bushing']
    };

    console.log('📊 CATEGORY ANALYSIS:\n');
    console.log('='.repeat(80));

    for (const [categoryName, keywords] of Object.entries(categoryGroups)) {
      console.log(`\n🔶 ${categoryName.toUpperCase()}`);
      console.log('-'.repeat(40));

      // Find products matching this category
      const matchingProducts = products.filter(product => 
        keywords.some(keyword => 
          product.name.toLowerCase().includes(keyword.toLowerCase()) ||
          product.category?.toLowerCase().includes(keyword.toLowerCase())
        )
      );

      const usingUnsplash = matchingProducts.filter(p => p.image_url?.includes('unsplash.com'));
      const usingLocal = matchingProducts.filter(p => p.image_url?.startsWith('/images/products/'));
      const missingImages = matchingProducts.filter(p => !p.image_url || p.image_url === '');

      console.log(`📝 Total Products: ${matchingProducts.length}`);
      console.log(`✅ Using Local Images: ${usingLocal.length}`);
      console.log(`🌐 Using Unsplash: ${usingUnsplash.length}`);
      console.log(`❌ Missing Images: ${missingImages.length}`);

      if (usingUnsplash.length > 0) {
        console.log(`\n🚨 NEEDS IMAGES (${usingUnsplash.length} products):`);
        usingUnsplash.slice(0, 10).forEach((product, index) => {
          console.log(`   ${index + 1}. ${product.name}`);
        });
        if (usingUnsplash.length > 10) {
          console.log(`   ... and ${usingUnsplash.length - 10} more`);
        }
      }

      // Suggest image names for this category
      if (usingUnsplash.length > 0) {
        console.log(`\n💡 SUGGESTED IMAGE NAMES:`);
        const uniqueProducts = [...new Set(usingUnsplash.map(p => p.name.toLowerCase()))];
        uniqueProducts.slice(0, 5).forEach((name, index) => {
          const filename = name.replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-') + '.jpg';
          console.log(`   ${index + 1}. ${filename}`);
        });
      }
    }

    // Summary of existing images
    console.log('\n\n📁 EXISTING IMAGES BY FOLDER:');
    console.log('='.repeat(80));
    for (const [category, files] of Object.entries(existingImages)) {
      console.log(`\n${category.toUpperCase()}: ${files.length} images`);
      if (files.length > 0) {
        files.forEach(file => console.log(`   • ${file}`));
      } else {
        console.log('   (no images)');
      }
    }

    // Generate image shopping list
    console.log('\n\n🛒 SHOPPING LIST - IMAGES NEEDED:');
    console.log('='.repeat(80));
    
    const allUnsplash = products.filter(p => p.image_url?.includes('unsplash.com'));
    const productsByCategory = {};
    
    allUnsplash.forEach(product => {
      const category = determineImageCategory(product.name);
      if (!productsByCategory[category]) {
        productsByCategory[category] = [];
      }
      productsByCategory[category].push(product.name);
    });

    let totalNeeded = 0;
    for (const [category, productNames] of Object.entries(productsByCategory)) {
      const uniqueNames = [...new Set(productNames)];
      console.log(`\n📂 ${category.toUpperCase()} (${uniqueNames.length} unique products):`);
      uniqueNames.forEach((name, index) => {
        const filename = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-') + '.jpg';
        console.log(`   ${index + 1}. ${filename}`);
        totalNeeded++;
      });
    }

    console.log(`\n🎯 TOTAL UNIQUE IMAGES NEEDED: ${totalNeeded}`);
    console.log(`✅ ALREADY HAVE: ${Object.values(existingImages).flat().length}`);
    console.log(`📥 STILL NEED: ${Math.max(0, totalNeeded - Object.values(existingImages).flat().length)}`);

  } catch (error) {
    console.error('❌ Analysis failed:', error.message);
  }
}

function determineImageCategory(productName) {
  const name = productName.toLowerCase();
  
  if (name.includes('brake')) return 'brake';
  if (name.includes('engine') || name.includes('oil') || name.includes('spark') || name.includes('filter')) return 'engine';
  if (name.includes('electrical') || name.includes('battery') || name.includes('alternator') || name.includes('starter') || name.includes('light')) return 'electrical';
  if (name.includes('interior') || name.includes('seat') || name.includes('floor') || name.includes('dashboard')) return 'interior';
  if (name.includes('suspension') || name.includes('shock') || name.includes('strut') || name.includes('spring')) return 'suspension';
  if (name.includes('exhaust') || name.includes('muffler') || name.includes('catalytic')) return 'exhaust';
  
  return 'miscellaneous';
}

analyzeImageNeeds();