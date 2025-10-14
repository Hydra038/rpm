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
    const tax = 0; // No VAT
    const total = subtotal; // No VAT
    
    // Payment plan information
    const paymentPlan = orderData.payment_plan || 'full';
    const amountPaid = total; // Show full amount as paid
    const remainingAmount = 0; // No remaining amount

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
                <p>Norwich, UK</p>
                <p>WhatsApp: +44 7723832186</p>
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
                        <p style="white-space: pre-line;">${orderData.billing_address}</p>
                    </div>
                ` : ''}
            </div>
            
            <div class="billing-info">
                <h3>Ship To:</h3>
                ${orderData.delivery_address ? `
                    <p style="white-space: pre-line;">${orderData.delivery_address}</p>
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
                            <strong>${item.product_name}</strong>
                            ${item.description ? `<br><small style="color: #666;">${item.description}</small>` : ''}
                        </td>
                        <td>${item.category}</td>
                        <td>${item.quantity}</td>
                        <td>${formatCurrency(item.price)}</td>
                        <td>${formatCurrency(item.quantity * item.price)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>

        <div class="totals">
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
            <p>Contact us: WhatsApp: +44 7723832186 | Email: support@rpmgenuineautoparts.info | Facebook: <a href="https://web.facebook.com/profile.php?id=61563129454615" target="_blank">RPM Genuine Auto Parts</a></p>
            <p>This invoice was generated on ${formatDate(new Date().toISOString())}</p>
        </div>
    </body>
    </html>
  `;
}