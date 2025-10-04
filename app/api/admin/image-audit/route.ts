import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Get all products from database
    const { data: products, error } = await supabase
      .from('parts')
      .select('id, name, image_url, category')
      .order('id');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Check physical files in the images directory
    const imagesPath = path.join(process.cwd(), 'public', 'images', 'products');
    const categories = ['engine', 'brake', 'electrical', 'interior', 'suspension', 'exhaust'];
    
    let physicalFiles = [];
    let totalFiles = 0;
    
    for (const category of categories) {
      const categoryPath = path.join(imagesPath, category);
      try {
        if (fs.existsSync(categoryPath)) {
          const files = fs.readdirSync(categoryPath);
          const categoryFiles = files.map(file => ({
            category,
            filename: file,
            path: `/images/products/${category}/${file}`,
            exists: true
          }));
          physicalFiles.push(...categoryFiles);
          totalFiles += files.length;
        }
      } catch (err) {
        console.log(`Category ${category} not found or error reading:`, err.message);
      }
    }

    // Match products with images
    const productImageStatus = products.map(product => {
      const isUsingUnsplash = product.image_url?.includes('unsplash.com');
      const hasLocalImage = product.image_url?.startsWith('/images/products/');
      
      // Try to find matching image file
      const productName = product.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const matchingImages = physicalFiles.filter(file => 
        file.filename.toLowerCase().includes(productName.substring(0, 10)) ||
        productName.includes(file.filename.toLowerCase().replace(/\.[^/.]+$/, "").substring(0, 10))
      );

      return {
        id: product.id,
        name: product.name,
        category: product.category,
        currentImageUrl: product.image_url,
        isUsingUnsplash,
        hasLocalImage,
        matchingImages: matchingImages.map(img => img.path),
        suggestedImage: matchingImages.length > 0 ? matchingImages[0].path : null,
        needsUpdate: isUsingUnsplash && matchingImages.length > 0
      };
    });

    // Summary statistics
    const stats = {
      totalProducts: products.length,
      totalPhysicalImages: totalFiles,
      productsWithUnsplash: productImageStatus.filter(p => p.isUsingUnsplash).length,
      productsWithLocalImages: productImageStatus.filter(p => p.hasLocalImage).length,
      productsNeedingUpdate: productImageStatus.filter(p => p.needsUpdate).length,
      unmatchedImages: physicalFiles.filter(file => 
        !productImageStatus.some(p => p.matchingImages.includes(file.path))
      ).length
    };

    // Categories breakdown
    const categoryBreakdown = {};
    categories.forEach(cat => {
      const categoryFiles = physicalFiles.filter(f => f.category === cat);
      const categoryProducts = productImageStatus.filter(p => 
        p.category?.toLowerCase().includes(cat) || 
        p.name.toLowerCase().includes(cat)
      );
      
      categoryBreakdown[cat] = {
        filesAdded: categoryFiles.length,
        productsInCategory: categoryProducts.length,
        files: categoryFiles.map(f => f.filename)
      };
    });

    return NextResponse.json({
      success: true,
      stats,
      categoryBreakdown,
      productImageStatus,
      physicalFiles: physicalFiles.map(f => ({ 
        category: f.category, 
        filename: f.filename, 
        path: f.path 
      })),
      updateSuggestions: productImageStatus
        .filter(p => p.needsUpdate)
        .map(p => ({
          productId: p.id,
          productName: p.name,
          currentUrl: p.currentImageUrl,
          suggestedUrl: p.suggestedImage
        }))
    });

  } catch (error) {
    console.error('Image audit error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}