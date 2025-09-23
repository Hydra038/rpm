import { supabase } from '../../../lib/supabase/client';

export default async function AdminInventoryPage() {
  const { data: parts } = await supabase.from('parts').select('*');
  // TODO: Add CRUD UI for admin
  return (
    <main className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Inventory</h2>
      <div>
        {parts?.map((part: any) => (
          <div key={part.id}>{part.name} - Stock: {part.stock}</div>
        ))}
      </div>
    </main>
  );
}
