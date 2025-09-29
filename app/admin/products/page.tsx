"use client";
import { useEffect, useState, useRef } from 'react';
import { fetchProducts } from '../../../lib/supabase/products';
import { supabase } from '../../../lib/supabase/client';
import AdminLayout from '../components/AdminLayout';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    stock_quantity: '',
    manufacturer: '',
    part_number: ''
  });
  const [message, setMessage] = useState('');

  async function loadProducts() {
    setLoading(true);
    const data = await fetchProducts({});
    setProducts(data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  const openModal = (product = null) => {
    setEditingProduct(product);
    setFormData(product ? {
      name: product.name || '',
      price: product.price?.toString() || '',
      category: product.category || '',
      description: product.description || '',
      stock_quantity: product.stock_quantity?.toString() || '',
      manufacturer: product.manufacturer || '',
      part_number: product.part_number || ''
    } : {
      name: '',
      price: '',
      category: '',
      description: '',
      stock_quantity: '',
      manufacturer: '',
      part_number: ''
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      price: '',
      category: '',
      description: '',
      stock_quantity: '',
      manufacturer: '',
      part_number: ''
    });
  };

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setMessage('');
    
    const productData = {
      name: formData.name,
      price: Number(formData.price),
      category: formData.category,
      description: formData.description || null,
      stock_quantity: Number(formData.stock_quantity) || 0,
      manufacturer: formData.manufacturer || null,
      part_number: formData.part_number || null
    };

    let error;
    if (editingProduct) {
      ({ error } = await supabase.from('parts').update(productData).eq('id', editingProduct.id));
    } else {
      ({ error } = await supabase.from('parts').insert(productData));
    }

    if (error) {
      setMessage(error.message);
    } else {
      setMessage(editingProduct ? 'Product updated!' : 'Product added!');
      closeModal();
      loadProducts();
    }
  }

  async function handleDelete(id: string) {
    setMessage('');
    const { error } = await supabase.from('parts').delete().eq('id', id);
    if (error) setMessage(error.message);
    else {
      setMessage('Product deleted!');
      loadProducts();
    }
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <button
            onClick={() => openModal()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Product
          </button>
        </div>

        {message && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
            {message}
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product: any) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{product.name}</div>
                      {product.part_number && (
                        <div className="text-sm text-gray-500">Part #{product.part_number}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                      {product.category?.replace('_', ' ')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${product.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.stock_quantity || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => openModal(product)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Draggable Modal */}
        {showModal && (
          <DraggableModal
            title={editingProduct ? 'Edit Product' : 'Add Product'}
            onClose={closeModal}
          >
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Part Number
                  </label>
                  <input
                    type="text"
                    value={formData.part_number}
                    onChange={(e) => setFormData(prev => ({ ...prev, part_number: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter part number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select category</option>
                    <option value="Engine Parts">Engine Parts</option>
                    <option value="Brake System">Brake System</option>
                    <option value="Suspension">Suspension</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Body Parts">Body Parts</option>
                    <option value="Interior">Interior</option>
                    <option value="Exhaust">Exhaust</option>
                    <option value="Filters">Filters</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Manufacturer
                  </label>
                  <input
                    type="text"
                    value={formData.manufacturer}
                    onChange={(e) => setFormData(prev => ({ ...prev, manufacturer: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter manufacturer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock_quantity}
                    onChange={(e) => setFormData(prev => ({ ...prev, stock_quantity: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter product description"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </DraggableModal>
        )}
      </div>
    </AdminLayout>
  );
}

// Draggable Modal Component
function DraggableModal({ 
  title, 
  children, 
  onClose 
}: { 
  title: string
  children: React.ReactNode
  onClose: () => void 
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const modalRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);

  // Initialize position to center
  useEffect(() => {
    if (modalRef.current) {
      const rect = modalRef.current.getBoundingClientRect();
      const centerX = (window.innerWidth - rect.width) / 2;
      const centerY = (window.innerHeight - rect.height) / 2;
      setPosition({ x: Math.max(0, centerX), y: Math.max(0, centerY) });
    }
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (dragRef.current && modalRef.current) {
      const rect = modalRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
      e.preventDefault();
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && modalRef.current) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      // Keep modal within viewport bounds
      const maxX = window.innerWidth - modalRef.current.offsetWidth;
      const maxY = window.innerHeight - modalRef.current.offsetHeight;
      
      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'grabbing';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [isDragging, dragOffset]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose}>
      <div 
        ref={modalRef}
        className="absolute bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          cursor: isDragging ? 'grabbing' : 'default'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div 
          ref={dragRef}
          className="px-6 py-4 border-b border-gray-200 bg-gray-50 cursor-grab active:cursor-grabbing flex items-center justify-between"
          onMouseDown={handleMouseDown}
        >
          <h3 className="text-lg font-semibold text-gray-900 select-none">
            {title}
          </h3>
          <div className="flex items-center gap-2">
            <div className="text-xs text-gray-500 select-none">
              Drag to move
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl font-bold leading-none"
            >
              ×
            </button>
          </div>
        </div>
        
        <div className="max-h-[75vh] overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
