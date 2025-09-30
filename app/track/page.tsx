"use client";
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Package, Truck, CheckCircle, MapPin, Calendar, Clock, Phone, Mail } from 'lucide-react';
import { supabase } from '../../lib/supabase/client';

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

  // Auto-populate tracking number from URL
  useEffect(() => {
    const orderParam = searchParams.get('order');
    if (orderParam) {
      setTrackingNumber(orderParam);
      // Auto-track if we have a parameter
      setTimeout(() => {
        handleTrackOrder(orderParam);
      }, 100);
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

    try {
      // Search by tracking number
      const { data, error: orderError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            quantity,
            parts (
              name,
              image_url
            )
          )
        `)
        .eq('tracking_number', numberToTrack.toUpperCase().trim())
        .single();

      if (orderError || !data) {
        // Also try searching by order ID
        const { data: orderById, error: orderByIdError } = await supabase
          .from('orders')
          .select(`
            *,
            order_items (
              quantity,
              parts (
                name,
                image_url
              )
            )
          `)
          .eq('id', numberToTrack.trim())
          .single();

        if (orderByIdError || !orderById) {
          setError('Order not found. Please check your tracking number and try again.');
          return;
        }
        
        setOrderData(orderById);
        setTrackingEvents(generateTrackingEvents(orderById.status, orderById.created_at));
      } else {
        setOrderData(data);
        setTrackingEvents(generateTrackingEvents(data.status, data.created_at));
      }
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
    <main className="container mx-auto p-3 sm:p-4 max-w-4xl">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Track Your Order</h1>
        <p className="text-gray-600 text-sm sm:text-base">Enter your tracking number or order ID to see the latest updates</p>
      </div>

      {/* Tracking Input */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Track Your Package
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Enter tracking number or order ID (e.g., RPM123456789)"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value.toUpperCase())}
              className="flex-1 border rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[48px]"
              onKeyDown={(e) => e.key === 'Enter' && handleTrackOrder()}
            />
            <Button 
              onClick={() => handleTrackOrder()} 
              disabled={loading} 
              className="px-6 py-3 text-base font-medium min-h-[48px] w-full sm:w-auto sm:px-8"
              size="lg"
            >
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

      {/* Order Information */}
      {orderData && (
        <div className="space-y-4 sm:space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div>
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="font-semibold">{orderData.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tracking Number</p>
                  <p className="font-semibold">{orderData.tracking_number || 'Not assigned yet'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(orderData.status)}
                    <span className="font-semibold capitalize">{orderData.status.replace('_', ' ')}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Estimated Delivery</p>
                  <p className="font-semibold">
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
                  <div key={index} className="flex gap-3 sm:gap-4">
                    <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 flex items-center justify-center ${getStatusColor(event.status)}`}>
                      {getStatusIcon(event.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1 gap-1">
                        <h4 className="font-semibold capitalize text-sm sm:text-base">
                          {event.status.replace('_', ' ')}
                        </h4>
                        <span className="text-xs sm:text-sm text-gray-500 order-first sm:order-last">
                          {new Date(event.timestamp).toLocaleDateString('en-GB')} at{' '}
                          {new Date(event.timestamp).toLocaleTimeString('en-GB', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-1 text-sm sm:text-base leading-relaxed">{event.description}</p>
                      <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{event.location}</span>
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
                  <div key={index} className="flex items-center gap-3 sm:gap-4 p-3 border rounded-lg">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      {item.parts.image_url ? (
                        <img 
                          src={item.parts.image_url} 
                          alt={item.parts.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Package className="w-4 h-4 sm:w-6 sm:h-6 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm sm:text-base truncate">{item.parts.name}</h4>
                      <p className="text-xs sm:text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                ))}
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
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                  <p className="text-sm sm:text-base leading-relaxed">{orderData.shipping_address.address_line1}</p>
                  {orderData.shipping_address.address_line2 && (
                    <p className="text-sm sm:text-base leading-relaxed">{orderData.shipping_address.address_line2}</p>
                  )}
                  <p className="text-sm sm:text-base leading-relaxed">{orderData.shipping_address.city}</p>
                  <p className="text-sm sm:text-base leading-relaxed font-medium">{orderData.shipping_address.postcode}</p>
                  <p className="text-sm sm:text-base leading-relaxed text-gray-600">{orderData.shipping_address.country}</p>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="flex items-center gap-3 p-3 sm:p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <Phone className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-semibold text-blue-900 text-sm sm:text-base">Call Us</p>
                    <p className="text-blue-700 text-sm font-medium">0800 123 4567</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 sm:p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                  <Mail className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-semibold text-green-900 text-sm sm:text-base">Email Support</p>
                    <p className="text-green-700 text-sm break-all font-medium">support@rpm-parts.com</p>
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