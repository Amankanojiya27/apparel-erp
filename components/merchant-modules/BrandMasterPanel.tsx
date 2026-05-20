// File: components/merchant-modules/BrandMasterPanel.tsx
// Phase 1: Brand Master - Full CRUD Component

'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import type { BrandMaster } from '@/lib/merchant-types';
import { merchantStore } from '@/lib/merchant-store';

export function BrandMasterPanel() {
  const [brands, setBrands] = useState<BrandMaster[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState<BrandMaster | null>(null);
  const [formData, setFormData] = useState<Partial<BrandMaster>>({});

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = () => {
    setBrands(merchantStore.getAllBrands());
  };

  const handleCreate = () => {
    setEditingBrand(null);
    setFormData({
      status: 'active',
      labelType: 'woven',
      approvedVendors: [],
    });
    setShowForm(true);
  };

  const handleEdit = (brand: BrandMaster) => {
    setEditingBrand(brand);
    setFormData({ ...brand });
    setShowForm(true);
  };

  const handleDelete = (brandId: string) => {
    if (confirm('Are you sure you want to delete this brand?')) {
      setBrands(brands.filter(b => b.brandId !== brandId));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingBrand) {
      // Update existing
      merchantStore.updateBrand?.(editingBrand.brandId, formData);
    } else {
      // Create new
      merchantStore.createBrand(formData as Omit<BrandMaster, 'brandId' | 'createdAt'>);
    }
    
    setShowForm(false);
    setEditingBrand(null);
    setFormData({});
    loadBrands();
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingBrand(null);
    setFormData({});
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Brand Master</h2>
            <p className="text-sm text-slate-500">Manage brand and label information</p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Add Brand
          </Button>
        </CardHeader>
        <CardContent>
          {brands.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              No brands found. Create your first brand to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Brand Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Label Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Approved Vendors</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {brands.map((brand) => (
                    <tr key={brand.brandId} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm font-medium">{brand.brandName}</td>
                      <td className="px-4 py-3 text-sm capitalize">{brand.labelType.replace('_', ' ')}</td>
                      <td className="px-4 py-3 text-sm">{brand.approvedVendors.length} vendors</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          brand.status === 'active' ? 'bg-green-100 text-green-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {brand.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button variant="secondary" size="sm" onClick={() => handleEdit(brand)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="secondary" size="sm" onClick={() => handleDelete(brand.brandId)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="border-b border-slate-200 p-6">
              <h2 className="text-xl font-semibold">
                {editingBrand ? 'Edit Brand' : 'Create New Brand'}
              </h2>
              <p className="text-sm text-slate-500">
                {editingBrand ? 'Update brand information' : 'Add a new brand to the system'}
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Brand Name *</label>
                  <Input
                    required
                    value={formData.brandName || ''}
                    onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                    placeholder="e.g., XYZ Fashion"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Label Type *</label>
                  <select
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={formData.labelType || ''}
                    onChange={(e) => setFormData({ ...formData, labelType: e.target.value as any })}
                  >
                    <option value="woven">Woven</option>
                    <option value="printed">Printed</option>
                    <option value="hang_tag">Hang Tag</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Status *</label>
                  <select
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={formData.status || ''}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="border-t pt-4">
                <label className="mb-1 block text-sm font-medium text-slate-700">Brand Guidelines URL</label>
                <Input
                  value={formData.brandGuidelinesUrl || ''}
                  onChange={(e) => setFormData({ ...formData, brandGuidelinesUrl: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div className="border-t pt-4">
                <label className="mb-1 block text-sm font-medium text-slate-700">Approved Vendor IDs</label>
                <textarea
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                  rows={3}
                  value={formData.approvedVendors?.join(', ') || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    approvedVendors: e.target.value.split(',').map(v => v.trim()).filter(Boolean) 
                  })}
                  placeholder="Enter vendor IDs separated by commas"
                />
              </div>

              <div className="flex justify-end gap-3 border-t pt-4">
                <Button variant="secondary" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  {editingBrand ? 'Update Brand' : 'Create Brand'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
