// File: components/merchant-modules/ProductionTrackingPanel.tsx
// Phase 8: Production Tracking - Full CRUD Component

'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import type { ProductionTrackingRecord, ProductionDailyUpdate } from '@/lib/merchant-types';
import { merchantStore } from '@/lib/merchant-store';

export function ProductionTrackingPanel() {
  const [productionTrackings, setProductionTrackings] = useState<ProductionTrackingRecord[]>([]);
  const [workOrders, setWorkOrders] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTracking, setEditingTracking] = useState<ProductionTrackingRecord | null>(null);
  const [formData, setFormData] = useState<Partial<ProductionTrackingRecord>>({});

  useEffect(() => {
    loadProductionTrackings();
    loadWorkOrders();
  }, []);

  const loadProductionTrackings = () => {
    setProductionTrackings(merchantStore.getAllProductionTrackings?.() || []);
  };

  const loadWorkOrders = () => {
    setWorkOrders(merchantStore.getAllInternalWorkOrders?.() || []);
  };

  const handleCreate = () => {
    setEditingTracking(null);
    setFormData({
      dailyUpdates: [],
      productionEfficiencyPercent: 0,
      balanceQuantity: 0,
      alerts: [],
    });
    setShowForm(true);
  };

  const handleEdit = (tracking: ProductionTrackingRecord) => {
    setEditingTracking(tracking);
    setFormData({ ...tracking });
    setShowForm(true);
  };

  const handleDelete = (productionTrackingId: string) => {
    if (confirm('Are you sure you want to delete this production tracking record?')) {
      setProductionTrackings(productionTrackings.filter(p => p.productionTrackingId !== productionTrackingId));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingTracking) {
      merchantStore.updateProductionTracking?.(editingTracking.productionTrackingId, formData);
    } else {
      merchantStore.createProductionTracking?.(formData as Omit<ProductionTrackingRecord, 'productionTrackingId' | 'createdAt' | 'updatedAt'>);
    }
    
    setShowForm(false);
    setEditingTracking(null);
    setFormData({});
    loadProductionTrackings();
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTracking(null);
    setFormData({});
  };

  const addDailyUpdate = () => {
    const newUpdate: ProductionDailyUpdate = {
      updateId: `UPD-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      cuttingDone: 0,
      stitchingDone: 0,
      finishingDone: 0,
      qcPassed: 0,
      qcRejected: 0,
      updatedAt: new Date().toISOString(),
    };
    setFormData({
      ...formData,
      dailyUpdates: [...(formData.dailyUpdates || []), newUpdate],
    });
  };

  const updateDailyUpdate = (index: number, field: keyof ProductionDailyUpdate, value: any) => {
    const updated = [...(formData.dailyUpdates || [])];
    updated[index] = { ...updated[index], [field]: value, updatedAt: new Date().toISOString() };
    setFormData({ ...formData, dailyUpdates: updated });
  };

  const removeDailyUpdate = (index: number) => {
    const updated = formData.dailyUpdates?.filter((_, i) => i !== index) || [];
    setFormData({ ...formData, dailyUpdates: updated });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Production Tracking</h2>
            <p className="text-sm text-slate-500">Track daily production updates and efficiency</p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Create Tracking
          </Button>
        </CardHeader>
        <CardContent>
          {productionTrackings.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              No production tracking records found. Create your first tracking to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Order Number</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Style Ref</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Total Qty</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Balance</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Efficiency %</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Projected Completion</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Daily Updates</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {productionTrackings.map((tracking) => (
                    <tr key={tracking.productionTrackingId} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm font-medium">{tracking.orderNumber}</td>
                      <td className="px-4 py-3 text-sm">{tracking.styleReference}</td>
                      <td className="px-4 py-3 text-sm">{tracking.totalOrderQuantity}</td>
                      <td className="px-4 py-3 text-sm">{tracking.balanceQuantity}</td>
                      <td className="px-4 py-3 text-sm">{tracking.productionEfficiencyPercent}%</td>
                      <td className="px-4 py-3 text-sm">{tracking.projectedCompletionDate}</td>
                      <td className="px-4 py-3 text-sm">{tracking.dailyUpdates.length} updates</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button variant="secondary" size="sm" onClick={() => handleEdit(tracking)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="secondary" size="sm" onClick={() => handleDelete(tracking.productionTrackingId)}>
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
                {editingTracking ? 'Edit Production Tracking' : 'Create New Production Tracking'}
              </h2>
              <p className="text-sm text-slate-500">
                {editingTracking ? 'Update tracking details' : 'Create a new production tracking record'}
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Order Number *</label>
                  <select
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={formData.orderNumber || ''}
                    onChange={(e) => {
                      const wo = workOrders.find(w => w.internalOrderNumber === e.target.value);
                      setFormData({ 
                        ...formData, 
                        orderNumber: e.target.value,
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
                  <label className="mb-1 block text-sm font-medium text-slate-700">Total Order Quantity *</label>
                  <Input
                    required
                    type="number"
                    value={formData.totalOrderQuantity || ''}
                    onChange={(e) => setFormData({ ...formData, totalOrderQuantity: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Balance Quantity *</label>
                  <Input
                    required
                    type="number"
                    value={formData.balanceQuantity || ''}
                    onChange={(e) => setFormData({ ...formData, balanceQuantity: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Production Efficiency % *</label>
                  <Input
                    required
                    type="number"
                    value={formData.productionEfficiencyPercent || ''}
                    onChange={(e) => setFormData({ ...formData, productionEfficiencyPercent: parseFloat(e.target.value) || 0 })}
                    placeholder="e.g., 85"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Projected Completion Date *</label>
                  <Input
                    required
                    type="date"
                    value={formData.projectedCompletionDate || ''}
                    onChange={(e) => setFormData({ ...formData, projectedCompletionDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <label className="mb-1 block text-sm font-medium text-slate-700">Alerts (comma-separated)</label>
                <Input
                  value={formData.alerts?.join(', ') || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    alerts: e.target.value.split(',').map(a => a.trim()).filter(Boolean)
                  })}
                  placeholder="e.g., Delay risk, Quality issue"
                />
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Daily Updates</h3>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={addDailyUpdate}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Daily Update
                  </Button>
                </div>
                {formData.dailyUpdates?.map((update, index) => (
                  <div key={index} className="grid grid-cols-6 gap-2 mb-2">
                    <Input
                      type="date"
                      value={update.date}
                      onChange={(e) => updateDailyUpdate(index, 'date', e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="Cutting"
                      value={update.cuttingDone || ''}
                      onChange={(e) => updateDailyUpdate(index, 'cuttingDone', parseInt(e.target.value) || 0)}
                    />
                    <Input
                      type="number"
                      placeholder="Stitching"
                      value={update.stitchingDone || ''}
                      onChange={(e) => updateDailyUpdate(index, 'stitchingDone', parseInt(e.target.value) || 0)}
                    />
                    <Input
                      type="number"
                      placeholder="Finishing"
                      value={update.finishingDone || ''}
                      onChange={(e) => updateDailyUpdate(index, 'finishingDone', parseInt(e.target.value) || 0)}
                    />
                    <Input
                      type="number"
                      placeholder="QC Passed"
                      value={update.qcPassed || ''}
                      onChange={(e) => updateDailyUpdate(index, 'qcPassed', parseInt(e.target.value) || 0)}
                    />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => removeDailyUpdate(index)}
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
                  {editingTracking ? 'Update Tracking' : 'Create Tracking'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
