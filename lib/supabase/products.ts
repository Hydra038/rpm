import { supabase } from './client';

export async function fetchCategories() {
  const { data, error } = await supabase
    .from('parts')
    .select('category')
    .not('category', 'is', null);

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  // Get unique categories
  const categories = [...new Set(data.map(item => item.category))].filter(Boolean);
  return categories.sort();
}

export async function fetchProducts({ make, model, year, category, search, limit = 1000 }: { 
  make?: string; 
  model?: string; 
  year?: number; 
  category?: string; 
  search?: string;
  limit?: number 
}) {
  let query = supabase
    .from('parts')
    .select('*')
    .limit(limit);

  // Filter by search query if provided
  if (search && search.trim()) {
    const searchFormatted = search.toLowerCase().trim();
    query = query.or(`name.ilike.%${searchFormatted}%,description.ilike.%${searchFormatted}%,category.ilike.%${searchFormatted}%,part_number.ilike.%${searchFormatted}%`);
  }

  // Filter by category if provided
  if (category) {
    const categoryFormatted = category.toLowerCase().replace(/\+/g, ' ');
    query = query.or(`category.ilike.%${categoryFormatted}%,name.ilike.%${categoryFormatted}%,description.ilike.%${categoryFormatted}%`);
  }

  // Filter by make if provided
  if (make && make.trim()) {
    query = query.or(`make.ilike.%${make}%,compatible_vehicles.ilike.%${make}%`);
  }

  // Filter by model if provided  
  if (model && model.trim()) {
    query = query.or(`model.ilike.%${model}%,compatible_vehicles.ilike.%${model}%`);
  }

  // Filter by year if provided
  if (year) {
    query = query.or(`year_from.lte.${year},year_to.gte.${year},compatible_vehicles.ilike.%${year}%`);
  }

  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }
  return data || [];
}
