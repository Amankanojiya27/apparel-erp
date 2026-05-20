// File: components/merchant-modules/InlineQCPanel.tsx
// Phase 9: Inline QC - Full CRUD Component

'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import type { InlineQC } from '@/lib/merchant-types';
import { merchantStore } from '@/lib/merchant-store';

export function InlineQCPanel() {
  const [inlineQCs, setInlineQCs] = useState<InlineQC[]>([]);
  const [workOrders, setWorkOrders] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingQC, setEditingQC] = useState<InlineQC | null>(null);
  const [formData, setFormData] = useState<Partial<InlineQC>>({});

  useEffect(() => {
    loadInlineQCs();
    loadWorkOrders();
  }, []);

  const loadInlineQCs = () => {
    setInlineQCs(merchantStore.getAllInlineQCs?.() || []);
  };

  const loadWorkOrders = () => {
    setWorkOrders(merchantStore.getAllInternalWorkOrders?.() || []);
  };

  const handleCreate = () => {
    setEditingQC(null);
    setFormData({
      passFailStatus: 'Pass',
      defectsFound: [],
    });
    setShowForm(true);
  };

  const handleEdit = (qc: InlineQC) => {
    setEditingQC(qc);
    setFormData({ ...qc });
    setShowForm(true);
  };

  const handleDelete = (inlineQCId: string) => {
    if (confirm('Are you sure you want to delete this inline QC record?')) {
      setInlineQCs(inlineQCs.filter(q => q.inlineQCId !== inlineQCId));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingQC) {
      merchantStore.updateInlineQC?.(editingQC.inlineQCId, formData);
    } else {
      merchantStore.createInlineQC?.(formData as Omit<InlineQC, 'inlineQCId' | 'createdAt'>);
    }
    
    setShowForm(false);
    setEditingQC(null);
    setFormData({});
    loadInlineQCs();
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingQC(null);
    setFormData({});
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pass': return 'bg-green-100 text-green-700';
      case 'Fail': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const addDefect = () => {
    setFormData({
      ...formData,
      defectsFound: [...(formData.defectsFound || []), { defectType: '', quantity: 0 }],
    });
  };

  const updateDefect = (index: number, field: string, value: any) => {
    const updated = [...(formData.defectsFound || [])];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, defectsFound: updated });
  };

  const removeDefect = (index: number) => {
    const updated = formData.defectsFound?.filter((_, i) => i !== index) || [];
    setFormData({ ...formData, defectsFound: updated });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Inline QC</h2>
            <p className="text-sm text-slate-500">Manage inline quality control inspections</p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Create QC
          </Button>
        </CardHeader>
        <CardContent>
          {inlineQCs.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              No inline QC records found. Create your first QC to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Style Ref</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Line No.</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Inspector</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Qty Inspected</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Defects</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">AQL</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inlineQCs.map((qc) => (
                    <tr key={qc.inlineQCId} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm font-medium">{qc.inspectionDate}</td>
                      <td className="px-4 py-3 text-sm">{qc.styleOrderReference}</td>
                      <td className="px-4 py-3 text-sm">{qc.lineNumber}</td>
                      <td className="px-4 py-3 text-sm">{qc.inspectorName}</td>
                      <td className="px-4 py-3 text-sm">{qc.quantityInspected}</td>
                      <td className="px-4 py-3 text-sm">{qc.defectsFound.length} types</td>
                      <td className="px-4 py-3 text-sm">{qc.aqlLevel}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(qc.passFailStatus)}`}>
                          {qc.passFailStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button variant="secondary" size="sm" onClick={() => handleEdit(qc)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="secondary" size="sm" onClick={() => handleDelete(qc.inlineQCId)}>
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
                {editingQC ? 'Edit Inline QC' : 'Create New Inline QC'}
              </h2>
              <p className="text-sm text-slate-500">
                {editingQC ? 'Update QC details' : 'Create a new inline quality control inspection'}
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Inspection Date *</label>
                  <Input
                    required
                    type="date"
                    value={formData.inspectionDate || ''}
                    onChange={(e) => setFormData({ ...formData, inspectionDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Style Reference *</label>
                  <select
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={formData.styleOrderReference || ''}
                    onChange={(e) => setFormData({ ...formData, styleOrderReference: e.target.value })}
                  >
                    <option value="">Select Work Order</option>
                    {workOrders.map((wo) => (
                      <option key={wo.workOrderId} value={wo.styleSummary}>
                        {wo.styleSummary}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Line Number *</label>
                  <Input
                    required
                    value={formData.lineNumber || ''}
                    onChange={(e) => setFormData({ ...formData, lineNumber: e.target.value })}
                    placeholder="e.g., Line 1"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Inspector Name *</label>
                  <Input
                    required
                    value={formData.inspectorName || ''}
                    onChange={(e) => setFormData({ ...formData, inspectorName: e.target.value })}
                    placeholder="Inspector name"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Quantity Inspected *</label>
                  <Input
                    required
                    type="number"
                    value={formData.quantityInspected || ''}
                    onChange={(e) => setFormData({ ...formData, quantityInspected: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">AQL Level *</label>
                  <Input
                    required
                    value={formData.aqlLevel || ''}
                    onChange={(e) => setFormData({ ...formData, aqlLevel: e.target.value })}
                    placeholder="e.g., 2.5"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Pass/Fail Status *</label>
                  <select
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={formData.passFailStatus || ''}
                    onChange={(e) => setFormData({ ...formData, passFailStatus: e.target.value as any })}
                  >
                    <option value="Pass">Pass</option>
                    <option value="Fail">Fail</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Inline Report URL</label>
                  <Input
                    value={formData.inlineReportUrl || ''}
                    onChange={(e) => setFormData({ ...formData, inlineReportUrl: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <label className="mb-1 block text-sm font-medium text-slate-700">Corrective Action Required</label>
                <Input
                  value={formData.correctiveActionRequired || ''}
                  onChange={(e) => setFormData({ ...formData, correctiveActionRequired: e.target.value })}
                  placeholder="Describe corrective action if needed"
                />
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Defects Found</h3>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={addDefect}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Defect
                  </Button>
                </div>
                {formData.defectsFound?.map((defect, index) => (
                  <div key={index} className="grid grid-cols-3 gap-2 mb-2">
                    <Input
                      placeholder="Defect Type"
                      value={defect.defectType}
                      onChange={(e) => updateDefect(index, 'defectType', e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="Quantity"
                      value={defect.quantity || ''}
                      onChange={(e) => updateDefect(index, 'quantity', parseInt(e.target.value) || 0)}
                    />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => removeDefect(index)}
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
                  {editingQC ? 'Update QC' : 'Create QC'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
