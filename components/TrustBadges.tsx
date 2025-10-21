"use client";
import { Shield, Lock, Star, Truck, RefreshCw, CheckCircle, Heart } from 'lucide-react';

interface TrustBadgeProps {
  variant?: 'horizontal' | 'vertical' | 'compact';
  showAll?: boolean;
  className?: string;
}

export function TrustBadges({ variant = 'horizontal', showAll = true, className = '' }: TrustBadgeProps) {
  const badges = [
    {
      icon: Shield,
      text: '30-Day Guarantee',
      color: 'text-green-600 bg-green-50',
      description: 'Money-back guarantee'
    },
    {
      icon: Star,
      text: '5,000+ Happy Customers',
      color: 'text-yellow-600 bg-yellow-50',
      description: '99.8% satisfaction rate'
    },
    {
      icon: Lock,
      text: 'SSL Secured',
      color: 'text-blue-600 bg-blue-50',
      description: 'Bank-level security'
    },
    {
      icon: Truck,
      text: 'Fast Delivery',
      color: 'text-purple-600 bg-purple-50',
      description: 'Next-day available'
    },
    {
      icon: CheckCircle,
      text: 'Genuine Parts Only',
      color: 'text-orange-600 bg-orange-50',
      description: 'OEM & high-quality aftermarket'
    },
    {
      icon: Heart,
      text: 'UK Based',
      color: 'text-red-600 bg-red-50',
      description: 'Local support team'
    }
  ];

  const displayBadges = showAll ? badges : badges.slice(0, 3);

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 text-xs ${className}`}>
        <div className="flex items-center gap-1 text-green-600">
          <Shield className="w-3 h-3" />
          <span>Guaranteed</span>
        </div>
        <div className="flex items-center gap-1 text-blue-600">
          <Lock className="w-3 h-3" />
          <span>Secure</span>
        </div>
        <div className="flex items-center gap-1 text-yellow-600">
          <Star className="w-3 h-3" />
          <span>5000+ Reviews</span>
        </div>
      </div>
    );
  }

  if (variant === 'vertical') {
    return (
      <div className={`space-y-3 ${className}`}>
        {displayBadges.map((badge, index) => (
          <div key={index} className={`flex items-center gap-3 p-3 rounded-lg ${badge.color}`}>
            <badge.icon className="w-5 h-5 flex-shrink-0" />
            <div>
              <div className="font-medium text-sm">{badge.text}</div>
              <div className="text-xs opacity-75">{badge.description}</div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 ${className}`}>
      {displayBadges.map((badge, index) => (
        <div key={index} className={`flex items-center gap-2 p-3 rounded-lg ${badge.color} text-center`}>
          <badge.icon className="w-4 h-4" />
          <span className="text-sm font-medium">{badge.text}</span>
        </div>
      ))}
    </div>
  );
}

export function SecurityBadges({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-4 text-sm ${className}`}>
      <div className="flex items-center gap-1 text-green-600">
        <Lock className="w-4 h-4" />
        <span>SSL Secured</span>
      </div>
      <div className="flex items-center gap-1 text-blue-600">
        <Shield className="w-4 h-4" />
        <span>256-bit Encryption</span>
      </div>
      <div className="text-gray-600">
        GDPR Compliant
      </div>
      <div className="text-gray-600">
        PCI DSS Certified
      </div>
    </div>
  );
}

export function MoneyBackGuarantee({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-green-50 border border-green-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="bg-green-100 p-2 rounded-full">
          <Shield className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h3 className="font-semibold text-green-900">30-Day Money-Back Guarantee</h3>
          <p className="text-green-700 text-sm">
            If the part doesn't fit or meet your expectations, we'll refund your purchase - no questions asked.
          </p>
        </div>
      </div>
    </div>
  );
}