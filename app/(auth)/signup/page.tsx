"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signUp } from '../../../lib/supabase/auth';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    const result = await signUp(email, password);
    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      if (result.user && !result.user.email_confirmed_at) {
        setSuccess('Please check your email and click the confirmation link to activate your account. Then you can sign in.');
      } else {
        setSuccess('Account created successfully! You can now sign in.');
      }
      setTimeout(() => router.push('/login'), 5000);
    }
  }

  return (
    <main className="container mx-auto p-4">
      <Card className="max-w-md mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-center">Create Account</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSignup}>
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">Email</label>
              <input 
                id="email"
                type="email"
                className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="Enter your email" 
                value={email} 
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium">Password</label>
              <input 
                id="password"
                type="password" 
                className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="Enter your password" 
                value={password} 
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium">Confirm Password</label>
              <input 
                id="confirmPassword"
                type="password" 
                className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="Confirm your password" 
                value={confirmPassword} 
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded">
                {success}
              </div>
            )}
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
            <div className="text-center mt-4">
              <span className="text-sm text-gray-600">Already have an account? </span>
              <a href="/login" className="text-blue-600 hover:underline">Sign in</a>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
