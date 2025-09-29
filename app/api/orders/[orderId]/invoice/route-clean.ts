import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    console.log('Generating customer invoice for order:', orderId);

    // Create client to access Supabase (use service role if available, fallback to anon key)
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

    console.log('Fetching order data...');
    
    // Try to get the order first
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      console.error('Error fetching order:', orderError);
      return NextResponse.json(
        { error: 'Order not found: ' + (orderError?.message || 'No data') },
        { status: 404 }
      );
    }

    console.log('Order found:', order);

    // Try to get order_items
    const { data: items, error: itemsError } = await supabase
      .from('order_items')
      .select(`
        *,
        parts (
          name,
          category,
          description
        )
      `)
      .eq('order_id', orderId);

    let orderItems: any[] = [];
    if (!itemsError && items && items.length > 0) {
      // We have order_items
      orderItems = items.map((item: any) => ({
        product_name: item.parts?.name || 'Product',
        quantity: item.quantity,
        price: item.price,
        category: item.parts?.category || 'N/A',
        description: item.parts?.description || ''
      }));
      console.log('Order items found:', orderItems);
    } else {
      // Fallback to single product data in orders table
      console.log('No order_items found, using fallback data');
      orderItems = [{
        product_name: order.product_name || 'Auto Parts',
        quantity: order.quantity || 1,
        price: order.product_price || order.total_amount,
        category: 'Auto Parts',
        description: ''
      }];
    }

    const orderData = {
      ...order,
      order_items: orderItems
    };

    return generateInvoiceResponse(orderData, orderId);

  } catch (error: any) {
    console.error('Error generating customer invoice:', error);
    return NextResponse.json(
      { error: 'Failed to generate invoice: ' + error.message },
      { status: 500 }
    );
  }
}

function generateInvoiceResponse(orderData: any, orderId: string) {
  try {
    // Calculate totals
    const subtotal = orderData.order_items.reduce((sum: number, item: any) => 
      sum + (item.quantity * item.price), 0
    );
    const tax = subtotal * 0.20; // 20% VAT
    const total = subtotal + tax;
    
    // Payment plan information
    const paymentPlan = orderData.payment_plan || 'full';
    const amountPaid = orderData.amount_paid || 0;
    const remainingAmount = orderData.remaining_amount || 0;

    console.log('Invoice totals:', { subtotal, tax, total, paymentPlan, amountPaid });

    // Generate invoice HTML
    const invoiceHTML = generateCustomerInvoiceHTML(orderData, subtotal, tax, total, paymentPlan, amountPaid, remainingAmount);

    return new NextResponse(invoiceHTML, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `inline; filename="invoice-${orderId}.html"`
      }
    });

  } catch (error: any) {
    console.error('Error in generateInvoiceResponse:', error);
    throw error;
  }
}

function generateCustomerInvoiceHTML(
  order: any,
  subtotal: number,
  tax: number,
  total: number,
  paymentPlan: string,
  amountPaid: number,
  remainingAmount: number
): string {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice - RPM Auto Parts</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 0; 
            padding: 20px; 
            background-color: #f5f5f5; 
            color: #333;
        }
        .invoice-container { 
            max-width: 800px; 
            margin: 0 auto; 
            background: white; 
            padding: 30px; 
            border-radius: 8px; 
            box-shadow: 0 2px 10px rgba(0,0,0,0.1); 
        }
        .header { 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            margin-bottom: 30px; 
            border-bottom: 2px solid #e5e5e5; 
            padding-bottom: 20px; 
        }
        .logo { 
            font-size: 28px; 
            font-weight: bold; 
            color: #dc2626; 
        }
        .invoice-info { 
            text-align: right; 
        }
        .invoice-number { 
            font-size: 18px; 
            font-weight: bold; 
        }
        .date { 
            color: #666; 
            margin-top: 5px; 
        }
        .customer-info { 
            margin: 20px 0; 
        }
        .customer-info h3 { 
            margin-bottom: 10px; 
            color: #333; 
        }
        .customer-details { 
            background-color: #f8f9fa; 
            padding: 15px; 
            border-radius: 5px; 
            margin-bottom: 20px; 
        }
        table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 20px 0; 
        }
        th, td { 
            padding: 12px; 
            text-align: left; 
            border-bottom: 1px solid #ddd; 
        }
        th { 
            background-color: #f8f9fa; 
            font-weight: bold; 
        }
        .total-row { 
            font-weight: bold; 
            background-color: #f8f9fa; 
        }
        .payment-info { 
            background-color: #e3f2fd; 
            padding: 20px; 
            border-radius: 5px; 
            margin-top: 20px; 
        }
        .payment-status { 
            padding: 5px 10px; 
            border-radius: 3px; 
            font-weight: bold; 
        }
        .status-pending { 
            background-color: #fff3cd; 
            color: #856404; 
        }
        .status-paid, .status-completed { 
            background-color: #d4edda; 
            color: #155724; 
        }
        .status-partial, .status-partially_paid { 
            background-color: #d1ecf1; 
            color: #0c5460; 
        }
        .amount { 
            text-align: right; 
        }
        .footer { 
            margin-top: 30px; 
            text-align: center; 
            color: #666; 
            font-size: 12px; 
        }
        .print-button {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #dc2626;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            z-index: 1000;
        }
        .print-button:hover {
            background: #b91c1c;
        }
        @media print {
            body { margin: 0; background: white; }
            .print-button { display: none; }
        }
    </style>
