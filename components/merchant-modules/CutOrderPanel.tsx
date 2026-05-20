// File: components/merchant-modules/CutOrderPanel.tsx
// Phase 8: Cut Orders - Full CRUD Component

'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import type { CutOrder } from '@/lib/merchant-types';
import { merchantStore } from '@/lib/merchant-store';

export function CutOrderPanel() {
  const [cutOrders, setCutOrders] = useState<CutOrder[]>([]);
  const [workOrders, setWorkOrders] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCutOrder, setEditingCutOrder] = useState<CutOrder | null>(null);
  const [formData, setFormData] = useState<Partial<CutOrder>>({});

  useEffect(() => {
    loadCutOrders();
    loadWorkOrders();
  }, []);

  const loadCutOrders = () => {
    setCutOrders(merchantStore.getAllCutOrders?.() || []);
  };

  const loadWorkOrders = () => {
    setWorkOrders(merchantStore.getAllInternalWorkOrders?.() || []);
  };

  const handleCreate = () => {
    setEditingCutOrder(null);
    setFormData({
      status: 'Planned',
      cutQuantity: [],
      cuttingDepartmentConfirmation: false,
    });
    setShowForm(true);
  };

  const handleEdit = (cutOrder: CutOrder) => {
    setEditingCutOrder(cutOrder);
    setFormData({ ...cutOrder });
    setShowForm(true);
  };

  const handleDelete = (cutOrderId: string) => {
    if (confirm('Are you sure you want to delete this cut order?')) {
      setCutOrders(cutOrders.filter(c => c.cutOrderId !== cutOrderId));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCutOrder) {
      merchantStore.updateCutOrder?.(editingCutOrder.cutOrderId, formData);
    } else {
      merchantStore.createCutOrder(formData as Omit<CutOrder, 'cutOrderId' | 'cutOrderNumber' | 'createdAt' | 'updatedAt'>);
    }
    
    setShowForm(false);
    setEditingCutOrder(null);
    setFormData({});
    loadCutOrders();
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCutOrder(null);
    setFormData({});
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-700';
      case 'In Progress': return 'bg-blue-100 text-blue-700';
      case 'Planned': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const addCutQuantity = () => {
    setFormData({
      ...formData,
      cutQuantity: [...(formData.cutQuantity || []), { size: '', color: '', quantity: 0 }],
    });
  };

  const updateCutQuantity = (index: number, field: string, value: any) => {
    const updated = [...(formData.cutQuantity || [])];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, cutQuantity: updated });
  };

  const removeCutQuantity = (index: number) => {
    const updated = formData.cutQuantity?.filter((_, i) => i !== index) || [];
    setFormData({ ...formData, cutQuantity: updated });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Cut Orders</h2>
            <p className="text-sm text-slate-500">Manage cutting department orders</p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Create Cut Order
          </Button>
        </CardHeader>
        <CardContent>
          {cutOrders.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              No cut orders found. Create your first cut order to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Cut Order No.</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Internal Order</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Style Ref</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Cut Start</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Cut Completion</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cutOrders.map((cutOrder) => (
                    <tr key={cutOrder.cutOrderId} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm font-medium">{cutOrder.cutOrderNumber}</td>
                      <td className="px-4 py-3 text-sm">{cutOrder.internalOrderNumber}</td>
                      <td className="px-4 py-3 text-sm">{cutOrder.styleReference}</td>
                      <td className="px-4 py-3 text-sm">{cutOrder.cuttingStartDate}</td>
                      <td className="px-4 py-3 text-sm">{cutOrder.cuttingCompletionDate}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(cutOrder.status)}`}>
                          {cutOrder.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button variant="secondary" size="sm" onClick={() => handleEdit(cutOrder)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="secondary" size="sm" onClick={() => handleDelete(cutOrder.cutOrderId)}>
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
                {editingCutOrder ? 'Edit Cut Order' : 'Create New Cut Order'}
              </h2>
              <p className="text-sm text-slate-500">
                {editingCutOrder ? 'Update cut order details' : 'Create a new cutting department order'}
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Internal Order Number *</label>
                  <select
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={formData.internalOrderNumber || ''}
                    onChange={(e) => {
                      const wo = workOrders.find(w => w.internalOrderNumber === e.target.value);
                      setFormData({ 
                        ...formData, 
                        internalOrderNumber: e.target.value,
                        styleReference: wo?.styleSummary || '',
                      });
                    }}
                  >
                    <option value="">Select Work Order</option>
                    {workOrders.map((wo) => (
                      <option key={wo.workOrderId} value={wo.internalOrderNumber}>
                        {wo.internalOrderNumber}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Style Reference *</label>
                  <Input
                    required
                    value={formData.styleReference || ''}
                    onChange={(e) => setFormData({ ...formData, styleReference: e.target.value })}
                    placeholder="Auto-filled from work order"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Cutting Start Date *</label>
                  <Input
                    required
                    type="date"
                    value={formData.cuttingStartDate || ''}
                    onChange={(e) => setFormData({ ...formData, cuttingStartDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Cutting Completion Date *</label>
                  <Input
                    required
                    type="date"
                    value={formData.cuttingCompletionDate || ''}
                    onChange={(e) => setFormData({ ...formData, cuttingCompletionDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Layer Plan *</label>
                  <Input
                    required
                    value={formData.layerPlan || ''}
                    onChange={(e) => setFormData({ ...formData, layerPlan: e.target.value })}
                    placeholder="e.g., 2 layers, 3 layers"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Marker Plan *</label>
                  <Input
                    required
                    value={formData.markerPlan || ''}
                    onChange={(e) => setFormData({ ...formData, markerPlan: e.target.value })}
                    placeholder="e.g., Marker efficiency 85%"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Fabric Consumption Planned *</label>
                  <Input
                    required
                    type="number"
                    step="0.01"
                    value={formData.fabricConsumptionPlanned || ''}
                    onChange={(e) => setFormData({ ...formData, fabricConsumptionPlanned: parseFloat(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Fabric Consumption Actual</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.fabricConsumptionActual || ''}
                    onChange={(e) => setFormData({ ...formData, fabricConsumptionActual: parseFloat(e.target.value) || 0 })}
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
                    <option value="Planned">Planned</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Cutting Department Confirmation</label>
                  <select
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={formData.cuttingDepartmentConfirmation ? 'true' : 'false'}
                    onChange={(e) => setFormData({ ...formData, cuttingDepartmentConfirmation: e.target.value === 'true' })}
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Cut Quantity (Size/Color)</h3>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={addCutQuantity}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Size/Color
                  </Button>
                </div>
                {formData.cutQuantity?.map((item, index) => (
                  <div key={index} className="grid grid-cols-4 gap-2 mb-2">
                    <Input
                      placeholder="Size"
                      value={item.size}
                      onChange={(e) => updateCutQuantity(index, 'size', e.target.value)}
                    />
                    <Input
                      placeholder="Color"
                      value={item.color}
                      onChange={(e) => updateCutQuantity(index, 'color', e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="Quantity"
                      value={item.quantity || ''}
                      onChange={(e) => updateCutQuantity(index, 'quantity', parseInt(e.target.value) || 0)}
                    />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => removeCutQuantity(index)}
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
                  {editingCutOrder ? 'Update Cut Order' : 'Create Cut Order'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
