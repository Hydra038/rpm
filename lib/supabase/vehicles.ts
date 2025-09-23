import { supabase } from './client';

export async function fetchBrands() {
  const { data, error } = await supabase.from('brands').select('*');
  if (error) throw error;
  return data;
}

export async function fetchVehicleModels(brandId: string) {
  const { data, error } = await supabase.from('vehicles').select('*').eq('brand_id', brandId);
  if (error) throw error;
  return data;
}
