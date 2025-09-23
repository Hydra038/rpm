import { fetchProducts } from '../../lib/supabase/products';

export default async function ProductsPage() {
  // TODO: Add filter UI and fetch logic
  const products = await fetchProducts({});
  return (
    <main className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Map ProductCard here */}
        {products?.map((product: any) => (
          <div key={product.id}>{product.name}</div>
        ))}
      </div>
    </main>
  );
}
