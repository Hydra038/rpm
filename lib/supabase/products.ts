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
  console.log('fetchProducts called with:', { make, model, year, category, search, limit });
  
  try {
    // Use the API endpoint instead of direct Supabase call
    const params = new URLSearchParams();
    if (make) params.append('make', make);
    if (model) params.append('model', model);
    if (year) params.append('year', year.toString());
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    if (limit) params.append('limit', limit.toString());

    const url = `/api/products?${params.toString()}`;
    console.log('Fetching from API:', url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error('API request failed:', response.status, response.statusText);
      return [];
    }
    
    const result = await response.json();
    console.log('API response:', { 
      success: result.success, 
      count: result.count,
      hasProducts: !!result.products
    });
    
    if (!result.success) {
      console.error('API returned error:', result.error);
      return [];
    }
    
    console.log(`Successfully fetched ${result.count} products from API`);
    return result.products || [];
    
  } catch (exception) {
    console.error('Exception in fetchProducts:', exception);
    return [];
  }
}
