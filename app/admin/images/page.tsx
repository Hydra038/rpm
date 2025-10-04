import { Metadata } from 'next';
import ImageManager from '@/components/ImageManager';

export const metadata: Metadata = {
  title: 'Image Management - Admin',
  description: 'Manage product images for the RPM Parts store',
};

export default function AdminImagesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ImageManager />
    </div>
  );
}