// File: components/merchant-modules/SampleApprovalPanel.tsx
// Phase 4: Sample Approval - Full CRUD Component

'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import type { SampleApproval, SampleComment } from '@/lib/merchant-types';
import { merchantStore } from '@/lib/merchant-store';

export function SampleApprovalPanel() {
  const [sampleApprovals, setSampleApprovals] = useState<SampleApproval[]>([]);
  const [sampleRequests, setSampleRequests] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingApproval, setEditingApproval] = useState<SampleApproval | null>(null);
  const [formData, setFormData] = useState<Partial<SampleApproval>>({});

  useEffect(() => {
    loadSampleApprovals();
    loadSampleRequests();
  }, []);

  const loadSampleApprovals = () => {
    setSampleApprovals(merchantStore.getAllSampleApprovals?.() || []);
  };

  const loadSampleRequests = () => {
    setSampleRequests(merchantStore.getAllSampleRequests?.() || []);
  };

  const handleCreate = () => {
    setEditingApproval(null);
    setFormData({
      approvalStatus: 'Pending' as any,
      comments: [],
    });
    setShowForm(true);
  };

  const handleEdit = (approval: SampleApproval) => {
    setEditingApproval(approval);
    setFormData({ ...approval });
    setShowForm(true);
  };

  const handleDelete = (sampleApprovalId: string) => {
    if (confirm('Are you sure you want to delete this sample approval record?')) {
      setSampleApprovals(sampleApprovals.filter(a => a.sampleApprovalId !== sampleApprovalId));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingApproval) {
      merchantStore.updateSampleApproval?.(editingApproval.sampleApprovalId, formData);
    } else {
      merchantStore.createSampleApproval?.(formData as Omit<SampleApproval, 'sampleApprovalId' | 'createdAt' | 'updatedAt'>);
    }
    
    setShowForm(false);
    setEditingApproval(null);
    setFormData({});
    loadSampleApprovals();
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingApproval(null);
    setFormData({});
  };

  const addComment = () => {
    const currentComments = formData.comments || [];
    setFormData({
      ...formData,
      comments: [...currentComments, {
        commentId: `CMT-${Date.now()}`,
        commentPointNumber: currentComments.length + 1,
        commentDate: new Date().toISOString().split('T')[0],
        buyerComments: '',
        actionRequired: '',
        resubmissionRequired: false,
        updatedAt: new Date().toISOString(),
      }],
    });
  };

  const updateComment = (index: number, field: keyof SampleComment, value: any) => {
    const updatedComments = [...(formData.comments || [])];
    updatedComments[index] = { ...updatedComments[index], [field]: value };
    setFormData({ ...formData, comments: updatedComments });
  };

  const removeComment = (index: number) => {
    const updatedComments = (formData.comments || []).filter((_, i) => i !== index);
    setFormData({ ...formData, comments: updatedComments });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-700';
      case 'Approved with Comments': return 'bg-yellow-100 text-yellow-700';
      case 'Rejected': return 'bg-red-100 text-red-700';
      case 'Pending': return 'bg-slate-100 text-slate-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Sample Approvals</h2>
            <p className="text-sm text-slate-500">Manage buyer sample approvals and comments</p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Create Approval Record
          </Button>
        </CardHeader>
        <CardContent>
          {sampleApprovals.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              No sample approval records found. Create your first approval record to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Approval ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Request ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Comment Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Comments Count</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Approval Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Approved By</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleApprovals.map((approval) => (
                    <tr key={approval.sampleApprovalId} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm font-medium">{approval.sampleApprovalId}</td>
                      <td className="px-4 py-3 text-sm">{approval.sampleRequestId}</td>
                      <td className="px-4 py-3 text-sm">{approval.buyerCommentDate}</td>
                      <td className="px-4 py-3 text-sm">{approval.comments.length}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(approval.approvalStatus)}`}>
                          {approval.approvalStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">{approval.approvedBy}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button variant="secondary" size="sm" onClick={() => handleEdit(approval)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="secondary" size="sm" onClick={() => handleDelete(approval.sampleApprovalId)}>
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
                {editingApproval ? 'Edit Sample Approval' : 'Create New Approval Record'}
              </h2>
              <p className="text-sm text-slate-500">
                {editingApproval ? 'Update approval details' : 'Record buyer sample approval and comments'}
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Sample Request *</label>
                  <select
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={formData.sampleRequestId || ''}
                    onChange={(e) => setFormData({ ...formData, sampleRequestId: e.target.value })}
                  >
                    <option value="">Select Sample Request</option>
                    {sampleRequests.map((request) => (
                      <option key={request.sampleRequestId} value={request.sampleRequestId}>
                        {request.sampleRequestNumber} - {request.styleReference}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Buyer Comment Date *</label>
                  <Input
                    required
                    type="date"
                    value={formData.buyerCommentDate || ''}
                    onChange={(e) => setFormData({ ...formData, buyerCommentDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Approval Status *</label>
                  <select
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={formData.approvalStatus || ''}
                    onChange={(e) => setFormData({ ...formData, approvalStatus: e.target.value as any })}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Approved with Comments">Approved with Comments</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Approved By</label>
                  <Input
                    value={formData.approvedBy || ''}
                    onChange={(e) => setFormData({ ...formData, approvedBy: e.target.value })}
                    placeholder="Buyer name or QC name"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Approval Date</label>
                  <Input
                    type="date"
                    value={formData.approvalDate || ''}
                    onChange={(e) => setFormData({ ...formData, approvalDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Sample Approval Document URL</label>
                  <Input
                    value={formData.sampleApprovalDocumentUrl || ''}
                    onChange={(e) => setFormData({ ...formData, sampleApprovalDocumentUrl: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">Buyer Comments</h3>
                  <Button type="button" variant="secondary" size="sm" onClick={addComment}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Comment
                  </Button>
                </div>
                {formData.comments?.map((comment, index) => (
                  <div key={index} className="mb-4 rounded-lg border border-slate-200 p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-600">Comment Point #{comment.commentPointNumber}</label>
                        <Input
                          value={comment.commentPointNumber}
                          onChange={(e) => updateComment(index, 'commentPointNumber', parseInt(e.target.value) || 0)}
                          className="w-24"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-600">Comment Date</label>
                        <Input
                          type="date"
                          value={comment.commentDate}
                          onChange={(e) => updateComment(index, 'commentDate', e.target.value)}
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="mb-1 block text-xs font-medium text-slate-600">Buyer Comments</label>
                        <textarea
                          className="w-full rounded-lg border border-slate-300 px-3 py-2"
                          rows={2}
                          value={comment.buyerComments}
                          onChange={(e) => updateComment(index, 'buyerComments', e.target.value)}
                          placeholder="Fit issue, color issue, construction issue, etc."
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="mb-1 block text-xs font-medium text-slate-600">Action Required</label>
                        <Input
                          value={comment.actionRequired}
                          onChange={(e) => updateComment(index, 'actionRequired', e.target.value)}
                          placeholder="Required corrective action"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-600">Corrective Action Taken</label>
                        <textarea
                          className="w-full rounded-lg border border-slate-300 px-3 py-2"
                          rows={2}
                          value={comment.correctiveActionTaken || ''}
                          onChange={(e) => updateComment(index, 'correctiveActionTaken', e.target.value)}
                          placeholder="Action taken to address the comment"
                        />
                      </div>
                      <div className="flex items-end">
                        <div className="flex-1">
                          <label className="mb-1 block text-xs font-medium text-slate-600">Resubmission Required</label>
                          <select
                            value={comment.resubmissionRequired ? 'true' : 'false'}
                            onChange={(e) => updateComment(index, 'resubmissionRequired', e.target.value === 'true')}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2"
                          >
                            <option value="false">No</option>
                            <option value="true">Yes</option>
                          </select>
                        </div>
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          className="ml-2"
                          onClick={() => removeComment(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
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
