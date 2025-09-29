"use client";
import { useCartStore } from '../../store/cart';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase/client';
import { getUser } from '../../lib/supabase/auth';
import { formatCurrency } from '../../lib/currency';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, CreditCard, Truck, Lock, Building, DollarSign, Percent, Info, Copy, Check, AlertCircle } from 'lucide-react';

interface PaymentSettings {
  paypal_email: string;
  bank_name: string;
  account_holder_name: string;
  account_number: string;
  sort_code: string;
  swift_code: string;
  bank_address: string;
  payment_instructions: string;
}

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const [user, setUser] = useState<any>(null);
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings | null>(null);
  const [billingAddress, setBillingAddress] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentPlan, setPaymentPlan] = useState('full');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [copiedField, setCopiedField] = useState('');
  const router = useRouter();

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping_cost = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.20; // 20% VAT
  const total = subtotal + shipping_cost + tax;
  const halfPaymentAmount = (total / 2);
  const paymentAmount = paymentPlan === 'half' ? halfPaymentAmount : total;

  useEffect(() => {
    async function initialize() {
      // Check user authentication
      const result = await getUser();
      if (result.error || !result.user) {
        router.push('/login');
        return;
      }
      setUser(result.user);

      // Load payment settings
      try {
        const response = await fetch('/api/payment-settings');
        if (response.ok) {
          const data = await response.json();
          setPaymentSettings(data.settings);
        }
      } catch (error) {
        console.error('Error loading payment settings:', error);
      }
    }
    
    initialize();
  }, [router]);

  useEffect(() => {
    if (items.length === 0 && !success) {
      router.push('/cart');
    }
  }, [items.length, success, router]);

  useEffect(() => {
    if (sameAsShipping) {
      setBillingAddress(shippingAddress);
    }
  }, [shippingAddress, sameAsShipping]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Parse addresses
      const shippingObj = parseAddress(shippingAddress);
      const billingObj = sameAsShipping ? shippingObj : parseAddress(billingAddress);

      // Calculate payment due date (7 days for half payment)
      const paymentDueDate = paymentPlan === 'half' 
        ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        : null;

      // Create the order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: total,
          status: 'pending',
          payment_status: 'pending',
          payment_method: paymentMethod,
          payment_plan: paymentPlan,
          amount_paid: 0,
          remaining_amount: paymentAmount,
          payment_due_date: paymentDueDate,
          shipping_address: shippingObj,
          billing_address: billingObj,
          notes: `Payment plan: ${paymentPlan}. Payment method: ${paymentMethod}.`
        })
        .select()
        .single();

      if (orderError) {
        console.error('Order creation error:', orderError);
        throw new Error(`Failed to create order: ${orderError.message}`);
      }

      // Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        part_id: parseInt(item.id),
        quantity: item.quantity,
        price: item.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('Order items creation error:', itemsError);
        throw new Error(`Failed to create order items: ${itemsError.message}`);
      }

      // Create initial payment transaction
      const { error: transactionError } = await supabase
        .from('payment_transactions')
        .insert({
          order_id: order.id,
          transaction_type: 'payment',
          payment_method: paymentMethod,
          amount: paymentAmount,
          status: 'pending',
          notes: `Initial ${paymentPlan} payment. ${paymentMethod === 'bank_transfer' ? 'Awaiting bank transfer.' : 'PayPal payment pending.'}`
        });

      if (transactionError) {
        console.error('Transaction creation error:', transactionError);
      }

      setSuccess(`Order #${order.id} placed successfully!`);
      clearCart();
      
      // Redirect to order confirmation with payment details
      setTimeout(() => router.push(`/order-confirmation/${order.id}`), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function parseAddress(address: string) {
    const lines = address.split('\n').filter(line => line.trim());
    return {
      address_line1: lines[0] || '',
      address_line2: lines[1] || '',
      city: lines[lines.length - 2] || '',
      postcode: lines[lines.length - 1] || '',
      country: 'United Kingdom'
    };
  }

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(''), 2000);
  };

  if (!user) return null;

  if (success) {
    return (
      <main className="container mx-auto p-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-green-600" />
              <h1 className="text-2xl font-bold text-green-600 mb-2">Order Placed Successfully!</h1>
              <p className="text-gray-600 mb-4">{success}</p>
              {paymentMethod === 'bank_transfer' && (
                <div className="bg-blue-50 p-4 rounded-lg mb-4 text-left">
                  <h3 className="font-medium text-blue-900 mb-2">Next Steps for Bank Transfer:</h3>
                  <p className="text-sm text-blue-800">
                    Please complete your payment using the bank details provided. 
                    Your order will be processed once payment is confirmed.
                  </p>
                </div>
              )}
              <p className="text-sm text-gray-500">You will be redirected to the order confirmation page shortly.</p>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Secure Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit}>
              {/* Shipping Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="w-5 h-5" />
                    Shipping Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full border rounded-md p-3 bg-gray-50 text-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Shipping Address *</label>
                    <textarea
                      className="w-full border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Street Address&#10;City&#10;Postal Code"
                      value={shippingAddress}
                      onChange={e => setShippingAddress(e.target.value)}
                      required
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Billing Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Billing Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="same-as-shipping"
                      checked={sameAsShipping}
                      onChange={e => setSameAsShipping(e.target.checked)}
                      className="rounded"
                    />
                    <label htmlFor="same-as-shipping" className="text-sm">
                      Same as shipping address
                    </label>
                  </div>
                  
                  {!sameAsShipping && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Billing Address *</label>
                      <textarea
                        className="w-full border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Street Address&#10;City&#10;Postal Code"
                        value={billingAddress}
                        onChange={e => setBillingAddress(e.target.value)}
                        required
                        rows={4}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Payment Plan Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Percent className="w-5 h-5" />
                    Payment Plan
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      paymentPlan === 'full' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        name="paymentPlan"
                        value="full"
                        checked={paymentPlan === 'full'}
                        onChange={e => setPaymentPlan(e.target.value)}
                        className="sr-only"
                      />
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Full Payment</span>
                        <DollarSign className="w-5 h-5 text-green-600" />
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Pay the full amount now</p>
                      <p className="text-xl font-bold text-green-600">{formatCurrency(total)}</p>
                    </label>

                    <label className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      paymentPlan === 'half' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        name="paymentPlan"
                        value="half"
                        checked={paymentPlan === 'half'}
                        onChange={e => setPaymentPlan(e.target.value)}
                        className="sr-only"
                      />
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">50% Deposit</span>
                        <Percent className="w-5 h-5 text-blue-600" />
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Pay half now, remainder in 7 days</p>
                      <p className="text-xl font-bold text-blue-600">{formatCurrency(halfPaymentAmount)}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Remaining: {formatCurrency(total - halfPaymentAmount)}
                      </p>
                    </label>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      paymentMethod === 'paypal' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="paypal"
                        checked={paymentMethod === 'paypal'}
                        onChange={e => setPaymentMethod(e.target.value)}
                        className="sr-only"
                      />
                      <div className="flex items-center gap-3 mb-2">
                        <CreditCard className="w-6 h-6 text-blue-600" />
                        <span className="font-medium">PayPal</span>
                      </div>
                      <p className="text-sm text-gray-600">Quick and secure payment</p>
                    </label>

                    <label className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      paymentMethod === 'bank_transfer' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="bank_transfer"
                        checked={paymentMethod === 'bank_transfer'}
                        onChange={e => setPaymentMethod(e.target.value)}
                        className="sr-only"
                      />
                      <div className="flex items-center gap-3 mb-2">
                        <Building className="w-6 h-6 text-green-600" />
                        <span className="font-medium">Bank Transfer</span>
                      </div>
                      <p className="text-sm text-gray-600">Direct bank payment</p>
                    </label>
                  </div>

                  {/* Payment Details */}
                  {paymentMethod === 'paypal' && paymentSettings && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-2">PayPal Payment Details</h4>
                      <div className="flex items-center justify-between bg-white rounded p-2">
                        <span className="text-sm">Send payment to: <strong>{paymentSettings.paypal_email}</strong></span>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(paymentSettings.paypal_email, 'paypal')}
                        >
                          {copiedField === 'paypal' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                      <p className="text-xs text-blue-700 mt-2">
                        Include your order number in the payment reference
                      </p>
                    </div>
                  )}

                  {paymentMethod === 'bank_transfer' && paymentSettings && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-medium text-green-900 mb-3">Bank Transfer Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div className="flex justify-between items-center bg-white rounded p-2">
                          <span><strong>Bank:</strong> {paymentSettings.bank_name}</span>
                        </div>
                        <div className="flex justify-between items-center bg-white rounded p-2">
                          <span><strong>Account Name:</strong> {paymentSettings.account_holder_name}</span>
                        </div>
                        <div className="flex justify-between items-center bg-white rounded p-2">
                          <span><strong>Account Number:</strong> {paymentSettings.account_number}</span>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(paymentSettings.account_number, 'account')}
                          >
                            {copiedField === 'account' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </Button>
                        </div>
                        <div className="flex justify-between items-center bg-white rounded p-2">
                          <span><strong>Sort Code:</strong> {paymentSettings.sort_code}</span>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(paymentSettings.sort_code, 'sort')}
                          >
                            {copiedField === 'sort' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </Button>
                        </div>
                        {paymentSettings.swift_code && (
                          <div className="flex justify-between items-center bg-white rounded p-2 md:col-span-2">
                            <span><strong>SWIFT Code:</strong> {paymentSettings.swift_code}</span>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => copyToClipboard(paymentSettings.swift_code, 'swift')}
                            >
                              {copiedField === 'swift' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </Button>
                          </div>
                        )}
                      </div>
                      {paymentSettings.payment_instructions && (
                        <div className="mt-3 p-2 bg-green-100 rounded text-xs text-green-800">
                          <Info className="w-4 h-4 inline mr-1" />
                          {paymentSettings.payment_instructions}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {error && (
                <Card>
                  <CardContent className="p-4">
                    <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      {error}
                    </div>
                  </CardContent>
                </Card>
              )}
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    {items.map(item => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="flex-1">{item.name} × {item.quantity}</span>
                        <span className="ml-2">{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t pt-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span className={shipping_cost === 0 ? 'text-green-600' : ''}>
                        {shipping_cost === 0 ? 'Free' : formatCurrency(shipping_cost)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>VAT (20%)</span>
                      <span>{formatCurrency(tax)}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                    
                    {paymentPlan === 'half' && (
                      <div className="bg-blue-50 p-3 rounded-lg text-sm">
                        <div className="flex justify-between font-medium text-blue-900">
                          <span>Pay Today</span>
                          <span>{formatCurrency(paymentAmount)}</span>
                        </div>
                        <div className="flex justify-between text-blue-700 mt-1">
                          <span>Remaining (due in 7 days)</span>
                          <span>{formatCurrency(total - paymentAmount)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <Button
                    onClick={handleSubmit}
                    disabled={loading || !shippingAddress || !paymentMethod}
                    className="w-full"
                    size="lg"
                  >
                    {loading ? 'Processing...' : `Place Order - ${formatCurrency(paymentAmount)}`}
                  </Button>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded">
                    <Lock className="w-4 h-4" />
                    <span>Secure checkout with 256-bit SSL encryption</span>
                  </div>
                  
                  {subtotal < 50 && (
                    <p className="text-sm text-gray-600 text-center">
                      Add {formatCurrency(50 - subtotal)} more for free shipping!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
