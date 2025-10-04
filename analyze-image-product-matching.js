require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function analyzeImageProductMatching() {
  console.log('🔍 Analyzing product names vs image assignments...\n');
  
  try {
    // Get all products with their images
    const { data: products, error } = await supabase
      .from('parts')
      .select('id, name, image_url')
      .order('id');

    if (error) throw error;

    console.log(`📊 Analyzing ${products.length} products...\n`);

    const mismatches = [];
    const correctMatches = [];

    products.forEach(product => {
      if (!product.image_url) {
        console.log(`⚠️  Product "${product.name}" (ID: ${product.id}) has no image`);
        return;
      }

      // Extract image filename without extension and path
      const imageName = product.image_url
        .split('/')
        .pop()
        .replace(/\.(jpg|jpeg|png|webp)$/i, '')
        .toLowerCase()
        .replace(/-/g, ' ');

      // Normalize product name for comparison
      const productName = product.name.toLowerCase();

      // Check if product name relates to image name
      const isGoodMatch = checkNameMatch(productName, imageName);

      if (isGoodMatch) {
        correctMatches.push({
          id: product.id,
          name: product.name,
          image: product.image_url,
          imageName: imageName
        });
      } else {
        mismatches.push({
          id: product.id,
          name: product.name,
          image: product.image_url,
          imageName: imageName,
          productName: productName
        });
      }
    });

    console.log('\n❌ MISMATCHED PRODUCTS (Product name doesn\'t match image):');
    console.log('============================================================\n');
    
    mismatches.forEach(item => {
      console.log(`🔴 ${item.name} (ID: ${item.id})`);
      console.log(`   Image: ${item.image}`);
      console.log(`   Product: "${item.productName}"`);
      console.log(`   Image file: "${item.imageName}"`);
      console.log('');
    });

    console.log('\n✅ CORRECTLY MATCHED PRODUCTS:');
    console.log('============================================================\n');
    
    correctMatches.forEach(item => {
      console.log(`🟢 ${item.name} (ID: ${item.id})`);
      console.log(`   Image: ${item.image}`);
      console.log('');
    });

    console.log('\n📊 SUMMARY:');
    console.log('==============================');
    console.log(`❌ Mismatched products: ${mismatches.length}`);
    console.log(`✅ Correctly matched products: ${correctMatches.length}`);
    console.log(`📈 Match accuracy: ${((correctMatches.length / products.length) * 100).toFixed(1)}%`);

    return { mismatches, correctMatches };

  } catch (error) {
    console.error('❌ Error analyzing image-product matching:', error);
    throw error;
  }
}

function checkNameMatch(productName, imageName) {
  // Remove common words that don't affect matching
  const cleanProduct = productName
    .replace(/\b(set|kit|pack|pair|front|rear|left|right|premium|high|performance|universal)\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  const cleanImage = imageName
    .replace(/\b(set|kit|pack|pair|front|rear|left|right|premium|high|performance|universal)\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  // Check for key word matches
  const productWords = cleanProduct.split(' ').filter(w => w.length > 2);
  const imageWords = cleanImage.split(' ').filter(w => w.length > 2);

  // Calculate match score
  let matches = 0;
  productWords.forEach(pWord => {
    if (imageWords.some(iWord => 
      iWord.includes(pWord) || 
      pWord.includes(iWord) ||
      levenshteinDistance(pWord, iWord) <= 1
    )) {
      matches++;
    }
  });

  // Consider it a good match if at least 50% of significant words match
  const matchScore = matches / Math.max(productWords.length, 1);
  return matchScore >= 0.5;
}

function levenshteinDistance(str1, str2) {
  const matrix = [];
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[str2.length][str1.length];
}

if (require.main === module) {
  analyzeImageProductMatching()
    .then(() => console.log('\n🎉 Analysis completed!'))
    .catch(console.error);
}

module.exports = { analyzeImageProductMatching };