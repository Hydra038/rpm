"use client";
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { fetchProducts, fetchCategories } from '../../lib/supabase/products';
import { ProductCard } from '../../components/ProductCard';
import { SearchBar } from '../../components/SearchBar';
import { ProductRecommendations } from '../../components/ProductRecommendations';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Car } from 'lucide-react';

function ProductsContent() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState({ 
    category: searchParams.get('category') || '' 
  });
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);

  useEffect(() => {
    // Load categories on component mount
    fetchCategories().then(setCategories);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchProducts({
      category: filters.category,
      search: searchQuery,
      limit: 1000, // Fetch up to 1000 products
    })
      .then((data) => {
        setProducts(data);
        setTotalCount(data.length);
      })
      .finally(() => setLoading(false));
  }, [filters, searchQuery]);

  // Load recently viewed products from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('rpm-recently-viewed');
    if (saved) {
      setRecentlyViewed(JSON.parse(saved));
    }
  }, []);

  const seedProducts = async () => {
    setSeeding(true);
    try {
      const response = await fetch('/api/seed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Seed API response status:', response.status);
      
      if (response.ok) {
        try {
          const result = await response.json();
          console.log('Seed API result:', result);
          
          // Refresh products after seeding
          const newProducts = await fetchProducts({
            category: filters.category,
            search: searchQuery,
            limit: 1000,
          });
          setProducts(newProducts);
          setTotalCount(newProducts.length);
          // Refresh categories too in case new ones were added
          fetchCategories().then(setCategories);
        } catch (jsonError) {
          console.error('Failed to parse JSON response from seed API:', jsonError);
          const text = await response.text();
          console.log('Response text:', text);
        }
      } else {
        console.error('Seed API failed with status:', response.status);
        const text = await response.text();
        console.log('Error response:', text);
      }
    } catch (error) {
      console.error('Error seeding products:', error);
    } finally {
      setSeeding(false);
    }
  };

  const clearFilters = () => {
    setFilters({ category: '' });
    setSearchQuery('');
  };

  const hasActiveFilters = filters.category || searchQuery;

  return (
    <main className="container mx-auto px-2 sm:px-4 py-4 space-y-4 sm:space-y-6">
      <div className="mb-6 sm:mb-8 text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Auto Parts & Accessories</h1>
        <p className="text-gray-600 text-sm sm:text-base">Find the perfect parts for your vehicle</p>
      </div>

      {/* Search */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Car className="w-4 h-4 sm:w-5 sm:h-5" />
            Find Your Parts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6 p-3 sm:p-6">
          <SearchBar onSearch={setSearchQuery} products={products} />
        </CardContent>
      </Card>

      {/* Category Grid */}
      <Card>
        <CardContent className="p-3 sm:p-4">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Browse by Category</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
            {categories.map((category) => (
              <Button
                key={category}
                variant={filters.category === category ? "default" : "outline"}
                className="h-10 sm:h-12 text-xs sm:text-sm px-2 sm:px-4 rounded-lg"
                onClick={() => setFilters(f => ({ 
                  ...f, 
                  category: f.category === category ? '' : category 
                }))}
              >
                <span className="truncate">{category}</span>
              </Button>
            ))}
          </div>
          {categories.length === 0 && (
            <p className="text-gray-500 text-center text-sm">Loading categories...</p>
          )}
        </CardContent>
      </Card>



      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Card key={i}>
              <CardContent className="p-3 sm:p-4">
                <Skeleton className="h-40 sm:h-48 w-full mb-3 sm:mb-4 rounded-lg" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-8 w-full rounded-lg" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : products.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-gray-500 mb-2">No products found</div>
            {hasActiveFilters ? (
              <div>
                <p className="text-sm text-gray-400 mb-4">Try adjusting your filters or search terms</p>
                <Button variant="outline" onClick={clearFilters}>
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-400 mb-4">Check back later for new products</p>
                <Button 
                  onClick={seedProducts} 
                  disabled={seeding}
                  className="mt-2"
                >
                  {seeding ? 'Loading Sample Products...' : 'Load Sample Products'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {products?.map((product: any) => (
              <ProductCard
                key={product.id}
                id={String(product.id)}
                name={product.name}
                price={product.price}
                image_url={product.image_url}
              />
            ))}
          </div>
          
          {/* Recommendations Section */}
          <ProductRecommendations recentlyViewed={recentlyViewed} />
        </div>
      )}
    </main>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
