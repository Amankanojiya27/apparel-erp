// File: components/merchant-modules/FabricRequirementPanel.tsx
// Phase 7: Fabric Requirements - Full CRUD Component

'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import type { FabricRequirement } from '@/lib/merchant-types';
import { merchantStore } from '@/lib/merchant-store';

export function FabricRequirementPanel() {
  const [fabricRequirements, setFabricRequirements] = useState<FabricRequirement[]>([]);
  const [buyerPOs, setBuyerPOs] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRequirement, setEditingRequirement] = useState<FabricRequirement | null>(null);
  const [formData, setFormData] = useState<Partial<FabricRequirement>>({});

  useEffect(() => {
    loadFabricRequirements();
    loadBuyerPOs();
  }, []);

  const loadFabricRequirements = () => {
    setFabricRequirements(merchantStore.getAllFabricRequirements?.() || []);
  };

  const loadBuyerPOs = () => {
    setBuyerPOs(merchantStore.getAllBuyerPOs?.() || []);
  };

  const handleCreate = () => {
    setEditingRequirement(null);
    setFormData({
      fabricSource: 'local',
      wastagePercent: 5,
      fabricPORaised: false,
      status: 'Planned',
    });
    setShowForm(true);
  };

  const handleEdit = (requirement: FabricRequirement) => {
    setEditingRequirement(requirement);
    setFormData({ ...requirement });
    setShowForm(true);
  };

  const handleDelete = (fabricRequirementId: string) => {
    if (confirm('Are you sure you want to delete this fabric requirement?')) {
      setFabricRequirements(fabricRequirements.filter(f => f.fabricRequirementId !== fabricRequirementId));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingRequirement) {
      merchantStore.updateFabricRequirement?.(editingRequirement.fabricRequirementId, formData);
    } else {
      merchantStore.createFabricRequirement(formData as Omit<FabricRequirement, 'fabricRequirementId' | 'createdAt' | 'updatedAt'>);
    }
    
    setShowForm(false);
    setEditingRequirement(null);
    setFormData({});
    loadFabricRequirements();
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingRequirement(null);
    setFormData({});
  };

  const calculateGrossRequirement = () => {
    const totalQty = formData.totalGarmentQuantity || 0;
    const consumption = formData.consumptionPerPiece || 0;
    const wastage = formData.wastagePercent || 0;
    const gross = totalQty * consumption * (1 + wastage / 100);
    const inStock = formData.alreadyInStock || 0;
    const net = Math.max(0, gross - inStock);
    
    setFormData({
      ...formData,
      grossFabricRequirement: gross,
      netFabricToOrder: net,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Received': return 'bg-green-100 text-green-700';
      case 'Ordered': return 'bg-blue-100 text-blue-700';
      case 'Delayed': return 'bg-red-100 text-red-700';
      case 'Planned': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Fabric Requirements</h2>
            <p className="text-sm text-slate-500">Manage fabric requirements for production</p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Create Requirement
          </Button>
        </CardHeader>
        <CardContent>
          {fabricRequirements.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              No fabric requirements found. Create your first requirement to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Order ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Fabric Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Quality</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Total Qty</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Gross Req</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Net to Order</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Required By</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {fabricRequirements.map((req) => (
                    <tr key={req.fabricRequirementId} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm font-medium">{req.orderId}</td>
                      <td className="px-4 py-3 text-sm">{req.fabricName}</td>
                      <td className="px-4 py-3 text-sm">{req.fabricQuality}</td>
                      <td className="px-4 py-3 text-sm">{req.totalGarmentQuantity}</td>
                      <td className="px-4 py-3 text-sm">{req.grossFabricRequirement.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm">{req.netFabricToOrder.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm">{req.requiredInHouseDate}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(req.status)}`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button variant="secondary" size="sm" onClick={() => handleEdit(req)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="secondary" size="sm" onClick={() => handleDelete(req.fabricRequirementId)}>
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
                {editingRequirement ? 'Edit Fabric Requirement' : 'Create New Fabric Requirement'}
              </h2>
              <p className="text-sm text-slate-500">
                {editingRequirement ? 'Update requirement details' : 'Create a new fabric requirement'}
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Order ID *</label>
                  <select
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={formData.orderId || ''}
                    onChange={(e) => {
                      const po = buyerPOs.find(p => p.buyerPOId === e.target.value);
                      setFormData({ 
                        ...formData, 
                        orderId: e.target.value,
                        totalGarmentQuantity: po?.poQuantity || 0,
                      });
                      calculateGrossRequirement();
                    }}
                  >
                    <option value="">Select Order</option>
                    {buyerPOs.map((po) => (
                      <option key={po.buyerPOId} value={po.buyerPOId}>
                        {po.poNumber} - {po.styleReference}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Fabric Name *</label>
                  <Input
                    required
                    value={formData.fabricName || ''}
                    onChange={(e) => setFormData({ ...formData, fabricName: e.target.value })}
                    placeholder="e.g., Cotton Twill, Polyester"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Fabric Quality *</label>
                  <Input
                    required
                    value={formData.fabricQuality || ''}
                    onChange={(e) => setFormData({ ...formData, fabricQuality: e.target.value })}
                    placeholder="e.g., 180 GSM, 200 GSM"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Total Garment Quantity *</label>
                  <Input
                    required
                    type="number"
                    value={formData.totalGarmentQuantity || ''}
                    onChange={(e) => {
                      setFormData({ ...formData, totalGarmentQuantity: parseInt(e.target.value) || 0 });
                      calculateGrossRequirement();
                    }}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Consumption Per Piece (m) *</label>
                  <Input
                    required
                    type="number"
                    step="0.01"
                    value={formData.consumptionPerPiece || ''}
                    onChange={(e) => {
                      setFormData({ ...formData, consumptionPerPiece: parseFloat(e.target.value) || 0 });
                      calculateGrossRequirement();
                    }}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Wastage % *</label>
                  <Input
                    required
                    type="number"
                    value={formData.wastagePercent || ''}
                    onChange={(e) => {
                      setFormData({ ...formData, wastagePercent: parseInt(e.target.value) || 0 });
                      calculateGrossRequirement();
                    }}
                    placeholder="5"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Already in Stock</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.alreadyInStock || ''}
                    onChange={(e) => {
                      setFormData({ ...formData, alreadyInStock: parseFloat(e.target.value) || 0 });
                      calculateGrossRequirement();
                    }}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Gross Requirement</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.grossFabricRequirement || ''}
                    onChange={(e) => setFormData({ ...formData, grossFabricRequirement: parseFloat(e.target.value) || 0 })}
                    placeholder="Auto-calculated"
                    readOnly
                    className="bg-slate-50"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Net to Order</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.netFabricToOrder || ''}
                    onChange={(e) => setFormData({ ...formData, netFabricToOrder: parseFloat(e.target.value) || 0 })}
                    placeholder="Auto-calculated"
                    readOnly
                    className="bg-slate-50"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Approved Supplier *</label>
                  <Input
                    required
                    value={formData.approvedSupplierName || ''}
                    onChange={(e) => setFormData({ ...formData, approvedSupplierName: e.target.value })}
                    placeholder="Supplier name"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Fabric Source *</label>
                  <select
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={formData.fabricSource || ''}
                    onChange={(e) => setFormData({ ...formData, fabricSource: e.target.value as any })}
                  >
                    <option value="local">Local</option>
                    <option value="import">Import</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Lead Time (Days) *</label>
                  <Input
                    required
                    type="number"
                    value={formData.leadTimeDays || ''}
                    onChange={(e) => setFormData({ ...formData, leadTimeDays: parseInt(e.target.value) || 0 })}
                    placeholder="e.g., 30"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Required In-House Date *</label>
                  <Input
                    required
                    type="date"
                    value={formData.requiredInHouseDate || ''}
                    onChange={(e) => setFormData({ ...formData, requiredInHouseDate: e.target.value })}
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
                    <option value="Ordered">Ordered</option>
                    <option value="Received">Received</option>
                    <option value="Delayed">Delayed</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Fabric PO Raised</label>
                  <select
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={formData.fabricPORaised ? 'true' : 'false'}
                    onChange={(e) => setFormData({ ...formData, fabricPORaised: e.target.value === 'true' })}
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
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
                  {editingRequirement ? 'Update Requirement' : 'Create Requirement'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
