import { supabase } from '../../../lib/supabase/client';

export default async function ShopAdminPage() {
  // TODO: Add admin dashboard summary, quick links, etc.
  return (
    <main className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      <div>Welcome to the admin dashboard.</div>
    </main>
  );
}
