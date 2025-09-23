"use client";
import { useState } from 'react';
import { signUp } from '../../../lib/supabase/auth';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    const { error } = await signUp(email, password);
    if (error) setError(error.message);
    else setSuccess('Check your email to confirm your account.');
  }

  return (
    <main className="container mx-auto p-4 max-w-md">
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
      <form className="space-y-4" onSubmit={handleSignup}>
        <input className="w-full border p-2" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="w-full border p-2" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-600">{success}</div>}
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Sign Up</button>
      </form>
    </main>
  );
}
