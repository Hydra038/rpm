import { signOut } from '../../../lib/supabase/auth';

export default async function LogoutPage() {
  await signOut();
  // TODO: Redirect to home or login
  return <div>Logging out...</div>;
}
