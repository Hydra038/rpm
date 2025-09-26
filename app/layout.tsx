import './globals.css';
import type { ReactNode } from 'react';
import { Navigation } from '../components/Navigation';

export const metadata = {
  title: 'RPM - Auto Parts Marketplace',
  description: 'Find genuine auto parts and accessories for all vehicle makes and models',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <Navigation />
        <div className="pt-16">
          {children}
        </div>
      </body>
    </html>
  );
}
