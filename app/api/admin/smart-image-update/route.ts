import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Disable static optimization for this route
export const dynamic = 'force-dynamic';

let supabase: any;

function getSupabaseClient() {
  if (!supabase) {
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables');
    }
    supabase = createClient(supabaseUrl, supabaseServiceKey);
  }
  return supabase;
}

export async function GET() {
  return NextResponse.json({ message: 'Smart update endpoint is ready', method: 'Use POST to execute' });
}

export async function POST() {
  try {
    // Get audit data first
    const auditResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/admin/image-audit`);
    const auditData = await auditResponse.json();
    
    if (!auditData.success) {
      return NextResponse.json({ error: 'Failed to get audit data' }, { status: 500 });
    }

    const updates = [];
    const { productImageStatus } = auditData;

    // Smart matching logic
    for (const product of productImageStatus) {
      if (product.needsUpdate && product.suggestedImage) {
        updates.push({
          id: product.id,
          name: product.name,
          oldUrl: product.currentImageUrl,
          newUrl: product.suggestedImage
        });
      }
    }

    // Also do some manual matching for specific products
    const manualMatches = [
      // Engine category
      { searchName: 'engine', fileName: 'engine-block-heater.jpg', newUrl: '/images/products/engine/engine-block-heater.jpg' },
      { searchName: 'air filter', fileName: 'high-performance-air-filter.webp', newUrl: '/images/products/engine/high-performance-air-filter.webp' },
      { searchName: 'oil filter', fileName: 'oil-filter-premium.jpg', newUrl: '/images/products/engine/oil-filter-premium.jpg' },
      { searchName: 'spark plug', fileName: 'iridium-spark-plugs-set.webp', newUrl: '/images/products/engine/iridium-spark-plugs-set.webp' },
      
      // Brake category
      { searchName: 'brake pad', fileName: 'ceramic-brake-pads-front.jpg', newUrl: '/images/products/brake/ceramic-brake-pads-front.jpg' },
      { searchName: 'brake fluid', fileName: 'brake-fluid-dot-4.webp', newUrl: '/images/products/brake/brake-fluid-dot-4.webp' },
      { searchName: 'brake rotor', fileName: 'brake-rotor-vented-front.png', newUrl: '/images/products/brake/brake-rotor-vented-front.png' },
      { searchName: 'master cylinder', fileName: 'brake-master-cylinder.webp', newUrl: '/images/products/brake/brake-master-cylinder.webp' },
      
      // Electrical category
      { searchName: 'battery', fileName: 'car-battery-12v.jpg', newUrl: '/images/products/electrical/car-battery-12v.jpg' },
      { searchName: 'alternator', fileName: 'alternator-120a.jpg', newUrl: '/images/products/electrical/alternator-120a.jpg' },
      { searchName: 'headlight', fileName: 'led-headlight-bulbs-h7.webp', newUrl: '/images/products/electrical/led-headlight-bulbs-h7.webp' },
      { searchName: 'starter', fileName: 'starter-motor-remanufactured.png', newUrl: '/images/products/electrical/starter-motor-remanufactured.png' },
      
      // Interior category
      { searchName: 'seat cover', fileName: 'leather-seat-covers-black.webp', newUrl: '/images/products/interior/leather-seat-covers-black.webp' },
      { searchName: 'floor mat', fileName: 'rubber-floor-mats-black.jpg', newUrl: '/images/products/interior/rubber-floor-mats-black.jpg' },
      { searchName: 'dashboard', fileName: 'dashboard-camera-1080p.jpg', newUrl: '/images/products/interior/dashboard-camera-1080p.jpg' },
      
      // Suspension category
      { searchName: 'shock', fileName: 'shock-absorbers-front.jpg', newUrl: '/images/products/suspension/shock-absorbers-front.jpg' },
      { searchName: 'strut', fileName: 'strut-assembly-complete.png', newUrl: '/images/products/suspension/strut-assembly-complete.png' },
      { searchName: 'spring', fileName: 'coil-springs-rear.webp', newUrl: '/images/products/suspension/coil-springs-rear.webp' },
      
      // Exhaust category
      { searchName: 'catalytic converter', fileName: 'catalytic-converter-universal.jpg', newUrl: '/images/products/exhaust/catalytic-converter-universal.jpg' },
      { searchName: 'muffler', fileName: 'performance-muffler-stainless.webp', newUrl: '/images/products/exhaust/performance-muffler-stainless.webp' }
    ];

    // Apply manual matches
    for (const match of manualMatches) {
      const matchingProducts = productImageStatus.filter(p => 
        p.name.toLowerCase().includes(match.searchName.toLowerCase()) &&
        p.isUsingUnsplash
      );
      
      for (const product of matchingProducts) {
        if (!updates.find(u => u.id === product.id)) {
          updates.push({
            id: product.id,
            name: product.name,
            oldUrl: product.currentImageUrl,
            newUrl: match.newUrl
          });
        }
      }
    }

    // Execute the updates
    const results = [];
    let successCount = 0;
    let errorCount = 0;

    for (const update of updates) {
      try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
          .from('parts')
          .update({ image_url: update.newUrl })
          .eq('id', update.id)
          .select();

        if (error) {
          results.push({
            id: update.id,
            name: update.name,
            success: false,
            error: error.message
          });
          errorCount++;
        } else {
          results.push({
            id: update.id,
            name: update.name,
            success: true,
            oldUrl: update.oldUrl,
            newUrl: update.newUrl
          });
          successCount++;
        }
      } catch (err) {
        results.push({
          id: update.id,
          name: update.name,
          success: false,
          error: err.message
        });
        errorCount++;
      }
    }

    return NextResponse.json({
      success: true,
      summary: {
        totalUpdates: updates.length,
        successCount,
        errorCount
      },
      results
    });

  } catch (error) {
    console.error('Smart update error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}