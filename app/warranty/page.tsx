import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, CheckCircle, FileText, Clock, AlertCircle, Mail } from 'lucide-react';
import Link from 'next/link';

export default function WarrantyPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Warranty Information</h1>
          <p className="text-lg text-gray-600">
            Quality guaranteed - your parts are protected
          </p>
        </div>

        {/* Quick Overview */}
        <Card className="mb-8 border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <Shield className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-1">Manufacturer Warranty</h3>
                <p className="text-sm text-gray-600">All parts covered</p>
              </div>
              <div className="text-center">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-1">Genuine Parts</h3>
                <p className="text-sm text-gray-600">OEM quality guaranteed</p>
              </div>
              <div className="text-center">
                <Clock className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-1">12-24 Months</h3>
                <p className="text-sm text-gray-600">Standard coverage</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Warranty Coverage */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Warranty Coverage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-600">
                All parts sold by RPM Genuine Auto Parts come with a manufacturer's warranty that covers 
                defects in materials and workmanship. The warranty period varies by product and manufacturer.
              </p>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  What's Covered:
                </h4>
                <ul className="space-y-1 text-sm text-gray-600 ml-7 list-disc">
                  <li>Manufacturing defects in materials</li>
                  <li>Workmanship defects</li>
                  <li>Parts that fail under normal use</li>
                  <li>Premature wear due to defects</li>
                  <li>Functional failures not caused by misuse</li>
                </ul>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  What's Not Covered:
                </h4>
                <ul className="space-y-1 text-sm text-gray-600 ml-7 list-disc">
                  <li>Normal wear and tear</li>
                  <li>Damage from improper installation</li>
                  <li>Modifications or alterations</li>
                  <li>Accident or collision damage</li>
                  <li>Improper maintenance or use</li>
                  <li>Environmental damage (rust, corrosion from neglect)</li>
                  <li>Racing or competition use</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Warranty Periods */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Warranty Periods by Product Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold">Engine Parts</h4>
                    <p className="text-sm text-gray-600">Pistons, bearings, gaskets, seals</p>
                  </div>
                  <div className="text-blue-600 font-bold">12-24 Months</div>
                </div>
              </div>

              <div className="border-b pb-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold">Brake Components</h4>
                    <p className="text-sm text-gray-600">Pads, discs, calipers, drums</p>
                  </div>
                  <div className="text-blue-600 font-bold">12 Months</div>
                </div>
              </div>

              <div className="border-b pb-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold">Suspension Parts</h4>
                    <p className="text-sm text-gray-600">Shocks, struts, bushings, mounts</p>
                  </div>
                  <div className="text-blue-600 font-bold">12-24 Months</div>
                </div>
              </div>

              <div className="border-b pb-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold">Electrical Components</h4>
                    <p className="text-sm text-gray-600">Alternators, starters, sensors</p>
                  </div>
                  <div className="text-blue-600 font-bold">12 Months</div>
                </div>
              </div>

              <div className="border-b pb-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold">Filters & Fluids</h4>
                    <p className="text-sm text-gray-600">Oil, air, cabin filters, fluids</p>
                  </div>
                  <div className="text-blue-600 font-bold">6-12 Months</div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold">Body & Trim Parts</h4>
                    <p className="text-sm text-gray-600">Mirrors, handles, panels, lights</p>
                  </div>
                  <div className="text-blue-600 font-bold">12 Months</div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg mt-4">
                <p className="text-sm">
                  <strong>Note:</strong> Specific warranty periods are listed in the product description. 
                  Some premium parts may carry extended warranties up to 36 months.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How to Make a Claim */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              How to Make a Warranty Claim
            </CardTitle>
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
                    Email <a href="mailto:support@rpmgenuineautoparts.info" className="text-blue-600 hover:underline">support@rpmgenuineautoparts.info</a> or 
                    call +44 7723832186 with your order number and details about the issue.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Provide Documentation</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Please have the following ready:
                  </p>
                  <ul className="text-sm text-gray-600 list-disc ml-5 space-y-1">
                    <li>Original invoice/receipt</li>
                    <li>Part number and description</li>
                    <li>Photos of the defective part</li>
                    <li>Description of the problem</li>
                    <li>Installation date (if applicable)</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Evaluation</h4>
                  <p className="text-sm text-gray-600">
                    Our team will review your claim and may request additional information or photos. 
                    We typically respond within 24-48 hours.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Return Authorization</h4>
                  <p className="text-sm text-gray-600">
                    If approved, we'll provide a Return Authorization (RA) number and instructions for 
                    returning the defective part.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  5
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Replacement or Refund</h4>
                  <p className="text-sm text-gray-600">
                    Once we receive and verify the defective part, we'll send a replacement or 
                    process a full refund, including return shipping costs.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Terms */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Important Warranty Terms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Proof of Purchase Required</h4>
                <p className="text-sm text-gray-600">
                  You must provide the original invoice or order confirmation to validate your warranty claim.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Professional Installation Recommended</h4>
                <p className="text-sm text-gray-600">
                  We recommend having parts installed by a qualified mechanic. Improper installation may void the warranty.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Inspection May Be Required</h4>
                <p className="text-sm text-gray-600">
                  We reserve the right to inspect returned parts to verify warranty claims and determine the cause of failure.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Transferable Warranty</h4>
                <p className="text-sm text-gray-600">
                  If you sell your vehicle, the remaining warranty can be transferred to the new owner with proof of purchase.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Labor Costs Not Covered</h4>
                <p className="text-sm text-gray-600">
                  The warranty covers the cost of the part only. Labor, installation, towing, or other related costs are not included.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Extended Warranty */}
        <Card className="mb-8 border-purple-200 bg-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-600" />
              Extended Warranty Available
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Looking for extra peace of mind? Ask about our extended warranty options when placing your order.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Extended Coverage</h4>
                <ul className="text-sm text-gray-600 space-y-1 list-disc ml-5">
                  <li>Up to 36 months coverage</li>
                  <li>Additional protection</li>
                  <li>Priority claim handling</li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Premium Support</h4>
                <ul className="text-sm text-gray-600 space-y-1 list-disc ml-5">
                  <li>Dedicated support line</li>
                  <li>Faster replacements</li>
                  <li>Extended return period</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6 text-center">
            <Mail className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <h3 className="text-xl font-semibold mb-2">Need to Make a Warranty Claim?</h3>
            <p className="text-gray-600 mb-4">
              Our warranty team is ready to assist you
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
                Email Warranty Team
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
