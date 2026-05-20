// File: components/merchant-modules/FabricGRNPanel.tsx
// Phase 7: Fabric Goods Receipt Note - Full CRUD Component

'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import type { FabricGRN } from '@/lib/merchant-types';
import { merchantStore } from '@/lib/merchant-store';

export function FabricGRNPanel() {
  const [fabricGRNs, setFabricGRNs] = useState<FabricGRN[]>([]);
  const [fabricPOs, setFabricPOs] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingGRN, setEditingGRN] = useState<FabricGRN | null>(null);
  const [formData, setFormData] = useState<Partial<FabricGRN>>({});

  useEffect(() => {
    loadFabricGRNs();
    loadFabricPOs();
  }, []);

  const loadFabricGRNs = () => {
    setFabricGRNs(merchantStore.getAllFabricGRNs?.() || []);
  };

  const loadFabricPOs = () => {
    setFabricPOs(merchantStore.getAllFabricPOs?.() || []);
  };

  const handleCreate = () => {
    setEditingGRN(null);
    setFormData({
      defectsFound: [],
      grnStatus: 'Pending',
    });
    setShowForm(true);
  };

  const handleEdit = (grn: FabricGRN) => {
    setEditingGRN(grn);
    setFormData({ ...grn });
    setShowForm(true);
  };

  const handleDelete = (fabricGRNId: string) => {
    if (confirm('Are you sure you want to delete this fabric GRN?')) {
      setFabricGRNs(fabricGRNs.filter(f => f.fabricGRNId !== fabricGRNId));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingGRN) {
      merchantStore.updateFabricGRN?.(editingGRN.fabricGRNId, formData);
    } else {
      merchantStore.createFabricGRN(formData as Omit<FabricGRN, 'fabricGRNId' | 'grnNumber' | 'createdAt' | 'updatedAt'>);
    }
    
    setShowForm(false);
    setEditingGRN(null);
    setFormData({});
    loadFabricGRNs();
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingGRN(null);
    setFormData({});
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Accepted': return 'bg-green-100 text-green-700';
      case 'Rejected': return 'bg-red-100 text-red-700';
      case 'Partial': return 'bg-blue-100 text-blue-700';
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Fabric Goods Receipt Notes</h2>
            <p className="text-sm text-slate-500">Manage fabric receiving and inspection</p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Create GRN
          </Button>
        </CardHeader>
        <CardContent>
          {fabricGRNs.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              No fabric GRNs found. Create your first GRN to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">GRN No.</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">PO Ref</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Received Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Supplier</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Received Qty</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Accepted Qty</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {fabricGRNs.map((grn) => (
                    <tr key={grn.fabricGRNId} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm font-medium">{grn.grnNumber}</td>
                      <td className="px-4 py-3 text-sm">{grn.poReference}</td>
                      <td className="px-4 py-3 text-sm">{grn.receivedDate}</td>
                      <td className="px-4 py-3 text-sm">{grn.supplierName}</td>
                      <td className="px-4 py-3 text-sm">{grn.fabricReceivedQuantity}</td>
                      <td className="px-4 py-3 text-sm">{grn.acceptedQuantity}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(grn.grnStatus)}`}>
                          {grn.grnStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button variant="secondary" size="sm" onClick={() => handleEdit(grn)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="secondary" size="sm" onClick={() => handleDelete(grn.fabricGRNId)}>
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
                {editingGRN ? 'Edit Fabric GRN' : 'Create New Fabric GRN'}
              </h2>
              <p className="text-sm text-slate-500">
                {editingGRN ? 'Update GRN details' : 'Create a new fabric goods receipt note'}
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">PO Reference *</label>
                  <select
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={formData.poReference || ''}
                    onChange={(e) => {
                      const po = fabricPOs.find(p => p.fabricPONumber === e.target.value);
                      setFormData({ 
                        ...formData, 
                        poReference: e.target.value,
                        supplierName: po?.supplierName || '',
                      });
                    }}
                  >
                    <option value="">Select PO</option>
                    {fabricPOs.map((po) => (
                      <option key={po.fabricPOId} value={po.fabricPONumber}>
                        {po.fabricPONumber}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Received Date *</label>
                  <Input
                    required
                    type="date"
                    value={formData.receivedDate || ''}
                    onChange={(e) => setFormData({ ...formData, receivedDate: e.target.value })}
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
                  <label className="mb-1 block text-sm font-medium text-slate-700">Fabric Received Quantity *</label>
                  <Input
                    required
                    type="number"
                    step="0.01"
                    value={formData.fabricReceivedQuantity || ''}
                    onChange={(e) => setFormData({ ...formData, fabricReceivedQuantity: parseFloat(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Fabric Inspected Quantity *</label>
                  <Input
                    required
                    type="number"
                    step="0.01"
                    value={formData.fabricInspectedQuantity || ''}
                    onChange={(e) => setFormData({ ...formData, fabricInspectedQuantity: parseFloat(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Four Point System Result *</label>
                  <Input
                    required
                    value={formData.fourPointSystemResult || ''}
                    onChange={(e) => setFormData({ ...formData, fourPointSystemResult: e.target.value })}
                    placeholder="e.g., Pass, Fail"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Accepted Quantity *</label>
                  <Input
                    required
                    type="number"
                    step="0.01"
                    value={formData.acceptedQuantity || ''}
                    onChange={(e) => setFormData({ ...formData, acceptedQuantity: parseFloat(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Rejected Quantity</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.rejectedQuantity || ''}
                    onChange={(e) => setFormData({ ...formData, rejectedQuantity: parseFloat(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">QC Person Name *</label>
                  <Input
                    required
                    value={formData.qcPersonName || ''}
                    onChange={(e) => setFormData({ ...formData, qcPersonName: e.target.value })}
                    placeholder="QC person name"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">GRN Status *</label>
                  <select
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={formData.grnStatus || ''}
                    onChange={(e) => setFormData({ ...formData, grnStatus: e.target.value as any })}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Partial">Partial</option>
                  </select>
                </div>
              </div>

              <div className="border-t pt-4">
                <label className="mb-1 block text-sm font-medium text-slate-700">Defects Found (comma-separated)</label>
                <Input
                  value={formData.defectsFound?.join(', ') || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    defectsFound: e.target.value.split(',').map(d => d.trim()).filter(Boolean)
                  })}
                  placeholder="e.g., Hole, Stain, Color variation"
                />
              </div>

              <div className="border-t pt-4">
                <label className="mb-1 block text-sm font-medium text-slate-700">Rejected Reason</label>
                <textarea
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                  rows={3}
                  value={formData.rejectedReason || ''}
                  onChange={(e) => setFormData({ ...formData, rejectedReason: e.target.value })}
                  placeholder="Reason for rejection..."
                />
              </div>

              <div className="flex justify-end gap-3 border-t pt-4">
                <Button variant="secondary" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  {editingGRN ? 'Update GRN' : 'Create GRN'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
