// File: components/merchant-modules/InvoicesPanel.tsx
// Phase 12: Invoices - Full CRUD Component

'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import type { InvoiceToBuyer } from '@/lib/merchant-types';
import { merchantStore } from '@/lib/merchant-store';

export function InvoicesPanel() {
  const [invoices, setInvoices] = useState<InvoiceToBuyer[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<InvoiceToBuyer | null>(null);
  const [formData, setFormData] = useState<Partial<InvoiceToBuyer>>({});

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = () => {
    setInvoices(merchantStore.getAllInvoices?.() || []);
  };

  const handleCreate = () => {
    setEditingInvoice(null);
    setFormData({
      status: 'Sent',
      paymentReceived: false,
      outstandingAmount: 0,
      itemWiseBilling: [],
    });
    setShowForm(true);
  };

  const handleEdit = (invoice: InvoiceToBuyer) => {
    setEditingInvoice(invoice);
    setFormData({ ...invoice });
    setShowForm(true);
  };

  const handleDelete = (invoiceId: string) => {
    if (confirm('Are you sure you want to delete this invoice?')) {
      setInvoices(invoices.filter(i => i.invoiceId !== invoiceId));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingInvoice) {
      merchantStore.updateInvoice?.(editingInvoice.invoiceId, formData);
    } else {
      merchantStore.createInvoice?.(formData as Omit<InvoiceToBuyer, 'invoiceId' | 'invoiceNumber' | 'createdAt' | 'updatedAt'>);
    }
    
    setShowForm(false);
    setEditingInvoice(null);
    setFormData({});
    loadInvoices();
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingInvoice(null);
    setFormData({});
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-700';
      case 'Partial Paid': return 'bg-blue-100 text-blue-700';
      case 'Sent': return 'bg-slate-100 text-slate-700';
      case 'Overdue': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const addItem = () => {
    setFormData({
      ...formData,
      itemWiseBilling: [...(formData.itemWiseBilling || []), { item: '', quantity: 0, rate: 0, amount: 0 }],
    });
  };

  const updateItem = (index: number, field: string, value: any) => {
    const updated = [...(formData.itemWiseBilling || [])];
    updated[index] = { ...updated[index], [field]: value };
    if (field === 'quantity' || field === 'rate') {
      updated[index].amount = (updated[index].quantity || 0) * (updated[index].rate || 0);
    }
    setFormData({ ...formData, itemWiseBilling: updated });
  };

  const removeItem = (index: number) => {
    const updated = formData.itemWiseBilling?.filter((_, i) => i !== index) || [];
    setFormData({ ...formData, itemWiseBilling: updated });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Invoices to Buyer</h2>
            <p className="text-sm text-slate-500">Manage buyer invoices and payment tracking</p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Create Invoice
          </Button>
        </CardHeader>
        <CardContent>
          {invoices.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              No invoices found. Create your first invoice to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Invoice No.</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">PO Ref</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Shipment Ref</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Currency</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Due Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.invoiceId} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm font-medium">{invoice.invoiceNumber}</td>
                      <td className="px-4 py-3 text-sm">{invoice.invoiceDate}</td>
                      <td className="px-4 py-3 text-sm">{invoice.poReference}</td>
                      <td className="px-4 py-3 text-sm">{invoice.shipmentReference}</td>
                      <td className="px-4 py-3 text-sm">{invoice.finalPayableAmount}</td>
                      <td className="px-4 py-3 text-sm">{invoice.currency}</td>
                      <td className="px-4 py-3 text-sm">{invoice.dueDate}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(invoice.status)}`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button variant="secondary" size="sm" onClick={() => handleEdit(invoice)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="secondary" size="sm" onClick={() => handleDelete(invoice.invoiceId)}>
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
                {editingInvoice ? 'Edit Invoice' : 'Create New Invoice'}
              </h2>
              <p className="text-sm text-slate-500">
                {editingInvoice ? 'Update invoice details' : 'Create a new invoice'}
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Invoice Date *</label>
                  <Input
                    required
                    type="date"
                    value={formData.invoiceDate || ''}
                    onChange={(e) => setFormData({ ...formData, invoiceDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">PO Reference *</label>
                  <Input
                    required
                    value={formData.poReference || ''}
                    onChange={(e) => setFormData({ ...formData, poReference: e.target.value })}
                    placeholder="PO number"
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
                  <label className="mb-1 block text-sm font-medium text-slate-700">Due Date *</label>
                  <Input
                    required
                    type="date"
                    value={formData.dueDate || ''}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
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
                  <label className="mb-1 block text-sm font-medium text-slate-700">Discount Deductions</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.discountDeductions || ''}
                    onChange={(e) => setFormData({ ...formData, discountDeductions: parseFloat(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Final Payable Amount *</label>
                  <Input
                    required
                    type="number"
                    step="0.01"
                    value={formData.finalPayableAmount || ''}
                    onChange={(e) => setFormData({ ...formData, finalPayableAmount: parseFloat(e.target.value) || 0 })}
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
                  <label className="mb-1 block text-sm font-medium text-slate-700">Status *</label>
                  <select
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={formData.status || ''}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  >
                    <option value="Sent">Sent</option>
                    <option value="Partial Paid">Partial Paid</option>
                    <option value="Paid">Paid</option>
                    <option value="Overdue">Overdue</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Payment Received</label>
                  <select
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={formData.paymentReceived ? 'true' : 'false'}
                    onChange={(e) => setFormData({ ...formData, paymentReceived: e.target.value === 'true' })}
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </div>
                {formData.paymentReceived && (
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Payment Received Date</label>
                    <Input
                      type="date"
                      value={formData.paymentReceivedDate || ''}
                      onChange={(e) => setFormData({ ...formData, paymentReceivedDate: e.target.value })}
                    />
                  </div>
                )}
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Item-wise Billing</h3>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={addItem}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>
                {formData.itemWiseBilling?.map((item, index) => (
                  <div key={index} className="grid grid-cols-5 gap-2 mb-2">
                    <Input
                      placeholder="Item"
                      value={item.item}
                      onChange={(e) => updateItem(index, 'item', e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="Qty"
                      value={item.quantity || ''}
                      onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                    />
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Rate"
                      value={item.rate || ''}
                      onChange={(e) => updateItem(index, 'rate', parseFloat(e.target.value) || 0)}
                    />
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Amount"
                      value={item.amount || ''}
                      readOnly
                    />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => removeItem(index)}
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
                  {editingInvoice ? 'Update Invoice' : 'Create Invoice'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
