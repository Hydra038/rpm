import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Package, MapPin, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function ShippingPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Shipping Information</h1>
          <p className="text-lg text-gray-600">
            Fast, reliable delivery across the UK and beyond
          </p>
        </div>

        {/* Quick Overview */}
        <Card className="mb-8 border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <Truck className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-1">Fast Delivery</h3>
                <p className="text-sm text-gray-600">3-5 business days</p>
              </div>
              <div className="text-center">
                <Package className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-1">Secure Packaging</h3>
                <p className="text-sm text-gray-600">Safe & protected</p>
              </div>
              <div className="text-center">
                <CheckCircle className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-1">Order Tracking</h3>
                <p className="text-sm text-gray-600">Track every step</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shipping Options */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="w-5 h-5" />
              Shipping Options
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="border-b pb-6">
                <div className="mb-3">
                  <h3 className="font-semibold text-lg">Standard Delivery</h3>
                  <p className="text-gray-600">Royal Mail / DHL</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Estimated delivery: 3-5 business days</span>
                </div>
                <ul className="mt-3 space-y-1 text-sm text-gray-600 ml-6 list-disc">
                  <li>Monday to Friday delivery</li>
                  <li>Tracking number provided</li>
                  <li>Signature may be required</li>
                </ul>
              </div>

              <div className="border-b pb-6">
                <div className="mb-3">
                  <h3 className="font-semibold text-lg">Express Delivery</h3>
                  <p className="text-gray-600">DHL Express</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Estimated delivery: 1-2 business days</span>
                </div>
                <ul className="mt-3 space-y-1 text-sm text-gray-600 ml-6 list-disc">
                  <li>Next business day delivery available</li>
                  <li>Real-time tracking</li>
                  <li>Signature required</li>
                </ul>
              </div>

              <div>
                <div className="mb-3">
                  <h3 className="font-semibold text-lg">International Shipping</h3>
                  <p className="text-gray-600">DHL International / Courier</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Estimated delivery: 5-10 business days</span>
                </div>
                <ul className="mt-3 space-y-1 text-sm text-gray-600 ml-6 list-disc">
                  <li>Worldwide shipping available</li>
                  <li>Customs and duties may apply</li>
                  <li>Full tracking provided</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Processing Times */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Processing & Dispatch
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-600">
                Orders are typically processed and dispatched within 1-2 business days after payment confirmation.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Order Cut-off Times:</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Orders placed before 2:00 PM (Mon-Fri): Same day dispatch</li>
                  <li>• Orders placed after 2:00 PM: Next business day dispatch</li>
                  <li>• Weekend orders: Dispatched Monday</li>
                  <li>• Bank holidays: Next business day dispatch</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tracking */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Order Tracking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-600">
                Once your order ships, you'll receive:
              </p>
              <ul className="space-y-2 ml-6 list-disc text-gray-600">
                <li>Email confirmation with tracking number</li>
                <li>Link to track your package in real-time</li>
                <li>Estimated delivery date</li>
                <li>Delivery updates via email</li>
              </ul>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm font-semibold mb-2">Track Your Order:</p>
                <Link 
                  href="/track" 
                  className="inline-flex items-center text-blue-600 hover:underline"
                >
                  Visit our tracking page →
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Areas */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Delivery Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">UK Mainland</h4>
                <p className="text-gray-600 text-sm">
                  We deliver to all UK mainland addresses including England, Scotland, and Wales.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Highlands & Islands</h4>
                <p className="text-gray-600 text-sm">
                  Additional 1-2 days may be required for remote areas. Additional charges may apply.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Northern Ireland</h4>
                <p className="text-gray-600 text-sm">
                  Standard delivery available. Additional 1-2 days for delivery.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">International</h4>
                <p className="text-gray-600 text-sm">
                  We ship worldwide. Delivery times and costs vary by destination. Contact us for specific quotes.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Notes */}
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle>Important Information</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Delivery times are estimates and not guaranteed</li>
              <li>• Signature may be required for delivery</li>
              <li>• If you're not home, a delivery card will be left</li>
              <li>• Please ensure delivery address is correct during checkout</li>
              <li>• We're not responsible for delays caused by courier or customs</li>
              <li>• International orders may be subject to customs duties and taxes</li>
            </ul>
          </CardContent>
        </Card>

        {/* Need Help */}
        <Card className="mt-8 border-green-200 bg-green-50">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-semibold mb-2">Questions About Shipping?</h3>
            <p className="text-gray-600 mb-4">
              Our customer service team is here to help
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Contact Support
              </Link>
              <Link 
                href="/help"
                className="inline-flex items-center justify-center px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Visit Help Center
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
