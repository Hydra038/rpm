"use client";
import { useEffect, useState } from 'react';
import { fetchProducts } from '../../lib/supabase/products';
import { ProductCard } from '../../components/ProductCard';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsPage() {
  const [filters, setFilters] = useState({ make: '', model: '', year: '', category: '' });
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchProducts({
      make: filters.make,
      model: filters.model,
      year: filters.year ? Number(filters.year) : undefined,
      category: filters.category,
    })
      .then(setProducts)
      .finally(() => setLoading(false));
  }, [filters]);

  const clearFilters = () => {
    setFilters({ make: '', model: '', year: '', category: '' });
  };

  const hasActiveFilters = filters.make || filters.model || filters.year || filters.category;

  return (
    <main className="container mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Auto Parts & Accessories</h1>
        <p className="text-gray-600">Find the perfect parts for your vehicle</p>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium mb-1">Make</label>
              <input 
                className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="e.g. Toyota, Honda" 
                value={filters.make} 
                onChange={e => setFilters(f => ({ ...f, make: e.target.value }))} 
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium mb-1">Model</label>
              <input 
                className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="e.g. Camry, Civic" 
                value={filters.model} 
                onChange={e => setFilters(f => ({ ...f, model: e.target.value }))} 
              />
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="block text-sm font-medium mb-1">Year</label>
              <input 
                className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="e.g. 2020" 
                value={filters.year} 
                onChange={e => setFilters(f => ({ ...f, year: e.target.value }))} 
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium mb-1">Category</label>
              <input 
                className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="e.g. Engine, Brake" 
                value={filters.category} 
                onChange={e => setFilters(f => ({ ...f, category: e.target.value }))} 
              />
            </div>
          </div>
          {hasActiveFilters && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                {products.length} product{products.length !== 1 ? 's' : ''} found
              </span>
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-48 w-full mb-4" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-8 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : products.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-gray-500 mb-2">No products found</div>
            {hasActiveFilters ? (
              <p className="text-sm text-gray-400">Try adjusting your filters or browse all products</p>
            ) : (
              <p className="text-sm text-gray-400">Check back later for new products</p>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
      )}
    </main>
  );
}
