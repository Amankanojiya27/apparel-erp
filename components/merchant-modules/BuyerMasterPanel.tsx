// File: components/merchant-modules/BuyerMasterPanel.tsx
// Phase 1: Buyer Master - Full CRUD Component

'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import type { BuyerMaster } from '@/lib/merchant-types';
import { merchantStore } from '@/lib/merchant-store';

export function BuyerMasterPanel() {
  const [buyers, setBuyers] = useState<BuyerMaster[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBuyer, setEditingBuyer] = useState<BuyerMaster | null>(null);
  const [formData, setFormData] = useState<Partial<BuyerMaster>>({});

  useEffect(() => {
    loadBuyers();
  }, []);

  const loadBuyers = () => {
    setBuyers(merchantStore.getAllBuyers());
  };

  const handleCreate = () => {
    setEditingBuyer(null);
    setFormData({
      status: 'active',
      paymentTerms: '30 days',
      incoterms: 'FOB',
      buyerCategory: 'Export',
      creditLimit: 0,
      documentRequirements: [],
    });
    setShowForm(true);
  };

  const handleEdit = (buyer: BuyerMaster) => {
    setEditingBuyer(buyer);
    setFormData({ ...buyer });
    setShowForm(true);
  };

  const handleDelete = (buyerId: string) => {
    if (confirm('Are you sure you want to delete this buyer?')) {
      merchantStore.deleteBuyer(buyerId);
      loadBuyers();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingBuyer) {
      // Update existing
      merchantStore.updateBuyer(editingBuyer.buyerId, formData);
    } else {
      // Create new
      merchantStore.createBuyer(formData as Omit<BuyerMaster, 'buyerId' | 'createdAt' | 'updatedAt'>);
    }
    
    setShowForm(false);
    setEditingBuyer(null);
    setFormData({});
    loadBuyers();
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingBuyer(null);
    setFormData({});
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Buyer Master</h2>
            <p className="text-sm text-slate-500">Manage buyer information and onboarding</p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Add Buyer
          </Button>
        </CardHeader>
        <CardContent>
          {buyers.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              No buyers found. Create your first buyer to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Code</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Country</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Currency</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Payment Terms</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {buyers.map((buyer) => (
                    <tr key={buyer.buyerId} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm font-medium">{buyer.buyerCode}</td>
                      <td className="px-4 py-3 text-sm">{buyer.buyerName}</td>
                      <td className="px-4 py-3 text-sm">{buyer.country}</td>
                      <td className="px-4 py-3 text-sm">{buyer.currency}</td>
                      <td className="px-4 py-3 text-sm">{buyer.buyerCategory}</td>
                      <td className="px-4 py-3 text-sm">{buyer.paymentTerms}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          buyer.status === 'active' ? 'bg-green-100 text-green-700' :
                          buyer.status === 'inactive' ? 'bg-slate-100 text-slate-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {buyer.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button variant="secondary" size="sm" onClick={() => handleEdit(buyer)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="secondary" size="sm" onClick={() => handleDelete(buyer.buyerId)}>
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
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="border-b border-slate-200 p-6">
              <h2 className="text-xl font-semibold">
                {editingBuyer ? 'Edit Buyer' : 'Create New Buyer'}
              </h2>
              <p className="text-sm text-slate-500">
                {editingBuyer ? 'Update buyer information' : 'Add a new buyer to the system'}
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Buyer Code *</label>
                  <Input
                    required
                    value={formData.buyerCode || ''}
                    onChange={(e) => setFormData({ ...formData, buyerCode: e.target.value })}
                    placeholder="e.g., BUY-001"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Buyer Name *</label>
                  <Input
                    required
                    value={formData.buyerName || ''}
                    onChange={(e) => setFormData({ ...formData, buyerName: e.target.value })}
                    placeholder="e.g., ABC Retail Ltd"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Country *</label>
                  <Input
                    required
                    value={formData.country || ''}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="e.g., United States"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Currency *</label>
                  <Input
                    required
                    value={formData.currency || ''}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    placeholder="e.g., USD"
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="mb-3 font-medium">Contact Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Contact Name *</label>
                    <Input
                      required
                      value={formData.contactDetails?.name || ''}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        contactDetails: { ...formData.contactDetails, name: e.target.value } as any 
                      })}
                      placeholder="Contact person name"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Email *</label>
                    <Input
                      required
                      type="email"
                      value={formData.contactDetails?.email || ''}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        contactDetails: { ...formData.contactDetails, email: e.target.value } as any 
                      })}
                      placeholder="contact@buyer.com"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Phone *</label>
                    <Input
                      required
                      value={formData.contactDetails?.phone || ''}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        contactDetails: { ...formData.contactDetails, phone: e.target.value } as any 
                      })}
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Designation</label>
                    <Input
                      value={formData.contactDetails?.designation || ''}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        contactDetails: { ...formData.contactDetails, designation: e.target.value } as any 
                      })}
                      placeholder="Purchasing Manager"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="mb-3 font-medium">Billing Address</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="mb-1 block text-sm font-medium text-slate-700">Address Line 1 *</label>
                    <Input
                      required
                      value={formData.billingAddress?.addressLine1 || ''}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        billingAddress: { ...formData.billingAddress, addressLine1: e.target.value } as any 
                      })}
                      placeholder="Street address"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="mb-1 block text-sm font-medium text-slate-700">Address Line 2</label>
                    <Input
                      value={formData.billingAddress?.addressLine2 || ''}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        billingAddress: { ...formData.billingAddress, addressLine2: e.target.value } as any 
                      })}
                      placeholder="Apartment, suite, etc."
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">City *</label>
                    <Input
                      required
                      value={formData.billingAddress?.city || ''}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        billingAddress: { ...formData.billingAddress, city: e.target.value } as any 
                      })}
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">State *</label>
                    <Input
                      required
                      value={formData.billingAddress?.state || ''}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        billingAddress: { ...formData.billingAddress, state: e.target.value } as any 
                      })}
                      placeholder="State"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">ZIP Code *</label>
                    <Input
                      required
                      value={formData.billingAddress?.zipCode || ''}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        billingAddress: { ...formData.billingAddress, zipCode: e.target.value } as any 
                      })}
                      placeholder="12345"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Country *</label>
                    <Input
                      required
                      value={formData.billingAddress?.country || ''}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        billingAddress: { ...formData.billingAddress, country: e.target.value } as any 
                      })}
                      placeholder="Country"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="mb-3 font-medium">Shipping Address</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="mb-1 block text-sm font-medium text-slate-700">Address Line 1 *</label>
                    <Input
                      required
                      value={formData.shippingAddress?.addressLine1 || ''}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        shippingAddress: { ...formData.shippingAddress, addressLine1: e.target.value } as any 
                      })}
                      placeholder="Street address"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="mb-1 block text-sm font-medium text-slate-700">Address Line 2</label>
                    <Input
                      value={formData.shippingAddress?.addressLine2 || ''}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        shippingAddress: { ...formData.shippingAddress, addressLine2: e.target.value } as any 
                      })}
                      placeholder="Apartment, suite, etc."
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">City *</label>
                    <Input
                      required
                      value={formData.shippingAddress?.city || ''}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        shippingAddress: { ...formData.shippingAddress, city: e.target.value } as any 
                      })}
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">State *</label>
                    <Input
                      required
                      value={formData.shippingAddress?.state || ''}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        shippingAddress: { ...formData.shippingAddress, state: e.target.value } as any 
                      })}
                      placeholder="State"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">ZIP Code *</label>
                    <Input
                      required
                      value={formData.shippingAddress?.zipCode || ''}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        shippingAddress: { ...formData.shippingAddress, zipCode: e.target.value } as any 
                      })}
                      placeholder="12345"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Country *</label>
                    <Input
                      required
                      value={formData.shippingAddress?.country || ''}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        shippingAddress: { ...formData.shippingAddress, country: e.target.value } as any 
                      })}
                      placeholder="Country"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="mb-3 font-medium">Business Terms</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Payment Terms *</label>
                    <select
                      required
                      className="w-full rounded-lg border border-slate-300 px-3 py-2"
                      value={formData.paymentTerms || ''}
                      onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                    >
                      <option value="30 days">30 Days</option>
                      <option value="60 days">60 Days</option>
                      <option value="90 days">90 Days</option>
                      <option value="LC">Letter of Credit (LC)</option>
                      <option value="TT">Telegraphic Transfer (TT)</option>
                      <option value="Advance">Advance Payment</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Incoterms *</label>
                    <select
                      required
                      className="w-full rounded-lg border border-slate-300 px-3 py-2"
                      value={formData.incoterms || ''}
                      onChange={(e) => setFormData({ ...formData, incoterms: e.target.value })}
                    >
                      <option value="FOB">FOB (Free On Board)</option>
                      <option value="CIF">CIF (Cost, Insurance, Freight)</option>
                      <option value="CNF">CNF (Cost and Freight)</option>
                      <option value="EXW">EXW (Ex Works)</option>
                      <option value="DDP">DDP (Delivered Duty Paid)</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Buyer Category *</label>
                    <select
                      required
                      className="w-full rounded-lg border border-slate-300 px-3 py-2"
                      value={formData.buyerCategory || ''}
                      onChange={(e) => setFormData({ ...formData, buyerCategory: e.target.value as any })}
                    >
                      <option value="Domestic">Domestic</option>
                      <option value="Export">Export</option>
                      <option value="Private Label">Private Label</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Credit Limit</label>
                    <Input
                      type="number"
                      value={formData.creditLimit || 0}
                      onChange={(e) => setFormData({ ...formData, creditLimit: parseFloat(e.target.value) || 0 })}
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="mb-3 font-medium">Status & Notes</h3>
                <div className="grid grid-cols-2 gap-4">
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
                      <option value="blocked">Blocked</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="mb-1 block text-sm font-medium text-slate-700">Special Instructions</label>
                    <textarea
                      className="w-full rounded-lg border border-slate-300 px-3 py-2"
                      rows={3}
                      value={formData.specialInstructions || ''}
                      onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                      placeholder="Any special instructions or notes..."
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t pt-4">
                <Button variant="secondary" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  {editingBuyer ? 'Update Buyer' : 'Create Buyer'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
