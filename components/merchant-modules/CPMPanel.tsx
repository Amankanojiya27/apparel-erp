// File: components/merchant-modules/CPMPanel.tsx
// Phase 8: Critical Path Management - Full CRUD Component

'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import type { CriticalPathManagement, CPMActivity } from '@/lib/merchant-types';
import { merchantStore } from '@/lib/merchant-store';

export function CPMPanel() {
  const [cpms, setCpms] = useState<CriticalPathManagement[]>([]);
  const [workOrders, setWorkOrders] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCPM, setEditingCPM] = useState<CriticalPathManagement | null>(null);
  const [formData, setFormData] = useState<Partial<CriticalPathManagement>>({});

  useEffect(() => {
    loadCPMs();
    loadWorkOrders();
  }, []);

  const loadCPMs = () => {
    setCpms(merchantStore.getAllCPMs?.() || []);
  };

  const loadWorkOrders = () => {
    setWorkOrders(merchantStore.getAllInternalWorkOrders());
  };

  const handleCreate = () => {
    setEditingCPM(null);
    setFormData({
      overallOrderHealth: 'Green',
      autoAlertEnabled: true,
      activities: [],
    });
    setShowForm(true);
  };

  const handleEdit = (cpm: CriticalPathManagement) => {
    setEditingCPM(cpm);
    setFormData({ ...cpm });
    setShowForm(true);
  };

  const handleDelete = (cpmId: string) => {
    if (confirm('Are you sure you want to delete this CPM record?')) {
      setCpms(cpms.filter(c => c.cpmId !== cpmId));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCPM) {
      merchantStore.updateCPM?.(editingCPM.cpmId, formData);
    } else {
      merchantStore.createCPM(formData as Omit<CriticalPathManagement, 'cpmId' | 'createdAt' | 'updatedAt'>);
    }
    
    setShowForm(false);
    setEditingCPM(null);
    setFormData({});
    loadCPMs();
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCPM(null);
    setFormData({});
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'Green': return 'bg-green-100 text-green-700';
      case 'Yellow': return 'bg-yellow-100 text-yellow-700';
      case 'Red': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Critical Path Management</h2>
            <p className="text-sm text-slate-500">Track order milestones and activities</p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Create CPM
          </Button>
        </CardHeader>
        <CardContent>
          {cpms.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              No CPM records found. Create your first CPM to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Order Number</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Style Ref</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Activities</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Health</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Auto Alert</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cpms.map((cpm) => (
                    <tr key={cpm.cpmId} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm font-medium">{cpm.orderNumber}</td>
                      <td className="px-4 py-3 text-sm">{cpm.styleReference}</td>
                      <td className="px-4 py-3 text-sm">{cpm.activities.length} activities</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getHealthColor(cpm.overallOrderHealth)}`}>
                          {cpm.overallOrderHealth}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {cpm.autoAlertEnabled ? 'Enabled' : 'Disabled'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button variant="secondary" size="sm" onClick={() => handleEdit(cpm)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="secondary" size="sm" onClick={() => handleDelete(cpm.cpmId)}>
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
                {editingCPM ? 'Edit CPM' : 'Create New CPM'}
              </h2>
              <p className="text-sm text-slate-500">
                {editingCPM ? 'Update CPM details' : 'Create a new critical path management record'}
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
                      <option key={wo.internalWorkOrderNumber} value={wo.internalOrderNumber}>
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
                  <label className="mb-1 block text-sm font-medium text-slate-700">Overall Order Health *</label>
                  <select
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={formData.overallOrderHealth || ''}
                    onChange={(e) => setFormData({ ...formData, overallOrderHealth: e.target.value as any })}
                  >
                    <option value="Green">Green</option>
                    <option value="Yellow">Yellow</option>
                    <option value="Red">Red</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Auto Alert Enabled</label>
                  <select
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={formData.autoAlertEnabled ? 'true' : 'false'}
                    onChange={(e) => setFormData({ ...formData, autoAlertEnabled: e.target.value === 'true' })}
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
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
                  {editingCPM ? 'Update CPM' : 'Create CPM'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
