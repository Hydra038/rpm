import { supabase } from '../../../lib/supabase/client';

export default async function AdminOrdersPage() {
  const { data: orders } = await supabase.from('orders').select('*');
  // TODO: Add CRUD UI for admin
  return (
    <main className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Orders</h2>
      <div>
        {orders?.map((order: any) => (
          <div key={order.id}>Order #{order.id} - {order.status}</div>
        ))}
      </div>
    </main>
  );
}
