import { getUser } from '../../../lib/supabase/auth';
import { supabase } from '../../../lib/supabase/client';

export default async function ShopAccountPage() {
  const user = await getUser();
  const { data: orders } = await supabase.from('orders').select('*').eq('user_id', user?.id);
  // TODO: Add download invoice, profile update, etc.
  return (
    <main className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">My Account</h2>
      <div className="mb-6">Email: {user?.email}</div>
      <h3 className="font-semibold mb-2">Order History</h3>
      <ul>
        {orders?.map((order: any) => (
          <li key={order.id} className="mb-2">Order #{order.id} - {order.status} - {order.created_at}</li>
        ))}
      </ul>
    </main>
  );
}
