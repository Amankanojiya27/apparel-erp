// File: components/merchant-modules/PaymentsPanel.tsx
// Phase 14: Payments - Full CRUD Component

'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import type { PaymentFollowUp } from '@/lib/merchant-types';
import { merchantStore } from '@/lib/merchant-store';

export function PaymentsPanel() {
  const [payments, setPayments] = useState<PaymentFollowUp[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState<PaymentFollowUp | null>(null);
  const [formData, setFormData] = useState<Partial<PaymentFollowUp>>({});

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = () => {
    setPayments(merchantStore.getAllPaymentFollowUps?.() || []);
  };

  const handleCreate = () => {
    setEditingPayment(null);
    setFormData({
      paymentStatus: 'Pending',
      outstandingAmount: 0,
      followUpLog: [],
    });
    setShowForm(true);
  };

  const handleEdit = (payment: PaymentFollowUp) => {
    setEditingPayment(payment);
    setFormData({ ...payment });
    setShowForm(true);
  };

  const handleDelete = (paymentFollowUpId: string) => {
    if (confirm('Are you sure you want to delete this payment follow-up?')) {
      setPayments(payments.filter(p => p.paymentFollowUpId !== paymentFollowUpId));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingPayment) {
      merchantStore.updatePaymentFollowUp?.(editingPayment.paymentFollowUpId, formData);
    } else {
      merchantStore.createPaymentFollowUp?.(formData as Omit<PaymentFollowUp, 'paymentFollowUpId' | 'createdAt' | 'updatedAt'>);
    }
    
    setShowForm(false);
    setEditingPayment(null);
    setFormData({});
    loadPayments();
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingPayment(null);
    setFormData({});
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-700';
      case 'Partial': return 'bg-blue-100 text-blue-700';
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      case 'Overdue': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getAgingColor = (aging: string) => {
    switch (aging) {
      case '0-30 days': return 'bg-green-100 text-green-700';
      case '30-60 days': return 'bg-yellow-100 text-yellow-700';
      case '60-90 days': return 'bg-orange-100 text-orange-700';
      case '90+ days': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const addFollowUp = () => {
    setFormData({
      ...formData,
      followUpLog: [...(formData.followUpLog || []), { date: '', contactMethod: '', notes: '' }],
    });
  };

  const updateFollowUp = (index: number, field: string, value: any) => {
    const updated = [...(formData.followUpLog || [])];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, followUpLog: updated });
  };

  const removeFollowUp = (index: number) => {
    const updated = formData.followUpLog?.filter((_, i) => i !== index) || [];
    setFormData({ ...formData, followUpLog: updated });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Payment Follow-Up</h2>
            <p className="text-sm text-slate-500">Track payment collection and follow-ups</p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Create Payment
          </Button>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              No payment records found. Create your first payment to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Invoice No.</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Invoice Value</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Due Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Received</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Outstanding</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Aging</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.paymentFollowUpId} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm font-medium">{payment.invoiceNumber}</td>
                      <td className="px-4 py-3 text-sm">{payment.currency} {payment.invoiceValue}</td>
                      <td className="px-4 py-3 text-sm">{payment.dueDate}</td>
                      <td className="px-4 py-3 text-sm">{payment.currency} {payment.amountReceived}</td>
                      <td className="px-4 py-3 text-sm">{payment.currency} {payment.outstandingAmount}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getAgingColor(payment.aging)}`}>
                          {payment.aging}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(payment.paymentStatus)}`}>
                          {payment.paymentStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button variant="secondary" size="sm" onClick={() => handleEdit(payment)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="secondary" size="sm" onClick={() => handleDelete(payment.paymentFollowUpId)}>
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
                {editingPayment ? 'Edit Payment Follow-Up' : 'Create New Payment Follow-Up'}
              </h2>
              <p className="text-sm text-slate-500">
                {editingPayment ? 'Update payment details' : 'Create a new payment follow-up'}
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Invoice Number *</label>
                  <Input
                    required
                    value={formData.invoiceNumber || ''}
                    onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                    placeholder="Invoice number"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Invoice Value *</label>
                  <Input
                    required
                    type="number"
                    step="0.01"
                    value={formData.invoiceValue || ''}
                    onChange={(e) => setFormData({ ...formData, invoiceValue: parseFloat(e.target.value) || 0 })}
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
                  <label className="mb-1 block text-sm font-medium text-slate-700">Due Date *</label>
                  <Input
                    required
                    type="date"
                    value={formData.dueDate || ''}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Payment Received Date</label>
                  <Input
                    type="date"
                    value={formData.paymentReceivedDate || ''}
                    onChange={(e) => setFormData({ ...formData, paymentReceivedDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Amount Received *</label>
                  <Input
                    required
                    type="number"
                    step="0.01"
                    value={formData.amountReceived || ''}
                    onChange={(e) => setFormData({ ...formData, amountReceived: parseFloat(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Outstanding Amount *</label>
                  <Input
                    required
                    type="number"
                    step="0.01"
                    value={formData.outstandingAmount || ''}
                    onChange={(e) => setFormData({ ...formData, outstandingAmount: parseFloat(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Aging *</label>
                  <select
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={formData.aging || ''}
                    onChange={(e) => setFormData({ ...formData, aging: e.target.value as any })}
                  >
                    <option value="0-30 days">0-30 days</option>
                    <option value="30-60 days">30-60 days</option>
                    <option value="60-90 days">60-90 days</option>
                    <option value="90+ days">90+ days</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Payment Status *</label>
                  <select
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={formData.paymentStatus || ''}
                    onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value as any })}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Partial">Partial</option>
                    <option value="Paid">Paid</option>
                    <option value="Overdue">Overdue</option>
                  </select>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Follow-Up Log</h3>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={addFollowUp}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Follow-Up
                  </Button>
                </div>
                {formData.followUpLog?.map((log, index) => (
                  <div key={index} className="grid grid-cols-4 gap-2 mb-2">
                    <Input
                      type="date"
                      placeholder="Date"
                      value={log.date}
                      onChange={(e) => updateFollowUp(index, 'date', e.target.value)}
                    />
                    <Input
                      placeholder="Contact Method"
                      value={log.contactMethod}
                      onChange={(e) => updateFollowUp(index, 'contactMethod', e.target.value)}
                    />
                    <Input
                      placeholder="Notes"
                      value={log.notes}
                      onChange={(e) => updateFollowUp(index, 'notes', e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => removeFollowUp(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
                  {editingPayment ? 'Update Payment' : 'Create Payment'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
