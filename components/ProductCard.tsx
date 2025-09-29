import { useCartStore } from '../store/cart';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart, Star, Eye, Badge } from 'lucide-react';
import { formatCurrency } from '../lib/currency';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase/client';
import { getUser } from '../lib/supabase/auth';

type ProductCardProps = {
  id: string;
  name: string;
  price: number;
  image_url?: string;
  category?: string;
  stock_quantity?: number;
  rating?: number;
  isOnSale?: boolean;
  originalPrice?: number;
};

export function ProductCard({ 
  id, 
  name, 
  price, 
  image_url, 
  category, 
  stock_quantity, 
  rating, 
  isOnSale, 
  originalPrice 
}: ProductCardProps) {
  const addToCart = useCartStore((state) => state.addToCart);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [addingToWishlist, setAddingToWishlist] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    async function checkUser() {
      const result = await getUser();
      if (result.user) {
        setUser(result.user);
        checkWishlistStatus(result.user.id);
      }
    }
    checkUser();
  }, []);

  async function checkWishlistStatus(userId: string) {
    try {
      const { data } = await supabase
        .from('wishlist')
        .select('id')
        .eq('user_id', userId)
        .eq('product_id', parseInt(id))
        .single();
      
      setIsInWishlist(!!data);
    } catch (error) {
      // Item not in wishlist
      setIsInWishlist(false);
    }
  }

  async function toggleWishlist() {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    setAddingToWishlist(true);
    try {
      if (isInWishlist) {
        // Remove from wishlist
        const { error } = await supabase
          .from('wishlist')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', parseInt(id));
        
        if (!error) {
          setIsInWishlist(false);
        }
      } else {
        // Add to wishlist
        const { error } = await supabase
          .from('wishlist')
          .insert({
            user_id: user.id,
            product_id: parseInt(id)
          });
        
        if (!error) {
          setIsInWishlist(true);
        }
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    } finally {
      setAddingToWishlist(false);
    }
  }

  function handleAddToCart() {
    setAddingToCart(true);
    addToCart({ id, name, price, image_url: image_url || '', quantity: 1 });
    
    // Save to recently viewed
    const recentlyViewed = JSON.parse(localStorage.getItem('rpm-recently-viewed') || '[]');
    const productData = { id: parseInt(id), name, price, image_url, category };
    const filtered = recentlyViewed.filter((p: any) => p.id !== parseInt(id));
    const updated = [productData, ...filtered].slice(0, 10);
    localStorage.setItem('rpm-recently-viewed', JSON.stringify(updated));
    
    setTimeout(() => setAddingToCart(false), 1000);
  }
  
  return (
    <Card className="group hover:shadow-lg transition-all duration-200 overflow-hidden relative">
      <CardContent className="p-0">
        <div className="aspect-square bg-gray-50 relative overflow-hidden">
          {/* Badges */}
          <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
            {isOnSale && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                Sale
              </span>
            )}
            {stock_quantity !== undefined && stock_quantity < 5 && stock_quantity > 0 && (
              <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                Low Stock
              </span>
            )}
            {stock_quantity === 0 && (
              <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                Out of Stock
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <div className="absolute top-2 right-2 z-10">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleWishlist}
              disabled={addingToWishlist}
              className="w-8 h-8 p-0 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full"
            >
              <Heart 
                className={`w-4 h-4 ${
                  isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'
                }`} 
              />
            </Button>
          </div>

          {/* Quick View Button (appears on hover) */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <Button
              variant="secondary"
              size="sm"
              className="opacity-90"
            >
              <Eye className="w-4 h-4 mr-2" />
              Quick View
            </Button>
          </div>

          {image_url ? (
            <img 
              src={image_url} 
              alt={name} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <div className="text-gray-400 text-sm">No Image</div>
            </div>
          )}
        </div>
        
        <div className="p-4">
          {/* Category */}
          {category && (
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{category}</p>
          )}
          
          {/* Product Name */}
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 min-h-[2.5rem] group-hover:text-blue-600 transition-colors">
            {name}
          </h3>
          
          {/* Rating */}
          {rating && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3 h-3 ${
                      star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">({rating.toFixed(1)})</span>
            </div>
          )}
          
          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl font-bold text-blue-600">
              {formatCurrency(price)}
            </span>
            {isOnSale && originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                {formatCurrency(originalPrice)}
              </span>
            )}
          </div>
          
          {/* Stock Status */}
          {stock_quantity !== undefined && (
            <div className="text-xs text-gray-600 mb-3">
              {stock_quantity > 0 ? (
                <>
                  {stock_quantity < 5 ? (
                    <span className="text-orange-600">Only {stock_quantity} left in stock</span>
                  ) : (
                    <span className="text-green-600">In Stock ({stock_quantity} available)</span>
                  )}
                </>
              ) : (
                <span className="text-red-600">Out of Stock</span>
              )}
            </div>
          )}
          
          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            disabled={stock_quantity === 0 || addingToCart}
            className="w-full gap-2"
            size="sm"
          >
            <ShoppingCart className="w-4 h-4" />
            {addingToCart ? 'Adding...' : stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
