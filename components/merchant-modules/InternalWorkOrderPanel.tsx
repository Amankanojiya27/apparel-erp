// File: components/merchant-modules/InternalWorkOrderPanel.tsx
// Phase 5: Internal Work Order - Full CRUD Component

'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import type { InternalWorkOrder } from '@/lib/merchant-types';
import { merchantStore } from '@/lib/merchant-store';

export function InternalWorkOrderPanel() {
  const [workOrders, setWorkOrders] = useState<InternalWorkOrder[]>([]);
  const [buyerPOs, setBuyerPOs] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingWO, setEditingWO] = useState<InternalWorkOrder | null>(null);
  const [formData, setFormData] = useState<Partial<InternalWorkOrder>>({});

  useEffect(() => {
    loadWorkOrders();
    loadBuyerPOs();
  }, []);

  const loadWorkOrders = () => {
    setWorkOrders(merchantStore.getAllInternalWorkOrders?.() || []);
  };

  const loadBuyerPOs = () => {
    setBuyerPOs(merchantStore.getAllBuyerPOs?.() || []);
  };

  const handleCreate = () => {
    setEditingWO(null);
    setFormData({
      status: 'Created',
    });
    setShowForm(true);
  };

  const handleEdit = (wo: InternalWorkOrder) => {
    setEditingWO(wo);
    setFormData({ ...wo });
    setShowForm(true);
  };

  const handleDelete = (workOrderId: string) => {
    if (confirm('Are you sure you want to delete this work order?')) {
      setWorkOrders(workOrders.filter(w => w.workOrderId !== workOrderId));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingWO) {
      merchantStore.updateInternalWorkOrder?.(editingWO.workOrderId, formData);
    } else {
      merchantStore.createInternalWorkOrder?.(formData as Omit<InternalWorkOrder, 'workOrderId' | 'internalOrderNumber' | 'createdAt' | 'updatedAt'>);
    }
    
    setShowForm(false);
    setEditingWO(null);
    setFormData({});
    loadWorkOrders();
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingWO(null);
    setFormData({});
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-700';
      case 'In Progress': return 'bg-blue-100 text-blue-700';
      case 'Shared': return 'bg-purple-100 text-purple-700';
      case 'Created': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Internal Work Orders</h2>
            <p className="text-sm text-slate-500">Manage internal work orders for production</p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Create Work Order
          </Button>
        </CardHeader>
        <CardContent>
          {workOrders.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              No work orders found. Create your first work order to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Order Number</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Buyer PO</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Merchant</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Factory Unit</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Delivery Schedule</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Internal Ex-Factory</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {workOrders.map((wo) => (
                    <tr key={wo.workOrderId} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm font-medium">{wo.internalOrderNumber}</td>
                      <td className="px-4 py-3 text-sm">{wo.buyerPONumber}</td>
                      <td className="px-4 py-3 text-sm">{wo.merchantName}</td>
                      <td className="px-4 py-3 text-sm">{wo.factoryUnit}</td>
                      <td className="px-4 py-3 text-sm">{wo.deliverySchedule}</td>
                      <td className="px-4 py-3 text-sm">{wo.internalExFactoryDate}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(wo.status)}`}>
                          {wo.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button variant="secondary" size="sm" onClick={() => handleEdit(wo)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="secondary" size="sm" onClick={() => handleDelete(wo.workOrderId)}>
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
                {editingWO ? 'Edit Work Order' : 'Create New Work Order'}
              </h2>
              <p className="text-sm text-slate-500">
                {editingWO ? 'Update work order details' : 'Create internal work order from buyer PO'}
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Buyer PO *</label>
                  <select
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={formData.buyerPOId || ''}
                    onChange={(e) => {
                      const po = buyerPOs.find(p => p.buyerPOId === e.target.value);
                      setFormData({ 
                        ...formData, 
                        buyerPOId: e.target.value,
                        buyerPONumber: po?.poNumber || '',
                        styleSummary: po?.styleDescription || '',
                      });
                    }}
                  >
                    <option value="">Select Buyer PO</option>
                    {buyerPOs.map((po) => (
                      <option key={po.buyerPOId} value={po.buyerPOId}>
                        {po.poNumber} - {po.styleReference}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Merchant Name *</label>
                  <Input
                    required
                    value={formData.merchantName || ''}
                    onChange={(e) => setFormData({ ...formData, merchantName: e.target.value })}
                    placeholder="Merchant name"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Factory Unit *</label>
                  <Input
                    required
                    value={formData.factoryUnit || ''}
                    onChange={(e) => setFormData({ ...formData, factoryUnit: e.target.value })}
                    placeholder="e.g., Unit A, Unit B"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Style Summary</label>
                  <Input
                    value={formData.styleSummary || ''}
                    onChange={(e) => setFormData({ ...formData, styleSummary: e.target.value })}
                    placeholder="Style summary"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Size Set</label>
                  <Input
                    value={formData.sizeSet?.join(', ') || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      sizeSet: e.target.value.split(',').map(s => s.trim()).filter(Boolean) 
                    })}
                    placeholder="e.g., XS, S, M, L, XL, XXL"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Color Options</label>
                  <Input
                    value={formData.colorOptions?.join(', ') || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      colorOptions: e.target.value.split(',').map(c => c.trim()).filter(Boolean) 
                    })}
                    placeholder="e.g., Navy, Black, White"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Delivery Schedule *</label>
                  <Input
                    required
                    value={formData.deliverySchedule || ''}
                    onChange={(e) => setFormData({ ...formData, deliverySchedule: e.target.value })}
                    placeholder="e.g., Week 1-4"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Internal Ex-Factory Date *</label>
                  <Input
                    required
                    type="date"
                    value={formData.internalExFactoryDate || ''}
                    onChange={(e) => setFormData({ ...formData, internalExFactoryDate: e.target.value })}
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
                    <option value="Created">Created</option>
                    <option value="Shared">Shared</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="border-t pt-4">
                <label className="mb-1 block text-sm font-medium text-slate-700">Shared With Departments</label>
                <textarea
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                  rows={2}
                  value={formData.sharedWithDepartments?.join(', ') || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    sharedWithDepartments: e.target.value.split(',').map(d => d.trim()).filter(Boolean) 
                  })}
                  placeholder="e.g., Production, Planning, QC"
                />
              </div>

              <div className="flex justify-end gap-3 border-t pt-4">
                <Button variant="secondary" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  {editingWO ? 'Update Work Order' : 'Create Work Order'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
