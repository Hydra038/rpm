'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Product {
  id: number;
  name: string;
  category: string;
  image_url: string;
  current_filename?: string;
  suggested_filename?: string;
}

interface UploadResult {
  success: boolean;
  filename?: string;
  path?: string;
  error?: string;
}

interface BatchUpdateResult {
  id: number;
  success: boolean;
  error?: string;
  data?: any;
}

export default function ImageManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<Record<number, boolean>>({});
  const [updating, setUpdating] = useState(false);
  const [uploadResults, setUploadResults] = useState<Record<number, UploadResult>>({});

  useEffect(() => {
    fetchImageData();
  }, []);

  const fetchImageData = async () => {
    try {
      const response = await fetch('/api/image-names');
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Failed to fetch image data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (productId: number, file: File) => {
    setUploading(prev => ({ ...prev, [productId]: true }));
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('productId', productId.toString());
      
      const product = products.find(p => p.id === productId);
      if (product?.category) {
        formData.append('category', product.category);
      }

      const response = await fetch('/api/admin/upload-image', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      setUploadResults(prev => ({
        ...prev,
        [productId]: result
      }));

      if (result.success) {
        // Update the product's image_url in local state
        setProducts(prev => prev.map(p => 
          p.id === productId 
            ? { ...p, image_url: result.path }
            : p
        ));
      }

    } catch (error) {
      console.error('Upload failed:', error);
      setUploadResults(prev => ({
        ...prev,
        [productId]: { success: false, error: 'Upload failed' }
      }));
    } finally {
      setUploading(prev => ({ ...prev, [productId]: false }));
    }
  };

  const handleBatchUpdate = async () => {
    setUpdating(true);
    
    try {
      // Get all products that have new image paths
      const updates = products
        .filter(p => p.image_url.startsWith('/images/products/'))
        .map(p => ({
          id: p.id,
          image_url: p.image_url
        }));

      if (updates.length === 0) {
        alert('No images to update. Please upload some images first.');
        return;
      }

      const response = await fetch('/api/admin/batch-update-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ updates }),
      });

      const result = await response.json();
      
      if (result.success) {
        alert(`Batch update completed: ${result.successCount} successful, ${result.errorCount} failed`);
        fetchImageData(); // Refresh data
      } else {
        alert('Batch update failed: ' + result.error);
      }

    } catch (error) {
      console.error('Batch update failed:', error);
      alert('Batch update failed');
    } finally {
      setUpdating(false);
    }
  };

  const getUploadedCount = () => {
    return products.filter(p => p.image_url.startsWith('/images/products/')).length;
  };

  if (loading) {
    return <div className="p-6">Loading products...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Image Management System</h1>
        
        <div className="flex gap-4 mb-6">
          <Card className="p-4">
            <div className="text-sm text-gray-600">Total Products</div>
            <div className="text-2xl font-bold">{products.length}</div>
          </Card>
          
          <Card className="p-4">
            <div className="text-sm text-gray-600">Images Uploaded</div>
            <div className="text-2xl font-bold text-green-600">{getUploadedCount()}</div>
          </Card>
          
          <Card className="p-4">
            <div className="text-sm text-gray-600">Remaining</div>
            <div className="text-2xl font-bold text-orange-600">
              {products.length - getUploadedCount()}
            </div>
          </Card>
        </div>

        <Button 
          onClick={handleBatchUpdate}
          disabled={updating || getUploadedCount() === 0}
          className="mb-6"
        >
          {updating ? 'Updating Database...' : `Update Database (${getUploadedCount()} images)`}
        </Button>
      </div>

      <div className="grid gap-4">
        {products.map((product) => (
          <Card key={product.id} className="p-4">
            <div className="flex gap-4 items-start">
              {/* Current Image */}
              <div className="w-24 h-24 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                <img 
                  src={product.image_url} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                  }}
                />
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm mb-1 truncate">
                  {product.name}
                </h3>
                <div className="text-xs text-gray-600 mb-2">
                  Category: {product.category} | ID: {product.id}
                </div>
                
                {/* Current Image Status */}
                <div className="text-xs mb-2">
                  {product.image_url.includes('unsplash') ? (
                    <span className="text-orange-600">📷 Stock Image</span>
                  ) : (
                    <span className="text-green-600">✅ Custom Image</span>
                  )}
                </div>

                {/* Suggested filename */}
                <div className="text-xs text-gray-500 mb-2">
                  Suggested: {product.suggested_filename}
                </div>

                {/* Upload Status */}
                {uploadResults[product.id] && (
                  <div className={`text-xs p-2 rounded mb-2 ${
                    uploadResults[product.id].success 
                      ? 'bg-green-50 text-green-700' 
                      : 'bg-red-50 text-red-700'
                  }`}>
                    {uploadResults[product.id].success 
                      ? `✅ Uploaded: ${uploadResults[product.id].filename}`
                      : `❌ Error: ${uploadResults[product.id].error}`
                    }
                  </div>
                )}
              </div>

              {/* Upload Section */}
              <div className="flex-shrink-0">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleFileUpload(product.id, file);
                    }
                  }}
                  disabled={uploading[product.id]}
                  className="hidden"
                  id={`file-${product.id}`}
                />
                <label 
                  htmlFor={`file-${product.id}`}
                  className={`inline-block px-3 py-1 text-xs rounded cursor-pointer ${
                    uploading[product.id]
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {uploading[product.id] ? 'Uploading...' : 'Upload Image'}
                </label>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}