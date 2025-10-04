import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET() {
  try {
    // Fetch all products with their image URLs
    const { data: products, error } = await supabase
      .from('parts')
      .select('id, name, image_url')
      .order('id');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Extract unique image names/filenames
    const imageNames = products
      .filter(product => product.image_url)
      .map(product => {
        const url = product.image_url;
        let imageName = '';
        
        if (url.includes('unsplash.com')) {
          // Extract Unsplash photo ID
          const match = url.match(/photo-([a-zA-Z0-9_-]+)/);
          imageName = match ? `unsplash-${match[1]}` : 'unsplash-unknown';
        } else if (url.includes('/')) {
          // Extract filename from URL
          imageName = url.split('/').pop().split('?')[0];
        } else {
          imageName = url;
        }
        
        return {
          id: product.id,
          name: product.name,
          originalUrl: url,
          imageName: imageName,
          suggestedFilename: `${product.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.jpg`
        };
      });

    // Get unique image names
    const uniqueImageNames = [...new Set(imageNames.map(img => img.imageName))];

    return NextResponse.json({
      success: true,
      totalProducts: products.length,
      productsWithImages: imageNames.length,
      uniqueImages: uniqueImageNames.length,
      imageDetails: imageNames,
      uniqueImageNames: uniqueImageNames,
      suggestedFilenames: imageNames.map(img => img.suggestedFilename)
    });

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}