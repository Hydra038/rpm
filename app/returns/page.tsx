import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, Package, CheckCircle, XCircle, AlertCircle, Mail } from 'lucide-react';
import Link from 'next/link';

export default function ReturnsPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Returns & Refunds Policy</h1>
          <p className="text-lg text-gray-600">
            We want you to be completely satisfied with your purchase
          </p>
        </div>

        {/* Quick Overview */}
        <Card className="mb-8 border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <RefreshCw className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-1">30-Day Returns</h3>
                <p className="text-sm text-gray-600">Free returns within 30 days</p>
              </div>
              <div className="text-center">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-1">Money-Back Guarantee</h3>
                <p className="text-sm text-gray-600">Full refund on eligible returns</p>
              </div>
              <div className="text-center">
                <Package className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-1">Easy Process</h3>
                <p className="text-sm text-gray-600">Simple return procedure</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Return Policy */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5" />
              Our Return Policy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-600">
                We offer a <strong>30-day money-back guarantee</strong> on all products. If you're not completely 
                satisfied with your purchase, you can return it for a full refund or exchange.
              </p>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Eligible for Return:
                </h4>
                <ul className="space-y-1 text-sm text-gray-600 ml-7 list-disc">
                  <li>Items in original, unused condition</li>
                  <li>Original packaging intact</li>
                  <li>All accessories and manuals included</li>
                  <li>Within 30 days of delivery</li>
                  <li>Proof of purchase (order number/receipt)</li>
                </ul>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-600" />
                  Not Eligible for Return:
                </h4>
                <ul className="space-y-1 text-sm text-gray-600 ml-7 list-disc">
                  <li>Items showing signs of installation or use</li>
                  <li>Electrical items with broken seals</li>
                  <li>Custom-ordered or specially made parts</li>
                  <li>Items damaged by customer misuse</li>
                  <li>Products past the 30-day return window</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How to Return */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>How to Return an Item</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Contact Us</h4>
                  <p className="text-sm text-gray-600">
                    Email us at <a href="mailto:support@rpmgenuineautoparts.info" className="text-blue-600 hover:underline">support@rpmgenuineautoparts.info</a> or 
                    call +44 7723832186 with your order number and reason for return.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Get Authorization</h4>
                  <p className="text-sm text-gray-600">
                    We'll provide you with a Return Authorization (RA) number and return shipping instructions.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Package the Item</h4>
                  <p className="text-sm text-gray-600">
                    Securely pack the item in its original packaging with all accessories. Include the RA number clearly visible.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Ship It Back</h4>
                  <p className="text-sm text-gray-600">
                    Send the package using a tracked shipping method to the address we provide. Keep your tracking number.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  5
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Receive Your Refund</h4>
                  <p className="text-sm text-gray-600">
                    Once we receive and inspect the item, we'll process your refund within 5-7 business days.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Refund Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Refund Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Refund Processing Time</h4>
                <p className="text-sm text-gray-600">
                  Refunds are processed within 5-7 business days after we receive and inspect the returned item. 
                  The refund will be issued to your original payment method.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Refund Methods</h4>
                <ul className="space-y-1 text-sm text-gray-600 ml-6 list-disc">
                  <li><strong>PayPal:</strong> Refunded to your PayPal account (2-3 days)</li>
                  <li><strong>Bank Transfer:</strong> Refunded to your bank account (5-7 days)</li>
                  <li><strong>Credit/Debit Card:</strong> Refunded to original card (5-10 days depending on bank)</li>
                </ul>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Partial Refunds</h4>
                <p className="text-sm text-gray-600 mb-2">
                  In some cases, only partial refunds are granted:
                </p>
                <ul className="space-y-1 text-sm text-gray-600 ml-6 list-disc">
                  <li>Items with obvious signs of use</li>
                  <li>Items not in original condition or damaged</li>
                  <li>Items missing parts not due to our error</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exchanges */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Exchanges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-600">
                If you need to exchange an item for a different one:
              </p>
              <ol className="space-y-2 text-sm text-gray-600 ml-6 list-decimal">
                <li>Follow the return process above to return the original item</li>
                <li>Place a new order for the replacement item</li>
                <li>Once we receive your return, we'll process the refund</li>
              </ol>
              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-sm">
                  <strong>Quick Tip:</strong> To get your replacement faster, you can place the new order 
                  while your return is in transit. Once we process your return, you'll receive the refund.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Damaged or Defective Items */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              Damaged or Defective Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-600">
                If you receive a damaged or defective item:
              </p>
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="font-semibold mb-2">Please contact us immediately!</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Email: <a href="mailto:support@rpmgenuineautoparts.info" className="text-blue-600 hover:underline">support@rpmgenuineautoparts.info</a></li>
                  <li>• Phone/WhatsApp: +44 7723832186</li>
                  <li>• Provide photos of the damage or defect</li>
                  <li>• Include your order number</li>
                </ul>
              </div>
              <p className="text-sm text-gray-600">
                We'll arrange for a replacement or full refund at no cost to you, including return shipping.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Shipping Costs */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Return Shipping Costs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    We Cover Shipping:
                  </h4>
                  <ul className="space-y-1 text-sm text-gray-600 list-disc ml-5">
                    <li>Damaged items</li>
                    <li>Defective products</li>
                    <li>Wrong item sent</li>
                    <li>Our shipping error</li>
                  </ul>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                    You Cover Shipping:
                  </h4>
                  <ul className="space-y-1 text-sm text-gray-600 list-disc ml-5">
                    <li>Change of mind</li>
                    <li>Ordered wrong part</li>
                    <li>No longer needed</li>
                    <li>Personal preference</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6 text-center">
            <Mail className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <h3 className="text-xl font-semibold mb-2">Need to Start a Return?</h3>
            <p className="text-gray-600 mb-4">
              Contact our customer service team to begin the return process
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Contact Support
              </Link>
              <a 
                href="mailto:support@rpmgenuineautoparts.info"
                className="inline-flex items-center justify-center px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <Mail className="w-5 h-5 mr-2" />
                Email Us
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