</head>
<body>
    <button class="print-button" onclick="window.print()">Print Invoice</button>
    
    <div class="invoice-container">
        <div class="header">
            <div class="logo">RPM Auto Parts</div>
            <div class="invoice-info">
                <div class="invoice-number">Invoice #${String(order.id).slice(-8)}</div>
                <div class="date">${formatDate(order.created_at)}</div>
            </div>
        </div>

        <div class="customer-info">
            <h3>Bill To:</h3>
            <div class="customer-details">
                <strong>${order.customer_name || 'N/A'}</strong><br>
                ${order.customer_email || 'N/A'}<br>
                ${order.customer_phone || 'N/A'}<br>
                ${order.delivery_address ? `<br>${order.delivery_address}` : ''}
            </div>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Qty</th>
                    <th>Unit Price</th>
                    <th class="amount">Total</th>
                </tr>
            </thead>
            <tbody>
                ${order.order_items.map((item: any) => `
                    <tr>
                        <td>
                            <strong>${item.product_name}</strong>
                            ${item.description ? `<br><small style="color: #666;">${item.description}</small>` : ''}
                        </td>
                        <td>${item.category || 'Auto Parts'}</td>
                        <td>${item.quantity}</td>
                        <td>${formatCurrency(item.price)}</td>
                        <td class="amount">${formatCurrency(item.quantity * item.price)}</td>
                    </tr>
                `).join('')}
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="4"><strong>Subtotal</strong></td>
                    <td class="amount"><strong>${formatCurrency(subtotal)}</strong></td>
                </tr>
                <tr>
                    <td colspan="4"><strong>VAT (20%)</strong></td>
                    <td class="amount"><strong>${formatCurrency(tax)}</strong></td>
                </tr>
                <tr class="total-row">
                    <td colspan="4"><strong>Total</strong></td>
                    <td class="amount"><strong>${formatCurrency(total)}</strong></td>
                </tr>
            </tfoot>
        </table>

        <div class="payment-info">
            <h3>Payment Information</h3>
            <p><strong>Payment Plan:</strong> ${paymentPlan === 'full' ? 'Full Payment' : '50% Deposit'}</p>
            <p><strong>Payment Method:</strong> ${order.payment_method || 'N/A'}</p>
            <p><strong>Payment Status:</strong> 
                <span class="payment-status status-${order.payment_status || 'pending'}">
                    ${(order.payment_status || 'PENDING').toUpperCase()}
                </span>
            </p>
            
            ${paymentPlan === 'half' ? `
                <p><strong>Amount Paid:</strong> ${formatCurrency(amountPaid)}</p>
                <p><strong>Remaining Amount:</strong> ${formatCurrency(remainingAmount)}</p>
                ${remainingAmount > 0 ? `<p><strong>Due Date:</strong> ${formatDate(new Date(new Date(order.created_at).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString())}</p>` : ''}
            ` : `
                <p><strong>Amount Paid:</strong> ${formatCurrency(amountPaid)}</p>
            `}
        </div>

        <div class="footer">
            <p>Thank you for your business!</p>
            <p>RPM Auto Parts - Your trusted partner for quality automotive parts</p>
            <p>For support, contact us at support@rpmgenuineautoparts.info</p>
        </div>
    </div>
</body>
</html>`;
}