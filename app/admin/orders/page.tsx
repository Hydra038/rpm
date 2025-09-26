"use client";
import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase/client';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function loadOrders() {
    setLoading(true);
    const { data } = await supabase.from('orders').select('*');
    setOrders(data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function handleDelete(id: string) {
    setMessage('');
    const { error } = await supabase.from('orders').delete().eq('id', id);
    if (error) setMessage(error.message);
    else {
      setMessage('Order deleted!');
      loadOrders();
    }
  }

  return (
    <main className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Orders</h2>
      {message && <div className="mb-2 text-green-600">{message}</div>}
      {loading ? <div>Loading...</div> : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Order #</th>
              <th className="p-2 border">User</th>
              <th className="p-2 border">Total</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Created</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order: any) => (
              <tr key={order.id}>
                <td className="p-2 border">{order.id}</td>
                <td className="p-2 border">{order.user_id}</td>
                <td className="p-2 border">${order.total_amount}</td>
                <td className="p-2 border">{order.status}</td>
                <td className="p-2 border">{order.created_at}</td>
                <td className="p-2 border">
                  <button onClick={() => handleDelete(order.id)} className="text-red-500">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
