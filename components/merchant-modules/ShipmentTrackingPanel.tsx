// File: components/merchant-modules/ShipmentTrackingPanel.tsx
// Phase 13: Shipment Tracking - Full CRUD Component

'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import type { ShipmentTracking } from '@/lib/merchant-types';
import { merchantStore } from '@/lib/merchant-store';

export function ShipmentTrackingPanel() {
  const [tracking, setTracking] = useState<ShipmentTracking[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTracking, setEditingTracking] = useState<ShipmentTracking | null>(null);
  const [formData, setFormData] = useState<Partial<ShipmentTracking>>({});

  useEffect(() => {
    loadTracking();
  }, []);

  const loadTracking = () => {
    setTracking(merchantStore.getAllShipmentTracking?.() || []);
  };

  const handleCreate = () => {
    setEditingTracking(null);
    setFormData({
      currentStatus: 'In Transit',
      trackingUpdates: [],
      delayAlerts: [],
    });
    setShowForm(true);
  };

  const handleEdit = (track: ShipmentTracking) => {
    setEditingTracking(track);
    setFormData({ ...track });
    setShowForm(true);
  };

  const handleDelete = (shipmentTrackingId: string) => {
    if (confirm('Are you sure you want to delete this shipment tracking record?')) {
      setTracking(tracking.filter(t => t.shipmentTrackingId !== shipmentTrackingId));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingTracking) {
      merchantStore.updateShipmentTracking?.(editingTracking.shipmentTrackingId, formData);
    } else {
      merchantStore.createShipmentTracking?.(formData as Omit<ShipmentTracking, 'shipmentTrackingId' | 'createdAt' | 'updatedAt'>);
    }
    
    setShowForm(false);
    setEditingTracking(null);
    setFormData({});
    loadTracking();
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTracking(null);
    setFormData({});
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Transit': return 'bg-blue-100 text-blue-700';
      case 'Customs': return 'bg-yellow-100 text-yellow-700';
      case 'Delivered': return 'bg-green-100 text-green-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const addTrackingUpdate = () => {
    setFormData({
      ...formData,
      trackingUpdates: [...(formData.trackingUpdates || []), { date: '', status: '', location: '' }],
    });
  };

  const updateTrackingUpdate = (index: number, field: string, value: any) => {
    const updated = [...(formData.trackingUpdates || [])];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, trackingUpdates: updated });
  };

  const removeTrackingUpdate = (index: number) => {
    const updated = formData.trackingUpdates?.filter((_, i) => i !== index) || [];
    setFormData({ ...formData, trackingUpdates: updated });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Shipment Tracking</h2>
            <p className="text-sm text-slate-500">Track shipment status and updates</p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Create Tracking
          </Button>
        </CardHeader>
        <CardContent>
          {tracking.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              No shipment tracking records found. Create your first tracking to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Shipment No.</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Updates</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Alerts</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Delivery Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tracking.map((track) => (
                    <tr key={track.shipmentTrackingId} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm font-medium">{track.shipmentNumber}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(track.currentStatus)}`}>
                          {track.currentStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">{track.trackingUpdates.length} updates</td>
                      <td className="px-4 py-3 text-sm">{track.delayAlerts.length} alerts</td>
                      <td className="px-4 py-3 text-sm">{track.deliveryConfirmationDate || '-'}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button variant="secondary" size="sm" onClick={() => handleEdit(track)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="secondary" size="sm" onClick={() => handleDelete(track.shipmentTrackingId)}>
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
                {editingTracking ? 'Edit Shipment Tracking' : 'Create New Shipment Tracking'}
              </h2>
              <p className="text-sm text-slate-500">
                {editingTracking ? 'Update tracking details' : 'Create a new shipment tracking'}
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Shipment Number *</label>
                  <Input
                    required
                    value={formData.shipmentNumber || ''}
                    onChange={(e) => setFormData({ ...formData, shipmentNumber: e.target.value })}
                    placeholder="Shipment number"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Current Status *</label>
                  <select
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={formData.currentStatus || ''}
                    onChange={(e) => setFormData({ ...formData, currentStatus: e.target.value as any })}
                  >
                    <option value="In Transit">In Transit</option>
                    <option value="Customs">Customs</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Delivery Confirmation Date</label>
                  <Input
                    type="date"
                    value={formData.deliveryConfirmationDate || ''}
                    onChange={(e) => setFormData({ ...formData, deliveryConfirmationDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Tracking Updates</h3>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={addTrackingUpdate}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Update
                  </Button>
                </div>
                {formData.trackingUpdates?.map((update, index) => (
                  <div key={index} className="grid grid-cols-4 gap-2 mb-2">
                    <Input
                      type="date"
                      placeholder="Date"
                      value={update.date}
                      onChange={(e) => updateTrackingUpdate(index, 'date', e.target.value)}
                    />
                    <Input
                      placeholder="Status"
                      value={update.status}
                      onChange={(e) => updateTrackingUpdate(index, 'status', e.target.value)}
                    />
                    <Input
                      placeholder="Location"
                      value={update.location}
                      onChange={(e) => updateTrackingUpdate(index, 'location', e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => removeTrackingUpdate(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <label className="mb-1 block text-sm font-medium text-slate-700">Delay Alerts (comma-separated)</label>
                <Input
                  value={formData.delayAlerts?.join(', ') || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    delayAlerts: e.target.value.split(',').map(a => a.trim()).filter(Boolean)
                  })}
                  placeholder="e.g., Port delay, Customs hold"
                />
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
