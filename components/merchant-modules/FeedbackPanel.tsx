// File: components/merchant-modules/FeedbackPanel.tsx
// Phase 13: Buyer Feedback - Full CRUD Component

'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import type { BuyerFeedback } from '@/lib/merchant-types';
import { merchantStore } from '@/lib/merchant-store';

export function FeedbackPanel() {
  const [feedbacks, setFeedbacks] = useState<BuyerFeedback[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingFeedback, setEditingFeedback] = useState<BuyerFeedback | null>(null);
  const [formData, setFormData] = useState<Partial<BuyerFeedback>>({});

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const loadFeedbacks = () => {
    setFeedbacks(merchantStore.getAllBuyerFeedbacks?.() || []);
  };

  const handleCreate = () => {
    setEditingFeedback(null);
    setFormData({
      claimSettlementStatus: 'Accepted',
      creditNoteIssued: false,
    });
    setShowForm(true);
  };

  const handleEdit = (feedback: BuyerFeedback) => {
    setEditingFeedback(feedback);
    setFormData({ ...feedback });
    setShowForm(true);
  };

  const handleDelete = (feedbackId: string) => {
    if (confirm('Are you sure you want to delete this feedback record?')) {
      setFeedbacks(feedbacks.filter(f => f.feedbackId !== feedbackId));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingFeedback) {
      merchantStore.updateBuyerFeedback?.(editingFeedback.feedbackId, formData);
    } else {
      merchantStore.createBuyerFeedback(formData as Omit<BuyerFeedback, 'feedbackId' | 'createdAt' | 'updatedAt'>);
    }
    
    setShowForm(false);
    setEditingFeedback(null);
    setFormData({});
    loadFeedbacks();
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingFeedback(null);
    setFormData({});
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Accepted': return 'bg-green-100 text-green-700';
      case 'Rejected': return 'bg-red-100 text-red-700';
      case 'Partial': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Buyer Feedback</h2>
            <p className="text-sm text-slate-500">Manage buyer complaints and feedback</p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Create Feedback
          </Button>
        </CardHeader>
        <CardContent>
          {feedbacks.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              No feedback records found. Create your first feedback to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Complaint No.</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Shipment Ref</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Pieces Affected</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Claim Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Settlement</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {feedbacks.map((feedback) => (
                    <tr key={feedback.feedbackId} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm font-medium">{feedback.complaintNumber}</td>
                      <td className="px-4 py-3 text-sm">{feedback.shipmentReference}</td>
                      <td className="px-4 py-3 text-sm">{feedback.complaintDate}</td>
                      <td className="px-4 py-3 text-sm">{feedback.complaintType.replace('_', ' ')}</td>
                      <td className="px-4 py-3 text-sm">{feedback.piecesAffected}</td>
                      <td className="px-4 py-3 text-sm">{feedback.currency} {feedback.buyerClaimAmount}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(feedback.claimSettlementStatus)}`}>
                          {feedback.claimSettlementStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button variant="secondary" size="sm" onClick={() => handleEdit(feedback)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="secondary" size="sm" onClick={() => handleDelete(feedback.feedbackId)}>
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
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="border-b border-slate-200 p-6">
              <h2 className="text-xl font-semibold">
                {editingFeedback ? 'Edit Buyer Feedback' : 'Create New Buyer Feedback'}
              </h2>
              <p className="text-sm text-slate-500">
                {editingFeedback ? 'Update feedback details' : 'Create a new buyer feedback record'}
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Complaint Number *</label>
                  <Input
                    required
                    value={formData.complaintNumber || ''}
                    onChange={(e) => setFormData({ ...formData, complaintNumber: e.target.value })}
                    placeholder="Complaint number"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Shipment Reference *</label>
                  <Input
                    required
                    value={formData.shipmentReference || ''}
                    onChange={(e) => setFormData({ ...formData, shipmentReference: e.target.value })}
                    placeholder="Shipment reference"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Complaint Date *</label>
                  <Input
                    required
                    type="date"
                    value={formData.complaintDate || ''}
                    onChange={(e) => setFormData({ ...formData, complaintDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Complaint Type *</label>
                  <select
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={formData.complaintType || ''}
                    onChange={(e) => setFormData({ ...formData, complaintType: e.target.value as any })}
                  >
                    <option value="quality">Quality</option>
                    <option value="short_shipment">Short Shipment</option>
                    <option value="wrong_packing">Wrong Packing</option>
                    <option value="delay">Delay</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="mb-1 block text-sm font-medium text-slate-700">Complaint Description *</label>
                  <Input
                    required
                    value={formData.complaintDescription || ''}
                    onChange={(e) => setFormData({ ...formData, complaintDescription: e.target.value })}
                    placeholder="Describe the complaint"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Pieces Affected *</label>
                  <Input
                    required
                    type="number"
                    value={formData.piecesAffected || ''}
                    onChange={(e) => setFormData({ ...formData, piecesAffected: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Buyer Claim Amount *</label>
                  <Input
                    required
                    type="number"
                    step="0.01"
                    value={formData.buyerClaimAmount || ''}
                    onChange={(e) => setFormData({ ...formData, buyerClaimAmount: parseFloat(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Currency *</label>
                  <Input
                    required
                    value={formData.currency || ''}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    placeholder="e.g., USD, EUR"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Claim Settlement Status *</label>
                  <select
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={formData.claimSettlementStatus || ''}
                    onChange={(e) => setFormData({ ...formData, claimSettlementStatus: e.target.value as any })}
                  >
                    <option value="Accepted">Accepted</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Partial">Partial</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Credit Note Issued</label>
                  <select
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={formData.creditNoteIssued ? 'true' : 'false'}
                    onChange={(e) => setFormData({ ...formData, creditNoteIssued: e.target.value === 'true' })}
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </div>
                {formData.creditNoteIssued && (
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Credit Note Number</label>
                    <Input
                      value={formData.creditNoteNumber || ''}
                      onChange={(e) => setFormData({ ...formData, creditNoteNumber: e.target.value })}
                      placeholder="Credit note number"
                    />
                  </div>
                )}
              </div>

              <div className="border-t pt-4">
                <label className="mb-1 block text-sm font-medium text-slate-700">Internal Investigation *</label>
                <Input
                  required
                  value={formData.internalInvestigation || ''}
                  onChange={(e) => setFormData({ ...formData, internalInvestigation: e.target.value })}
                  placeholder="Internal investigation details"
                />
              </div>

              <div className="border-t pt-4">
                <label className="mb-1 block text-sm font-medium text-slate-700">Root Cause *</label>
                <Input
                  required
                  value={formData.rootCause || ''}
                  onChange={(e) => setFormData({ ...formData, rootCause: e.target.value })}
                  placeholder="Root cause analysis"
                />
              </div>

              <div className="border-t pt-4">
                <label className="mb-1 block text-sm font-medium text-slate-700">Corrective Action *</label>
                <Input
                  required
                  value={formData.correctiveAction || ''}
                  onChange={(e) => setFormData({ ...formData, correctiveAction: e.target.value })}
                  placeholder="Corrective action taken"
                />
              </div>

              <div className="flex justify-end gap-3 border-t pt-4">
                <Button variant="secondary" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  {editingFeedback ? 'Update Feedback' : 'Create Feedback'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
