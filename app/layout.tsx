import './globals.css';
import type { ReactNode } from 'react';
import { Navigation } from '@/components/Navigation';
import { GlobalLoadingProvider } from '@/components/GlobalLoadingProvider';

export const metadata = {
  title: 'RPM - Auto Parts Marketplace',
  description: 'Find genuine auto parts and accessories for all vehicle makes and models',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <GlobalLoadingProvider>
          <Navigation />
          <div className="pt-16">
            {children}
          </div>
        </GlobalLoadingProvider>
      </body>
    </html>
  );
}
