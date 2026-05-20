// File: components/merchant-modules/TrimPurchaseOrderPanel.tsx
// Phase 7: Trim Purchase Order - Full CRUD Component

'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import type { TrimPurchaseOrder } from '@/lib/merchant-types';
import { merchantStore } from '@/lib/merchant-store';

export function TrimPurchaseOrderPanel() {
  const [trimPOs, setTrimPOs] = useState<TrimPurchaseOrder[]>([]);
  const [trimRequirements, setTrimRequirements] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPO, setEditingPO] = useState<TrimPurchaseOrder | null>(null);
  const [formData, setFormData] = useState<Partial<TrimPurchaseOrder>>({});

  useEffect(() => {
    loadTrimPOs();
    loadTrimRequirements();
  }, []);

  const loadTrimPOs = () => {
    setTrimPOs(merchantStore.getAllTrimPOs?.() || []);
  };

  const loadTrimRequirements = () => {
    setTrimRequirements(merchantStore.getAllTrimRequirements?.() || []);
  };

  const handleCreate = () => {
    setEditingPO(null);
    setFormData({
      status: 'Raised',
    });
    setShowForm(true);
  };

  const handleEdit = (po: TrimPurchaseOrder) => {
    setEditingPO(po);
    setFormData({ ...po });
    setShowForm(true);
  };

  const handleDelete = (trimPOId: string) => {
    if (confirm('Are you sure you want to delete this trim PO?')) {
      setTrimPOs(trimPOs.filter(p => p.trimPOId !== trimPOId));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingPO) {
      merchantStore.updateTrimPO?.(editingPO.trimPOId, formData);
    } else {
      merchantStore.createTrimPO?.(formData as Omit<TrimPurchaseOrder, 'trimPOId' | 'trimPONumber' | 'createdAt' | 'updatedAt'>);
    }
    
    setShowForm(false);
    setEditingPO(null);
    setFormData({});
    loadTrimPOs();
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingPO(null);
    setFormData({});
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Received': return 'bg-green-100 text-green-700';
      case 'Confirmed': return 'bg-blue-100 text-blue-700';
      case 'Raised': return 'bg-yellow-100 text-yellow-700';
      case 'Cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Trim Purchase Orders</h2>
            <p className="text-sm text-slate-500">Manage trim purchase orders</p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Create PO
          </Button>
        </CardHeader>
        <CardContent>
          {trimPOs.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              No trim POs found. Create your first PO to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">PO Number</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Supplier</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Items</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Total Value</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Delivery</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {trimPOs.map((po) => (
                    <tr key={po.trimPOId} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm font-medium">{po.trimPONumber}</td>
                      <td className="px-4 py-3 text-sm">{po.poDate}</td>
                      <td className="px-4 py-3 text-sm">{po.supplierName}</td>
                      <td className="px-4 py-3 text-sm">{po.itemWiseDetails.length} items</td>
                      <td className="px-4 py-3 text-sm">{po.totalValue.toFixed(2)} {po.currency}</td>
                      <td className="px-4 py-3 text-sm">{po.deliveryDate}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(po.status)}`}>
                          {po.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button variant="secondary" size="sm" onClick={() => handleEdit(po)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="secondary" size="sm" onClick={() => handleDelete(po.trimPOId)}>
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
                {editingPO ? 'Edit Trim PO' : 'Create New Trim PO'}
              </h2>
              <p className="text-sm text-slate-500">
                {editingPO ? 'Update PO details' : 'Create a new trim purchase order'}
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">PO Date *</label>
                  <Input
                    required
                    type="date"
                    value={formData.poDate || ''}
                    onChange={(e) => setFormData({ ...formData, poDate: e.target.value })}
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
                  <label className="mb-1 block text-sm font-medium text-slate-700">Currency *</label>
                  <Input
                    required
                    value={formData.currency || ''}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    placeholder="e.g., USD, EUR"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Delivery Date *</label>
                  <Input
                    required
                    type="date"
                    value={formData.deliveryDate || ''}
                    onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
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
                    <option value="Raised">Raised</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Received">Received</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Item-wise Details</h3>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      const newItem = { item: '', description: '', quantity: 0, rate: 0, total: 0 };
                      setFormData({
                        ...formData,
                        itemWiseDetails: [...(formData.itemWiseDetails || []), newItem],
                      });
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>
                {formData.itemWiseDetails?.map((item, index) => (
                  <div key={index} className="grid grid-cols-5 gap-2 mb-2">
                    <Input
                      placeholder="Item"
                      value={item.item}
                      onChange={(e) => {
                        const updated = [...(formData.itemWiseDetails || [])];
                        updated[index] = { ...item, item: e.target.value };
                        setFormData({ ...formData, itemWiseDetails: updated });
                      }}
                    />
                    <Input
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => {
                        const updated = [...(formData.itemWiseDetails || [])];
                        updated[index] = { ...item, description: e.target.value };
                        setFormData({ ...formData, itemWiseDetails: updated });
                      }}
                    />
                    <Input
                      type="number"
                      placeholder="Qty"
                      value={item.quantity || ''}
                      onChange={(e) => {
                        const qty = parseFloat(e.target.value) || 0;
                        const updated = [...(formData.itemWiseDetails || [])];
                        updated[index] = { ...item, quantity: qty, total: qty * (item.rate || 0) };
                        setFormData({ ...formData, itemWiseDetails: updated });
                      }}
                    />
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Rate"
                      value={item.rate || ''}
                      onChange={(e) => {
                        const rate = parseFloat(e.target.value) || 0;
                        const updated = [...(formData.itemWiseDetails || [])];
                        updated[index] = { ...item, rate, total: rate * (item.quantity || 0) };
                        setFormData({ ...formData, itemWiseDetails: updated });
                      }}
                    />
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Total"
                        value={item.total || ''}
                        readOnly
                        className="bg-slate-50"
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => {
                          const updated = formData.itemWiseDetails?.filter((_, i) => i !== index) || [];
                          setFormData({ ...formData, itemWiseDetails: updated });
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Total Value</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.totalValue || ''}
                      onChange={(e) => setFormData({ ...formData, totalValue: parseFloat(e.target.value) || 0 })}
                      placeholder="Auto-calculated"
                      readOnly
                      className="bg-slate-50"
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
                  {editingPO ? 'Update PO' : 'Create PO'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
