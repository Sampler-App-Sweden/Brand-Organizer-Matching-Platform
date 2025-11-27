import React, { useEffect, useState, useRef } from 'react';
import { PackageIcon, PlusIcon, ImageIcon, XIcon, EditIcon, TrashIcon, GripIcon, Sparkles } from 'lucide-react';
import { Button } from '../Button';
// Types
interface ProductImage {
  id: string;
  url: string;
  file?: File;
}
interface SponsorshipProduct {
  id: string;
  name: string;
  images: ProductImage[];
  goals: string;
  quantity: number;
  unit: string;
  details?: string;
  status: 'online' | 'offline';
  order: number;
}
interface ProductSponsorshipManagerProps {
  initialProducts?: SponsorshipProduct[];
  onSave?: (products: SponsorshipProduct[]) => void;
}
export function ProductSponsorshipManager({
  initialProducts = [],
  onSave
}: ProductSponsorshipManagerProps) {
  const [products, setProducts] = useState<SponsorshipProduct[]>(initialProducts);
  const [editingProduct, setEditingProduct] = useState<SponsorshipProduct | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [draggedProduct, setDraggedProduct] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Form state
  const [formData, setFormData] = useState<Omit<SponsorshipProduct, 'id' | 'order'>>({
    name: '',
    images: [],
    goals: '',
    quantity: 0,
    unit: 'packs',
    details: '',
    status: 'online'
  });
  // Reset form when closing
  useEffect(() => {
    if (!isFormOpen) {
      setFormData({
        name: '',
        images: [],
        goals: '',
        quantity: 0,
        unit: 'packs',
        details: '',
        status: 'online'
      });
      setEditingProduct(null);
    }
  }, [isFormOpen]);
  // Set form data when editing
  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name,
        images: [...editingProduct.images],
        goals: editingProduct.goals,
        quantity: editingProduct.quantity,
        unit: editingProduct.unit,
        details: editingProduct.details || '',
        status: editingProduct.status
      });
      setIsFormOpen(true);
    }
  }, [editingProduct]);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'quantity' ? parseInt(value) || 0 : value
    });
  };
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newImages: ProductImage[] = [...formData.images];
    Array.from(files).forEach(file => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Only image files are allowed');
        return;
      }
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('Image size should not exceed 2MB');
        return;
      }
      // Limit to 5 images
      if (newImages.length >= 5) {
        alert('Maximum 5 images allowed');
        return;
      }
      const reader = new FileReader();
      reader.onload = e => {
        const url = e.target?.result as string;
        newImages.push({
          id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          url,
          file
        });
        setFormData({
          ...formData,
          images: newImages
        });
      };
      reader.readAsDataURL(file);
    });
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  const removeImage = (imageId: string) => {
    setFormData({
      ...formData,
      images: formData.images.filter(img => img.id !== imageId)
    });
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let updatedProducts: SponsorshipProduct[];
    if (editingProduct) {
      // Update existing product
      updatedProducts = products.map(p => p.id === editingProduct.id ? {
        ...formData,
        id: p.id,
        order: p.order
      } : p);
    } else {
      // Add new product
      const newProduct: SponsorshipProduct = {
        ...formData,
        id: `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        order: products.length
      };
      updatedProducts = [...products, newProduct];
    }
    setProducts(updatedProducts);
    setIsFormOpen(false);
    if (onSave) {
      onSave(updatedProducts);
    }
  };
  const handleDelete = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const updatedProducts = products.filter(p => p.id !== productId).map((p, index) => ({
        ...p,
        order: index
      }));
      setProducts(updatedProducts);
      if (onSave) {
        onSave(updatedProducts);
      }
    }
  };
  const handleDragStart = (productId: string) => {
    setDraggedProduct(productId);
  };
  const handleDragOver = (e: React.DragEvent, productId: string) => {
    e.preventDefault();
    if (!draggedProduct || draggedProduct === productId) return;
    // Reorder products
    const draggedIndex = products.findIndex(p => p.id === draggedProduct);
    const targetIndex = products.findIndex(p => p.id === productId);
    if (draggedIndex === -1 || targetIndex === -1) return;
    const updatedProducts = [...products];
    const [draggedItem] = updatedProducts.splice(draggedIndex, 1);
    updatedProducts.splice(targetIndex, 0, draggedItem);
    // Update order property
    const reorderedProducts = updatedProducts.map((p, index) => ({
      ...p,
      order: index
    }));
    setProducts(reorderedProducts);
  };
  const handleDragEnd = () => {
    if (draggedProduct && onSave) {
      onSave(products);
    }
    setDraggedProduct(null);
  };
  return <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 relative overflow-hidden">
      {/* Mystical decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-100 via-purple-200 to-indigo-100"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 opacity-30"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-50 rounded-full -ml-12 -mb-12 opacity-30"></div>
      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <PackageIcon className="h-5 w-5 text-indigo-600 mr-2" />
              Your Sponsorship Products
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Upload images, set goals, and sample quantities for each item.
            </p>
          </div>
          <Button variant="primary" className="mt-4 sm:mt-0 flex items-center bg-gradient-to-r from-green-500 to-green-600" onClick={() => setIsFormOpen(true)}>
            <PlusIcon className="h-4 w-4 mr-1" />
            Add New Product
          </Button>
        </div>
        {/* Product Form */}
        {isFormOpen && <div className="mb-8 bg-gray-50 p-6 rounded-lg border border-gray-200 relative">
            <div className="absolute -top-3 -left-3 w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
              <Sparkles className="h-3 w-3 text-indigo-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name*
                  </label>
                  <input type="text" name="name" required className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" value={formData.name} onChange={handleInputChange} />
                </div>
                {/* Image Upload */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Images (up to 5)
                  </label>
                  <div className="flex flex-wrap gap-3 mb-3">
                    {formData.images.map(image => <div key={image.id} className="relative h-24 w-24 rounded-md overflow-hidden border border-gray-200 group">
                        <img src={image.url} alt="Product" className="h-full w-full object-cover" />
                        <button type="button" onClick={() => removeImage(image.id)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <XIcon className="h-3 w-3" />
                        </button>
                      </div>)}
                    {formData.images.length < 5 && <button type="button" onClick={() => fileInputRef.current?.click()} className="h-24 w-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md text-gray-400 hover:text-gray-500 hover:border-gray-400 transition-colors">
                        <ImageIcon className="h-8 w-8 mb-1" />
                        <span className="text-xs">Add Image</span>
                      </button>}
                  </div>
                  <input type="file" ref={fileInputRef} accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                  <p className="text-xs text-gray-500">
                    Accepted formats: JPG, PNG, GIF. Max size: 2MB per image.
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sponsorship Goals*
                  </label>
                  <textarea name="goals" rows={3} required placeholder="e.g. brand awareness, sampling feedback, social media buzz" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" value={formData.goals} onChange={handleInputChange}></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sample Quantity*
                  </label>
                  <div className="flex">
                    <input type="number" name="quantity" min="1" required className="block w-full rounded-l-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" value={formData.quantity} onChange={handleInputChange} />
                    <select name="unit" className="block rounded-r-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border-l-0" value={formData.unit} onChange={handleInputChange}>
                      <option value="packs">packs</option>
                      <option value="boxes">boxes</option>
                      <option value="units">units</option>
                      <option value="bottles">bottles</option>
                      <option value="cans">cans</option>
                      <option value="samples">samples</option>
                      <option value="cups">cups</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select name="status" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" value={formData.status} onChange={handleInputChange}>
                    <option value="online">Online - Available</option>
                    <option value="offline">Offline - Hidden</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Details
                  </label>
                  <textarea name="details" rows={2} placeholder="Optional: shipping constraints, timeline, etc." className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" value={formData.details} onChange={handleInputChange}></textarea>
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" className="bg-gradient-to-r from-green-500 to-green-600">
                  {editingProduct ? 'Update Product' : 'Save Product'}
                </Button>
              </div>
            </form>
          </div>}
        {/* Products List */}
        {products.length === 0 ? <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <PackageIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No Products Yet
            </h3>
            <p className="text-gray-500 mb-4">
              Add your first sponsorship product to get started
            </p>
            <Button variant="primary" className="flex items-center mx-auto" onClick={() => setIsFormOpen(true)}>
              <PlusIcon className="h-4 w-4 mr-1" />
              Add New Product
            </Button>
          </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.sort((a, b) => a.order - b.order).map(product => <div key={product.id} className={`bg-white rounded-lg border overflow-hidden shadow-sm transition-all ${draggedProduct === product.id ? 'opacity-50 border-indigo-300' : 'border-gray-200'} hover:shadow-md hover:border-indigo-100`} draggable onDragStart={() => handleDragStart(product.id)} onDragOver={e => handleDragOver(e, product.id)} onDragEnd={handleDragEnd}>
                  {/* Product Card */}
                  <div className="relative">
                    {/* Drag handle */}
                    <div className="absolute top-2 left-2 cursor-move text-gray-400 hover:text-gray-600 z-10" title="Drag to reorder">
                      <GripIcon className="h-5 w-5" />
                    </div>
                    {/* Status indicator */}
                    <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs z-10 ${product.status === 'online' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {product.status === 'online' ? 'Online' : 'Hidden'}
                    </div>
                    {/* Image carousel (simplified - just showing first image) */}
                    <div className="h-40 bg-gray-100 relative overflow-hidden">
                      {product.images.length > 0 ? <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" /> : <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                          <PackageIcon className="h-12 w-12" />
                        </div>}
                      {/* Image count indicator */}
                      {product.images.length > 1 && <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full">
                          {product.images.length} images
                        </div>}
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 mb-1">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                        {product.goals}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          {product.quantity} {product.unit}
                        </span>
                        <div className="flex space-x-1">
                          <button onClick={() => setEditingProduct(product)} className="p-1 text-gray-500 hover:text-indigo-600 transition-colors" title="Edit">
                            <EditIcon className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleDelete(product.id)} className="p-1 text-gray-500 hover:text-red-600 transition-colors" title="Delete">
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Arcane border decoration */}
                  <div className="h-1 w-full bg-gradient-to-r from-transparent via-indigo-200 to-transparent"></div>
                </div>)}
          </div>}
      </div>
    </div>;
}