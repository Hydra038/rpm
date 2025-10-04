import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    const { updates } = await request.json();

    if (!updates || !Array.isArray(updates)) {
      return NextResponse.json({ 
        error: 'Invalid request. Expected array of updates.' 
      }, { status: 400 });
    }

    const results = [];
    let successCount = 0;
    let errorCount = 0;

    for (const update of updates) {
      try {
        const { id, image_url } = update;
        
        if (!id || !image_url) {
          results.push({
            id,
            success: false,
            error: 'Missing id or image_url'
          });
          errorCount++;
          continue;
        }

        const { data, error } = await supabase
          .from('parts')
          .update({ image_url })
          .eq('id', id)
          .select('id, name, image_url');

        if (error) {
          results.push({
            id,
            success: false,
            error: error.message
          });
          errorCount++;
        } else {
          results.push({
            id,
            success: true,
            data: data[0]
          });
          successCount++;
        }
      } catch (err: any) {
        results.push({
          id: update.id,
          success: false,
          error: err.message
        });
        errorCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Batch update completed: ${successCount} successful, ${errorCount} failed`,
      successCount,
      errorCount,
      results
    });

  } catch (error: any) {
    console.error('Batch update error:', error);
    return NextResponse.json({ 
      error: 'Failed to update images: ' + error.message 
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Batch image update endpoint',
    usage: 'POST with array of {id, image_url} objects',
    example: {
      updates: [
        { id: 1, image_url: '/images/products/engine/air-filter.jpg' },
        { id: 2, image_url: '/images/products/brake/brake-pads.jpg' }
      ]
    }
  });
}