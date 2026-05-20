// File: components/merchant-modules/TrimApprovalPanel.tsx
// Phase 7: Trim Approval - Full CRUD Component

'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import type { TrimApproval } from '@/lib/merchant-types';
import { merchantStore } from '@/lib/merchant-store';

export function TrimApprovalPanel() {
  const [trimApprovals, setTrimApprovals] = useState<TrimApproval[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingApproval, setEditingApproval] = useState<TrimApproval | null>(null);
  const [formData, setFormData] = useState<Partial<TrimApproval>>({});

  useEffect(() => {
    loadTrimApprovals();
  }, []);

  const loadTrimApprovals = () => {
    setTrimApprovals(merchantStore.getAllTrimApprovals?.() || []);
  };

  const handleCreate = () => {
    setEditingApproval(null);
    setFormData({
      submittedToBuyer: false,
      buyerApprovalStatus: 'Pending',
    });
    setShowForm(true);
  };

  const handleEdit = (approval: TrimApproval) => {
    setEditingApproval(approval);
    setFormData({ ...approval });
    setShowForm(true);
  };

  const handleDelete = (trimApprovalId: string) => {
    if (confirm('Are you sure you want to delete this trim approval?')) {
      setTrimApprovals(trimApprovals.filter(t => t.trimApprovalId !== trimApprovalId));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingApproval) {
      merchantStore.updateTrimApproval?.(editingApproval.trimApprovalId, formData);
    } else {
      merchantStore.createTrimApproval?.(formData as Omit<TrimApproval, 'trimApprovalId' | 'createdAt' | 'updatedAt'>);
    }
    
    setShowForm(false);
    setEditingApproval(null);
    setFormData({});
    loadTrimApprovals();
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingApproval(null);
    setFormData({});
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-700';
      case 'Rejected': return 'bg-red-100 text-red-700';
      case 'With Comments': return 'bg-blue-100 text-blue-700';
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Trim Approvals</h2>
            <p className="text-sm text-slate-500">Manage trim sample approvals</p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Create Approval
          </Button>
        </CardHeader>
        <CardContent>
          {trimApprovals.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              No trim approvals found. Create your first approval to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Item Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Submitted</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Submission Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Buyer Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Sample Kept</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {trimApprovals.map((approval) => (
                    <tr key={approval.trimApprovalId} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm font-medium">{approval.itemName}</td>
                      <td className="px-4 py-3 text-sm">
                        {approval.submittedToBuyer ? 'Yes' : 'No'}
                      </td>
                      <td className="px-4 py-3 text-sm">{approval.submissionDate || '-'}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(approval.buyerApprovalStatus)}`}>
                          {approval.buyerApprovalStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {approval.approvedSampleKeptInRecord ? 'Yes' : 'No'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button variant="secondary" size="sm" onClick={() => handleEdit(approval)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="secondary" size="sm" onClick={() => handleDelete(approval.trimApprovalId)}>
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
                {editingApproval ? 'Edit Trim Approval' : 'Create New Trim Approval'}
              </h2>
              <p className="text-sm text-slate-500">
                {editingApproval ? 'Update approval details' : 'Create a new trim sample approval'}
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Item Name *</label>
                  <Input
                    required
                    value={formData.itemName || ''}
                    onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                    placeholder="e.g., Buttons, Zippers"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Submitted to Buyer</label>
                  <select
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={formData.submittedToBuyer ? 'true' : 'false'}
                    onChange={(e) => setFormData({ ...formData, submittedToBuyer: e.target.value === 'true' })}
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Submission Date</label>
                  <Input
                    type="date"
                    value={formData.submissionDate || ''}
                    onChange={(e) => setFormData({ ...formData, submissionDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Buyer Approval Status *</label>
                  <select
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={formData.buyerApprovalStatus || ''}
                    onChange={(e) => setFormData({ ...formData, buyerApprovalStatus: e.target.value as any })}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                    <option value="With Comments">With Comments</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Approved Sample Kept in Record</label>
                  <select
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={formData.approvedSampleKeptInRecord ? 'true' : 'false'}
                    onChange={(e) => setFormData({ ...formData, approvedSampleKeptInRecord: e.target.value === 'true' })}
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
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
                  {editingApproval ? 'Update Approval' : 'Create Approval'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
