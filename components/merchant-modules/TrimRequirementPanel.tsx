// File: components/merchant-modules/TrimRequirementPanel.tsx
// Phase 7: Trim Requirements - Full CRUD Component

'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import type { TrimRequirement } from '@/lib/merchant-types';
import { merchantStore } from '@/lib/merchant-store';

export function TrimRequirementPanel() {
  const [trimRequirements, setTrimRequirements] = useState<TrimRequirement[]>([]);
  const [buyerPOs, setBuyerPOs] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRequirement, setEditingRequirement] = useState<TrimRequirement | null>(null);
  const [formData, setFormData] = useState<Partial<TrimRequirement>>({});

  useEffect(() => {
    loadTrimRequirements();
    loadBuyerPOs();
  }, []);

  const loadTrimRequirements = () => {
    setTrimRequirements(merchantStore.getAllTrimRequirements?.() || []);
  };

  const loadBuyerPOs = () => {
    setBuyerPOs(merchantStore.getAllBuyerPOs?.() || []);
  };

  const handleCreate = () => {
    setEditingRequirement(null);
    setFormData({
      bufferPercent: 10,
      status: 'To Order',
    });
    setShowForm(true);
  };

  const handleEdit = (requirement: TrimRequirement) => {
    setEditingRequirement(requirement);
    setFormData({ ...requirement });
    setShowForm(true);
  };

  const handleDelete = (trimRequirementId: string) => {
    if (confirm('Are you sure you want to delete this trim requirement?')) {
      setTrimRequirements(trimRequirements.filter(t => t.trimRequirementId !== trimRequirementId));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingRequirement) {
      merchantStore.updateTrimRequirement?.(editingRequirement.trimRequirementId, formData);
    } else {
      merchantStore.createTrimRequirement?.(formData as Omit<TrimRequirement, 'trimRequirementId' | 'createdAt' | 'updatedAt'>);
    }
    
    setShowForm(false);
    setEditingRequirement(null);
    setFormData({});
    loadTrimRequirements();
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingRequirement(null);
    setFormData({});
  };

  const calculateTotalWithBuffer = () => {
    const qty = formData.requiredQuantity || 0;
    const buffer = formData.bufferPercent || 0;
    const total = qty * (1 + buffer / 100);
    setFormData({ ...formData, totalRequiredWithBuffer: total });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-700';
      case 'Received': return 'bg-purple-100 text-purple-700';
      case 'To Order': return 'bg-yellow-100 text-yellow-700';
      case 'Ordered': return 'bg-blue-100 text-blue-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Trim Requirements</h2>
            <p className="text-sm text-slate-500">Manage trim requirements for production</p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Create Requirement
          </Button>
        </CardHeader>
        <CardContent>
          {trimRequirements.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              No trim requirements found. Create your first requirement to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Style Ref</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Trim Item</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Description</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Required Qty</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Buffer %</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Total w/ Buffer</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Supplier</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Required By</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {trimRequirements.map((req) => (
                    <tr key={req.trimRequirementId} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm font-medium">{req.styleOrderReference}</td>
                      <td className="px-4 py-3 text-sm">{req.trimItemName}</td>
                      <td className="px-4 py-3 text-sm">{req.description}</td>
                      <td className="px-4 py-3 text-sm">{req.requiredQuantity}</td>
                      <td className="px-4 py-3 text-sm">{req.bufferPercent}%</td>
                      <td className="px-4 py-3 text-sm">{req.totalRequiredWithBuffer.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm">{req.supplierName}</td>
                      <td className="px-4 py-3 text-sm">{req.requiredInHouseDate}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(req.status)}`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button variant="secondary" size="sm" onClick={() => handleEdit(req)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="secondary" size="sm" onClick={() => handleDelete(req.trimRequirementId)}>
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
                {editingRequirement ? 'Edit Trim Requirement' : 'Create New Trim Requirement'}
              </h2>
              <p className="text-sm text-slate-500">
                {editingRequirement ? 'Update requirement details' : 'Create a new trim requirement'}
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Style Reference *</label>
                  <select
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={formData.styleOrderReference || ''}
                    onChange={(e) => setFormData({ ...formData, styleOrderReference: e.target.value })}
                  >
                    <option value="">Select Style</option>
                    {buyerPOs.map((po) => (
                      <option key={po.buyerPOId} value={po.styleReference}>
                        {po.styleReference}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Trim Item Name *</label>
                  <Input
                    required
                    value={formData.trimItemName || ''}
                    onChange={(e) => setFormData({ ...formData, trimItemName: e.target.value })}
                    placeholder="e.g., Buttons, Zippers, Labels"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Description *</label>
                  <Input
                    required
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Item description"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Required Quantity *</label>
                  <Input
                    required
                    type="number"
                    value={formData.requiredQuantity || ''}
                    onChange={(e) => {
                      setFormData({ ...formData, requiredQuantity: parseInt(e.target.value) || 0 });
                      calculateTotalWithBuffer();
                    }}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Buffer % *</label>
                  <Input
                    required
                    type="number"
                    value={formData.bufferPercent || ''}
                    onChange={(e) => {
                      setFormData({ ...formData, bufferPercent: parseInt(e.target.value) || 0 });
                      calculateTotalWithBuffer();
                    }}
                    placeholder="10"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Total with Buffer</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.totalRequiredWithBuffer || ''}
                    onChange={(e) => setFormData({ ...formData, totalRequiredWithBuffer: parseFloat(e.target.value) || 0 })}
                    placeholder="Auto-calculated"
                    readOnly
                    className="bg-slate-50"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Supplier Name *</label>
                  <Input
                    required
                    value={formData.supplierName || ''}
                    onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
                    placeholder="Supplier name"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Lead Time (Days) *</label>
                  <Input
                    required
                    type="number"
                    value={formData.leadTimeDays || ''}
                    onChange={(e) => setFormData({ ...formData, leadTimeDays: parseInt(e.target.value) || 0 })}
                    placeholder="e.g., 15"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Required In-House Date *</label>
                  <Input
                    required
                    type="date"
                    value={formData.requiredInHouseDate || ''}
                    onChange={(e) => setFormData({ ...formData, requiredInHouseDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Status *</label>
                  <select
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={formData.status || ''}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  >
                    <option value="To Order">To Order</option>
                    <option value="Ordered">Ordered</option>
                    <option value="Received">Received</option>
                    <option value="Approved">Approved</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t pt-4">
                <Button variant="secondary" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  {editingRequirement ? 'Update Requirement' : 'Create Requirement'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
