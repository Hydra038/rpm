import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Car, Wrench, Shield, Truck } from 'lucide-react';

export default function HomePage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-4">
              Auto Parts & Accessories Marketplace
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Find genuine parts for BMW, Mercedes, Honda, Toyota, Ford, and more. 
              Quality guaranteed with fast shipping.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-white text-blue-600 hover:bg-gray-100">
                <Link href="/products">
                  <Search className="w-5 h-5 mr-2" />
                  Browse Parts
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-white border-2 bg-transparent text-white hover:bg-white hover:text-blue-600">
                <Link href="/account">My Account</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose RPM?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We make finding the right auto parts simple, fast, and reliable for every vehicle.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardHeader>
                <Car className="w-12 h-12 mx-auto text-blue-600 mb-4" />
                <CardTitle>All Vehicle Types</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Parts for cars, trucks, motorcycles, and commercial vehicles from all major brands.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Shield className="w-12 h-12 mx-auto text-green-600 mb-4" />
                <CardTitle>Quality Guaranteed</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  All parts are genuine OEM or high-quality aftermarket with warranty protection.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Truck className="w-12 h-12 mx-auto text-orange-600 mb-4" />
                <CardTitle>Fast Shipping</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Fast and reliable delivery available nationwide.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Wrench className="w-12 h-12 mx-auto text-purple-600 mb-4" />
                <CardTitle>Expert Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Our automotive specialists help you find exactly what you need for your vehicle.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust Signals Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Trusted by Thousands</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join over 5,000+ satisfied customers who trust RPM for their automotive needs
            </p>
          </div>
          
          {/* Trust Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">5,000+</div>
              <p className="text-gray-600">Happy Customers</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">99.8%</div>
              <p className="text-gray-600">Customer Satisfaction</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
              <p className="text-gray-600">Customer Support</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">30-Day</div>
              <p className="text-gray-600">Money-Back Guarantee</p>
            </div>
          </div>

          {/* Customer Reviews */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-blue-50 border-blue-100">
              <CardContent className="p-6">
                <div className="flex items-center mb-3">
                  <div className="flex text-yellow-400">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                  </div>
                  <span className="ml-2 text-sm text-gray-600">5.0/5</span>
                </div>
                <blockquote className="text-gray-800 italic mb-3">
                  "Excellent service! Got my BMW brake pads delivered next day. Perfect fit and great quality. Will definitely order again!"
                </blockquote>
                <cite className="text-sm text-blue-600 font-medium">Sarah M., London</cite>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-100">
              <CardContent className="p-6">
                <div className="flex items-center mb-3">
                  <div className="flex text-yellow-400">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                  </div>
                  <span className="ml-2 text-sm text-gray-600">5.0/5</span>
                </div>
                <blockquote className="text-gray-800 italic mb-3">
                  "Needed urgent Ford parts for my van. RPM delivered within hours and saved my business. Professional service throughout."
                </blockquote>
                <cite className="text-sm text-green-600 font-medium">Mike T., Manchester</cite>
              </CardContent>
            </Card>

            <Card className="bg-purple-50 border-purple-100">
              <CardContent className="p-6">
                <div className="flex items-center mb-3">
                  <div className="flex text-yellow-400">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                  </div>
                  <span className="ml-2 text-sm text-gray-600">5.0/5</span>
                </div>
                <blockquote className="text-gray-800 italic mb-3">
                  "Amazing customer service! They helped me find the exact part I needed for my Honda. Quality is outstanding."
                </blockquote>
                <cite className="text-sm text-purple-600 font-medium">James R., Birmingham</cite>
              </CardContent>
            </Card>
          </div>

          {/* Security & Guarantees */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center border-2 border-green-200 bg-green-50">
              <CardHeader>
                <Shield className="w-16 h-16 mx-auto text-green-600 mb-4" />
                <CardTitle className="text-green-800">30-Day Money-Back Guarantee</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-green-700">
                  Wrong part or not satisfied? Get a full refund within 30 days - no questions asked.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 border-blue-200 bg-blue-50">
              <CardHeader>
                <svg className="w-16 h-16 mx-auto text-blue-600 mb-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <CardTitle className="text-blue-800">SSL Encrypted & Secure</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-700">
                  256-bit SSL encryption protects your personal and payment information at all times.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 border-orange-200 bg-orange-50">
              <CardHeader>
                <svg className="w-16 h-16 mx-auto text-orange-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <CardTitle className="text-orange-800">Genuine Parts Certified</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-orange-700">
                  All parts are OEM genuine or certified aftermarket. No counterfeit parts, ever.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Popular Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Popular Categories</h2>
            <p className="text-gray-600">Shop by category to find what you need quickly</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              'Engine Parts',
              'Brake System', 
              'Suspension',
              'Electrical',
              'Body Parts',
              'Interior',
              'Exhaust',
              'Filters'
            ].map((category) => (
              <Button
                key={category}
                variant="outline"
                asChild
                className="h-16 text-center font-medium text-gray-700 border-2 border-gray-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
              >
                <Link href={`/products?category=${category.toLowerCase().replace(' ', '%20')}`}>
                  {category}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Parts?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of satisfied customers who trust RPM for their automotive needs.
          </p>
          <Button size="lg" asChild className="bg-white text-blue-600 hover:bg-gray-100">
            <Link href="/products">
              Start Shopping Now
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
