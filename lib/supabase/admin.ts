import { supabase } from './client';

export async function getAdminUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return { user: null, error: error || new Error('Not authenticated') };
  }

  // For now, we'll consider any authenticated user as admin
  // In production, you'd check user roles/permissions from your database
  return { user, error: null };
}

export async function requireAdmin() {
  const { user, error } = await getAdminUser();
  
  if (!user) {
    throw new Error('Admin access required');
  }
  
  return user;
}

export function isAdmin(user: any): boolean {
  // For now, any authenticated user is considered admin
  // In production, check user roles/permissions
  return !!user;
}