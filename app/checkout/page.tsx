"use client";
import { useCartStore } from '../../store/cart';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createOrder } from '../../lib/supabase/orders';
import { getUser } from '../../lib/supabase/auth';
import { formatCurrency } from '../../lib/currency';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, CreditCard, Truck, Lock } from 'lucide-react';

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const [user, setUser] = useState<any>(null);
  const [shipping, setShipping] = useState('');
  const [payment, setPayment] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping_cost = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping_cost + tax;

  useEffect(() => {
    async function checkUser() {
      const result = await getUser();
      if (result.error || !result.user) {
        router.push('/login');
      } else {
        setUser(result.user);
      }
    }
    checkUser();
  }, [router]);

  useEffect(() => {
    if (items.length === 0 && !success) {
      router.push('/cart');
    }
  }, [items.length, success, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const orderItems = items.map(item => ({ 
        part_id: item.id, 
        quantity: item.quantity, 
        price: item.price 
      }));
      
      await createOrder(user.id, orderItems, total);
      setSuccess('Order placed successfully!');
      clearCart();
      setTimeout(() => router.push('/account'), 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (!user) return null;

  if (success) {
    return (
      <main className="container mx-auto p-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-green-600" />
              <h1 className="text-2xl font-bold text-green-600 mb-2">Order Successful!</h1>
              <p className="text-gray-600 mb-4">{success}</p>
              <p className="text-sm text-gray-500">You will be redirected to your account page shortly.</p>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
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
                      className="w-full border rounded-md p-2 bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Shipping Address</label>
                    <textarea
                      className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your complete shipping address..."
                      value={shipping}
                      onChange={e => setShipping(e.target.value)}
                      required
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Payment Method</label>
                    <select
                      className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={payment}
                      onChange={e => setPayment(e.target.value)}
                      required
                    >
                      <option value="">Select payment method</option>
                      <option value="credit-card">Credit Card</option>
                      <option value="debit-card">Debit Card</option>
                      <option value="paypal">PayPal</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 p-3 rounded">
                    <Lock className="w-4 h-4" />
                    Your payment information is secure and encrypted
                  </div>
                </CardContent>
              </Card>

              {error && (
                <Card>
                  <CardContent className="p-4">
                    <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded">
                      {error}
                    </div>
                  </CardContent>
                </Card>
              )}
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    {items.map(item => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>{item.name} × {item.quantity}</span>
                        <span>{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t pt-2 space-y-1">
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
                      <span>Tax</span>
                      <span>{formatCurrency(tax)}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                  </div>
                  
                  <Button
                    onClick={handleSubmit}
                    disabled={loading || !shipping || !payment}
                    className="w-full"
                    size="lg"
                  >
                    {loading ? 'Processing...' : `Place Order - ${formatCurrency(total)}`}
                  </Button>
                  
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
