import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrustBadges, MoneyBackGuarantee } from "@/components/TrustBadges";
import { 
  Car, 
  Shield, 
  Users, 
  Award, 
  Clock, 
  MapPin, 
  Phone, 
  Mail,
  Star,
  CheckCircle,
  Truck,
  Heart
} from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="container mx-auto px-4 py-8 space-y-12">
      {/* Hero Section */}
      <section className="text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Car className="w-12 h-12 text-blue-600" />
          <h1 className="text-4xl font-bold text-gray-900">About RPM Genuine Auto Parts</h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Your trusted partner for genuine auto parts and accessories since our founding. 
          We're committed to keeping you on the road with quality parts, competitive prices, and exceptional service.
        </p>
      </section>

      {/* Trust Metrics */}
      <section className="bg-blue-50 rounded-2xl p-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">5,000+</div>
            <p className="text-gray-700">Satisfied Customers</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-green-600 mb-2">50,000+</div>
            <p className="text-gray-700">Parts Delivered</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-purple-600 mb-2">99.8%</div>
            <p className="text-gray-700">Customer Satisfaction</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-orange-600 mb-2">24/7</div>
            <p className="text-gray-700">Customer Support</p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-6">Our Story</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              RPM Genuine Auto Parts was founded with a simple mission: to make finding and purchasing 
              quality auto parts as easy and reliable as possible. We understand the frustration of 
              dealing with car repairs and the importance of getting the right part the first time.
            </p>
            <p>
              Based in Norwich, UK, we've built our reputation on providing genuine OEM and 
              high-quality aftermarket parts for all major vehicle makes and models. Our team 
              of automotive experts carefully curates every product in our catalog to ensure 
              it meets our strict quality standards.
            </p>
            <p>
              Whether you're a professional mechanic, a weekend DIY enthusiast, or someone who 
              just needs a replacement part, we're here to help you find exactly what you need 
              with confidence and peace of mind.
            </p>
          </div>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                To provide reliable access to genuine auto parts with exceptional customer service, 
                helping keep vehicles safe and roadworthy across the UK.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-600" />
                Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                To be the UK's most trusted online destination for auto parts, known for our 
                quality products, competitive prices, and outstanding customer experience.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Why Choose Us */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose RPM?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="text-center">
            <CardHeader>
              <CheckCircle className="w-12 h-12 mx-auto text-green-600 mb-4" />
              <CardTitle>Genuine Parts Only</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                We source directly from manufacturers and authorized distributors to guarantee 
                authenticity and quality. No counterfeit or substandard parts.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Truck className="w-12 h-12 mx-auto text-blue-600 mb-4" />
              <CardTitle>Fast Delivery</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Next-day delivery available across the UK. We understand urgency when your 
                vehicle is off the road, so we prioritize quick dispatch.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="w-12 h-12 mx-auto text-purple-600 mb-4" />
              <CardTitle>Expert Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Our knowledgeable team can help you find the right parts for your specific 
                vehicle. We're here to answer questions and provide guidance.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Shield className="w-12 h-12 mx-auto text-orange-600 mb-4" />
              <CardTitle>Quality Guarantee</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Every part comes with our quality guarantee. If it doesn't meet your 
                expectations, we'll make it right with our hassle-free return policy.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Award className="w-12 h-12 mx-auto text-red-600 mb-4" />
              <CardTitle>Competitive Prices</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                We work hard to offer competitive pricing without compromising on quality. 
                Great value for genuine parts you can trust.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Heart className="w-12 h-12 mx-auto text-pink-600 mb-4" />
              <CardTitle>Customer First</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Your satisfaction is our priority. We go the extra mile to ensure you have 
                a positive experience with every order and interaction.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Money Back Guarantee */}
      <section>
        <MoneyBackGuarantee className="max-w-4xl mx-auto" />
      </section>

      {/* Trust Badges */}
      <section>
        <h2 className="text-2xl font-bold text-center mb-8">Your Trust, Our Commitment</h2>
        <TrustBadges className="max-w-6xl mx-auto" />
      </section>

      {/* Contact Info */}
      <section className="bg-gray-50 rounded-2xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
          <p className="text-gray-600">
            Have questions? Need help finding a specific part? We're here to help.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <Card>
            <CardContent className="p-6">
              <MapPin className="w-8 h-8 mx-auto text-blue-600 mb-3" />
              <h3 className="font-semibold mb-2">Visit Us</h3>
              <p className="text-gray-600">Norwich, UK</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <Phone className="w-8 h-8 mx-auto text-green-600 mb-3" />
              <h3 className="font-semibold mb-2">Call Us</h3>
              <p className="text-gray-600">+44 7723832186</p>
              <p className="text-xs text-gray-500">(WhatsApp available)</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <Mail className="w-8 h-8 mx-auto text-purple-600 mb-3" />
              <h3 className="font-semibold mb-2">Email Us</h3>
              <p className="text-gray-600">support@rpmgenuineautoparts.info</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="text-center mt-8">
          <Button asChild size="lg">
            <Link href="/contact">Contact Us Today</Link>
          </Button>
        </div>
      </section>

      {/* Business Hours */}
      <section className="text-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Business Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Monday - Friday:</span>
                <span className="font-medium">9:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday:</span>
                <span className="font-medium">9:00 AM - 4:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday:</span>
                <span className="font-medium">Closed</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              * Online orders processed 24/7
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}