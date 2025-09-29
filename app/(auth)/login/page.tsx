"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from '../../../lib/supabase/auth';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const result = await signIn(email, password);
    setLoading(false);
    
    if (result.error) {
      // Provide more helpful error messages
      if (result.error.includes('Invalid login credentials')) {
        setError('Invalid email or password. If you just signed up, please check your email and confirm your account first.');
      } else if (result.error.includes('Email not confirmed')) {
        setError('Please check your email and click the confirmation link to activate your account.');
      } else {
        setError(result.error);
      }
    } else {
      router.push('/account');
    }
  }

  return (
    <main className="container mx-auto p-4">
      <Card className="max-w-md mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-center">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleLogin}>
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
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {error}
              </div>
            )}
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
            <div className="text-center mt-4">
              <span className="text-sm text-gray-600">Don't have an account? </span>
              <a href="/signup" className="text-blue-600 hover:underline">Sign up</a>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
