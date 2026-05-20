// File: components/merchant-modules/LabDipApprovalPanel.tsx
// Phase 7: Lab Dip Approval - Full CRUD Component

'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import type { LabDipApproval } from '@/lib/merchant-types';
import { merchantStore } from '@/lib/merchant-store';

export function LabDipApprovalPanel() {
  const [labDips, setLabDips] = useState<LabDipApproval[]>([]);
  const [buyerPOs, setBuyerPOs] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingLabDip, setEditingLabDip] = useState<LabDipApproval | null>(null);
  const [formData, setFormData] = useState<Partial<LabDipApproval>>({});

  useEffect(() => {
    loadLabDips();
    loadBuyerPOs();
  }, []);

  const loadLabDips = () => {
    setLabDips(merchantStore.getAllLabDipApprovals?.() || []);
  };

  const loadBuyerPOs = () => {
    setBuyerPOs(merchantStore.getAllBuyerPOs?.() || []);
  };

  const handleCreate = () => {
    setEditingLabDip(null);
    setFormData({
      status: 'Pending',
    });
    setShowForm(true);
  };

  const handleEdit = (labDip: LabDipApproval) => {
    setEditingLabDip(labDip);
    setFormData({ ...labDip });
    setShowForm(true);
  };

  const handleDelete = (labDipId: string) => {
    if (confirm('Are you sure you want to delete this lab dip approval?')) {
      setLabDips(labDips.filter(l => l.labDipId !== labDipId));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingLabDip) {
      merchantStore.updateLabDipApproval?.(editingLabDip.labDipId, formData);
    } else {
      merchantStore.createLabDipApproval?.(formData as Omit<LabDipApproval, 'labDipId' | 'labDipNumber' | 'createdAt' | 'updatedAt'>);
    }
    
    setShowForm(false);
    setEditingLabDip(null);
    setFormData({});
    loadLabDips();
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingLabDip(null);
    setFormData({});
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-700';
      case 'Rejected': return 'bg-red-100 text-red-700';
      case 'Resubmitted': return 'bg-blue-100 text-blue-700';
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Lab Dip Approvals</h2>
            <p className="text-sm text-slate-500">Manage lab dip approvals for fabric colors</p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Create Lab Dip
          </Button>
        </CardHeader>
        <CardContent>
          {labDips.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              No lab dips found. Create your first lab dip to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Lab Dip No.</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Style Ref</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Color Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Pantone</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Sent Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {labDips.map((labDip) => (
                    <tr key={labDip.labDipId} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm font-medium">{labDip.labDipNumber}</td>
                      <td className="px-4 py-3 text-sm">{labDip.styleOrderReference}</td>
                      <td className="px-4 py-3 text-sm">{labDip.colorName}</td>
                      <td className="px-4 py-3 text-sm">{labDip.pantoneCode}</td>
                      <td className="px-4 py-3 text-sm">{labDip.submissionDate}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(labDip.status)}`}>
                          {labDip.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button variant="secondary" size="sm" onClick={() => handleEdit(labDip)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="secondary" size="sm" onClick={() => handleDelete(labDip.labDipId)}>
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
                {editingLabDip ? 'Edit Lab Dip' : 'Create New Lab Dip'}
              </h2>
              <p className="text-sm text-slate-500">
                {editingLabDip ? 'Update lab dip details' : 'Create a new lab dip approval'}
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
                  <label className="mb-1 block text-sm font-medium text-slate-700">Color Name *</label>
                  <Input
                    required
                    value={formData.colorName || ''}
                    onChange={(e) => setFormData({ ...formData, colorName: e.target.value })}
                    placeholder="e.g., Navy Blue"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Pantone Code *</label>
                  <Input
                    required
                    value={formData.pantoneCode || ''}
                    onChange={(e) => setFormData({ ...formData, pantoneCode: e.target.value })}
                    placeholder="e.g., 19-4052 TCX"
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
                  <label className="mb-1 block text-sm font-medium text-slate-700">Submission Date *</label>
                  <Input
                    required
                    type="date"
                    value={formData.submissionDate || ''}
                    onChange={(e) => setFormData({ ...formData, submissionDate: e.target.value })}
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
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Resubmit">Resubmit</option>
                  </select>
                </div>
              </div>

              <div className="border-t pt-4">
                <label className="mb-1 block text-sm font-medium text-slate-700">Buyer Comment</label>
                <textarea
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                  rows={3}
                  value={formData.buyerComment || ''}
                  onChange={(e) => setFormData({ ...formData, buyerComment: e.target.value })}
                  placeholder="Buyer feedback comment..."
                />
              </div>

              <div className="border-t pt-4">
                <label className="mb-1 block text-sm font-medium text-slate-700">Approved Shade Card URL</label>
                <Input
                  value={formData.approvedShadeCardUrl || ''}
                  onChange={(e) => setFormData({ ...formData, approvedShadeCardUrl: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div className="flex justify-end gap-3 border-t pt-4">
                <Button variant="secondary" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  {editingLabDip ? 'Update Lab Dip' : 'Create Lab Dip'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
