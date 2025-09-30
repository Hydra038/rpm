"use client";
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase/client';
import { formatCurrency } from '../../lib/currency';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { User, Package, CreditCard, MapPin, Clock, CheckCircle, XCircle, AlertCircle, Shield, Settings, Download, FileText, Truck, ExternalLink } from 'lucide-react';

interface Order {
  id: string;
  total_amount: number;
  status: string;
  created_at: string;
  payment_status: string;
  tracking_number: string | null;
  order_items: Array<{
    id: string;
    quantity: number;
    price: number;
    parts: {
      name: string;
      image_url: string;
    };
  }>;
  customer?: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

export default function AccountPage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses' | 'admin'>('profile');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    async function fetchUserAndOrders() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        // Fetch user profile to check role
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (!profileError && profileData) {
          setProfile(profileData);
        }

        // Fetch orders - admin can see all orders, regular users see only their own
        let ordersQuery;
        
        if (profileData && profileData.role === 'admin') {
          // Admin query: get all orders with customer information
          // We need to use a custom query since we need to join through user_id
          const { data: allOrders, error: ordersError } = await supabase
            .from('orders')
            .select(`
              *,
              order_items (
                id,
                quantity,
                price,
                parts (
                  name,
                  image_url
                )
              )
            `)
            .order('created_at', { ascending: false });

          if (ordersError) {
            console.error('Error fetching admin orders:', ordersError);
            setOrders([]);
          } else {
            // Get user profile info for each order
            const ordersWithProfiles = await Promise.all(
              (allOrders || []).map(async (order) => {
                const { data: userProfile } = await supabase
                  .from('user_profiles')
                  .select('first_name, last_name, email')
                  .eq('user_id', order.user_id)
                  .single();
                
                return {
                  ...order,
                  customer: userProfile
                };
              })
            );
            setOrders(ordersWithProfiles);
          }
        } else {
          // Regular user query: get only their own orders
          const { data: orders, error } = await supabase
            .from('orders')
            .select(`
              *,
              order_items (
                id,
                quantity,
                price,
                parts (
                  name,
                  image_url
                )
              )
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
          
          if (error) {
            console.error('Error fetching user orders:', error);
            setOrders([]);
          } else {
            setOrders(orders || []);
          }
        }
      }
      setLoading(false);
    }
    fetchUserAndOrders();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'processing':
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      default:
        return <Clock className="h-4 w-4 text-orange-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'cancelled':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'processing':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      default:
        return 'text-orange-700 bg-orange-50 border-orange-200';
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const handleDownloadInvoice = (orderId: string) => {
    window.open(`/api/orders/${orderId}/invoice`, '_blank');
  };

  if (loading) return (
    <main className="container mx-auto p-4 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <Skeleton className="h-8 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardContent className="p-6">
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    </main>
  );

  if (!user) {
    return (
      <main className="container mx-auto p-4">
        <Card className="max-w-md mx-auto mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              My Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">Please log in to view your account.</div>
            <Button asChild>
              <a href="/login">Login</a>
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="container mx-auto p-4 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              My Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <nav className="space-y-2">
              <Button
                variant={activeTab === 'profile' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('profile')}
              >
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
              <Button
                variant={activeTab === 'orders' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('orders')}
              >
                <Package className="h-4 w-4 mr-2" />
                Orders ({orders.length})
              </Button>
              <Button
                variant={activeTab === 'addresses' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('addresses')}
              >
                <MapPin className="h-4 w-4 mr-2" />
                Addresses
              </Button>
              {profile?.role === 'admin' && (
                <Button
                  variant={activeTab === 'admin' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('admin')}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Admin Panel
                </Button>
              )}
            </nav>
            <div className="mt-6 pt-6 border-t">
              <Button variant="outline" onClick={handleSignOut} className="w-full">
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {activeTab === 'profile' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address</label>
                    <div className="p-3 bg-gray-50 rounded-md border">
                      {user.email}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Account Created</label>
                    <div className="p-3 bg-gray-50 rounded-md border">
                      {new Date(user.created_at).toLocaleDateString('en-GB')}
                    </div>
                  </div>
                  {profile?.role && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Account Type</label>
                      <div className={`p-3 rounded-md border flex items-center gap-2 ${
                        profile.role === 'admin' 
                          ? 'bg-red-50 border-red-200 text-red-800' 
                          : 'bg-blue-50 border-blue-200 text-blue-800'
                      }`}>
                        {profile.role === 'admin' ? (
                          <Shield className="h-4 w-4" />
                        ) : (
                          <User className="h-4 w-4" />
                        )}
                        {profile.role === 'admin' ? 'Administrator' : 'Customer'}
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium mb-2">Profile ID</label>
                    <div className="p-3 bg-gray-50 rounded-md border font-mono text-sm">
                      {profile?.id || 'Loading...'}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 text-blue-800 font-medium mb-2">
                    <CreditCard className="h-4 w-4" />
                    Account Status
                  </div>
                  <p className="text-blue-700">Your account is active and verified.</p>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'orders' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                    <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
                    <Button asChild>
                      <a href="/products">Start Shopping</a>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                          <div className="flex items-center gap-4">
                            <div>
                              <p className="font-medium">Order #{order.id}</p>
                              <p className="text-sm text-gray-600">
                                {new Date(order.created_at).toLocaleDateString('en-GB')}
                              </p>
                              {profile?.role === 'admin' && order.customer && (
                                <p className="text-sm text-blue-600 font-medium">
                                  Customer: {order.customer?.email || 'Unknown'}
                                </p>
                              )}
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                              <div className="flex items-center gap-1">
                                {getStatusIcon(order.status)}
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-lg">
                              {formatCurrency(order.total_amount)}
                            </p>
                            {order.tracking_number && (
                              <p className="text-sm text-blue-600">
                                Tracking: {order.tracking_number}
                              </p>
                            )}
                            <div className="flex flex-col gap-2 mt-2">
                              {order.payment_status === 'paid' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDownloadInvoice(order.id)}
                                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                >
                                  <Download className="h-4 w-4 mr-1" />
                                  Invoice
                                </Button>
                              )}
                              {(order.tracking_number || order.status === 'shipped' || order.status === 'processing') && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  asChild
                                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 min-h-[40px] px-3 py-2 text-sm font-medium"
                                >
                                  <a href={`/track?order=${order.tracking_number || order.id}`} target="_blank" className="flex items-center gap-1 no-underline">
                                    <Truck className="h-4 w-4" />
                                    <span className="hidden xs:inline">Track Order</span>
                                    <span className="xs:hidden">Track</span>
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* Order Items Preview */}
                        <div className="border-t pt-3">
                          <div className="flex gap-2 overflow-x-auto">
                            {order.order_items?.slice(0, 3).map((item, index) => (
                              <div key={index} className="flex-shrink-0 flex items-center gap-2 bg-white border rounded-lg p-2">
                                {item.parts?.image_url && (
                                  <img 
                                    src={item.parts.image_url} 
                                    alt={item.parts?.name || 'Product'}
                                    className="w-10 h-10 rounded object-cover"
                                  />
                                )}
                                <div className="min-w-0">
                                  <p className="text-xs font-medium truncate max-w-[120px]">
                                    {item.parts?.name || 'Product'}
                                  </p>
                                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                </div>
                              </div>
                            ))}
                            {order.order_items && order.order_items.length > 3 && (
                              <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 bg-gray-100 border rounded-lg text-xs text-gray-600">
                                +{order.order_items.length - 3} more
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === 'admin' && profile?.role === 'admin' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Admin Panel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <Card className="bg-gradient-to-r from-blue-50 to-blue-100">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Package className="h-8 w-8 text-blue-600" />
                        <div>
                          <p className="text-2xl font-bold text-blue-900">{orders.length}</p>
                          <p className="text-sm text-blue-700">Total Orders</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-r from-green-50 to-green-100">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                        <div>
                          <p className="text-2xl font-bold text-green-900">
                            {orders.filter(o => o.status === 'completed').length}
                          </p>
                          <p className="text-sm text-green-700">Completed</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-r from-orange-50 to-orange-100">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Clock className="h-8 w-8 text-orange-600" />
                        <div>
                          <p className="text-2xl font-bold text-orange-900">
                            {orders.filter(o => o.status === 'processing').length}
                          </p>
                          <p className="text-sm text-orange-700">Processing</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-r from-purple-50 to-purple-100">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-8 w-8 text-purple-600" />
                        <div>
                          <p className="text-2xl font-bold text-purple-900">
                            {formatCurrency(orders.reduce((sum, order) => sum + order.total_amount, 0))}
                          </p>
                          <p className="text-sm text-purple-700">Total Revenue</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button asChild className="h-16 text-left justify-start">
                    <a href="/admin" className="flex items-center gap-3">
                      <Settings className="h-6 w-6" />
                      <div>
                        <div className="font-medium">Full Admin Dashboard</div>
                        <div className="text-sm opacity-75">Manage products, orders, and more</div>
                      </div>
                    </a>
                  </Button>
                  
                  <Button asChild variant="outline" className="h-16 text-left justify-start">
                    <a href="/admin/orders" className="flex items-center gap-3">
                      <Package className="h-6 w-6" />
                      <div>
                        <div className="font-medium">Order Management</div>
                        <div className="text-sm opacity-75">View and manage all orders</div>
                      </div>
                    </a>
                  </Button>
                  
                  <Button asChild variant="outline" className="h-16 text-left justify-start">
                    <a href="/admin/products" className="flex items-center gap-3">
                      <Package className="h-6 w-6" />
                      <div>
                        <div className="font-medium">Product Management</div>
                        <div className="text-sm opacity-75">Add and edit products</div>
                      </div>
                    </a>
                  </Button>
                  
                  <Button asChild variant="outline" className="h-16 text-left justify-start">
                    <a href="/auth-test" className="flex items-center gap-3">
                      <Settings className="h-6 w-6" />
                      <div>
                        <div className="font-medium">Debug Tools</div>
                        <div className="text-sm opacity-75">Development and testing</div>
                      </div>
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'addresses' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Saved Addresses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No saved addresses</h3>
                  <p className="text-gray-600 mb-4">Add an address to make checkout faster.</p>
                  <Button>Add Address</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}
