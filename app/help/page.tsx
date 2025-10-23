import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Phone, Mail, HelpCircle, Package, CreditCard, Truck, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function HelpCenterPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Help Center</h1>
          <p className="text-lg text-gray-600">
            Find answers to common questions or get in touch with our support team
          </p>
        </div>

        {/* Quick Contact */}
        <Card className="mb-8 border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-around gap-6">
              <div className="flex items-center gap-3">
                <Phone className="w-6 h-6 text-blue-600" />
                <div>
                  <div className="font-semibold">Call Us</div>
                  <div className="text-sm text-gray-600">+44 7723832186</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MessageCircle className="w-6 h-6 text-green-600" />
                <div>
                  <div className="font-semibold">WhatsApp</div>
                  <div className="text-sm text-gray-600">+44 7723832186</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-6 h-6 text-purple-600" />
                <div>
                  <div className="font-semibold">Email</div>
                  <div className="text-sm text-gray-600">support@rpmgenuineautoparts.info</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Categories */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Link href="/shipping">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-blue-600" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Learn about our shipping options, delivery times, and tracking your order.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/returns">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-green-600" />
                  Returns & Refunds
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Information about our 30-day return policy and refund process.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/warranty">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-purple-600" />
                  Warranty Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Details about our warranty coverage and how to make a warranty claim.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/contact">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-orange-600" />
                  Contact Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Get in touch with our customer service team for personalized assistance.
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Common Questions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5" />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">How do I track my order?</h3>
                <p className="text-gray-600">
                  Once your order ships, you'll receive a tracking number via email. You can also track your order 
                  on our <Link href="/track" className="text-blue-600 hover:underline">order tracking page</Link>.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">What payment methods do you accept?</h3>
                <p className="text-gray-600">
                  We accept PayPal and bank transfers. All payments are processed securely with SSL encryption.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Are your parts genuine?</h3>
                <p className="text-gray-600">
                  Yes, all our parts are genuine OEM or high-quality aftermarket parts from trusted manufacturers. 
                  We stand behind the quality of every product we sell.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">How long does shipping take?</h3>
                <p className="text-gray-600">
                  Standard delivery typically takes 3-5 business days within the UK. Express shipping options are 
                  also available for faster delivery. See our <Link href="/shipping" className="text-blue-600 hover:underline">shipping page</Link> for more details.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Can I return a part if it doesn't fit?</h3>
                <p className="text-gray-600">
                  Yes! We offer a 30-day return policy on all parts. Please see our <Link href="/returns" className="text-blue-600 hover:underline">returns policy</Link> for complete details.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Do you offer warranty on parts?</h3>
                <p className="text-gray-600">
                  Yes, all parts come with manufacturer warranty. Warranty periods vary by product. 
                  Visit our <Link href="/warranty" className="text-blue-600 hover:underline">warranty page</Link> for more information.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">How do I know which part fits my vehicle?</h3>
                <p className="text-gray-600">
                  Each product listing includes compatibility information. If you're unsure, please contact our 
                  support team with your vehicle details (make, model, year) and we'll help you find the right part.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">What if I receive a damaged or defective part?</h3>
                <p className="text-gray-600">
                  Contact us immediately at support@rpmgenuineautoparts.info or call +44 7723832186. 
                  We'll arrange a replacement or refund right away.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Still Need Help */}
        <Card className="mt-8 border-green-200 bg-green-50">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-semibold mb-2">Still Need Help?</h3>
            <p className="text-gray-600 mb-4">
              Our customer service team is here to assist you
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Contact Support
              </Link>
              <a 
                href="https://wa.me/447723832186"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                WhatsApp Us
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
