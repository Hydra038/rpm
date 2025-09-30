import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const make = searchParams.get('make') || '';
    const model = searchParams.get('model') || '';
    const year = searchParams.get('year') ? parseInt(searchParams.get('year')!) : undefined;
    const category = searchParams.get('category') || '';
    const search = searchParams.get('search') || '';
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 1000;

    console.log('API: Fetching products with params:', { make, model, year, category, search, limit });

    let query = supabase
      .from('parts')
      .select('*')
      .limit(limit);

    // Apply filters
    if (search && search.trim()) {
      const searchFormatted = search.toLowerCase().trim();
      query = query.or(`name.ilike.%${searchFormatted}%,description.ilike.%${searchFormatted}%,category.ilike.%${searchFormatted}%,part_number.ilike.%${searchFormatted}%`);
    }

    if (category) {
      const categoryFormatted = category.toLowerCase().replace(/\+/g, ' ');
      query = query.or(`category.ilike.%${categoryFormatted}%,name.ilike.%${categoryFormatted}%,description.ilike.%${categoryFormatted}%`);
    }

    if (make && make.trim()) {
      query = query.or(`make.ilike.%${make}%,compatible_vehicles.ilike.%${make}%`);
    }

    if (model && model.trim()) {
      query = query.or(`model.ilike.%${model}%,compatible_vehicles.ilike.%${model}%`);
    }

    if (year) {
      query = query.or(`year_from.lte.${year},year_to.gte.${year},compatible_vehicles.ilike.%${year}%`);
    }

    const { data, error } = await query.order('id', { ascending: false });

    if (error) {
      console.error('API: Error fetching products:', error);
      return NextResponse.json({
        success: false,
        error: error.message,
        products: []
      }, { status: 500 });
    }

    console.log(`API: Successfully fetched ${data?.length || 0} products`);
    
    return NextResponse.json({
      success: true,
      products: data || [],
      count: data?.length || 0
    });

  } catch (error: any) {
    console.error('API: Exception in products endpoint:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      products: []
    }, { status: 500 });
  }
}