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
    
    // Try to get the order with order_items relationship first
    let orderData: any;
    let orderItems: any[] = [];

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
            color: #2563eb; 
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
        .status-paid { 
            background-color: #d4edda; 
            color: #155724; 
        }
        .status-partial { 
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
    </style>
</head>
<body>
    <div class="invoice-container">
        <div class="header">
            <div class="logo">RPM Auto Parts</div>
            <div class="invoice-info">
                <div class="invoice-number">Invoice #${order.id.slice(-8)}</div>
                <div class="date">${new Date(order.created_at).toLocaleDateString()}</div>
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
                    <th>Qty</th>
                    <th>Price</th>
                    <th class="amount">Total</th>
                </tr>
            </thead>
            <tbody>
                ${order.order_items.map((item: any) => `
                    <tr>
                        <td>${item.product_name}</td>
                        <td>${item.quantity}</td>
                        <td>£${item.price.toFixed(2)}</td>
                        <td class="amount">£${(item.quantity * item.price).toFixed(2)}</td>
                    </tr>
                `).join('')}
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="3"><strong>Subtotal</strong></td>
                    <td class="amount"><strong>£${subtotal.toFixed(2)}</strong></td>
                </tr>
                <tr>
                    <td colspan="3"><strong>VAT (20%)</strong></td>
                    <td class="amount"><strong>£${tax.toFixed(2)}</strong></td>
                </tr>
                <tr class="total-row">
                    <td colspan="3"><strong>Total</strong></td>
                    <td class="amount"><strong>£${total.toFixed(2)}</strong></td>
                </tr>
            </tfoot>
        </table>

        <div class="payment-info">
            <h3>Payment Information</h3>
            <p><strong>Payment Plan:</strong> ${paymentPlan === 'full' ? 'Full Payment' : '50% Deposit'}</p>
            <p><strong>Payment Method:</strong> ${order.payment_method || 'N/A'}</p>
            <p><strong>Payment Status:</strong> 
                <span class="payment-status status-${order.payment_status === 'completed' ? 'paid' : order.payment_status === 'partially_paid' ? 'partial' : 'pending'}">
                    ${order.payment_status?.toUpperCase() || 'PENDING'}
                </span>
            </p>
            
            ${paymentPlan === 'half' ? `
                <p><strong>Amount Paid:</strong> £${amountPaid.toFixed(2)}</p>
                <p><strong>Remaining Amount:</strong> £${remainingAmount.toFixed(2)}</p>
                ${remainingAmount > 0 ? `<p><strong>Due Date:</strong> ${new Date(new Date(order.created_at).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>` : ''}
            ` : ''}
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

function generateCustomerInvoiceHTML(orderData: any, subtotal: number, tax: number, total: number, paymentPlan: string, amountPaid: number, remainingAmount: number) {
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

  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Invoice #${orderData.id}</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 20px;
                color: #333;
                line-height: 1.6;
            }
            .invoice-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 40px;
                padding-bottom: 20px;
                border-bottom: 2px solid #e5e5e5;
            }
            .company-info h1 {
                color: #dc2626;
                margin: 0;
                font-size: 28px;
            }
            .company-info p {
                margin: 5px 0;
                color: #666;
            }
            .invoice-info {
                text-align: right;
            }
            .invoice-info h2 {
                color: #333;
                margin: 0;
                font-size: 24px;
            }
            .invoice-details {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 40px;
                margin-bottom: 40px;
            }
            .billing-info h3 {
                color: #dc2626;
                margin-bottom: 10px;
                font-size: 16px;
                text-transform: uppercase;
            }
            .items-table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 30px;
            }
            .items-table th,
            .items-table td {
                padding: 12px;
                text-align: left;
                border-bottom: 1px solid #e5e5e5;
            }
            .items-table th {
                background-color: #f8f9fa;
                font-weight: 600;
                color: #333;
            }
            .items-table td:last-child,
            .items-table th:last-child {
                text-align: right;
            }
            .totals {
                margin-left: auto;
                width: 300px;
            }
            .totals-row {
                display: flex;
                justify-content: space-between;
                padding: 8px 0;
                border-bottom: 1px solid #e5e5e5;
            }
            .totals-row.total {
                font-weight: 600;
                font-size: 18px;
                border-bottom: 2px solid #333;
                margin-top: 10px;
            }
            .footer {
                margin-top: 50px;
                padding-top: 20px;
                border-top: 1px solid #e5e5e5;
                text-align: center;
                color: #666;
                font-size: 14px;
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
                body { margin: 0; }
                .no-print { display: none; }
                .print-button { display: none; }
            }
        </style>
    </head>
    <body>
        <button class="print-button no-print" onclick="window.print()">Print Invoice</button>
        
        <div class="invoice-header">
            <div class="company-info">
                <h1>RPM Genuine Auto Parts</h1>
                <p>123 Auto Parts Lane</p>
                <p>Manchester, M1 1AA</p>
                <p>United Kingdom</p>
                <p>Phone: +44 161 123 4567</p>
                <p>Email: support@rpmgenuineautoparts.info</p>
            </div>
            <div class="invoice-info">
                <h2>INVOICE</h2>
                <p><strong>Invoice #:</strong> ${orderData.id}</p>
                <p><strong>Date:</strong> ${formatDate(orderData.created_at)}</p>
                <p><strong>Status:</strong> ${orderData.payment_status.toUpperCase()}</p>
            </div>
        </div>

        <div class="invoice-details">
            <div class="billing-info">
                <h3>Bill To:</h3>
                ${orderData.user_profiles ? `
                    <p><strong>${orderData.user_profiles.first_name || ''} ${orderData.user_profiles.last_name || ''}</strong></p>
                    <p>${orderData.user_profiles.email}</p>
                ` : '<p>Customer Details Not Available</p>'}
                
                ${orderData.billing_address ? `
                    <div style="margin-top: 15px;">
                        <p>${orderData.billing_address.address_line1}</p>
                        ${orderData.billing_address.address_line2 ? `<p>${orderData.billing_address.address_line2}</p>` : ''}
                        <p>${orderData.billing_address.city}, ${orderData.billing_address.postcode}</p>
                        <p>${orderData.billing_address.country}</p>
                    </div>
                ` : ''}
            </div>
            
            <div class="billing-info">
                <h3>Ship To:</h3>
                ${orderData.shipping_address ? `
                    <p>${orderData.shipping_address.address_line1}</p>
                    ${orderData.shipping_address.address_line2 ? `<p>${orderData.shipping_address.address_line2}</p>` : ''}
                    <p>${orderData.shipping_address.city}, ${orderData.shipping_address.postcode}</p>
                    <p>${orderData.shipping_address.country}</p>
                ` : '<p>Same as billing address</p>'}
                
                ${orderData.tracking_number ? `
                    <div style="margin-top: 15px;">
                        <p><strong>Tracking Number:</strong> ${orderData.tracking_number}</p>
                    </div>
                ` : ''}
            </div>
        </div>

        <table class="items-table">
            <thead>
                <tr>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Qty</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                ${orderData.order_items.map((item: any) => `
                    <tr>
                        <td>
                            <strong>${item.parts.name}</strong>
                            ${item.parts.description ? `<br><small style="color: #666;">${item.parts.description}</small>` : ''}
                        </td>
                        <td>${item.parts.category}</td>
                        <td>${item.quantity}</td>
                        <td>${formatCurrency(item.price)}</td>
                        <td>${formatCurrency(item.quantity * item.price)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>

        <div class="totals">
            <div class="totals-row">
                <span>Subtotal:</span>
                <span>${formatCurrency(subtotal)}</span>
            </div>
            <div class="totals-row">
                <span>VAT (20%):</span>
                <span>${formatCurrency(tax)}</span>
            </div>
            <div class="totals-row total">
                <span>Total:</span>
                <span>${formatCurrency(total)}</span>
            </div>
            ${paymentPlan === 'half' ? `
                <div class="totals-row" style="background-color: #f0f9ff; margin-top: 10px; padding: 8px;">
                    <span><strong>Payment Plan: 50% Deposit</strong></span>
                    <span></span>
                </div>
                <div class="totals-row">
                    <span>Amount Paid:</span>
                    <span>${formatCurrency(amountPaid)}</span>
                </div>
                ${remainingAmount > 0 ? `
                    <div class="totals-row">
                        <span>Remaining Balance:</span>
                        <span style="color: #dc2626; font-weight: 600;">${formatCurrency(remainingAmount)}</span>
                    </div>
                ` : ''}
            ` : `
                <div class="totals-row">
                    <span>Amount Paid:</span>
                    <span>${formatCurrency(amountPaid)}</span>
                </div>
            `}
        </div>

        <div class="footer">
            <p>Thank you for your business!</p>
            <p>This invoice was generated on ${formatDate(new Date().toISOString())}</p>
            <p>For support, contact us at support@rpmgenuineautoparts.info</p>
        </div>
    </body>
    </html>
  `;
}