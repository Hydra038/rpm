import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Eye, Lock, Users, Mail, Phone } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Shield className="w-10 h-10 text-blue-600" />
          <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>
        </div>
        <p className="text-lg text-gray-600">
          Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
        </p>
        <p className="text-sm text-gray-500 mt-2">Last updated: October 2025</p>
      </div>

      <div className="space-y-8">
        {/* Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-600" />
              Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              RPM Genuine Auto Parts ("we", "our", or "us") is committed to protecting your privacy and ensuring 
              the security of your personal information. This Privacy Policy explains how we collect, use, store, 
              and protect your information when you use our website and services.
            </p>
            <p>
              We comply with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018. 
              By using our website, you consent to the collection and use of your information as described in this policy.
            </p>
          </CardContent>
        </Card>

        {/* Information We Collect */}
        <Card>
          <CardHeader>
            <CardTitle>Information We Collect</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Personal Information</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>Name and contact details (email address, phone number)</li>
                <li>Billing and delivery addresses</li>
                <li>Payment information (processed securely by our payment providers)</li>
                <li>Order history and preferences</li>
                <li>Account credentials (encrypted passwords)</li>
                <li>Communication records (support messages, emails)</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">Technical Information</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>IP address and browser information</li>
                <li>Device type and operating system</li>
                <li>Website usage data and analytics</li>
                <li>Cookies and similar tracking technologies</li>
                <li>Page views and time spent on our website</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* How We Use Your Information */}
        <Card>
          <CardHeader>
            <CardTitle>How We Use Your Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>We use your personal information for the following purposes:</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Order Processing</h4>
                <ul className="text-sm space-y-1">
                  <li>• Process and fulfill your orders</li>
                  <li>• Send order confirmations and updates</li>
                  <li>• Handle payments and refunds</li>
                  <li>• Arrange delivery and shipping</li>
                </ul>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">Customer Service</h4>
                <ul className="text-sm space-y-1">
                  <li>• Respond to inquiries and support requests</li>
                  <li>• Provide technical assistance</li>
                  <li>• Handle returns and warranty claims</li>
                  <li>• Improve our products and services</li>
                </ul>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-2">Account Management</h4>
                <ul className="text-sm space-y-1">
                  <li>• Create and maintain your account</li>
                  <li>• Store your preferences and order history</li>
                  <li>• Enable wishlist functionality</li>
                  <li>• Provide personalized recommendations</li>
                </ul>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-900 mb-2">Legal & Security</h4>
                <ul className="text-sm space-y-1">
                  <li>• Comply with legal obligations</li>
                  <li>• Prevent fraud and security threats</li>
                  <li>• Enforce our terms of service</li>
                  <li>• Resolve disputes</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-green-600" />
              Data Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We take the security of your personal information seriously and implement appropriate 
              technical and organizational measures to protect it:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Lock className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                <h4 className="font-semibold mb-1">SSL Encryption</h4>
                <p className="text-sm text-gray-600">256-bit SSL encryption for all data transmission</p>
              </div>
              
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Shield className="w-8 h-8 mx-auto text-green-600 mb-2" />
                <h4 className="font-semibold mb-1">Secure Storage</h4>
                <p className="text-sm text-gray-600">Data stored in secure, access-controlled servers</p>
              </div>
              
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Users className="w-8 h-8 mx-auto text-purple-600 mb-2" />
                <h4 className="font-semibold mb-1">Access Control</h4>
                <p className="text-sm text-gray-600">Limited access on a need-to-know basis</p>
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm">
                <strong>Payment Security:</strong> We do not store your payment card details. 
                All payment processing is handled by PCI DSS compliant payment processors 
                (PayPal, Stripe) with bank-level security.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <Card>
          <CardHeader>
            <CardTitle>Your Data Protection Rights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Under UK GDPR, you have the following rights regarding your personal data:</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold">Right to Access</h4>
                    <p className="text-sm text-gray-600">Request copies of your personal data</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold">Right to Rectification</h4>
                    <p className="text-sm text-gray-600">Request correction of inaccurate data</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold">Right to Erasure</h4>
                    <p className="text-sm text-gray-600">Request deletion of your personal data</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold">Right to Portability</h4>
                    <p className="text-sm text-gray-600">Request transfer of your data</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold">Right to Object</h4>
                    <p className="text-sm text-gray-600">Object to processing of your data</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold">Right to Restrict</h4>
                    <p className="text-sm text-gray-600">Request restricted processing</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cookies */}
        <Card>
          <CardHeader>
            <CardTitle>Cookies and Tracking</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We use cookies and similar technologies to improve your browsing experience, 
              analyze website traffic, and provide personalized content.
            </p>
            
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold">Essential Cookies</h4>
                <p className="text-sm text-gray-600">
                  Required for basic website functionality, including shopping cart, 
                  account login, and security features.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold">Analytics Cookies</h4>
                <p className="text-sm text-gray-600">
                  Help us understand how visitors use our website to improve user experience 
                  and website performance.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold">Marketing Cookies</h4>
                <p className="text-sm text-gray-600">
                  Used to provide relevant advertisements and track the effectiveness 
                  of our marketing campaigns.
                </p>
              </div>
            </div>
            
            <p className="text-sm">
              You can control cookie settings through your browser preferences. 
              Note that disabling certain cookies may affect website functionality.
            </p>
          </CardContent>
        </Card>

        {/* Data Retention */}
        <Card>
          <CardHeader>
            <CardTitle>Data Retention</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              We retain your personal information only as long as necessary for the purposes 
              outlined in this policy or as required by law:
            </p>
            
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span><strong>Account Data:</strong> Retained while your account is active and for 3 years after closure</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">•</span>
                <span><strong>Order Records:</strong> Kept for 7 years for tax and legal purposes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600">•</span>
                <span><strong>Support Communications:</strong> Retained for 2 years for quality assurance</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600">•</span>
                <span><strong>Marketing Data:</strong> Retained until you opt out or for 3 years if inactive</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              If you have questions about this Privacy Policy or wish to exercise your data protection rights, 
              please contact us:
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
                <strong>Data Protection Officer:</strong> For specific data protection queries, 
                please email us with "Data Protection" in the subject line. We will respond 
                to all requests within 30 days as required by UK GDPR.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Updates */}
        <Card>
          <CardHeader>
            <CardTitle>Policy Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our 
              practices or for legal, operational, or regulatory reasons. We will notify you 
              of any significant changes by posting the updated policy on our website and 
              updating the "Last updated" date at the top of this page.
            </p>
            
            <p className="mt-4 text-sm text-gray-600">
              Your continued use of our website after any changes indicates your acceptance 
              of the updated Privacy Policy.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}