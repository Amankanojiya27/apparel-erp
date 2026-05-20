// File: components/merchant-modules/FabricPurchaseOrderPanel.tsx
// Phase 7: Fabric Purchase Order - Full CRUD Component

'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import type { FabricPurchaseOrder } from '@/lib/merchant-types';
import { merchantStore } from '@/lib/merchant-store';

export function FabricPurchaseOrderPanel() {
  const [fabricPOs, setFabricPOs] = useState<FabricPurchaseOrder[]>([]);
  const [fabricRequirements, setFabricRequirements] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPO, setEditingPO] = useState<FabricPurchaseOrder | null>(null);
  const [formData, setFormData] = useState<Partial<FabricPurchaseOrder>>({});

  useEffect(() => {
    loadFabricPOs();
    loadFabricRequirements();
  }, []);

  const loadFabricPOs = () => {
    setFabricPOs(merchantStore.getAllFabricPOs?.() || []);
  };

  const loadFabricRequirements = () => {
    setFabricRequirements(merchantStore.getAllFabricRequirements?.() || []);
  };

  const handleCreate = () => {
    setEditingPO(null);
    setFormData({
      status: 'Raised',
    });
    setShowForm(true);
  };

  const handleEdit = (po: FabricPurchaseOrder) => {
    setEditingPO(po);
    setFormData({ ...po });
    setShowForm(true);
  };

  const handleDelete = (fabricPOId: string) => {
    if (confirm('Are you sure you want to delete this fabric PO?')) {
      setFabricPOs(fabricPOs.filter(p => p.fabricPOId !== fabricPOId));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingPO) {
      merchantStore.updateFabricPO?.(editingPO.fabricPOId, formData);
    } else {
      merchantStore.createFabricPO(formData as Omit<FabricPurchaseOrder, 'fabricPOId' | 'fabricPONumber' | 'createdAt' | 'updatedAt'>);
    }
    
    setShowForm(false);
    setEditingPO(null);
    setFormData({});
    loadFabricPOs();
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingPO(null);
    setFormData({});
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Received': return 'bg-green-100 text-green-700';
      case 'Confirmed': return 'bg-blue-100 text-blue-700';
      case 'In Transit': return 'bg-purple-100 text-purple-700';
      case 'Raised': return 'bg-yellow-100 text-yellow-700';
      case 'Cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Fabric Purchase Orders</h2>
            <p className="text-sm text-slate-500">Manage fabric purchase orders</p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Create PO
          </Button>
        </CardHeader>
        <CardContent>
          {fabricPOs.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              No fabric POs found. Create your first PO to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">PO Number</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Supplier</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Fabric</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Quantity</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Rate</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Total</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Delivery</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {fabricPOs.map((po) => (
                    <tr key={po.fabricPOId} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm font-medium">{po.fabricPONumber}</td>
                      <td className="px-4 py-3 text-sm">{po.poDate}</td>
                      <td className="px-4 py-3 text-sm">{po.supplierName}</td>
                      <td className="px-4 py-3 text-sm">{po.fabricDescription}</td>
                      <td className="px-4 py-3 text-sm">{po.quantity}m</td>
                      <td className="px-4 py-3 text-sm">{po.ratePerMeter.toFixed(2)} {po.currency}</td>
                      <td className="px-4 py-3 text-sm">{po.totalValue.toFixed(2)} {po.currency}</td>
                      <td className="px-4 py-3 text-sm">{po.requiredDeliveryDate}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(po.status)}`}>
                          {po.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button variant="secondary" size="sm" onClick={() => handleEdit(po)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="secondary" size="sm" onClick={() => handleDelete(po.fabricPOId)}>
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
                {editingPO ? 'Edit Fabric PO' : 'Create New Fabric PO'}
              </h2>
              <p className="text-sm text-slate-500">
                {editingPO ? 'Update PO details' : 'Create a new fabric purchase order'}
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">PO Date *</label>
                  <Input
                    required
                    type="date"
                    value={formData.poDate || ''}
                    onChange={(e) => setFormData({ ...formData, poDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Fabric Requirement *</label>
                  <select
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    onChange={(e) => {
                      const req = fabricRequirements.find(r => r.fabricRequirementId === e.target.value);
                      setFormData({ 
                        ...formData, 
                        fabricDescription: req?.fabricName || '',
                        fabricQuality: req?.fabricQuality || '',
                        quantity: req?.netFabricToOrder || 0,
                      });
                    }}
                  >
                    <option value="">Select Fabric Requirement</option>
                    {fabricRequirements.map((req) => (
                      <option key={req.fabricRequirementId} value={req.fabricRequirementId}>
                        {req.fabricName} - {req.orderId}
                      </option>
                    ))}
                  </select>
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
                  <label className="mb-1 block text-sm font-medium text-slate-700">Fabric Description</label>
                  <Input
                    value={formData.fabricDescription || ''}
                    onChange={(e) => setFormData({ ...formData, fabricDescription: e.target.value })}
                    placeholder="Auto-filled from requirement"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Supplier Code *</label>
                  <Input
                    required
                    value={formData.supplierCode || ''}
                    onChange={(e) => setFormData({ ...formData, supplierCode: e.target.value })}
                    placeholder="Supplier code"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Fabric Quality</label>
                  <Input
                    value={formData.fabricQuality || ''}
                    onChange={(e) => setFormData({ ...formData, fabricQuality: e.target.value })}
                    placeholder="Auto-filled from requirement"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Fabric Composition</label>
                  <Input
                    value={formData.fabricComposition || ''}
                    onChange={(e) => setFormData({ ...formData, fabricComposition: e.target.value })}
                    placeholder="e.g., 100% Cotton"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Fabric Construction</label>
                  <Input
                    value={formData.fabricConstruction || ''}
                    onChange={(e) => setFormData({ ...formData, fabricConstruction: e.target.value })}
                    placeholder="e.g., Plain Weave"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Color Details</label>
                  <Input
                    value={formData.colorDetails || ''}
                    onChange={(e) => setFormData({ ...formData, colorDetails: e.target.value })}
                    placeholder="e.g., Navy"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Width (cm) *</label>
                  <Input
                    required
                    type="number"
                    value={formData.width || ''}
                    onChange={(e) => setFormData({ ...formData, width: parseInt(e.target.value) || 0 })}
                    placeholder="e.g., 150"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Quantity (meters) *</label>
                  <Input
                    required
                    type="number"
                    step="0.01"
                    value={formData.quantity || ''}
                    onChange={(e) => {
                      const qty = parseFloat(e.target.value) || 0;
                      const rate = formData.ratePerMeter || 0;
                      setFormData({ 
                        ...formData, 
                        quantity: qty,
                        totalValue: qty * rate,
                      });
                    }}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Rate Per Meter *</label>
                  <Input
                    required
                    type="number"
                    step="0.01"
                    value={formData.ratePerMeter || ''}
                    onChange={(e) => {
                      const rate = parseFloat(e.target.value) || 0;
                      const qty = formData.quantity || 0;
                      setFormData({ 
                        ...formData, 
                        ratePerMeter: rate,
                        totalValue: qty * rate,
                      });
                    }}
                    placeholder="0.00"
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
                  <label className="mb-1 block text-sm font-medium text-slate-700">Total Value</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.totalValue || ''}
                    onChange={(e) => setFormData({ ...formData, totalValue: parseFloat(e.target.value) || 0 })}
                    placeholder="Auto-calculated"
                    readOnly
                    className="bg-slate-50"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Delivery Address *</label>
                  <Input
                    required
                    value={formData.deliveryAddress || ''}
                    onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                    placeholder="Delivery address"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Required Delivery Date *</label>
                  <Input
                    required
                    type="date"
                    value={formData.requiredDeliveryDate || ''}
                    onChange={(e) => setFormData({ ...formData, requiredDeliveryDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">PO Terms</label>
                  <Input
                    value={formData.poTerms || ''}
                    onChange={(e) => setFormData({ ...formData, poTerms: e.target.value })}
                    placeholder="e.g., 30 days advance, 70 days credit"
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
                    <option value="Raised">Raised</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Received">Received</option>
                    <option value="Cancelled">Cancelled</option>
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
                  {editingPO ? 'Update PO' : 'Create PO'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
