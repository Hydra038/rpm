"use client";
import { useCartStore } from '../../store/cart';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingCart, Heart, Truck, Shield, CreditCard, ArrowLeft } from 'lucide-react';
import { formatCurrency } from '../../lib/currency';
import { ProductRecommendations } from '../../components/ProductRecommendations';
import Link from 'next/link';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, clearCart } = useCartStore();
  
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.20; // 20% VAT
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <main className="container mx-auto p-4 space-y-8">
        <div className="max-w-2xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span>/</span>
            <span>Shopping Cart</span>
          </div>
          
          <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
          <Card>
            <CardContent className="p-8 text-center">
              <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
              <p className="text-gray-600 mb-6">Discover amazing auto parts and accessories</p>
              <div className="flex gap-3 justify-center">
                <Button asChild>
                  <Link href="/products">Continue Shopping</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/" className="flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Recommendations for empty cart */}
        <ProductRecommendations />
      </main>
    );
  }

  return (
    <main className="container mx-auto p-4 space-y-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <span>Shopping Cart</span>
        </div>
        
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Shopping Cart ({items.length} items)</h1>
          <Button variant="outline" asChild>
            <Link href="/products" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Items in your cart</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {items.map((item, index) => (
                  <div key={item.id} className={`p-6 ${index !== items.length - 1 ? 'border-b' : ''}`}>
                    <div className="flex gap-4">
                      <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                        {item.image_url ? (
                          <img 
                            src={item.image_url} 
                            alt={item.name} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                            No Image
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                        <p className="text-2xl font-bold text-blue-600 mb-1">
                          {formatCurrency(item.price)}
                        </p>
                        <p className="text-sm text-gray-600 mb-3">
                          Subtotal: {formatCurrency(item.price * item.quantity)}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600 mr-2">Qty:</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              className="h-8 w-8 p-0"
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-12 text-center font-semibold bg-gray-50 py-1 rounded">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="h-8 w-8 p-0"
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-500 hover:text-red-500"
                            >
                              <Heart className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button variant="outline" onClick={clearCart} className="flex-1">
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Cart
              </Button>
              <Button variant="outline" asChild className="flex-1">
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </div>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'text-green-600' : ''}>
                      {shipping === 0 ? 'Free' : formatCurrency(shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>VAT (20%)</span>
                    <span>{formatCurrency(tax)}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                  
                  {subtotal < 50 && (
                    <div className="text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
                      Add {formatCurrency(50 - subtotal)} more for free shipping!
                    </div>
                  )}
                </div>
                
                <Button asChild className="w-full mb-4" size="lg">
                  <Link href="/checkout">Proceed to Checkout</Link>
                </Button>
                
                {/* Trust indicators */}
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span>Secure checkout</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-blue-600" />
                    <span>Fast delivery</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-purple-600" />
                    <span>Multiple payment options</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Product Recommendations */}
      <div className="max-w-6xl mx-auto">
        <ProductRecommendations />
      </div>
    </main>
  );
}
