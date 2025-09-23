import { fetchProducts } from '../../../lib/supabase/products';
import { ProductCard } from '../../../components/ProductCard';

export default async function ShopProductsPage() {
  const products = await fetchProducts({});
  return (
    <main className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products?.map((product: any) => (
          <ProductCard key={product.id} name={product.name} price={product.price} image_url={product.image_url} />
        ))}
      </div>
    </main>
  );
}
