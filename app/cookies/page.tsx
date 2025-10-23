import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cookie, Shield, Settings, Eye, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function CookiesPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Cookie className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">Cookie Policy</h1>
          <p className="text-lg text-gray-600">
            How we use cookies and similar technologies
          </p>
          <p className="text-sm text-gray-500 mt-2">Last Updated: October 23, 2025</p>
        </div>

        {/* Introduction */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>What Are Cookies?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Cookies are small text files that are placed on your device when you visit our website. 
              They help us provide you with a better experience by remembering your preferences, 
              keeping you signed in, and analyzing how you use our site.
            </p>
            <p className="text-gray-600">
              We use both first-party cookies (set by RPM Genuine Auto Parts) and third-party cookies 
              (set by our service providers) to enhance your shopping experience and improve our services.
            </p>
          </CardContent>
        </Card>

        {/* Types of Cookies */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Types of Cookies We Use
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Essential Cookies */}
              <div className="border-l-4 border-blue-600 pl-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">Essential Cookies</h3>
                    <p className="text-sm text-gray-500">Required for website functionality</p>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  These cookies are necessary for the website to function properly. They enable core 
                  functionality such as security, network management, and accessibility. You cannot 
                  opt out of these cookies.
                </p>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm font-semibold mb-2">Examples:</p>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4 list-disc">
                    <li>Authentication and session management</li>
                    <li>Shopping cart functionality</li>
                    <li>Security and fraud prevention</li>
                    <li>Load balancing and performance</li>
                  </ul>
                </div>
              </div>

              {/* Performance Cookies */}
              <div className="border-l-4 border-purple-600 pl-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">Performance Cookies</h3>
                    <p className="text-sm text-gray-500">Help us improve our website</p>
                  </div>
                  <Settings className="w-5 h-5 text-purple-600 flex-shrink-0" />
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  These cookies collect information about how visitors use our website, such as which 
                  pages are most popular and if users receive error messages. This helps us improve 
                  how our website works.
                </p>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm font-semibold mb-2">Examples:</p>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4 list-disc">
                    <li>Google Analytics for website analytics</li>
                    <li>Page load time monitoring</li>
                    <li>Error tracking and reporting</li>
                    <li>Traffic source analysis</li>
                  </ul>
                </div>
              </div>

              {/* Functional Cookies */}
              <div className="border-l-4 border-green-600 pl-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">Functional Cookies</h3>
                    <p className="text-sm text-gray-500">Remember your preferences</p>
                  </div>
                  <Eye className="w-5 h-5 text-green-600 flex-shrink-0" />
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  These cookies allow our website to remember choices you make (such as your username, 
                  language, or region) and provide enhanced, personalized features.
                </p>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm font-semibold mb-2">Examples:</p>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4 list-disc">
                    <li>Remembering login details</li>
                    <li>Saved vehicle information</li>
                    <li>Recently viewed products</li>
                    <li>Wishlist items</li>
                    <li>Language and region preferences</li>
                  </ul>
                </div>
              </div>

              {/* Targeting/Advertising Cookies */}
              <div className="border-l-4 border-orange-600 pl-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">Targeting/Advertising Cookies</h3>
                    <p className="text-sm text-gray-500">Show relevant advertisements</p>
                  </div>
                  <XCircle className="w-5 h-5 text-orange-600 flex-shrink-0" />
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  These cookies are used to deliver advertisements more relevant to you and your interests. 
                  They may be set by advertising partners through our site and used to build a profile of 
                  your interests.
                </p>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm font-semibold mb-2">Examples:</p>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4 list-disc">
                    <li>Google Ads and remarketing</li>
                    <li>Facebook Pixel</li>
                    <li>Social media sharing buttons</li>
                    <li>Product recommendation engines</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Third-Party Cookies */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Third-Party Services</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              We use third-party services that may set cookies on your device. These services help us 
              provide a better experience and include:
            </p>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Supabase</h4>
                <p className="text-sm text-gray-600">
                  Authentication and database services. Essential for account functionality and security.
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Vercel</h4>
                <p className="text-sm text-gray-600">
                  Hosting and performance optimization. Essential for website delivery and speed.
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Google Analytics</h4>
                <p className="text-sm text-gray-600">
                  Website analytics to understand how visitors use our site and improve user experience.
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Payment Processors</h4>
                <p className="text-sm text-gray-600">
                  Secure payment processing through Stripe and PayPal. Essential for checkout functionality.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cookie Duration */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>How Long Do Cookies Last?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Session Cookies</h4>
                <p className="text-sm text-gray-600">
                  These are temporary cookies that expire when you close your browser. They're used for 
                  essential functions like maintaining your shopping cart during your visit.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Persistent Cookies</h4>
                <p className="text-sm text-gray-600">
                  These remain on your device for a set period (typically 30 days to 2 years) or until 
                  you delete them. They remember your preferences and allow us to recognize you on return visits.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Managing Cookies */}
        <Card className="mb-8 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              How to Manage Cookies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              You have the right to decide whether to accept or reject cookies. You can exercise your 
              cookie preferences by:
            </p>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Browser Settings</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Most web browsers allow you to control cookies through their settings. You can set your 
                  browser to refuse cookies or delete certain cookies. Generally, you can find these settings 
                  in the "Options" or "Preferences" menu of your browser.
                </p>
                <div className="bg-white p-3 rounded-lg">
                  <p className="text-sm font-semibold mb-2">Browser-Specific Instructions:</p>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4 list-disc">
                    <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
                    <li><strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data</li>
                    <li><strong>Safari:</strong> Preferences → Privacy → Cookies and website data</li>
                    <li><strong>Edge:</strong> Settings → Cookies and site permissions → Cookies and site data</li>
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Opt-Out Tools</h4>
                <ul className="text-sm text-gray-600 space-y-2 ml-4 list-disc">
                  <li>
                    <strong>Google Analytics:</strong> Use the{' '}
                    <a 
                      href="https://tools.google.com/dlpage/gaoptout" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Google Analytics Opt-out Browser Add-on
                    </a>
                  </li>
                  <li>
                    <strong>Advertising:</strong> Visit{' '}
                    <a 
                      href="https://www.youronlinechoices.com/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Your Online Choices
                    </a>
                    {' '}to manage advertising cookies
                  </li>
                </ul>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>⚠️ Important:</strong> Blocking or deleting cookies may impact your experience on our 
                  website. Some features and services may not function properly without cookies, including 
                  the shopping cart, account login, and order processing.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Privacy Rights</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Under data protection laws (including GDPR and UK GDPR), you have rights regarding your 
              personal data, including data collected through cookies:
            </p>
            <ul className="space-y-2 text-sm text-gray-600 ml-6 list-disc">
              <li><strong>Right to Access:</strong> Request a copy of the personal data we hold about you</li>
              <li><strong>Right to Rectification:</strong> Request correction of inaccurate personal data</li>
              <li><strong>Right to Erasure:</strong> Request deletion of your personal data</li>
              <li><strong>Right to Restrict Processing:</strong> Request that we limit how we use your data</li>
              <li><strong>Right to Object:</strong> Object to processing of your personal data</li>
              <li><strong>Right to Data Portability:</strong> Request transfer of your data to another service</li>
            </ul>
          </CardContent>
        </Card>

        {/* Updates */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Changes to This Cookie Policy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              We may update this Cookie Policy from time to time to reflect changes in our practices or for 
              legal, operational, or regulatory reasons. We will notify you of any significant changes by 
              posting the updated policy on this page with a new "Last Updated" date. We encourage you to 
              review this policy periodically.
            </p>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-3">Questions About Cookies?</h3>
            <p className="text-gray-600 mb-4">
              If you have any questions about our use of cookies or this policy, please contact us:
            </p>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Email:</strong>{' '}
                <a 
                  href="mailto:support@rpmgenuineautoparts.info" 
                  className="text-blue-600 hover:underline"
                >
                  support@rpmgenuineautoparts.info
                </a>
              </p>
              <p><strong>Phone:</strong> +44 7723832186</p>
              <p><strong>WhatsApp:</strong> +44 7723832186</p>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link 
                href="/privacy"
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Read Privacy Policy
              </Link>
              <Link 
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
