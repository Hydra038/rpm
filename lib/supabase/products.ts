import { supabase } from './client';

export async function fetchProducts({ make, model, year, category }: { make?: string; model?: string; year?: number; category?: string }) {
  let query = supabase
    .from('parts')
    .select('*, vehicles(*, brands(*))');

  if (make) query = query.ilike('vehicles.brands.name', `%${make}%`);
  if (model) query = query.ilike('vehicles.model', `%${model}%`);
  if (year) query = query.gte('vehicles.year_start', year).lte('vehicles.year_end', year);
  if (category) query = query.ilike('category', `%${category}%`);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}
