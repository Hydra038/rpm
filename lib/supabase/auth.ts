import { supabase } from './client';

export async function signUp(email: string, password: string) {
  console.log('Starting signup for:', email);
  
  try {
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`
      }
    });
    
    console.log('Signup response:', { data, error });
    
    if (error) {
      console.error('Signup error:', error);
      return { error: error.message };
    }
    
    console.log('Signup successful:', data);
    return { user: data.user, session: data.session };
  } catch (err) {
    console.error('Signup exception:', err);
    return { error: 'Unexpected error during signup' };
  }
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };
  return { user: data.user, session: data.session };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) return { error: error.message };
  return { success: true };
}

export async function getUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) return { error: error.message };
  return { user: data.user };
}
