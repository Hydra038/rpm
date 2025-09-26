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
              <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white hover:text-blue-600">
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
                  Free shipping on orders over $50. Express delivery available nationwide.
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
