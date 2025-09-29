"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase/client';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Settings, Package, ShoppingCart, BarChart3, LogOut, CreditCard } from 'lucide-react';
import Link from 'next/link';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminSetupNeeded, setAdminSetupNeeded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error || !user) {
          router.push('/login');
          return;
        }
        
        setUser(user);

        // Check if user is admin by checking the user_profiles table directly
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('user_id', user.id)
          .single();
        
        if (!profileError && profile && profile.role === 'admin') {
          setIsAdmin(true);
        } else {
          // Check if this is the designated admin email that needs setup
          if (user.email === 'support@rpmgenuineautoparts.info') {
            // Since we know the admin profile exists, let's try to refresh and check again
            const { data: refreshedProfile } = await supabase
              .from('user_profiles')
              .select('role')
              .eq('email', user.email)
              .single();
            
            if (refreshedProfile && refreshedProfile.role === 'admin') {
              setIsAdmin(true);
            } else {
              setAdminSetupNeeded(true);
            }
          } else {
            // Not an admin and not the designated admin email
            router.push('/');
            return;
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [router]);

  const handleSetupAdmin = async () => {
    try {
      // Since we know the admin profile already exists in the database,
      // let's just refresh the page to check the profile again
      window.location.reload();
    } catch (error) {
      console.error('Admin setup failed:', error);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto p-4">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p>Checking authentication...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!user || (!isAdmin && !adminSetupNeeded)) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto p-4">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Admin Access Required</h2>
              <p className="text-gray-600 mb-4">
                You need admin privileges to access this area.
              </p>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">
                  Current user: {user?.email || 'Not logged in'}
                </p>
                <div className="flex gap-2 justify-center">
                  <Link href="/">
                    <Button variant="outline">Back to Store</Button>
                  </Link>
                  <Button onClick={handleSignOut}>Sign Out</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show admin setup if needed
  if (adminSetupNeeded && user.email === 'support@rpmgenuineautoparts.info') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto p-4">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Admin Setup</h2>
              <p className="text-gray-600 mb-4">
                Welcome! You're logged in as the designated admin user. 
                Your admin profile should already be set up. Click below to refresh and check your admin status.
              </p>
              <p className="text-sm text-blue-600 mb-6">
                {user.email}
              </p>
              <Button onClick={handleSetupAdmin} className="w-full">
                Check Admin Status
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                RPM Admin
              </Link>
              <div className="hidden md:flex items-center gap-1 text-sm text-gray-600">
                <Settings className="h-4 w-4" />
                Administration Panel
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                {user.email}
              </div>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-1" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Navigation */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <nav className="flex gap-6 py-3">
            <Link 
              href="/admin" 
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </Link>
            <Link 
              href="/admin/orders" 
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              <ShoppingCart className="h-4 w-4" />
              Orders
            </Link>
            <Link 
              href="/admin/products" 
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              <Package className="h-4 w-4" />
              Products
            </Link>
            <Link 
              href="/admin/payment-settings" 
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              <CreditCard className="h-4 w-4" />
              Payment Settings
            </Link>
            <Link 
              href="/admin/inventory" 
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              <Settings className="h-4 w-4" />
              Inventory
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-4">
        {children}
      </div>
    </div>
  );
}