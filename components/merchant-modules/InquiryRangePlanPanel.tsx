// File: components/merchant-modules/InquiryRangePlanPanel.tsx
// Phase 2: Inquiry/Range Plan - Full CRUD Component

'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Plus, Pencil, Trash2, Save, X, ArrowRight } from 'lucide-react';
import type { InquiryRangePlan } from '@/lib/merchant-types';
import { merchantStore } from '@/lib/merchant-store';

export function InquiryRangePlanPanel() {
  const [inquiries, setInquiries] = useState<InquiryRangePlan[]>([]);
  const [buyers, setBuyers] = useState<any[]>([]);
  const [seasons, setSeasons] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingInquiry, setEditingInquiry] = useState<InquiryRangePlan | null>(null);
  const [formData, setFormData] = useState<Partial<InquiryRangePlan>>({});

  useEffect(() => {
    loadInquiries();
    loadBuyers();
    loadSeasons();
  }, []);

  const loadInquiries = () => {
    setInquiries(merchantStore.getAllInquiries?.() || []);
  };

  const loadBuyers = () => {
    setBuyers(merchantStore.getAllBuyers?.() || []);
  };

  const loadSeasons = () => {
    setSeasons(merchantStore.getAllSeasons?.() || []);
  };

  const handleCreate = () => {
    setEditingInquiry(null);
    setFormData({
      inquiryStatus: 'New',
      gender: 'Unisex',
    });
    setShowForm(true);
  };

  const handleEdit = (inquiry: InquiryRangePlan) => {
    setEditingInquiry(inquiry);
    setFormData({ ...inquiry });
    setShowForm(true);
  };

  const handleDelete = (inquiryId: string) => {
    if (confirm('Are you sure you want to delete this inquiry?')) {
      merchantStore.deleteInquiry?.(inquiryId);
      loadInquiries();
    }
  };

  const handleConvertToCosting = (inquiry: InquiryRangePlan) => {
    // This would navigate to the costing module with pre-filled data
    alert(`Converting inquiry ${inquiry.inquiryNumber} to costing. This would navigate to the Costing module.`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingInquiry) {
      merchantStore.updateInquiry?.(editingInquiry.inquiryId, formData);
    } else {
      merchantStore.createInquiry?.(formData as Omit<InquiryRangePlan, 'inquiryId' | 'inquiryNumber' | 'createdAt' | 'updatedAt'>);
    }
    
    setShowForm(false);
    setEditingInquiry(null);
    setFormData({});
    loadInquiries();
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingInquiry(null);
    setFormData({});
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-700';
      case 'Under Review': return 'bg-yellow-100 text-yellow-700';
      case 'Quoted': return 'bg-purple-100 text-purple-700';
      case 'Converted': return 'bg-green-100 text-green-700';
      case 'Closed': return 'bg-slate-100 text-slate-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Inquiry / Range Plan</h2>
            <p className="text-sm text-slate-500">Manage buyer inquiries and range plans</p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Create Inquiry
          </Button>
        </CardHeader>
        <CardContent>
          {inquiries.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              No inquiries found. Create your first inquiry to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Inquiry No.</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Buyer</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Style Ref</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Target Price</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Qty</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Delivery</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiries.map((inquiry) => (
                    <tr key={inquiry.inquiryId} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm font-medium">{inquiry.inquiryNumber}</td>
                      <td className="px-4 py-3 text-sm">{inquiry.inquiryDate}</td>
                      <td className="px-4 py-3 text-sm">{inquiry.buyerName}</td>
                      <td className="px-4 py-3 text-sm">{inquiry.styleReferenceNumber}</td>
                      <td className="px-4 py-3 text-sm">{inquiry.productCategory}</td>
                      <td className="px-4 py-3 text-sm">{inquiry.targetPrice} {inquiry.targetPriceCurrency}</td>
                      <td className="px-4 py-3 text-sm">{inquiry.expectedOrderQuantity}</td>
                      <td className="px-4 py-3 text-sm">{inquiry.expectedDeliveryDate}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(inquiry.inquiryStatus)}`}>
                          {inquiry.inquiryStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button variant="secondary" size="sm" onClick={() => handleEdit(inquiry)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          {inquiry.inquiryStatus === 'Under Review' && (
                            <Button variant="secondary" size="sm" onClick={() => handleConvertToCosting(inquiry)}>
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="secondary" size="sm" onClick={() => handleDelete(inquiry.inquiryId)}>
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
                {editingInquiry ? 'Edit Inquiry' : 'Create New Inquiry'}
              </h2>
              <p className="text-sm text-slate-500">
                {editingInquiry ? 'Update inquiry details' : 'Add a new buyer inquiry'}
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Inquiry Date *</label>
                  <Input
                    required
                    type="date"
                    value={formData.inquiryDate || ''}
                    onChange={(e) => setFormData({ ...formData, inquiryDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Buyer *</label>
                  <select
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={formData.buyerId || ''}
                    onChange={(e) => {
                      const buyer = buyers.find(b => b.buyerId === e.target.value);
                      setFormData({ 
                        ...formData, 
                        buyerId: e.target.value,
                        buyerName: buyer?.buyerName || ''
                      });
                    }}
                  >
                    <option value="">Select Buyer</option>
                    {buyers.map((buyer) => (
                      <option key={buyer.buyerId} value={buyer.buyerId}>
                        {buyer.buyerName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Season</label>
                  <select
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={formData.seasonId || ''}
                    onChange={(e) => {
                      const season = seasons.find(s => s.seasonId === e.target.value);
                      setFormData({ 
                        ...formData, 
                        seasonId: e.target.value,
                        seasonName: season?.seasonName || ''
                      });
                    }}
                  >
                    <option value="">Select Season (Optional)</option>
                    {seasons.map((season) => (
                      <option key={season.seasonId} value={season.seasonId}>
                        {season.seasonName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Status *</label>
                  <select
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={formData.inquiryStatus || ''}
                    onChange={(e) => setFormData({ ...formData, inquiryStatus: e.target.value as any })}
                  >
                    <option value="New">New</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Quoted">Quoted</option>
                    <option value="Converted">Converted</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="mb-3 font-medium">Style Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Style Reference Number *</label>
                    <Input
                      required
                      value={formData.styleReferenceNumber || ''}
                      onChange={(e) => setFormData({ ...formData, styleReferenceNumber: e.target.value })}
                      placeholder="e.g., STY-001"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Style Name *</label>
                    <Input
                      required
                      value={formData.styleName || ''}
                      onChange={(e) => setFormData({ ...formData, styleName: e.target.value })}
                      placeholder="e.g., Men's Casual Shirt"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="mb-1 block text-sm font-medium text-slate-700">Style Description *</label>
                    <textarea
                      required
                      className="w-full rounded-lg border border-slate-300 px-3 py-2"
                      rows={2}
                      value={formData.styleDescription || ''}
                      onChange={(e) => setFormData({ ...formData, styleDescription: e.target.value })}
                      placeholder="Detailed style description..."
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Product Category *</label>
                    <select
                      required
                      className="w-full rounded-lg border border-slate-300 px-3 py-2"
                      value={formData.productCategory || ''}
                      onChange={(e) => setFormData({ ...formData, productCategory: e.target.value })}
                    >
                      <option value="">Select Category</option>
                      <option value="Top">Top</option>
                      <option value="Bottom">Bottom</option>
                      <option value="Dress">Dress</option>
                      <option value="Outerwear">Outerwear</option>
                      <option value="Activewear">Activewear</option>
                      <option value="Loungewear">Loungewear</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Sub-Category *</label>
                    <Input
                      required
                      value={formData.subCategory || ''}
                      onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                      placeholder="e.g., Shirt, Trouser, Jacket"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Gender *</label>
                    <select
                      required
                      className="w-full rounded-lg border border-slate-300 px-3 py-2"
                      value={formData.gender || ''}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    >
                      <option value="Men">Men</option>
                      <option value="Women">Women</option>
                      <option value="Kids">Kids</option>
                      <option value="Unisex">Unisex</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Assigned Merchant</label>
                    <Input
                      value={formData.assignedMerchantName || ''}
                      onChange={(e) => setFormData({ ...formData, assignedMerchantName: e.target.value })}
                      placeholder="Merchant name"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="mb-3 font-medium">Fabric Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Fabric Composition *</label>
                    <Input
                      required
                      value={formData.fabricComposition || ''}
                      onChange={(e) => setFormData({ ...formData, fabricComposition: e.target.value })}
                      placeholder="e.g., 60% Cotton, 40% Polyester"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Fabric Construction *</label>
                    <select
                      required
                      className="w-full rounded-lg border border-slate-300 px-3 py-2"
                      value={formData.fabricConstruction || ''}
                      onChange={(e) => setFormData({ ...formData, fabricConstruction: e.target.value })}
                    >
                      <option value="">Select Construction</option>
                      <option value="Woven">Woven</option>
                      <option value="Knit">Knit</option>
                      <option value="Denim">Denim</option>
                      <option value="Fleece">Fleece</option>
                      <option value="Jersey">Jersey</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="mb-3 font-medium">Pricing & Quantity</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Target Price *</label>
                    <Input
                      required
                      type="number"
                      step="0.01"
                      value={formData.targetPrice || ''}
                      onChange={(e) => setFormData({ ...formData, targetPrice: parseFloat(e.target.value) || 0 })}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Currency *</label>
                    <Input
                      required
                      value={formData.targetPriceCurrency || ''}
                      onChange={(e) => setFormData({ ...formData, targetPriceCurrency: e.target.value })}
                      placeholder="e.g., USD, EUR"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Expected Order Quantity *</label>
                    <Input
                      required
                      type="number"
                      value={formData.expectedOrderQuantity || ''}
                      onChange={(e) => setFormData({ ...formData, expectedOrderQuantity: parseInt(e.target.value) || 0 })}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Expected Delivery Date *</label>
                    <Input
                      required
                      type="date"
                      value={formData.expectedDeliveryDate || ''}
                      onChange={(e) => setFormData({ ...formData, expectedDeliveryDate: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="mb-3 font-medium">Attachments & Remarks</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Tech Pack URL</label>
                    <Input
                      value={formData.techPackUrl || ''}
                      onChange={(e) => setFormData({ ...formData, techPackUrl: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Reference Sample Image URL</label>
                    <Input
                      value={formData.referenceSampleImageUrl || ''}
                      onChange={(e) => setFormData({ ...formData, referenceSampleImageUrl: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="mb-1 block text-sm font-medium text-slate-700">Remarks</label>
                    <textarea
                      className="w-full rounded-lg border border-slate-300 px-3 py-2"
                      rows={3}
                      value={formData.remarks || ''}
                      onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                      placeholder="Any additional notes or special requirements..."
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
                  {editingInquiry ? 'Update Inquiry' : 'Create Inquiry'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
