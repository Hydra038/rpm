import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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
    const { action, productIds, updateData } = body;

    if (!action || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json({ 
        error: 'Action and productIds array are required' 
      }, { status: 400 });
    }

    let result;
    
    switch (action) {
      case 'delete':
        // Check if any products are used in orders
        const { data: orderItems, error: orderCheckError } = await supabase
          .from('order_items')
          .select('part_id')
          .in('part_id', productIds);

        if (orderCheckError) {
          console.error('Error checking product usage:', orderCheckError);
          return NextResponse.json({ error: 'Failed to verify product status' }, { status: 500 });
        }

        const usedProductIds = orderItems?.map(item => item.part_id) || [];
        const usableProductIds = productIds.filter(id => !usedProductIds.includes(id));

        if (usedProductIds.length > 0) {
          return NextResponse.json({ 
            error: `Cannot delete ${usedProductIds.length} product(s) that have been used in orders`,
            usedProductIds,
            deletableCount: usableProductIds.length
          }, { status: 400 });
        }

        // Delete products
        const { error: deleteError } = await supabase
          .from('parts')
          .delete()
          .in('id', productIds);

        if (deleteError) {
          console.error('Error deleting products:', deleteError);
          return NextResponse.json({ error: 'Failed to delete products' }, { status: 500 });
        }

        result = { message: `Successfully deleted ${productIds.length} product(s)` };
        break;

      case 'update':
        if (!updateData) {
          return NextResponse.json({ error: 'Update data is required' }, { status: 400 });
        }

        // Validate update data
        if (updateData.price !== undefined && (typeof updateData.price !== 'number' || updateData.price < 0)) {
          return NextResponse.json({ error: 'Price must be a positive number' }, { status: 400 });
        }

        if (updateData.stock_quantity !== undefined && 
            (typeof updateData.stock_quantity !== 'number' || updateData.stock_quantity < 0 || !Number.isInteger(updateData.stock_quantity))) {
          return NextResponse.json({ error: 'Stock quantity must be a non-negative integer' }, { status: 400 });
        }

        // Update products
        const { error: updateError } = await supabase
          .from('parts')
          .update(updateData)
          .in('id', productIds);

        if (updateError) {
          console.error('Error updating products:', updateError);
          return NextResponse.json({ error: 'Failed to update products' }, { status: 500 });
        }

        result = { message: `Successfully updated ${productIds.length} product(s)` };
        break;

      case 'updateStock':
        if (updateData.stock_quantity === undefined) {
          return NextResponse.json({ error: 'Stock quantity is required' }, { status: 400 });
        }

        if (typeof updateData.stock_quantity !== 'number' || updateData.stock_quantity < 0 || !Number.isInteger(updateData.stock_quantity)) {
          return NextResponse.json({ error: 'Stock quantity must be a non-negative integer' }, { status: 400 });
        }

        // Update stock for selected products
        const { error: stockError } = await supabase
          .from('parts')
          .update({ stock_quantity: updateData.stock_quantity })
          .in('id', productIds);

        if (stockError) {
          console.error('Error updating stock:', stockError);
          return NextResponse.json({ error: 'Failed to update stock' }, { status: 500 });
        }

        result = { message: `Successfully updated stock for ${productIds.length} product(s)` };
        break;

      case 'updateCategory':
        if (!updateData.category) {
          return NextResponse.json({ error: 'Category is required' }, { status: 400 });
        }

        // Update category for selected products
        const { error: categoryError } = await supabase
          .from('parts')
          .update({ category: updateData.category })
          .in('id', productIds);

        if (categoryError) {
          console.error('Error updating category:', categoryError);
          return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
        }

        result = { message: `Successfully updated category for ${productIds.length} product(s)` };
        break;

      case 'export':
        // Get product data for export
        const { data: products, error: exportError } = await supabase
          .from('parts')
          .select('*')
          .in('id', productIds)
          .order('name');

        if (exportError) {
          console.error('Error exporting products:', exportError);
          return NextResponse.json({ error: 'Failed to export products' }, { status: 500 });
        }

        // Convert to CSV format
        const csvHeaders = [
          'ID', 'Name', 'Description', 'Category', 'Price', 'Stock Quantity', 
          'Part Number', 'Manufacturer', 'Weight', 'Dimensions', 'Image URL'
        ];
        
        const csvRows = products?.map(product => [
          product.id,
          `"${product.name || ''}"`,
          `"${product.description || ''}"`,
          product.category,
          product.price,
          product.stock_quantity,
          `"${product.part_number || ''}"`,
          `"${product.manufacturer || ''}"`,
          product.weight || '',
          `"${product.dimensions || ''}"`,
          `"${product.image_url || ''}"`
        ]) || [];

        const csvContent = [csvHeaders.join(','), ...csvRows.map(row => row.join(','))].join('\n');

        return new NextResponse(csvContent, {
          headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="products-export-${new Date().toISOString().split('T')[0]}.csv"`
          }
        });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error in bulk products API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}