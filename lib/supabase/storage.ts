import { supabase } from './client';

export async function uploadProductImage(file: File, path: string) {
  const { data, error } = await supabase.storage.from('product-images').upload(path, file);
  if (error) throw error;
  return data;
}

export async function getProductImageUrl(path: string) {
  const { data } = supabase.storage.from('product-images').getPublicUrl(path);
  return data.publicUrl;
}
