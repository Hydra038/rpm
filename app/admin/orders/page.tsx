"use client";
import { useEffect, useState } from 'react';
import { formatCurrency } from '../../../lib/currency';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AdminLayout from '../components/AdminLayout';
import { 
  Package, 
  User, 
  Calendar, 
  CreditCard, 
  Truck, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Clock, 
  Eye,
  Edit,
  Trash2,
  Download,
  FileText
} from 'lucide-react';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  parts: {
    id: string;
    name: string;
    image_url: string;
    category: string;
  };
}

interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: string;
  payment_status: string;
  tracking_number: string | null;
  created_at: string;
  updated_at: string;
  notes: string | null;
  order_items: OrderItem[];
}

const ORDER_STATUSES = [
  { value: 'pending', label: 'Pending', color: 'bg-orange-100 text-orange-800' },
  { value: 'processing', label: 'Processing', color: 'bg-blue-100 text-blue-800' },
  { value: 'shipped', label: 'Shipped', color: 'bg-purple-100 text-purple-800' },
  { value: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-800' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
  { value: 'refunded', label: 'Refunded', color: 'bg-gray-100 text-gray-800' },
];

const PAYMENT_STATUSES = [
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'Paid' },
  { value: 'failed', label: 'Failed' },
  { value: 'refunded', label: 'Refunded' },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    status: '',
    payment_status: '',
    tracking_number: '',
    notes: ''
  });

  async function loadOrders() {
    setLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/admin/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      } else {
        throw new Error('Failed to load orders');
      }
    } catch (error: any) {
      setMessage(`Error loading orders: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'cancelled':
      case 'refunded':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'processing':
      case 'shipped':
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      default:
        return <Clock className="h-4 w-4 text-orange-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = ORDER_STATUSES.find(s => s.value === status?.toLowerCase()) || ORDER_STATUSES[0];
    return (
      <Badge className={`${statusConfig.color} border-0`}>
        <div className="flex items-center gap-1">
          {getStatusIcon(status)}
          {statusConfig.label}
        </div>
      </Badge>
    );
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string, newPaymentStatus: string, trackingNumber: string, notes: string) => {
    setMessage('');
    
    try {
      const updateData: any = {
        status: newStatus,
        payment_status: newPaymentStatus
      };

      if (trackingNumber) {
        updateData.tracking_number = trackingNumber;
      }
      if (notes) {
        updateData.notes = notes;
      }

      const response = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId, updates: updateData }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order');
      }
      
      setMessage('Order updated successfully!');
      setIsEditing(false);
      setSelectedOrder(null);
      loadOrders();
    } catch (error: any) {
      setMessage(`Error updating order: ${error.message}`);
    }
  };

  const handleEdit = (order: Order) => {
    setSelectedOrder(order);
    setEditForm({
      status: order.status || 'pending',
      payment_status: order.payment_status || 'pending',
      tracking_number: order.tracking_number || '',
      notes: order.notes || ''
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      return;
    }

    setMessage('');
    try {
      const response = await fetch('/api/admin/orders', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId: id }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete order');
      }

      setMessage('Order deleted successfully!');
      loadOrders();
    } catch (error: any) {
      setMessage(`Error deleting order: ${error.message}`);
    }
  };

  const handleDownloadInvoice = (orderId: string) => {
    window.open(`/api/admin/orders/${orderId}/invoice`, '_blank');
  };

  const getTotalItems = (orderItems: OrderItem[]) => {
    return orderItems?.reduce((total, item) => total + item.quantity, 0) || 0;
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Order Management</h2>
        <p className="text-gray-600">Manage customer orders, update statuses, and track shipments</p>
      </div>

      {message && (
        <Card className={`mb-6 ${message.includes('Error') ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
          <CardContent className="p-4">
            <p className={message.includes('Error') ? 'text-red-700' : 'text-green-700'}>
              {message}
            </p>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-3">Loading orders...</span>
            </div>
          </CardContent>
        </Card>
      ) : orders.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600">Orders will appear here once customers start purchasing.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {ORDER_STATUSES.slice(0, 4).map(status => {
              const count = orders.filter(order => order.status === status.value).length;
              return (
                <Card key={status.value}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">{status.label}</p>
                        <p className="text-2xl font-bold">{count}</p>
                      </div>
                      <div className={`p-3 rounded-full ${status.color.replace('text-', 'text-').replace('bg-', 'bg-')}`}>
                        {getStatusIcon(status.value)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Orders List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                All Orders ({orders.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <div>
                            <h3 className="font-semibold text-lg">Order #{order.id}</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                {order.user_id.substring(0, 8)}...
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {new Date(order.created_at).toLocaleDateString('en-GB')}
                              </span>
                              <span className="flex items-center gap-1">
                                <Package className="h-4 w-4" />
                                {getTotalItems(order.order_items)} items
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {getStatusBadge(order.status)}
                            <Badge variant="outline" className="flex items-center gap-1">
                              <CreditCard className="h-3 w-3" />
                              {order.payment_status?.charAt(0).toUpperCase() + order.payment_status?.slice(1)}
                            </Badge>
                          </div>
                        </div>

                        {/* Order Items Preview */}
                        <div className="flex gap-2 overflow-x-auto mb-2">
                          {order.order_items?.slice(0, 3).map((item, index) => (
                            <div key={index} className="flex-shrink-0 flex items-center gap-2 bg-white border rounded p-2 min-w-[200px]">
                              {item.parts?.image_url && (
                                <img 
                                  src={item.parts.image_url} 
                                  alt={item.parts.name}
                                  className="w-10 h-10 rounded object-cover"
                                />
                              )}
                              <div className="min-w-0">
                                <p className="text-sm font-medium truncate">
                                  {item.parts?.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Qty: {item.quantity} × {formatCurrency(item.price)}
                                </p>
                              </div>
                            </div>
                          ))}
                          {order.order_items && order.order_items.length > 3 && (
                            <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 bg-gray-100 border rounded text-xs text-gray-600">
                              +{order.order_items.length - 3}
                            </div>
                          )}
                        </div>

                        {order.tracking_number && (
                          <div className="flex items-center gap-1 text-sm text-blue-600">
                            <Truck className="h-4 w-4" />
                            Tracking: {order.tracking_number}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col lg:items-end gap-2">
                        <div className="text-right">
                          <p className="text-2xl font-bold">{formatCurrency(order.total_amount)}</p>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(order)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          
                          {/* Download Invoice Buttons for Paid Orders */}
                          {order.payment_status === 'paid' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDownloadInvoice(order.id)}
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              >
                                <Download className="h-4 w-4 mr-1" />
                                Admin Invoice
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(`/api/orders/${order.id}/invoice`, '_blank')}
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              >
                                <FileText className="h-4 w-4 mr-1" />
                                Customer Invoice
                              </Button>
                            </>
                          )}
                          
                          {/* Quick Payment Status Actions */}
                          {order.payment_status === 'pending' && (
                            <Button
                              size="sm"
                              onClick={() => handleStatusUpdate(order.id, order.status, 'paid', order.tracking_number || '', order.notes || '')}
                              className="bg-green-500 hover:bg-green-600 text-white"
                            >
                              Mark Paid
                            </Button>
                          )}
                          
                          {order.payment_status === 'paid' && order.status === 'pending' && (
                            <Button
                              size="sm"
                              onClick={() => handleStatusUpdate(order.id, order.status, 'pending', order.tracking_number || '', order.notes || '')}
                              className="bg-orange-500 hover:bg-orange-600 text-white"
                            >
                              Mark Unpaid
                            </Button>
                          )}
                          
                          {/* Quick Status Actions */}
                          {order.status === 'pending' && (
                            <Button
                              size="sm"
                              onClick={() => handleStatusUpdate(order.id, 'processing', order.payment_status, order.tracking_number || '', order.notes || '')}
                              className="bg-blue-500 hover:bg-blue-600"
                            >
                              Process
                            </Button>
                          )}
                          
                          {order.status === 'processing' && (
                            <Button
                              size="sm"
                              onClick={() => handleStatusUpdate(order.id, 'shipped', order.payment_status, order.tracking_number || '', order.notes || '')}
                              className="bg-purple-500 hover:bg-purple-600"
                            >
                              Ship
                            </Button>
                          )}
                          
                          {order.status === 'shipped' && (
                            <Button
                              size="sm"
                              onClick={() => handleStatusUpdate(order.id, 'delivered', order.payment_status, order.tracking_number || '', order.notes || '')}
                              className="bg-green-500 hover:bg-green-600"
                            >
                              Deliver
                            </Button>
                          )}
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(order.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Order Modal */}
      {isEditing && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Edit Order #{selectedOrder.id}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Order Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full p-2 border rounded-lg"
                  >
                    {ORDER_STATUSES.map(status => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Payment Status</label>
                  <select
                    value={editForm.payment_status}
                    onChange={(e) => setEditForm(prev => ({ ...prev, payment_status: e.target.value }))}
                    className="w-full p-2 border rounded-lg"
                  >
                    {PAYMENT_STATUSES.map(status => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Tracking Number</label>
                  <input
                    type="text"
                    value={editForm.tracking_number}
                    onChange={(e) => setEditForm(prev => ({ ...prev, tracking_number: e.target.value }))}
                    placeholder="Enter tracking number (optional)"
                    className="w-full p-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Notes</label>
                  <textarea
                    value={editForm.notes}
                    onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Add internal notes (optional)"
                    rows={3}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={() => handleStatusUpdate(
                      selectedOrder.id,
                      editForm.status,
                      editForm.payment_status,
                      editForm.tracking_number,
                      editForm.notes
                    )}
                    className="flex-1"
                  >
                    Update Order
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setSelectedOrder(null);
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </AdminLayout>
  );
}
