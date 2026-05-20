// File: components/merchant-modules/QuotationPanel.tsx
// Phase 3: Quotation - Full CRUD Component

'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Plus, Pencil, Trash2, Save, X, Send } from 'lucide-react';
import type { Quotation } from '@/lib/merchant-types';
import { merchantStore } from '@/lib/merchant-store';

export function QuotationPanel() {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [costSheets, setCostSheets] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingQuotation, setEditingQuotation] = useState<Quotation | null>(null);
  const [formData, setFormData] = useState<Partial<Quotation>>({});

  useEffect(() => {
    loadQuotations();
    loadCostSheets();
  }, []);

  const loadQuotations = () => {
    setQuotations(merchantStore.getAllQuotations?.() || []);
  };

  const loadCostSheets = () => {
    setCostSheets(merchantStore.getAllCostSheets?.() || []);
  };

  const handleCreate = () => {
    setEditingQuotation(null);
    setFormData({
      buyerFeedback: 'Pending',
      quotationStatus: 'Sent',
    });
    setShowForm(true);
  };

  const handleEdit = (quotation: Quotation) => {
    setEditingQuotation(quotation);
    setFormData({ ...quotation });
    setShowForm(true);
  };

  const handleDelete = (quotationId: string) => {
    if (confirm('Are you sure you want to delete this quotation?')) {
      setQuotations(quotations.filter(q => q.quotationId !== quotationId));
    }
  };

  const handleSendToBuyer = (quotation: Quotation) => {
    merchantStore.updateQuotation?.(quotation.quotationId, { 
      dateSentToBuyer: new Date().toISOString().split('T')[0],
      quotationStatus: 'Sent'
    });
    loadQuotations();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingQuotation) {
      merchantStore.updateQuotation?.(editingQuotation.quotationId, formData);
    } else {
      merchantStore.createQuotation?.(formData as Omit<Quotation, 'quotationId' | 'quotationNumber' | 'createdAt' | 'updatedAt'>);
    }
    
    setShowForm(false);
    setEditingQuotation(null);
    setFormData({});
    loadQuotations();
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingQuotation(null);
    setFormData({});
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Accepted': return 'bg-green-100 text-green-700';
      case 'Rejected': return 'bg-red-100 text-red-700';
      case 'Negotiating': return 'bg-yellow-100 text-yellow-700';
      case 'Sent': return 'bg-blue-100 text-blue-700';
      case 'Pending': return 'bg-slate-100 text-slate-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getFeedbackColor = (feedback: string) => {
    switch (feedback) {
      case 'Accepted': return 'bg-green-100 text-green-700';
      case 'Rejected': return 'bg-red-100 text-red-700';
      case 'Counter': return 'bg-yellow-100 text-yellow-700';
      case 'Pending': return 'bg-blue-100 text-blue-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Quotations</h2>
            <p className="text-sm text-slate-500">Manage quotations sent to buyers</p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Create Quotation
          </Button>
        </CardHeader>
        <CardContent>
          {quotations.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              No quotations found. Create your first quotation to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Quotation No.</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Cost Sheet Ref</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Quoted Price</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Currency</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Date Sent</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Buyer Feedback</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Final Price</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {quotations.map((quotation) => (
                    <tr key={quotation.quotationId} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm font-medium">{quotation.quotationNumber}</td>
                      <td className="px-4 py-3 text-sm">{quotation.costSheetNumber}</td>
                      <td className="px-4 py-3 text-sm">{quotation.quotedPrice.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm">{quotation.currency}</td>
                      <td className="px-4 py-3 text-sm">{quotation.dateSentToBuyer || '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getFeedbackColor(quotation.buyerFeedback)}`}>
                          {quotation.buyerFeedback}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">{quotation.finalAgreedPrice ? quotation.finalAgreedPrice.toFixed(2) : '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(quotation.quotationStatus)}`}>
                          {quotation.quotationStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button variant="secondary" size="sm" onClick={() => handleEdit(quotation)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          {quotation.quotationStatus === 'Pending' && (
                            <Button variant="secondary" size="sm" onClick={() => handleSendToBuyer(quotation)}>
                              <Send className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="secondary" size="sm" onClick={() => handleDelete(quotation.quotationId)}>
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
                {editingQuotation ? 'Edit Quotation' : 'Create New Quotation'}
              </h2>
              <p className="text-sm text-slate-500">
                {editingQuotation ? 'Update quotation details' : 'Create a new quotation from cost sheet'}
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Cost Sheet *</label>
                  <select
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={formData.costSheetId || ''}
                    onChange={(e) => {
                      const costSheet = costSheets.find(c => c.costSheetId === e.target.value);
                      setFormData({ 
                        ...formData, 
                        costSheetId: e.target.value,
                        costSheetNumber: costSheet?.costSheetNumber || '',
                        quotedPrice: costSheet?.summary?.finalFOBPrice || 0,
                        currency: costSheet?.currency || 'USD',
                      });
                    }}
                  >
                    <option value="">Select Cost Sheet</option>
                    {costSheets.map((costSheet) => (
                      <option key={costSheet.costSheetId} value={costSheet.costSheetId}>
                        {costSheet.costSheetNumber} - {costSheet.styleReference} ({costSheet.summary?.finalFOBPrice?.toFixed(2)} {costSheet.currency})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Quoted Price *</label>
                  <Input
                    required
                    type="number"
                    step="0.01"
                    value={formData.quotedPrice || ''}
                    onChange={(e) => setFormData({ ...formData, quotedPrice: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
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
                  <label className="mb-1 block text-sm font-medium text-slate-700">Date Sent to Buyer</label>
                  <Input
                    type="date"
                    value={formData.dateSentToBuyer || ''}
                    onChange={(e) => setFormData({ ...formData, dateSentToBuyer: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Buyer Feedback</label>
                  <select
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={formData.buyerFeedback || ''}
                    onChange={(e) => setFormData({ ...formData, buyerFeedback: e.target.value as any })}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Counter">Counter</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Quotation Status</label>
                  <select
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={formData.quotationStatus || ''}
                    onChange={(e) => setFormData({ ...formData, quotationStatus: e.target.value as any })}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Sent">Sent</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Negotiating">Negotiating</option>
                  </select>
                </div>
              </div>

              {formData.buyerFeedback === 'Counter' && (
                <div className="border-t pt-4">
                  <h3 className="mb-3 font-medium">Counter Offer Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">Counter Price</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.counterPrice || ''}
                        onChange={(e) => setFormData({ ...formData, counterPrice: parseFloat(e.target.value) || 0 })}
                        placeholder="Buyer's counter price"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">Final Agreed Price</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.finalAgreedPrice || ''}
                        onChange={(e) => setFormData({ ...formData, finalAgreedPrice: parseFloat(e.target.value) || 0 })}
                        placeholder="Final negotiated price"
                      />
                    </div>
                  </div>
                </div>
              )}

              {formData.buyerFeedback === 'Accepted' && (
                <div className="border-t pt-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Final Agreed Price</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.finalAgreedPrice || ''}
                      onChange={(e) => setFormData({ ...formData, finalAgreedPrice: parseFloat(e.target.value) || 0 })}
                      placeholder="Final agreed price"
                    />
                  </div>
                </div>
              )}

              <div className="border-t pt-4">
                <label className="mb-1 block text-sm font-medium text-slate-700">Remarks</label>
                <textarea
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                  rows={3}
                  value={formData.remarks || ''}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  placeholder="Any additional notes..."
                />
              </div>

              <div className="flex justify-end gap-3 border-t pt-4">
                <Button variant="secondary" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  {editingQuotation ? 'Update Quotation' : 'Create Quotation'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
