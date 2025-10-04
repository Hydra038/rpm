'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function SmartImageUpdatePage() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [results, setResults] = useState(null);
  const [auditData, setAuditData] = useState(null);

  const runAudit = async () => {
    try {
      const response = await fetch('/api/admin/image-audit');
      const data = await response.json();
      setAuditData(data);
    } catch (error) {
      console.error('Audit failed:', error);
    }
  };

  const runSmartUpdate = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch('/api/admin/smart-image-update', {
        method: 'POST'
      });
      const data = await response.json();
      setResults(data);
      // Refresh audit data after update
      setTimeout(runAudit, 1000);
    } catch (error) {
      console.error('Update failed:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Smart Image Update System</h1>
      
      <div className="grid gap-6">
        {/* Controls */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Controls</h2>
          <div className="flex gap-4">
            <Button onClick={runAudit} variant="outline">
              Run Image Audit
            </Button>
            <Button 
              onClick={runSmartUpdate} 
              disabled={isUpdating}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isUpdating ? 'Updating...' : 'Run Smart Update'}
            </Button>
          </div>
        </Card>

        {/* Audit Results */}
        {auditData && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Image Audit Results</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded">
                <div className="text-2xl font-bold text-blue-600">{auditData.stats.totalProducts}</div>
                <div className="text-sm text-gray-600">Total Products</div>
              </div>
              <div className="bg-green-50 p-4 rounded">
                <div className="text-2xl font-bold text-green-600">{auditData.stats.totalPhysicalImages}</div>
                <div className="text-sm text-gray-600">Images Added</div>
              </div>
              <div className="bg-orange-50 p-4 rounded">
                <div className="text-2xl font-bold text-orange-600">{auditData.stats.productsWithUnsplash}</div>
                <div className="text-sm text-gray-600">Using Unsplash</div>
              </div>
              <div className="bg-purple-50 p-4 rounded">
                <div className="text-2xl font-bold text-purple-600">{auditData.stats.productsNeedingUpdate}</div>
                <div className="text-sm text-gray-600">Need Update</div>
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-3">Category Breakdown</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(auditData.categoryBreakdown).map(([category, info]) => (
                <div key={category} className="border rounded p-3">
                  <div className="font-semibold capitalize">{category}</div>
                  <div className="text-sm text-gray-600">
                    {info.filesAdded} images added
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {info.files.slice(0, 3).join(', ')}
                    {info.files.length > 3 && '...'}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Update Results */}
        {results && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Update Results</h2>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded">
                <div className="text-2xl font-bold text-green-600">{results.summary.successCount}</div>
                <div className="text-sm text-gray-600">Successful Updates</div>
              </div>
              <div className="bg-red-50 p-4 rounded">
                <div className="text-2xl font-bold text-red-600">{results.summary.errorCount}</div>
                <div className="text-sm text-gray-600">Failed Updates</div>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <div className="text-2xl font-bold text-gray-600">{results.summary.totalUpdates}</div>
                <div className="text-sm text-gray-600">Total Attempts</div>
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-3">Detailed Results</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {results.results.map((result, index) => (
                <div 
                  key={index} 
                  className={`p-3 rounded border-l-4 ${
                    result.success 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-red-500 bg-red-50'
                  }`}
                >
                  <div className="font-medium">{result.name}</div>
                  {result.success ? (
                    <>
                      <div className="text-sm text-gray-600">✅ Updated successfully</div>
                      <div className="text-xs text-gray-500 mt-1">
                        New: {result.newUrl}
                      </div>
                    </>
                  ) : (
                    <div className="text-sm text-red-600">❌ {result.error}</div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}