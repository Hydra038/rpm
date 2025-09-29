"use client";
import { useState, useEffect } from 'react';
import { Heart, X, ShoppingCart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from '../lib/currency';
import { useCartStore } from '../store/cart';
import { supabase } from '../lib/supabase/client';
import { getUser } from '../lib/supabase/auth';

interface Product {
  id: number;
  name: string;
  price: number;
  image_url: string;
  category: string;
  description: string;
}

interface WishlistItem {
  id: string;
  product_id: number;
  product: Product;
  created_at: string;
}

export function WishlistDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { addToCart } = useCartStore();

  useEffect(() => {
    async function loadUser() {
      const result = await getUser();
      if (result.user) {
        setUser(result.user);
        loadWishlist(result.user.id);
      }
    }
    if (isOpen) {
      loadUser();
    }
  }, [isOpen]);

  async function loadWishlist(userId: string) {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('wishlist')
        .select(`
          *,
          product:parts(*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWishlistItems(data || []);
    } catch (error) {
      console.error('Error loading wishlist:', error);
    } finally {
      setLoading(false);
    }
  }

  async function removeFromWishlist(itemId: string) {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('id', itemId)
        .eq('user_id', user.id);

      if (error) throw error;

      setWishlistItems(prev => prev.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  }

  function handleAddToCart(product: Product) {
    addToCart({
      id: String(product.id),
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      quantity: 1
    });
  }

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 w-96 h-full bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            <h3 className="text-lg font-semibold">
              Wishlist ({wishlistItems.length})
            </h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-1"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {!user ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <Heart className="w-16 h-16 text-gray-300 mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">Sign in to save favorites</h4>
              <p className="text-gray-600 mb-6">Create an account to save your favorite items</p>
              <Button onClick={() => { onClose(); window.location.href = '/login'; }}>
                Sign In
              </Button>
            </div>
          ) : loading ? (
            <div className="p-4 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex gap-3">
                    <div className="w-16 h-16 bg-gray-300 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-300 rounded mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : wishlistItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <Heart className="w-16 h-16 text-gray-300 mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h4>
              <p className="text-gray-600 mb-6">Save items you love to buy them later</p>
              <Button onClick={() => { onClose(); window.location.href = '/products'; }}>
                Browse Products
              </Button>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {wishlistItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      {/* Product Image Placeholder */}
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                        <ShoppingCart className="w-6 h-6 text-gray-400" />
                      </div>
                      
                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">
                          {item.product.name}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {item.product.category}
                        </p>
                        <p className="font-semibold text-lg text-gray-900">
                          {formatCurrency(item.product.price)}
                        </p>
                        
                        {/* Action Buttons */}
                        <div className="flex gap-2 mt-2">
                          <Button
                            size="sm"
                            onClick={() => handleAddToCart(item.product)}
                            className="flex-1"
                          >
                            <ShoppingCart className="w-4 h-4 mr-1" />
                            Add to Cart
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeFromWishlist(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {user && wishlistItems.length > 0 && (
          <div className="border-t p-4 bg-gray-50">
            <Button
              onClick={() => {
                wishlistItems.forEach(item => handleAddToCart(item.product));
                onClose();
              }}
              className="w-full"
              size="lg"
            >
              Add All to Cart ({wishlistItems.length} items)
            </Button>
          </div>
        )}
      </div>
    </>
  );
}