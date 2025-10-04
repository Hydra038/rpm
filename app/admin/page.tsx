'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase/client'
import { formatCurrency } from '../../lib/currency'
import Link from 'next/link'
import AdminLayout from './components/AdminLayout'

export default function AdminPage() {
  const [isSeeding, setIsSeeding] = useState(false)
  const [seedMessage, setSeedMessage] = useState('')
  const [isOrderSeeding, setIsOrderSeeding] = useState(false)
  const [orderSeedMessage, setOrderSeedMessage] = useState('')
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: [] as any[],
    unreadMessages: 0
  })
  const [loading, setLoading] = useState(true)

  // Load dashboard statistics
  useEffect(() => {
    async function loadDashboardData() {
      try {
        const response = await fetch('/api/admin/stats');
        if (response.ok) {
          const stats = await response.json();
          setStats(stats);
        }
        
        // Load unread messages count
        try {
          const { data: messages, error } = await supabase
            .from('support_messages')
            .select('user_id, is_admin, created_at')
            .order('created_at', { ascending: false });
          
          if (!error && messages) {
            // Count unread messages (user messages that came after last admin message per user)
            const userLastMessages = new Map();
            let unread = 0;
            
            messages.forEach(msg => {
              if (!userLastMessages.has(msg.user_id)) {
                userLastMessages.set(msg.user_id, msg.is_admin);
                if (!msg.is_admin) {
                  unread++;
                }
              }
            });
            
            setStats(prev => ({ ...prev, unreadMessages: unread }));
          }
        } catch (error) {
          console.error('Error loading support messages:', error);
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  const seedProducts = async () => {
    setIsSeeding(true)
    setSeedMessage('')
    
    try {
      const response = await fetch('/api/seed', {
        method: 'POST',
      })
      const data = await response.json()
      
      if (response.ok) {
        setSeedMessage('Products seeded successfully!')
        // Refresh stats after seeding
        const { count: productCount } = await supabase
          .from('parts')
          .select('*', { count: 'exact', head: true })
        setStats(prev => ({ ...prev, totalProducts: productCount || 0 }))
      } else {
        setSeedMessage(`Error: ${data.error}`)
      }
    } catch (error) {
      setSeedMessage('Failed to seed products')
    } finally {
      setIsSeeding(false)
    }
  }

  const seedOrders = async () => {
    setIsOrderSeeding(true)
    setOrderSeedMessage('')
    
    try {
      const response = await fetch('/api/seed-orders', {
        method: 'POST',
      })
      const data = await response.json()
      
      if (response.ok) {
        setOrderSeedMessage(`Successfully seeded ${data.orders} sample orders!`)
        // Refresh stats after seeding
        const { data: orders, count: orderCount } = await supabase
          .from('orders')
          .select('total_amount', { count: 'exact' })
        
        const totalRevenue = orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0
        
        const { data: recentOrders } = await supabase
          .from('orders')
          .select(`
            id,
            total_amount,
            status,
            created_at,
            order_items (
              quantity,
              parts (
                name
              )
            )
          `)
          .order('created_at', { ascending: false })
          .limit(5)

        setStats(prev => ({ 
          ...prev, 
          totalOrders: orderCount || 0,
          totalRevenue: totalRevenue,
          recentOrders: recentOrders || []
        }))
      } else {
        setOrderSeedMessage(`Error: ${data.error}`)
      }
    } catch (error) {
      setOrderSeedMessage('Failed to seed orders')
    } finally {
      setIsOrderSeeding(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return 'text-green-600 bg-green-100'
      case 'cancelled':
        return 'text-red-600 bg-red-100'
      case 'processing':
        return 'text-blue-600 bg-blue-100'
      default:
        return 'text-orange-600 bg-orange-100'
    }
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Admin Dashboard</h2>
        <p className="text-gray-600">Manage your RPM Auto Parts store</p>
      </div>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-1">Products</h3>
              <p className="text-3xl font-bold text-blue-600">
                {loading ? '...' : stats.totalProducts.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Total Products</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-1">Orders</h3>
              <p className="text-3xl font-bold text-green-600">
                {loading ? '...' : stats.totalOrders.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Total Orders</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-1">Revenue</h3>
              <p className="text-3xl font-bold text-purple-600">
                {loading ? '...' : formatCurrency(stats.totalRevenue)}
              </p>
              <p className="text-sm text-gray-600">Total Revenue</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>
        
        <Link href="/admin/chat" className="bg-white p-6 rounded-lg shadow border hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-1">Support</h3>
              <p className="text-3xl font-bold text-orange-600">
                {loading ? '...' : stats.unreadMessages}
              </p>
              <p className="text-sm text-gray-600">Unread Messages</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4z" />
              </svg>
            </div>
          </div>
        </Link>
      </div>
      
      {/* Action Buttons and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button 
              onClick={seedProducts}
              disabled={isSeeding}
              className="w-full bg-orange-500 text-white px-4 py-3 rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isSeeding ? 'Seeding Products...' : 'Seed Sample Products'}
            </button>
            {seedMessage && (
              <div className={`p-3 rounded-lg text-sm ${
                seedMessage.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
              }`}>
                {seedMessage}
              </div>
            )}

            <button 
              onClick={seedOrders}
              disabled={isOrderSeeding}
              className="w-full bg-yellow-500 text-white px-4 py-3 rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isOrderSeeding ? 'Seeding Orders...' : 'Seed Sample Orders'}
            </button>
            {orderSeedMessage && (
              <div className={`p-3 rounded-lg text-sm ${
                orderSeedMessage.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
              }`}>
                {orderSeedMessage}
              </div>
            )}
            
            <Link href="/admin/products">
              <button className="w-full bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium">
                Manage Products
              </button>
            </Link>
            
            <Link href="/admin/orders">
              <button className="w-full bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 transition-colors font-medium">
                View Orders
              </button>
            </Link>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-xl font-semibold mb-4">Recent Orders</h3>
          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : stats.recentOrders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p>No recent orders</p>
              <p className="text-sm">Orders will appear here once customers start purchasing</p>
            </div>
          ) : (
            <div className="space-y-4">
              {stats.recentOrders.map((order) => (
                <div key={order.id} className="border-b pb-3 last:border-b-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">Order #{order.id}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(order.created_at).toLocaleDateString('en-GB')}
                      </p>
                      {order.order_items && order.order_items.length > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                          {order.order_items.length} item{order.order_items.length !== 1 ? 's' : ''}
                          {order.order_items[0]?.parts?.name && ` • ${order.order_items[0].parts.name}${order.order_items.length > 1 ? '...' : ''}`}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(order.total_amount)}</p>
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                        {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              
              <Link href="/admin/orders">
                <button className="w-full text-blue-600 hover:text-blue-800 text-sm font-medium mt-4 py-2 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
                  View All Orders →
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
