import { fetchProducts } from '../../../lib/supabase/products';

export default async function AdminProductsPage() {
  const products = await fetchProducts({});
  // TODO: Add CRUD UI for admin
  return (
    <main className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products?.map((product: any) => (
          <div key={product.id}>{product.name}</div>
        ))}
      </div>
    </main>
  );
}
