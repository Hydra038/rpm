"use client";
import { useState } from 'react';
import { signIn } from '../../../lib/supabase/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const { error } = await signIn(email, password);
    if (error) setError(error.message);
    // TODO: Redirect on success
  }

  return (
    <main className="container mx-auto p-4 max-w-md">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form className="space-y-4" onSubmit={handleLogin}>
        <input className="w-full border p-2" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="w-full border p-2" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        {error && <div className="text-red-500">{error}</div>}
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Login</button>
      </form>
    </main>
  );
}
