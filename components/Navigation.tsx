"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { ShoppingCart, User, Menu, X, Car, Shield, Heart, Truck } from 'lucide-react';
import { useCartStore } from '../store/cart';
import { getUser, signOut } from '../lib/supabase/auth';
import { supabase } from '../lib/supabase/client';
import { CartDrawer } from './CartDrawer';
import { WishlistDrawer } from './WishlistDrawer';
import { NavigationLink } from './NavigationLink';

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const cartItems = useCartStore((state) => state.items);
  const router = useRouter();

  useEffect(() => {
    async function checkUser() {
      try {
        const result = await getUser();
        console.log('Navigation auth check:', result); // Debug log
        
        if (!result.error && result.user) {
          setUser(result.user);
          
          // Check if user is admin
          const { data: profileData } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', result.user.id)
            .single();
          
          if (profileData) {
            setProfile(profileData);
          }
        } else {
          setUser(null);
          setProfile(null);
        }
      } catch (error) {
        console.error('Navigation auth error:', error);
        setUser(null);
        setProfile(null);
      }
    }
    
    checkUser();
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state change:', event, session?.user?.email);
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setUser(null);
    setProfile(null);
    router.push('/');
  };

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="fixed top-0 w-full bg-white border-b border-gray-200 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 px-2 sm:px-0">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-lg sm:text-xl text-blue-600">
            <Car className="w-6 h-6 sm:w-8 sm:h-8" />
            RPM
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <NavigationLink href="/" className="hover:text-blue-600 transition-colors">
              Home
            </NavigationLink>
            <NavigationLink href="/products" className="hover:text-blue-600 transition-colors">
              Products
            </NavigationLink>
            <NavigationLink href="/track" className="hover:text-blue-600 transition-colors flex items-center gap-1">
              <Truck className="w-4 h-4" />
              Track Order
            </NavigationLink>
            <NavigationLink href="/contact" className="hover:text-blue-600 transition-colors">
              Contact
            </NavigationLink>
            {user && (
              <>
                <NavigationLink href="/account" className="hover:text-blue-600 transition-colors">
                  Account
                </NavigationLink>
                {profile?.role === 'admin' && (
                  <NavigationLink href="/admin" className="hover:text-red-600 transition-colors flex items-center gap-1">
                    <Shield className="w-4 h-4" />
                    Admin
                  </NavigationLink>
                )}
              </>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Wishlist */}
            {user && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="relative p-2"
                onClick={() => setIsWishlistOpen(true)}
              >
                <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            )}

            {/* Cart */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative p-2"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-blue-600 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-[10px] sm:text-xs">
                  {cartItemCount}
                </span>
              )}
            </Button>

            {/* User Menu */}
            <div className="hidden md:flex items-center gap-2">
              {user ? (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/account" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {user.email?.split('@')[0]}
                      {profile?.role === 'admin' && (
                        <Shield className="w-3 h-3 text-red-600" />
                      )}
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleSignOut}>
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/login">Sign In</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col gap-2">
              <NavigationLink
                href="/"
                className="px-4 py-2 hover:bg-gray-50 rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </NavigationLink>
              <NavigationLink
                href="/products"
                className="px-4 py-2 hover:bg-gray-50 rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </NavigationLink>
              <NavigationLink
                href="/track"
                className="px-4 py-2 hover:bg-gray-50 rounded flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Truck className="w-4 h-4" />
                Track Order
              </NavigationLink>
              <NavigationLink
                href="/contact"
                className="px-4 py-2 hover:bg-gray-50 rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </NavigationLink>
              {user ? (
                <>
                  <NavigationLink
                    href="/account"
                    className="px-4 py-2 hover:bg-gray-50 rounded flex items-center gap-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Account ({user.email?.split('@')[0]})
                    {profile?.role === 'admin' && (
                      <Shield className="w-4 h-4 text-red-600" />
                    )}
                  </NavigationLink>
                  {profile?.role === 'admin' && (
                    <NavigationLink
                      href="/admin"
                      className="px-4 py-2 hover:bg-gray-50 rounded flex items-center gap-2 text-red-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Shield className="w-4 h-4" />
                      Admin Panel
                    </NavigationLink>
                  )}
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="px-4 py-2 hover:bg-gray-50 rounded text-left"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <NavigationLink
                    href="/login"
                    className="px-4 py-2 hover:bg-gray-50 rounded"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </NavigationLink>
                  <NavigationLink
                    href="/signup"
                    className="px-4 py-2 hover:bg-gray-50 rounded"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </NavigationLink>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      
      {/* Wishlist Drawer */}
      <WishlistDrawer isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
    </nav>
  );
}