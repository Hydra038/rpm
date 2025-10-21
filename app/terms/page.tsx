import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Scale, Shield, AlertTriangle, Phone, Mail } from 'lucide-react';

export default function TermsPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-6">
          <FileText className="w-10 h-10 text-blue-600" />
          <h1 className="text-4xl font-bold text-gray-900">Terms of Service</h1>
        </div>
        <p className="text-lg text-gray-600">
          These terms govern your use of our website and services. Please read them carefully.
        </p>
        <p className="text-sm text-gray-500 mt-2">Last updated: October 2025</p>
      </div>

      <div className="space-y-8">
        {/* Agreement */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-blue-600" />
              Agreement to Terms
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              By accessing and using the RPM Genuine Auto Parts website ("Service"), you agree to be bound 
              by these Terms of Service ("Terms"). If you disagree with any part of these terms, then you 
              may not access the Service.
            </p>
            <p>
              These Terms apply to all visitors, users, and others who access or use the Service. 
              RPM Genuine Auto Parts ("Company", "we", "our", or "us") reserves the right to update 
              and change these Terms at any time without notice.
            </p>
          </CardContent>
        </Card>

        {/* Account Terms */}
        <Card>
          <CardHeader>
            <CardTitle>Account Registration and Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Account Creation</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>You must provide accurate, current, and complete information during registration</li>
                <li>You are responsible for safeguarding your account password</li>
                <li>You must be at least 18 years old to create an account</li>
                <li>One person or legal entity may maintain only one account</li>
                <li>You are responsible for all activities that occur under your account</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">Account Termination</h3>
              <p className="text-gray-700">
                We reserve the right to suspend or terminate your account at any time for violation 
                of these Terms, fraudulent activity, or any other reason we deem necessary to protect 
                our business or other users.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Products and Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Products and Orders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Product Information</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>We strive to display product information accurately</li>
                <li>Colors and images may vary slightly from actual products</li>
                <li>We reserve the right to limit quantities of any products</li>
                <li>All prices are in British Pounds (GBP) and include VAT where applicable</li>
                <li>We reserve the right to change prices without notice</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">Order Acceptance</h3>
              <p className="text-gray-700">
                Your receipt of an order confirmation does not signify our acceptance of your order. 
                We reserve the right to accept or decline your order for any reason, including 
                availability, errors in product information, or credit verification issues.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">Compatibility</h3>
              <p className="text-gray-700">
                You are responsible for ensuring that products you order are compatible with your vehicle. 
                While we provide assistance, we cannot guarantee compatibility. Please verify part numbers 
                and specifications before ordering.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Payment Terms */}
        <Card>
          <CardHeader>
            <CardTitle>Payment and Billing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Payment Methods</h4>
                <ul className="text-sm space-y-1">
                  <li>• PayPal payments</li>
                  <li>• Bank transfers (UK)</li>
                  <li>• IBAN transfers (International)</li>
                  <li>• Payment plans available</li>
                </ul>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">Payment Terms</h4>
                <ul className="text-sm space-y-1">
                  <li>• Payment due upon ordering</li>
                  <li>• 50% deposit option available</li>
                  <li>• Remaining balance due within 7 days</li>
                  <li>• Orders held until payment cleared</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm">
                <strong>Important:</strong> Orders not paid within the specified timeframe may be cancelled. 
                For payment plan orders, failure to pay the remaining balance within 7 days may result 
                in order cancellation and forfeiture of the deposit.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Shipping and Delivery */}
        <Card>
          <CardHeader>
            <CardTitle>Shipping and Delivery</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Delivery Information</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>Shipping is handled by DHL and other courier services</li>
                <li>Delivery times are estimates and not guaranteed</li>
                <li>You must provide accurate delivery address information</li>
                <li>Risk of loss passes to you upon delivery to the carrier</li>
                <li>Delivery confirmation may be required for high-value items</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">Failed Deliveries</h3>
              <p className="text-gray-700">
                If delivery fails due to incorrect address information or unavailability at the 
                delivery address, additional shipping charges may apply for redelivery attempts.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Returns and Refunds */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              Returns and Refunds
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-green-900 mb-2">30-Day Money-Back Guarantee</h3>
              <p className="text-green-800 text-sm">
                We offer a 30-day money-back guarantee on all products. If you're not satisfied 
                with your purchase, you can return it for a full refund within 30 days of delivery.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">Return Conditions</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>Items must be returned in original condition and packaging</li>
                <li>Return authorization required before sending items back</li>
                <li>Customer responsible for return shipping costs unless item is defective</li>
                <li>Refunds processed within 5-10 business days of receiving returned items</li>
                <li>Original shipping costs are non-refundable unless item is defective</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">Non-Returnable Items</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>Electrical components that have been installed</li>
                <li>Fluids, chemicals, and consumable items</li>
                <li>Custom-ordered or special-order parts</li>
                <li>Items damaged by misuse or normal wear</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Warranties */}
        <Card>
          <CardHeader>
            <CardTitle>Warranties and Disclaimers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Product Warranties</h3>
              <p className="text-gray-700 mb-2">
                Products sold through our website may be covered by manufacturer warranties. 
                Warranty terms vary by manufacturer and product type.
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>We pass through manufacturer warranties to customers</li>
                <li>Warranty claims must be processed according to manufacturer procedures</li>
                <li>We assist with warranty claims but are not responsible for manufacturer decisions</li>
                <li>Installation and labor costs are typically not covered by product warranties</li>
              </ul>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Disclaimer of Warranties
              </h3>
              <p className="text-red-800 text-sm">
                THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND. WE DISCLAIM ALL WARRANTIES, 
                EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, 
                AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED OR ERROR-FREE.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Limitation of Liability */}
        <Card>
          <CardHeader>
            <CardTitle>Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              IN NO EVENT SHALL RPM GENUINE AUTO PARTS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, 
              SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF 
              PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
            </p>
            
            <p>
              Our total liability to you for any damages shall not exceed the amount you paid 
              for the specific product or service that is the subject of the claim.
            </p>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm">
                <strong>Note:</strong> Some jurisdictions do not allow the exclusion or limitation 
                of certain damages, so some of the above limitations may not apply to you. 
                In such cases, our liability will be limited to the maximum extent permitted by law.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* User Conduct */}
        <Card>
          <CardHeader>
            <CardTitle>User Conduct and Prohibited Uses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>You agree not to use the Service:</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>For any unlawful purpose or to solicit unlawful acts</li>
                <li>To violate any international, federal, provincial, or state regulations or laws</li>
                <li>To infringe upon intellectual property rights</li>
                <li>To harass, abuse, or harm others</li>
                <li>To submit false or misleading information</li>
              </ul>
              
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>To transmit viruses or malicious code</li>
                <li>To collect or track personal information of others</li>
                <li>To spam, phish, or engage in similar activities</li>
                <li>To interfere with website security features</li>
                <li>To engage in automated data collection</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Intellectual Property */}
        <Card>
          <CardHeader>
            <CardTitle>Intellectual Property Rights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              The Service and its original content, features, and functionality are and will remain 
              the exclusive property of RPM Genuine Auto Parts and its licensors. The Service is 
              protected by copyright, trademark, and other laws.
            </p>
            
            <p>
              Our trademarks and trade dress may not be used in connection with any product or 
              service without our prior written consent.
            </p>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">User-Generated Content</h3>
              <p className="text-gray-700">
                By submitting content to our Service (reviews, comments, etc.), you grant us a 
                non-exclusive, royalty-free, perpetual, and worldwide license to use, reproduce, 
                modify, and distribute such content.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Governing Law */}
        <Card>
          <CardHeader>
            <CardTitle>Governing Law and Jurisdiction</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              These Terms shall be governed by and construed in accordance with the laws of 
              England and Wales, without regard to its conflict of law provisions.
            </p>
            
            <p>
              Any disputes arising out of or relating to these Terms or the Service shall be 
              subject to the exclusive jurisdiction of the courts of England and Wales.
            </p>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-gray-600">support@rpmgenuineautoparts.info</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-sm text-gray-600">+44 7723832186</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm">
                <strong>Business Address:</strong> Norwich, UK<br />
                <strong>Business Hours:</strong> Monday-Friday 9:00 AM - 6:00 PM, Saturday 9:00 AM - 4:00 PM
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Severability */}
        <Card>
          <CardHeader>
            <CardTitle>Severability and Changes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Severability</h3>
              <p className="text-gray-700">
                If any provision of these Terms is held to be unenforceable or invalid, such 
                provision will be changed and interpreted to accomplish the objectives of such 
                provision to the greatest extent possible under applicable law, and the remaining 
                provisions will continue in full force and effect.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">Changes to Terms</h3>
              <p className="text-gray-700">
                We reserve the right, at our sole discretion, to modify or replace these Terms 
                at any time. If a revision is material, we will try to provide at least 30 days 
                notice prior to any new terms taking effect.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}