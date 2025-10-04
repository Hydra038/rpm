const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function getImageNames() {
  console.log('📋 Getting exact image names for remaining products...\n');
  
  try {
    // Get all products currently using Unsplash
    const { data: products, error: fetchError } = await supabase
      .from('parts')
      .select('id, name, image_url, category')
      .like('image_url', '%unsplash.com%')
      .order('name');

    if (fetchError) {
      console.error('❌ Error fetching products:', fetchError.message);
      return;
    }

    console.log(`🔍 Found ${products.length} products still using Unsplash images\n`);

    // Categorize products and suggest image names
    const categoryMappings = {
      'body': {
        keywords: ['door', 'bumper', 'grille', 'spoiler', 'mirror', 'skirt', 'tail light', 'fender', 'hood'],
        folder: '/public/images/products/body/',
        products: []
      },
      'brake': {
        keywords: ['brake'],
        folder: '/public/images/products/brake/',
        products: []
      },
      'electrical': {
        keywords: ['battery', 'alternator', 'starter', 'light', 'electrical', 'wire', 'switch', 'motor', 'wiper'],
        folder: '/public/images/products/electrical/',
        products: []
      },
      'engine': {
        keywords: ['engine', 'fuel', 'injector', 'timing', 'belt', 'gasket', 'manifold', 'coolant', 'breather'],
        folder: '/public/images/products/engine/',
        products: []
      },
      'exhaust': {
        keywords: ['exhaust', 'muffler', 'catalytic', 'clamp', 'tips', 'heat', 'shield', 'resonator', 'pipe'],
        folder: '/public/images/products/exhaust/',
        products: []
      },
      'filters': {
        keywords: ['filter'],
        folder: '/public/images/products/filters/',
        products: []
      },
      'interior': {
        keywords: ['seat', 'floor', 'mat', 'console', 'cup', 'gear', 'steering', 'wheel', 'sunroof', 'dashboard'],
        folder: '/public/images/products/interior/',
        products: []
      },
      'suspension': {
        keywords: ['shock', 'strut', 'spring', 'suspension', 'control', 'arm', 'bushing', 'sway', 'bar'],
        folder: '/public/images/products/suspension/',
        products: []
      }
    };

    // Categorize each product
    products.forEach(product => {
      let categorized = false;
      const productName = product.name.toLowerCase();
      
      for (const [category, config] of Object.entries(categoryMappings)) {
        if (config.keywords.some(keyword => productName.includes(keyword))) {
          const imageName = productName
            .replace(/[^a-z0-9\s]/g, '') // Remove special chars
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/-+/g, '-') // Remove multiple hyphens
            .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
            + '.jpg';
          
          config.products.push({
            name: product.name,
            imageName: imageName,
            id: product.id
          });
          categorized = true;
          break;
        }
      }
      
      if (!categorized) {
        // Default to miscellaneous/engine category
        const imageName = productName
          .replace(/[^a-z0-9\s]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '')
          + '.jpg';
        
        categoryMappings.engine.products.push({
          name: product.name,
          imageName: imageName,
          id: product.id
        });
      }
    });

    // Display organized results
    console.log('🎯 EXACT IMAGE NAMES NEEDED BY CATEGORY:\n');
    console.log('='.repeat(80));

    let totalImages = 0;

    for (const [category, config] of Object.entries(categoryMappings)) {
      if (config.products.length > 0) {
        console.log(`\n📁 ${category.toUpperCase()} CATEGORY`);
        console.log(`📂 Save in folder: ${config.folder}`);
        console.log(`📊 ${config.products.length} images needed`);
        console.log('-'.repeat(50));
        
        config.products.forEach((product, index) => {
          console.log(`${(index + 1).toString().padStart(2)}. ${product.imageName}`);
          console.log(`    └─ For product: "${product.name}"`);
        });
        
        totalImages += config.products.length;
      }
    }

    console.log('\n' + '='.repeat(80));
    console.log(`🎯 TOTAL IMAGES TO SOURCE: ${totalImages}`);
    console.log('\n💡 TIPS:');
    console.log('   • Use exact filenames as shown above');
    console.log('   • Save as .jpg format (or .webp/.png if you prefer)');
    console.log('   • Place in the correct folder for each category');
    console.log('   • Run "node complete-update.js" after adding images');

    // Create a simple checklist file
    console.log('\n📝 Creating checklist file...');
    
    let checklistContent = '# 🛒 RPM Image Checklist\n\n';
    checklistContent += `**Total Images Needed: ${totalImages}**\n\n`;
    
    for (const [category, config] of Object.entries(categoryMappings)) {
      if (config.products.length > 0) {
        checklistContent += `## 📁 ${category.toUpperCase()} (${config.products.length} images)\n`;
        checklistContent += `**Folder:** \`${config.folder}\`\n\n`;
        
        config.products.forEach((product, index) => {
          checklistContent += `- [ ] \`${product.imageName}\`\n`;
          checklistContent += `      *For: ${product.name}*\n`;
        });
        checklistContent += '\n';
      }
    }
    
    checklistContent += '\n---\n\n';
    checklistContent += '**After adding images, run:** `node complete-update.js`\n';

    require('fs').writeFileSync('IMAGE_CHECKLIST.md', checklistContent);
    console.log('✅ Created IMAGE_CHECKLIST.md file for easy tracking!');

  } catch (error) {
    console.error('❌ Failed to get image names:', error.message);
  }
}

getImageNames();