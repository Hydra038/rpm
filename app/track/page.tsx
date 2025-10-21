"use client";
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Package, Truck, CheckCircle, MapPin, Calendar, Clock, Phone, Mail } from 'lucide-react';
import { formatCurrency } from '../../lib/currency';

interface TrackingEvent {
  status: string;
  location: string;
  timestamp: string;
  description: string;
}

interface OrderData {
  id: string;
  status: string;
  tracking_number: string;
  created_at: string;
  shipping_address: any;
  estimated_delivery: string;
  carrier: string;
  total_amount: number;
  order_items: Array<{
    quantity: number;
    price: number;
    parts: {
      name: string;
      image_url: string;
    };
  }>;
}

function TrackContent() {
  const searchParams = useSearchParams();
  const [trackingNumber, setTrackingNumber] = useState('');
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [trackingEvents, setTrackingEvents] = useState<TrackingEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  // Auto-populate tracking number from URL (but don't auto-search)
  useEffect(() => {
    const orderParam = searchParams.get('order');
    if (orderParam) {
      setTrackingNumber(orderParam);
      // Don't auto-search anymore - user must click "Track Order" button
      // This ensures tracking history is hidden until user actively searches
    }
  }, [searchParams]);

  const generateTrackingEvents = (status: string, createdAt: string): TrackingEvent[] => {
    const events: TrackingEvent[] = [];
    const baseDate = new Date(createdAt);

    // Order Placed
    events.push({
      status: 'placed',
      location: 'RPM Distribution Center',
      timestamp: baseDate.toISOString(),
      description: 'Order has been placed and payment confirmed'
    });

    if (['processing', 'shipped', 'delivered'].includes(status)) {
      // Processing
      const processingDate = new Date(baseDate.getTime() + 4 * 60 * 60 * 1000); // +4 hours
      events.push({
        status: 'processing',
        location: 'RPM Warehouse',
        timestamp: processingDate.toISOString(),
        description: 'Order is being picked and packed'
      });
    }

    if (['shipped', 'delivered'].includes(status)) {
      // Shipped
      const shippedDate = new Date(baseDate.getTime() + 24 * 60 * 60 * 1000); // +1 day
      events.push({
        status: 'shipped',
        location: 'RPM Distribution Center',
        timestamp: shippedDate.toISOString(),
        description: 'Package has been dispatched for delivery'
      });

      // In Transit
      const transitDate = new Date(baseDate.getTime() + 36 * 60 * 60 * 1000); // +1.5 days
      events.push({
        status: 'in_transit',
        location: 'Local Depot',
        timestamp: transitDate.toISOString(),
        description: 'Package is in transit to your location'
      });
    }

    if (status === 'delivered') {
      // Delivered
      const deliveredDate = new Date(baseDate.getTime() + 48 * 60 * 60 * 1000); // +2 days
      events.push({
        status: 'delivered',
        location: 'Customer Address',
        timestamp: deliveredDate.toISOString(),
        description: 'Package has been delivered successfully'
      });
    }

    return events.reverse(); // Most recent first
  };

  const handleTrackOrder = async (orderNumber?: string) => {
    const numberToTrack = orderNumber || trackingNumber;
    if (!numberToTrack.trim()) {
      setError('Please enter a tracking number');
      return;
    }

    setLoading(true);
    setError('');
    setOrderData(null);
    setTrackingEvents([]);
    setHasSearched(true);

    try {
      // Use API route which has service role access (bypasses RLS)
      const response = await fetch(`/api/tracking?tracking=${encodeURIComponent(numberToTrack.trim())}`);
      
      if (!response.ok) {
        // Try with order ID if tracking number fails
        const orderIdResponse = await fetch(`/api/tracking?order=${encodeURIComponent(numberToTrack.trim())}`);
        
        if (!orderIdResponse.ok) {
          setError('Order not found. Please check your tracking number and try again.');
          return;
        }
        
        const { order: orderById } = await orderIdResponse.json();
        if (!orderById) {
          setError('Order not found. Please check your tracking number and try again.');
          return;
        }
        
        setOrderData(orderById);
        setTrackingEvents(generateTrackingEvents(orderById.status, orderById.created_at));
        return;
      }
      
      const { order } = await response.json();
      if (!order) {
        setError('Order not found. Please check your tracking number and try again.');
        return;
      }
      
      setOrderData(order);
      setTrackingEvents(generateTrackingEvents(order.status, order.created_at));
    } catch (err) {
      setError('Failed to track order. Please try again.');
      console.error('Tracking error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'placed':
        return <Package className="w-5 h-5 text-blue-600" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-orange-600" />;
      case 'shipped':
      case 'in_transit':
        return <Truck className="w-5 h-5 text-purple-600" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      default:
        return <Package className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'placed':
        return 'border-blue-600 bg-blue-50';
      case 'processing':
        return 'border-orange-600 bg-orange-50';
      case 'shipped':
      case 'in_transit':
        return 'border-purple-600 bg-purple-50';
      case 'delivered':
        return 'border-green-600 bg-green-50';
      default:
        return 'border-gray-600 bg-gray-50';
    }
  };

  return (
    <main className="container mx-auto p-4 max-w-4xl">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Track Your Order</h1>
        <p className="text-gray-600 text-sm md:text-base">Enter your tracking number or order ID to see the latest updates</p>
      </div>

      {/* Tracking Input */}
      <Card className="mb-6 md:mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <Search className="w-5 h-5" />
            Track Your Package
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <input
              type="text"
              placeholder="Enter tracking number or order ID"
              value={trackingNumber}
              onChange={(e) => {
                setTrackingNumber(e.target.value.toUpperCase());
                // Reset search state when input is cleared
                if (e.target.value.trim() === '') {
                  setHasSearched(false);
                  setOrderData(null);
                  setTrackingEvents([]);
                  setError('');
                }
              }}
              className="flex-1 border rounded-md px-3 md:px-4 py-2 md:py-3 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyDown={(e) => e.key === 'Enter' && handleTrackOrder()}
            />
            <Button onClick={() => handleTrackOrder()} disabled={loading} className="px-6 md:px-8 py-2 md:py-3 text-sm md:text-base">
              {loading ? 'Tracking...' : 'Track Order'}
            </Button>
          </div>
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {/* No Results Message - Only show after search with no results */}
      {hasSearched && !orderData && !loading && !error && (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Order Found</h3>
            <p className="text-gray-600">
              We couldn't find an order with that tracking number. Please check your tracking number and try again.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Initial State Message - Show when no search has been performed */}
      {!hasSearched && !loading && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <Package className="w-20 h-20 mx-auto mb-6 text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Ready to Track Your Order?</h3>
              <p className="text-gray-600 mb-6">
                Enter your tracking number or order ID above to see real-time updates on your package delivery status.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Tip:</strong> Your tracking number starts with "RPM" followed by numbers (e.g., RPM123456789)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Order Information - Only show after search */}
      {hasSearched && orderData && (
        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs md:text-sm text-gray-600">Order ID</p>
                  <p className="font-semibold text-sm md:text-base">#{orderData.id}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs md:text-sm text-gray-600">Tracking Number</p>
                  <p className="font-semibold text-sm md:text-base break-all">{orderData.tracking_number || 'Not assigned yet'}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs md:text-sm text-gray-600">Status</p>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(orderData.status)}
                    <span className="font-semibold capitalize text-sm md:text-base">{orderData.status.replace('_', ' ')}</span>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs md:text-sm text-gray-600">Estimated Delivery</p>
                  <p className="font-semibold text-sm md:text-base">
                    {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short'
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tracking Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Tracking History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trackingEvents.map((event, index) => (
                  <div key={index} className="flex gap-3 md:gap-4">
                    <div className={`flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full border-2 flex items-center justify-center ${getStatusColor(event.status)}`}>
                      {getStatusIcon(event.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1 gap-1">
                        <h4 className="font-semibold capitalize text-sm md:text-base">
                          {event.status.replace('_', ' ')}
                        </h4>
                        <span className="text-xs md:text-sm text-gray-500 order-first sm:order-last">
                          {new Date(event.timestamp).toLocaleDateString('en-GB')} at{' '}
                          {new Date(event.timestamp).toLocaleTimeString('en-GB', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-1 text-xs md:text-sm">{event.description}</p>
                      <div className="flex items-center gap-1 text-xs md:text-sm text-gray-500">
                        <MapPin className="w-3 h-3" />
                        {event.location}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Items in this Order</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orderData.order_items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      {item.parts.image_url ? (
                        <img 
                          src={item.parts.image_url} 
                          alt={item.parts.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Package className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{item.parts.name}</h4>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      <p className="text-sm font-semibold text-blue-600">
                        {formatCurrency(item.price)} each
                      </p>
                      <p className="text-sm text-gray-700 mt-1">
                        Subtotal: <span className="font-semibold">{formatCurrency(item.price * item.quantity)}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Order Total */}
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Order Total:</span>
                  <span className="text-xl font-bold text-blue-600">{formatCurrency(orderData.total_amount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Address */}
          {orderData.shipping_address && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p>{orderData.shipping_address.address_line1}</p>
                  {orderData.shipping_address.address_line2 && (
                    <p>{orderData.shipping_address.address_line2}</p>
                  )}
                  <p>{orderData.shipping_address.city}</p>
                  <p>{orderData.shipping_address.postcode}</p>
                  <p>{orderData.shipping_address.country}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-start sm:items-center gap-3 p-3 md:p-4 bg-blue-50 rounded-lg">
                  <Phone className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1 sm:mt-0" />
                  <div>
                    <p className="font-semibold text-blue-900 text-sm md:text-base">WhatsApp Only</p>
                    <p className="text-blue-700 text-sm md:text-base break-all">+44 7723832186</p>
                    <p className="text-xs text-blue-600">WhatsApp messages only</p>
                  </div>
                </div>
                <div className="flex items-start sm:items-center gap-3 p-3 md:p-4 bg-green-50 rounded-lg">
                  <Mail className="w-5 h-5 text-green-600 flex-shrink-0 mt-1 sm:mt-0" />
                  <div>
                    <p className="font-semibold text-green-900 text-sm md:text-base">Email Support</p>
                    <p className="text-green-700 text-sm md:text-base break-all">support@rpmgenuineautoparts.info</p>
                  </div>
                </div>
                <div className="flex items-start sm:items-center gap-3 p-3 md:p-4 bg-purple-50 rounded-lg">
                  <svg className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1 sm:mt-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <div>
                    <p className="font-semibold text-purple-900 text-sm md:text-base">Facebook</p>
                    <a href="https://web.facebook.com/profile.php?id=61563129454615" target="_blank" rel="noopener noreferrer" className="text-purple-700 hover:underline text-sm md:text-base">
                      Visit our page
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  );
}

export default function OrderTrackingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TrackContent />
    </Suspense>
  );
}