"use client";
import { useEffect, useState } from 'react';
import { fetchProducts } from '../../../lib/supabase/products';
import { supabase } from '../../../lib/supabase/client';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');

  async function loadProducts() {
    setLoading(true);
    const data = await fetchProducts({});
    setProducts(data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setMessage('');
    const { error } = await supabase.from('parts').insert({ name, price: Number(price), category });
    if (error) setMessage(error.message);
    else {
      setMessage('Product added!');
      setName(''); setPrice(''); setCategory('');
      loadProducts();
    }
  }

  async function handleDelete(id: string) {
    setMessage('');
    const { error } = await supabase.from('parts').delete().eq('id', id);
    if (error) setMessage(error.message);
    else {
      setMessage('Product deleted!');
      loadProducts();
    }
  }

  return (
    <main className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Products</h2>
      <form className="flex gap-2 mb-4" onSubmit={handleAdd}>
        <input className="border p-2" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
        <input className="border p-2" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} required type="number" min="0" />
        <input className="border p-2" placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} required />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
      </form>
      {message && <div className="mb-2 text-green-600">{message}</div>}
      {loading ? <div>Loading...</div> : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Price</th>
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product: any) => (
              <tr key={product.id}>
                <td className="p-2 border">{product.name}</td>
                <td className="p-2 border">${product.price}</td>
                <td className="p-2 border">{product.category}</td>
                <td className="p-2 border">
                  <button onClick={() => handleDelete(product.id)} className="text-red-500">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
