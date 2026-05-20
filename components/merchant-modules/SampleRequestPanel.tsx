// File: components/merchant-modules/SampleRequestPanel.tsx
// Phase 4: Sample Request - Full CRUD Component

'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import type { SampleRequest, SampleType } from '@/lib/merchant-types';
import { merchantStore } from '@/lib/merchant-store';

export function SampleRequestPanel() {
  const [sampleRequests, setSampleRequests] = useState<SampleRequest[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRequest, setEditingRequest] = useState<SampleRequest | null>(null);
  const [formData, setFormData] = useState<Partial<SampleRequest>>({});

  useEffect(() => {
    loadSampleRequests();
  }, []);

  const loadSampleRequests = () => {
    setSampleRequests(merchantStore.getAllSampleRequests?.() || []);
  };

  const handleCreate = () => {
    setEditingRequest(null);
    setFormData({
      sampleType: 'Proto Sample',
      sampleQuantityRequired: 1,
      priorityLevel: 'Normal',
      status: 'Pending',
    });
    setShowForm(true);
  };

  const handleEdit = (request: SampleRequest) => {
    setEditingRequest(request);
    setFormData({ ...request });
    setShowForm(true);
  };

  const handleDelete = (sampleRequestId: string) => {
    if (confirm('Are you sure you want to delete this sample request?')) {
      merchantStore.deleteSampleRequest?.(sampleRequestId);
      loadSampleRequests();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingRequest) {
      merchantStore.updateSampleRequest?.(editingRequest.sampleRequestId, formData);
    } else {
      merchantStore.createSampleRequest?.(formData as Omit<SampleRequest, 'sampleRequestId' | 'sampleRequestNumber' | 'createdAt' | 'updatedAt'>);
    }
    
    setShowForm(false);
    setEditingRequest(null);
    setFormData({});
    loadSampleRequests();
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingRequest(null);
    setFormData({});
  };

  const addSizeBreakdown = () => {
    const currentBreakdown = formData.sizeBreakdown || [];
    setFormData({
      ...formData,
      sizeBreakdown: [...currentBreakdown, { size: '', quantity: 0 }],
    });
  };

  const updateSizeBreakdown = (index: number, field: 'size' | 'quantity', value: string | number) => {
    const updatedBreakdown = [...(formData.sizeBreakdown || [])];
    updatedBreakdown[index] = { ...updatedBreakdown[index], [field]: value };
    setFormData({ ...formData, sizeBreakdown: updatedBreakdown });
  };

  const removeSizeBreakdown = (index: number) => {
    const updatedBreakdown = (formData.sizeBreakdown || []).filter((_, i) => i !== index);
    setFormData({ ...formData, sizeBreakdown: updatedBreakdown });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-700';
      case 'Dispatched': return 'bg-blue-100 text-blue-700';
      case 'Approved': return 'bg-emerald-100 text-emerald-700';
      case 'Rejected': return 'bg-red-100 text-red-700';
      case 'In Progress': return 'bg-yellow-100 text-yellow-700';
      case 'Pending': return 'bg-slate-100 text-slate-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Sample Requests</h2>
            <p className="text-sm text-slate-500">Manage sample development requests</p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Create Sample Request
          </Button>
        </CardHeader>
        <CardContent>
          {sampleRequests.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              No sample requests found. Create your first sample request to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Request No.</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Style Ref</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Buyer</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Sample Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Quantity</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Required By</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleRequests.map((request) => (
                    <tr key={request.sampleRequestId} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm font-medium">{request.sampleRequestNumber}</td>
                      <td className="px-4 py-3 text-sm">{request.date}</td>
                      <td className="px-4 py-3 text-sm">{request.styleReference}</td>
                      <td className="px-4 py-3 text-sm">{request.buyerName}</td>
                      <td className="px-4 py-3 text-sm">{request.sampleType}</td>
                      <td className="px-4 py-3 text-sm">{request.sampleQuantityRequired}</td>
                      <td className="px-4 py-3 text-sm">{request.requiredByDate}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button variant="secondary" size="sm" onClick={() => handleEdit(request)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="secondary" size="sm" onClick={() => handleDelete(request.sampleRequestId)}>
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
                {editingRequest ? 'Edit Sample Request' : 'Create New Sample Request'}
              </h2>
              <p className="text-sm text-slate-500">
                {editingRequest ? 'Update sample request details' : 'Create a new sample development request'}
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Date *</label>
                  <Input
                    required
                    type="date"
                    value={formData.date || ''}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Style Reference *</label>
                  <Input
                    required
                    value={formData.styleReference || ''}
                    onChange={(e) => setFormData({ ...formData, styleReference: e.target.value })}
                    placeholder="e.g., STY-001"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Buyer Name *</label>
                  <Input
                    required
                    value={formData.buyerName || ''}
                    onChange={(e) => setFormData({ ...formData, buyerName: e.target.value })}
                    placeholder="Buyer name"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Season Name</label>
                  <Input
                    value={formData.seasonName || ''}
                    onChange={(e) => setFormData({ ...formData, seasonName: e.target.value })}
                    placeholder="e.g., SS24"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Sample Type *</label>
                  <select
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={formData.sampleType || ''}
                    onChange={(e) => setFormData({ ...formData, sampleType: e.target.value as SampleType })}
                  >
                    <option value="Proto Sample">Proto Sample</option>
                    <option value="Fit Sample">Fit Sample</option>
                    <option value="Salesman Sample (SMS)">Salesman Sample (SMS)</option>
                    <option value="Photo Shoot Sample">Photo Shoot Sample</option>
                    <option value="Pre-Production Sample (PPS)">Pre-Production Sample (PPS)</option>
                    <option value="TOP (Top of Production)">TOP (Top of Production)</option>
                    <option value="Shipment Sample">Shipment Sample</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Sample Quantity Required *</label>
                  <Input
                    required
                    type="number"
                    value={formData.sampleQuantityRequired || ''}
                    onChange={(e) => setFormData({ ...formData, sampleQuantityRequired: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Required By Date *</label>
                  <Input
                    required
                    type="date"
                    value={formData.requiredByDate || ''}
                    onChange={(e) => setFormData({ ...formData, requiredByDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Sent To Department *</label>
                  <Input
                    required
                    value={formData.sentToDepartment || ''}
                    onChange={(e) => setFormData({ ...formData, sentToDepartment: e.target.value })}
                    placeholder="e.g., Sampling Department"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Priority Level *</label>
                  <select
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={formData.priorityLevel || ''}
                    onChange={(e) => setFormData({ ...formData, priorityLevel: e.target.value as any })}
                  >
                    <option value="Normal">Normal</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Status *</label>
                  <select
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={formData.status || ''}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Dispatched">Dispatched</option>
                    <option value="Received">Received</option>
                    <option value="Approved">Approved</option>
                    <option value="Approved with Comments">Approved with Comments</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">Size Breakdown</h3>
                  <Button type="button" variant="secondary" size="sm" onClick={addSizeBreakdown}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Size
                  </Button>
                </div>
                {formData.sizeBreakdown?.map((item, index) => (
                  <div key={index} className="mb-2 flex gap-3">
                    <Input
                      placeholder="Size (e.g., S, M, L)"
                      value={item.size}
                      onChange={(e) => updateSizeBreakdown(index, 'size', e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      placeholder="Quantity"
                      value={item.quantity}
                      onChange={(e) => updateSizeBreakdown(index, 'quantity', parseInt(e.target.value) || 0)}
                      className="w-32"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => removeSizeBreakdown(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <label className="mb-1 block text-sm font-medium text-slate-700">Color & Fabric Details</label>
                <textarea
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                  rows={2}
                  value={formData.colorFabricDetails || ''}
                  onChange={(e) => setFormData({ ...formData, colorFabricDetails: e.target.value })}
                  placeholder="Color and fabric specifications..."
                />
              </div>

              <div className="border-t pt-4">
                <label className="mb-1 block text-sm font-medium text-slate-700">Special Instructions</label>
                <textarea
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                  rows={3}
                  value={formData.specialInstructions || ''}
                  onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                  placeholder="Any special requirements..."
                />
              </div>

              <div className="flex justify-end gap-3 border-t pt-4">
                <Button variant="secondary" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  {editingRequest ? 'Update Sample Request' : 'Create Sample Request'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
