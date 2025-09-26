"use client";
import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase/client';

export default function AdminInventoryPage() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({ part_id: '', quantity: '' });

  async function loadInventory() {
    setLoading(true);
    const { data } = await supabase.from('inventory').select('*');
    setInventory(data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadInventory();
  }, []);

  async function handleAdd(e: any) {
    e.preventDefault();
    setMessage('');
    const { error } = await supabase.from('inventory').insert({
      part_id: form.part_id,
      quantity: Number(form.quantity),
    });
    if (error) setMessage(error.message);
    else {
      setMessage('Inventory item added!');
      setForm({ part_id: '', quantity: '' });
      loadInventory();
    }
  }

  async function handleDelete(id: string) {
    setMessage('');
    const { error } = await supabase.from('inventory').delete().eq('id', id);
    if (error) setMessage(error.message);
    else {
      setMessage('Inventory item deleted!');
      loadInventory();
    }
  }

  return (
    <main className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Inventory</h2>
      {message && <div className="mb-2 text-green-600">{message}</div>}
      <form onSubmit={handleAdd} className="mb-4 flex gap-2">
        <input
          className="border p-2"
          placeholder="Part ID"
          value={form.part_id}
          onChange={e => setForm(f => ({ ...f, part_id: e.target.value }))}
          required
        />
        <input
          className="border p-2"
          placeholder="Quantity"
          type="number"
          value={form.quantity}
          onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))}
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
      </form>
      {loading ? <div>Loading...</div> : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Part ID</th>
              <th className="p-2 border">Quantity</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item: any) => (
              <tr key={item.id}>
                <td className="p-2 border">{item.id}</td>
                <td className="p-2 border">{item.part_id}</td>
                <td className="p-2 border">{item.quantity}</td>
                <td className="p-2 border">
                  <button onClick={() => handleDelete(item.id)} className="text-red-500">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
