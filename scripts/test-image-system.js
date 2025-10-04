// Test script for the image management system
// Run with: node scripts/test-image-system.js

const fs = require('fs').promises;
const path = require('path');

async function testImageSystem() {
  console.log('🧪 Testing Image Management System\n');

  // Test 1: Check directory structure
  console.log('1. Checking directory structure...');
  const imageDir = path.join(process.cwd(), 'public', 'images', 'products');
  
  try {
    const categories = ['engine', 'brake', 'electrical', 'interior', 'suspension', 'exhaust'];
    
    for (const category of categories) {
      const categoryPath = path.join(imageDir, category);
      try {
        await fs.access(categoryPath);
        console.log(`   ✅ ${category}/ folder exists`);
      } catch {
        console.log(`   ❌ ${category}/ folder missing`);
      }
    }
  } catch (error) {
    console.log(`   ❌ Main images directory missing: ${imageDir}`);
  }

  console.log();

  // Test 2: Check API endpoints
  console.log('2. Testing API endpoints...');
  
  const endpoints = [
    { name: 'Image Names API', url: 'http://localhost:3001/api/image-names' },
    { name: 'Upload API Info', url: 'http://localhost:3001/api/admin/upload-image' },
    { name: 'Batch Update API Info', url: 'http://localhost:3001/api/admin/batch-update-images' }
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint.url);
      const data = await response.json();
      
      if (response.ok) {
        console.log(`   ✅ ${endpoint.name}: Working`);
        if (endpoint.name === 'Image Names API' && data.products) {
          console.log(`      📊 Found ${data.products.length} products`);
        }
      } else {
        console.log(`   ❌ ${endpoint.name}: Error ${response.status}`);
      }
    } catch (error) {
      console.log(`   ❌ ${endpoint.name}: Failed to connect`);
    }
  }

  console.log();

  // Test 3: Check for existing images
  console.log('3. Checking for existing product images...');
  
  try {
    const categories = ['engine', 'brake', 'electrical', 'interior', 'suspension', 'exhaust'];
    let totalImages = 0;
    
    for (const category of categories) {
      const categoryPath = path.join(imageDir, category);
      try {
        const files = await fs.readdir(categoryPath);
        const imageFiles = files.filter(file => 
          /\.(jpg|jpeg|png|webp)$/i.test(file)
        );
        
        if (imageFiles.length > 0) {
          console.log(`   📁 ${category}: ${imageFiles.length} images`);
          totalImages += imageFiles.length;
        }
      } catch (error) {
        // Category folder doesn't exist or can't be read
      }
    }
    
    if (totalImages === 0) {
      console.log('   📷 No custom images uploaded yet');
      console.log('   💡 Upload images via: http://localhost:3001/admin/images');
    } else {
      console.log(`   ✅ Total custom images: ${totalImages}`);
    }
  } catch (error) {
    console.log(`   ❌ Error checking images: ${error.message}`);
  }

  console.log();

  // Test 4: File permissions
  console.log('4. Testing file permissions...');
  
  const testFile = path.join(imageDir, 'test-write.txt');
  try {
    await fs.writeFile(testFile, 'test');
    await fs.unlink(testFile);
    console.log('   ✅ Directory is writable');
  } catch (error) {
    console.log('   ❌ Directory is not writable');
    console.log(`      Error: ${error.message}`);
  }

  console.log();

  // Summary
  console.log('📋 Quick Start Guide:');
  console.log('   1. Start your server: npm run dev');
  console.log('   2. Visit admin panel: http://localhost:3001/admin/images');
  console.log('   3. Upload images for each product');
  console.log('   4. Click "Update Database" to save changes');
  console.log();
  console.log('🔗 Useful URLs:');
  console.log('   • Admin Images: http://localhost:3001/admin/images');
  console.log('   • Image Names API: http://localhost:3001/api/image-names');
  console.log('   • Main Store: http://localhost:3001');
}

// Run the test
testImageSystem().catch(console.error);