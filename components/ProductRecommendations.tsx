"use client";
import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { Heart, ShoppingCart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  image_url: string;
  stock_quantity: number;
}

interface ProductRecommendationsProps {
  currentProduct?: Product;
  recentlyViewed?: Product[];
  userPurchases?: Product[];
}

export function ProductRecommendations({ 
  currentProduct, 
  recentlyViewed = [], 
  userPurchases = [] 
}: ProductRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecommendations();
  }, [currentProduct]);

  async function loadRecommendations() {
    setLoading(true);
    try {
      // Simulate fetching recommendations
      const response = await fetch('/api/products?limit=8');
      const data = await response.json();
      
      let recs = data.products || [];
      
      // Filter out current product if viewing product details
      if (currentProduct) {
        recs = recs.filter((p: Product) => p.id !== currentProduct.id);
        
        // Prioritize products from same category
        recs = recs.sort((a: Product, b: Product) => {
          if (a.category === currentProduct.category && b.category !== currentProduct.category) return -1;
          if (b.category === currentProduct.category && a.category !== currentProduct.category) return 1;
          return 0;
        });
      }
      
      setRecommendations(recs.slice(0, 4));
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recommended for You</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-300 h-40 rounded-lg mb-2"></div>
                <div className="bg-gray-300 h-4 rounded mb-1"></div>
                <div className="bg-gray-300 h-4 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (recommendations.length === 0) return null;

  return (
    <div className="space-y-6">
      {/* Main Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            {currentProduct ? 'Related Products' : 'Recommended for You'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recommendations.map((product) => (
              <ProductCard key={product.id} {...product} id={product.id.toString()} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recently Viewed */}
      {recentlyViewed.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Recently Viewed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {recentlyViewed.slice(0, 4).map((product) => (
                <ProductCard key={product.id} {...product} id={product.id.toString()} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Frequently Bought Together */}
      {currentProduct && (
        <Card>
          <CardHeader>
            <CardTitle>Frequently Bought Together</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-sm font-medium mt-2 text-center">This item</p>
                <p className="text-sm text-gray-600 text-center">£{currentProduct.price.toFixed(2)}</p>
              </div>
              <div className="text-2xl text-gray-400">+</div>
              {recommendations.slice(0, 2).map((product, index) => (
                <div key={product.id} className="flex-shrink-0">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-sm font-medium mt-2 text-center truncate">{product.name}</p>
                  <p className="text-sm text-gray-600 text-center">£{product.price.toFixed(2)}</p>
                  {index < 1 && <div className="text-2xl text-gray-400 text-center mt-2">+</div>}
                </div>
              ))}
              <div className="ml-4">
                <Button size="sm" className="whitespace-nowrap">
                  Add All to Cart
                </Button>
                <p className="text-sm text-gray-600 mt-1">
                  Total: £{(currentProduct.price + recommendations.slice(0, 2).reduce((sum, p) => sum + p.price, 0)).toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}