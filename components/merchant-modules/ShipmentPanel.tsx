// File: components/merchant-modules/ShipmentPanel.tsx
// Phase 11: Shipment - Full CRUD Component

'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import type { ShipmentPlanning } from '@/lib/merchant-types';
import { merchantStore } from '@/lib/merchant-store';

export function ShipmentPanel() {
  const [shipments, setShipments] = useState<ShipmentPlanning[]>([]);
  const [workOrders, setWorkOrders] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingShipment, setEditingShipment] = useState<ShipmentPlanning | null>(null);
  const [formData, setFormData] = useState<Partial<ShipmentPlanning>>({});

  useEffect(() => {
    loadShipments();
    loadWorkOrders();
  }, []);

  const loadShipments = () => {
    setShipments(merchantStore.getAllShipmentPlannings?.() || []);
  };

  const loadWorkOrders = () => {
    setWorkOrders(merchantStore.getAllInternalWorkOrders?.() || []);
  };

  const handleCreate = () => {
    setEditingShipment(null);
    setFormData({
      shipmentMode: 'Sea',
      status: 'Planned',
      shipmentQuantity: { pieces: 0, cartons: 0 },
    });
    setShowForm(true);
  };

  const handleEdit = (shipment: ShipmentPlanning) => {
    setEditingShipment(shipment);
    setFormData({ ...shipment });
    setShowForm(true);
  };

  const handleDelete = (shipmentPlanningId: string) => {
    if (confirm('Are you sure you want to delete this shipment planning?')) {
      setShipments(shipments.filter(s => s.shipmentPlanningId !== shipmentPlanningId));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingShipment) {
      merchantStore.updateShipmentPlanning?.(editingShipment.shipmentPlanningId, formData);
    } else {
      merchantStore.createShipmentPlanning?.(formData as Omit<ShipmentPlanning, 'shipmentPlanningId' | 'createdAt' | 'updatedAt'>);
    }
    
    setShowForm(false);
    setEditingShipment(null);
    setFormData({});
    loadShipments();
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingShipment(null);
    setFormData({});
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Planned': return 'bg-slate-100 text-slate-700';
      case 'Booked': return 'bg-blue-100 text-blue-700';
      case 'In Transit': return 'bg-yellow-100 text-yellow-700';
      case 'Delivered': return 'bg-green-100 text-green-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Shipment Planning</h2>
            <p className="text-sm text-slate-500">Manage shipment logistics and tracking</p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Create Shipment
          </Button>
        </CardHeader>
        <CardContent>
          {shipments.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              No shipment plans found. Create your first shipment to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Order No.</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Mode</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Port of Loading</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Port of Destination</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Forwarder</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">ETD</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">ETA</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Pieces</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Cartons</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {shipments.map((shipment) => (
                    <tr key={shipment.shipmentPlanningId} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm font-medium">{shipment.orderNumber}</td>
                      <td className="px-4 py-3 text-sm">{shipment.shipmentMode}</td>
                      <td className="px-4 py-3 text-sm">{shipment.portOfLoading}</td>
                      <td className="px-4 py-3 text-sm">{shipment.portOfDestination}</td>
                      <td className="px-4 py-3 text-sm">{shipment.forwarderName}</td>
                      <td className="px-4 py-3 text-sm">{shipment.etd}</td>
                      <td className="px-4 py-3 text-sm">{shipment.eta}</td>
                      <td className="px-4 py-3 text-sm">{shipment.shipmentQuantity.pieces}</td>
                      <td className="px-4 py-3 text-sm">{shipment.shipmentQuantity.cartons}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(shipment.status)}`}>
                          {shipment.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button variant="secondary" size="sm" onClick={() => handleEdit(shipment)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="secondary" size="sm" onClick={() => handleDelete(shipment.shipmentPlanningId)}>
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
                {editingShipment ? 'Edit Shipment Planning' : 'Create New Shipment Planning'}
              </h2>
              <p className="text-sm text-slate-500">
                {editingShipment ? 'Update shipment details' : 'Create a new shipment planning'}
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
                    onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
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
                  <label className="mb-1 block text-sm font-medium text-slate-700">Planned Ex-Factory Date *</label>
                  <Input
                    required
                    type="date"
                    value={formData.plannedExFactoryDate || ''}
                    onChange={(e) => setFormData({ ...formData, plannedExFactoryDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Actual Ex-Factory Date</label>
                  <Input
                    type="date"
                    value={formData.actualExFactoryDate || ''}
                    onChange={(e) => setFormData({ ...formData, actualExFactoryDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Shipment Mode *</label>
                  <select
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={formData.shipmentMode || ''}
                    onChange={(e) => setFormData({ ...formData, shipmentMode: e.target.value as any })}
                  >
                    <option value="Sea">Sea</option>
                    <option value="Air">Air</option>
                    <option value="Road">Road</option>
                    <option value="Courier">Courier</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Port of Loading *</label>
                  <Input
                    required
                    value={formData.portOfLoading || ''}
                    onChange={(e) => setFormData({ ...formData, portOfLoading: e.target.value })}
                    placeholder="e.g., Shanghai"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Port of Destination *</label>
                  <Input
                    required
                    value={formData.portOfDestination || ''}
                    onChange={(e) => setFormData({ ...formData, portOfDestination: e.target.value })}
                    placeholder="e.g., Los Angeles"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Forwarder Name *</label>
                  <Input
                    required
                    value={formData.forwarderName || ''}
                    onChange={(e) => setFormData({ ...formData, forwarderName: e.target.value })}
                    placeholder="Forwarder name"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Booking Confirmation Number *</label>
                  <Input
                    required
                    value={formData.bookingConfirmationNumber || ''}
                    onChange={(e) => setFormData({ ...formData, bookingConfirmationNumber: e.target.value })}
                    placeholder="Booking number"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Container Number</label>
                  <Input
                    value={formData.containerNumber || ''}
                    onChange={(e) => setFormData({ ...formData, containerNumber: e.target.value })}
                    placeholder="Container number (for sea freight)"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Airway Bill Number</label>
                  <Input
                    value={formData.airwayBillNumber || ''}
                    onChange={(e) => setFormData({ ...formData, airwayBillNumber: e.target.value })}
                    placeholder="Airway bill number (for air freight)"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Vessel Name</label>
                  <Input
                    value={formData.vesselName || ''}
                    onChange={(e) => setFormData({ ...formData, vesselName: e.target.value })}
                    placeholder="Vessel name (for sea freight)"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Flight Number</label>
                  <Input
                    value={formData.flightNumber || ''}
                    onChange={(e) => setFormData({ ...formData, flightNumber: e.target.value })}
                    placeholder="Flight number (for air freight)"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">ETD *</label>
                  <Input
                    required
                    type="date"
                    value={formData.etd || ''}
                    onChange={(e) => setFormData({ ...formData, etd: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">ETA *</label>
                  <Input
                    required
                    type="date"
                    value={formData.eta || ''}
                    onChange={(e) => setFormData({ ...formData, eta: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Pieces *</label>
                  <Input
                    required
                    type="number"
                    value={formData.shipmentQuantity?.pieces || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      shipmentQuantity: {
                        ...(formData.shipmentQuantity || { pieces: 0, cartons: 0 }),
                        pieces: parseInt(e.target.value) || 0,
                      },
                    })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Cartons *</label>
                  <Input
                    required
                    type="number"
                    value={formData.shipmentQuantity?.cartons || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      shipmentQuantity: {
                        ...(formData.shipmentQuantity || { pieces: 0, cartons: 0 }),
                        cartons: parseInt(e.target.value) || 0,
                      },
                    })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Shipment Value *</label>
                  <Input
                    required
                    type="number"
                    step="0.01"
                    value={formData.shipmentValue || ''}
                    onChange={(e) => setFormData({ ...formData, shipmentValue: parseFloat(e.target.value) || 0 })}
                    placeholder="0"
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
                  <label className="mb-1 block text-sm font-medium text-slate-700">Status *</label>
                  <select
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={formData.status || ''}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  >
                    <option value="Planned">Planned</option>
                    <option value="Booked">Booked</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Delivered">Delivered</option>
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
                  {editingShipment ? 'Update Shipment' : 'Create Shipment'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
