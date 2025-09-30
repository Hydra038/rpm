import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const sortBy = searchParams.get('sortBy') || 'name';
    const sortOrder = searchParams.get('sortOrder') || 'asc';

    let query = supabase
      .from('parts')
      .select('*', { count: 'exact' });

    // Apply filters
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,part_number.ilike.%${search}%`);
    }

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: products, error, count } = await query;

    if (error) {
      console.error('Error fetching products:', error);
      return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }

    return NextResponse.json({
      products: products || [],
      totalCount: count || 0,
      currentPage: page,
      totalPages: Math.ceil((count || 0) / limit),
      hasNextPage: (page * limit) < (count || 0),
      hasPreviousPage: page > 1
    });

  } catch (error) {
    console.error('Error in products API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );
    const body = await request.json();

    // Validate required fields
    const { name, category, price, stock_quantity } = body;
    if (!name || !category || price === undefined || stock_quantity === undefined) {
      return NextResponse.json({ 
        error: 'Missing required fields: name, category, price, stock_quantity' 
      }, { status: 400 });
    }

    // Validate data types
    if (typeof price !== 'number' || price < 0) {
      return NextResponse.json({ error: 'Price must be a positive number' }, { status: 400 });
    }

    if (typeof stock_quantity !== 'number' || stock_quantity < 0 || !Number.isInteger(stock_quantity)) {
      return NextResponse.json({ error: 'Stock quantity must be a non-negative integer' }, { status: 400 });
    }

    // Create the product
    const { data: product, error } = await supabase
      .from('parts')
      .insert([{
        name,
        description: body.description || null,
        category,
        price,
        stock_quantity,
        part_number: body.part_number || null,
        manufacturer: body.manufacturer || null,
        weight: body.weight || null,
        dimensions: body.dimensions || null,
        image_url: body.image_url || null
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating product:', error);
      return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'Product created successfully', 
      product 
    }, { status: 201 });

  } catch (error) {
    console.error('Error in POST products API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Validate data types if provided
    if (updateData.price !== undefined && (typeof updateData.price !== 'number' || updateData.price < 0)) {
      return NextResponse.json({ error: 'Price must be a positive number' }, { status: 400 });
    }

    if (updateData.stock_quantity !== undefined && 
        (typeof updateData.stock_quantity !== 'number' || updateData.stock_quantity < 0 || !Number.isInteger(updateData.stock_quantity))) {
      return NextResponse.json({ error: 'Stock quantity must be a non-negative integer' }, { status: 400 });
    }

    // Update the product
    const { data: product, error } = await supabase
      .from('parts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }
      console.error('Error updating product:', error);
      return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'Product updated successfully', 
      product 
    });

  } catch (error) {
    console.error('Error in PUT products API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Check if product exists and if it's used in any orders
    const { data: orderItems, error: orderCheckError } = await supabase
      .from('order_items')
      .select('id')
      .eq('part_id', id)
      .limit(1);

    if (orderCheckError) {
      console.error('Error checking product usage:', orderCheckError);
      return NextResponse.json({ error: 'Failed to verify product status' }, { status: 500 });
    }

    if (orderItems && orderItems.length > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete product that has been used in orders. Consider setting stock to 0 instead.' 
      }, { status: 400 });
    }

    // Delete the product
    const { error } = await supabase
      .from('parts')
      .delete()
      .eq('id', id);

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }
      console.error('Error deleting product:', error);
      return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Product deleted successfully' });

  } catch (error) {
    console.error('Error in DELETE products API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}