"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '../../../lib/supabase/client';
import { formatCurrency } from '../../../lib/currency';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  Package, 
  CreditCard, 
  Building, 
  Clock, 
  Copy, 
  Check,
  Download,
  ArrowLeft,
  Info,
  Truck,
  ExternalLink
} from 'lucide-react';

interface Order {
  id: string;
  total_amount: number;
  payment_method: string;
  payment_plan: string;
  amount_paid: number;
  remaining_amount: number;
  payment_due_date: string;
  status: string;
  payment_status: string;
  tracking_number: string | null;
  created_at: string;
  billing_address: string;
  delivery_address: string;
  order_items: Array<{
    quantity: number;
    price: number;
    parts: {
      name: string;
      image_url: string;
    };
  }>;
}

interface PaymentSettings {
  paypal_email: string;
  bank_name: string;
  account_holder_name: string;
  account_number: string;
  sort_code: string;
  swift_code: string;
  iban: string;
  payment_instructions: string;
  paypal_enabled: boolean;
  bank_transfer_enabled: boolean;
  iban_enabled: boolean;
}

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedField, setCopiedField] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadOrderDetails() {
      try {
        // Load order details
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select(`
            *,
            order_items (
              quantity,
              price,
              parts (
                name,
                image_url
              )
            )
          `)
          .eq('id', orderId)
          .single();

        if (orderError) {
          throw new Error('Order not found');
        }

        setOrder(orderData);

        // Load payment settings if needed
        if (orderData.payment_method === 'bank_transfer' || orderData.payment_method === 'paypal') {
          const response = await fetch('/api/payment-settings');
          if (response.ok) {
            const data = await response.json();
            setPaymentSettings(data.settings);
          }
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (orderId) {
      loadOrderDetails();
    }
  }, [orderId]);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(''), 2000);
  };

  const handleDownloadInvoice = () => {
    window.open(`/api/orders/${orderId}/invoice`, '_blank');
  };

  if (loading) {
    return (
      <main className="container mx-auto p-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p>Loading order details...</p>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="container mx-auto p-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="w-16 h-16 mx-auto mb-4 text-red-400" />
              <h1 className="text-2xl font-bold text-red-600 mb-2">Order Not Found</h1>
              <p className="text-gray-600 mb-4">{error || 'The requested order could not be found.'}</p>
              <Button asChild>
                <a href="/account">View My Orders</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  const paymentAmount = order.payment_plan === 'half' ? order.total_amount / 2 : order.total_amount;

  return (
    <main className="container mx-auto p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" asChild>
            <a href="/account">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Orders
            </a>
          </Button>
        </div>

        {/* Success Message */}
        <Card>
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-600" />
            <h1 className="text-3xl font-bold text-green-600 mb-2">Order Confirmed!</h1>
            <p className="text-gray-600 mb-4">
              Thank you for your order. We'll send you an email confirmation shortly.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Badge variant="outline" className="text-lg px-4 py-2">
                Order #{order.id}
              </Badge>
              <Badge className={
                order.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                order.payment_status === 'partially_paid' ? 'bg-blue-100 text-blue-800' :
                'bg-orange-100 text-orange-800'
              }>
                {order.payment_status === 'paid' ? 'Paid' :
                 order.payment_status === 'partially_paid' ? 'Partially Paid' :
                 'Payment Pending'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Payment Instructions */}
        {(order.payment_method === 'bank_transfer' || order.payment_method === 'paypal') && 
         order.payment_status !== 'paid' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {order.payment_method === 'paypal' ? (
                  <CreditCard className="w-5 h-5 text-blue-600" />
                ) : (
                  <Building className="w-5 h-5 text-green-600" />
                )}
                Complete Your Payment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`p-4 rounded-lg ${
                order.payment_method === 'paypal' ? 'bg-blue-50 border border-blue-200' : 'bg-green-50 border border-green-200'
              }`}>
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-5 h-5 text-orange-500" />
                  <span className="font-medium">
                    Amount to pay: {formatCurrency(paymentAmount)}
                    {order.payment_plan === 'half' && (
                      <span className="text-sm text-gray-600 ml-2">
                        (50% deposit - remaining {formatCurrency(order.remaining_amount)} due by {new Date(order.payment_due_date).toLocaleDateString()})
                      </span>
                    )}
                  </span>
                </div>

                {order.payment_method === 'paypal' && paymentSettings && (
                  <div>
                    <h4 className="font-medium text-blue-900 mb-2">PayPal Payment</h4>
                    <div className="flex items-center justify-between bg-white rounded p-3">
                      <span>Send to: <strong>{paymentSettings.paypal_email}</strong></span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(paymentSettings.paypal_email, 'paypal')}
                      >
                        {copiedField === 'paypal' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                    <p className="text-sm text-blue-700 mt-2">
                      Reference: Order #{order.id}
                    </p>
                  </div>
                )}

                {order.payment_method === 'bank_transfer' && paymentSettings && (
                  <div>
                    <h4 className="font-medium text-green-900 mb-3">Bank Transfer Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="bg-white rounded p-3">
                        <div className="text-sm text-gray-600">Bank</div>
                        <div className="font-medium">{paymentSettings.bank_name}</div>
                      </div>
                      <div className="bg-white rounded p-3">
                        <div className="text-sm text-gray-600">Account Name</div>
                        <div className="font-medium">{paymentSettings.account_holder_name}</div>
                      </div>
                      <div className="bg-white rounded p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm text-gray-600">Account Number</div>
                            <div className="font-medium">{paymentSettings.account_number}</div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(paymentSettings.account_number, 'account')}
                          >
                            {copiedField === 'account' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>
                      <div className="bg-white rounded p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm text-gray-600">Sort Code</div>
                            <div className="font-medium">{paymentSettings.sort_code}</div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(paymentSettings.sort_code, 'sort')}
                          >
                            {copiedField === 'sort' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 p-3 bg-green-100 rounded text-sm text-green-800">
                      <Info className="w-4 h-4 inline mr-2" />
                      <strong>Important:</strong> Include "Order #{order.id}" as your payment reference
                    </div>
                    {paymentSettings.payment_instructions && (
                      <p className="text-sm text-green-700 mt-2">
                        {paymentSettings.payment_instructions}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Order Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  {order.order_items.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border rounded">
                      {item.parts.image_url && (
                        <img 
                          src={item.parts.image_url} 
                          alt={item.parts.name}
                          className="w-12 h-12 rounded object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{item.parts.name}</p>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity} × {formatCurrency(item.price)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(item.quantity * item.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{formatCurrency(order.total_amount)}</span>
                  </div>
                  
                  {order.payment_plan === 'half' && (
                    <div className="bg-blue-50 p-3 rounded-lg text-sm">
                      <div className="flex justify-between font-medium">
                        <span>Payment Plan: 50% Deposit</span>
                      </div>
                      <div className="flex justify-between text-blue-700 mt-1">
                        <span>Amount Due Today</span>
                        <span>{formatCurrency(paymentAmount)}</span>
                      </div>
                      {order.remaining_amount > 0 && (
                        <div className="flex justify-between text-blue-700">
                          <span>Remaining Balance</span>
                          <span>{formatCurrency(order.remaining_amount)}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping & Billing */}
          <Card>
            <CardHeader>
              <CardTitle>Shipping & Billing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Shipping Address</h4>
                <div className="p-3 bg-gray-50 rounded text-sm">
                  {order.delivery_address ? (
                    <div className="whitespace-pre-line">
                      {order.delivery_address}
                    </div>
                  ) : (
                    <p>Address not available</p>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Billing Address</h4>
                <div className="p-3 bg-gray-50 rounded text-sm">
                  {order.billing_address ? (
                    <div className="whitespace-pre-line">
                      {order.billing_address}
                    </div>
                  ) : (
                    <p>Same as shipping address</p>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Payment Method</h4>
                <div className="flex items-center gap-2">
                  {order.payment_method === 'paypal' ? (
                    <CreditCard className="w-5 h-5 text-blue-600" />
                  ) : (
                    <Building className="w-5 h-5 text-green-600" />
                  )}
                  <span className="capitalize">
                    {order.payment_method.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {order.payment_status === 'paid' && (
                <Button
                  onClick={handleDownloadInvoice}
                  className="w-full flex items-center gap-2"
                  variant="outline"
                >
                  <Download className="w-4 h-4" />
                  Download Invoice
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="outline">
                <a href="/products">Continue Shopping</a>
              </Button>
              <Button asChild>
                <a href="/account">View All Orders</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}