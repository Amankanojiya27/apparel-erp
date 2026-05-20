// File: components/merchant-modules/SampleTrackingPanel.tsx
// Phase 4: Sample Tracking - Full CRUD Component

'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import type { SampleTracking, SampleStage, SampleStatus } from '@/lib/merchant-types';
import { merchantStore } from '@/lib/merchant-store';

export function SampleTrackingPanel() {
  const [sampleTracking, setSampleTracking] = useState<SampleTracking[]>([]);
  const [sampleRequests, setSampleRequests] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTracking, setEditingTracking] = useState<SampleTracking | null>(null);
  const [formData, setFormData] = useState<Partial<SampleTracking>>({});

  useEffect(() => {
    loadSampleTracking();
    loadSampleRequests();
  }, []);

  const loadSampleTracking = () => {
    setSampleTracking(merchantStore.getAllSampleTracking?.() || []);
  };

  const loadSampleRequests = () => {
    setSampleRequests(merchantStore.getAllSampleRequests?.() || []);
  };

  const handleCreate = () => {
    setEditingTracking(null);
    setFormData({
      stage: 'Cutting',
      currentStatus: 'Pending',
    });
    setShowForm(true);
  };

  const handleEdit = (tracking: SampleTracking) => {
    setEditingTracking(tracking);
    setFormData({ ...tracking });
    setShowForm(true);
  };

  const handleDelete = (sampleTrackingId: string) => {
    if (confirm('Are you sure you want to delete this sample tracking record?')) {
      setSampleTracking(sampleTracking.filter(t => t.sampleTrackingId !== sampleTrackingId));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingTracking) {
      merchantStore.updateSampleTracking?.(editingTracking.sampleTrackingId, formData);
    } else {
      merchantStore.createSampleTracking?.(formData as Omit<SampleTracking, 'sampleTrackingId' | 'updatedAt'>);
    }
    
    setShowForm(false);
    setEditingTracking(null);
    setFormData({});
    loadSampleTracking();
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTracking(null);
    setFormData({});
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'Cutting': return 'bg-blue-100 text-blue-700';
      case 'Stitching': return 'bg-purple-100 text-purple-700';
      case 'Finishing': return 'bg-orange-100 text-orange-700';
      case 'QC': return 'bg-yellow-100 text-yellow-700';
      case 'Dispatch': return 'bg-green-100 text-green-700';
      default: return 'bg-slate-100 text-slate-700';
    }
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
            <h2 className="text-lg font-semibold">Sample Tracking</h2>
            <p className="text-sm text-slate-500">Track sample development progress through stages</p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Create Tracking Record
          </Button>
        </CardHeader>
        <CardContent>
          {sampleTracking.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              No sample tracking records found. Create your first tracking record to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Sample Number</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Request ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Stage</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Responsible Person</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">In House Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Dispatch Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleTracking.map((tracking) => (
                    <tr key={tracking.sampleTrackingId} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm font-medium">{tracking.sampleNumber}</td>
                      <td className="px-4 py-3 text-sm">{tracking.sampleRequestId}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStageColor(tracking.stage)}`}>
                          {tracking.stage}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(tracking.currentStatus)}`}>
                          {tracking.currentStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">{tracking.responsiblePerson}</td>
                      <td className="px-4 py-3 text-sm">{tracking.inHouseDate || '—'}</td>
                      <td className="px-4 py-3 text-sm">{tracking.dispatchDate || '—'}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button variant="secondary" size="sm" onClick={() => handleEdit(tracking)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="secondary" size="sm" onClick={() => handleDelete(tracking.sampleTrackingId)}>
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
                {editingTracking ? 'Edit Sample Tracking' : 'Create New Tracking Record'}
              </h2>
              <p className="text-sm text-slate-500">
                {editingTracking ? 'Update tracking details' : 'Track sample development progress'}
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Sample Request *</label>
                  <select
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={formData.sampleRequestId || ''}
                    onChange={(e) => {
                      const request = sampleRequests.find(r => r.sampleRequestId === e.target.value);
                      setFormData({ 
                        ...formData, 
                        sampleRequestId: e.target.value,
                        sampleNumber: request?.sampleRequestNumber || '',
                      });
                    }}
                  >
                    <option value="">Select Sample Request</option>
                    {sampleRequests.map((request) => (
                      <option key={request.sampleRequestId} value={request.sampleRequestId}>
                        {request.sampleRequestNumber} - {request.styleReference}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Sample Number</label>
                  <Input
                    value={formData.sampleNumber || ''}
                    onChange={(e) => setFormData({ ...formData, sampleNumber: e.target.value })}
                    placeholder="Auto-generated or manual"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Stage *</label>
                  <select
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={formData.stage || ''}
                    onChange={(e) => setFormData({ ...formData, stage: e.target.value as SampleStage })}
                  >
                    <option value="Cutting">Cutting</option>
                    <option value="Stitching">Stitching</option>
                    <option value="Finishing">Finishing</option>
                    <option value="QC">QC</option>
                    <option value="Dispatch">Dispatch</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Current Status *</label>
                  <select
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={formData.currentStatus || ''}
                    onChange={(e) => setFormData({ ...formData, currentStatus: e.target.value as SampleStatus })}
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
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Responsible Person *</label>
                  <Input
                    required
                    value={formData.responsiblePerson || ''}
                    onChange={(e) => setFormData({ ...formData, responsiblePerson: e.target.value })}
                    placeholder="Person responsible for this stage"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">In House Date</label>
                  <Input
                    type="date"
                    value={formData.inHouseDate || ''}
                    onChange={(e) => setFormData({ ...formData, inHouseDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Dispatch Date</label>
                  <Input
                    type="date"
                    value={formData.dispatchDate || ''}
                    onChange={(e) => setFormData({ ...formData, dispatchDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Courier Tracking Number</label>
                  <Input
                    value={formData.courierTrackingNumber || ''}
                    onChange={(e) => setFormData({ ...formData, courierTrackingNumber: e.target.value })}
                    placeholder="e.g., 1Z999AA10123456784"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Courier Company</label>
                  <Input
                    value={formData.courierCompanyName || ''}
                    onChange={(e) => setFormData({ ...formData, courierCompanyName: e.target.value })}
                    placeholder="e.g., FedEx, DHL, UPS"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Buyer Received Date</label>
                  <Input
                    type="date"
                    value={formData.buyerReceivedDate || ''}
                    onChange={(e) => setFormData({ ...formData, buyerReceivedDate: e.target.value })}
                  />
                </div>
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
