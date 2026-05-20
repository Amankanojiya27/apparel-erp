// File: components/merchant-modules/PackingPanel.tsx
// Phase 11: Packing - Full CRUD Component

'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import type { PackingInstruction } from '@/lib/merchant-types';
import { merchantStore } from '@/lib/merchant-store';

export function PackingPanel() {
  const [packingInstructions, setPackingInstructions] = useState<PackingInstruction[]>([]);
  const [workOrders, setWorkOrders] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingInstruction, setEditingInstruction] = useState<PackingInstruction | null>(null);
  const [formData, setFormData] = useState<Partial<PackingInstruction>>({});

  useEffect(() => {
    loadPackingInstructions();
    loadWorkOrders();
  }, []);

  const loadPackingInstructions = () => {
    setPackingInstructions(merchantStore.getAllPackingInstructions?.() || []);
  };

  const loadWorkOrders = () => {
    setWorkOrders(merchantStore.getAllInternalWorkOrders?.() || []);
  };

  const handleCreate = () => {
    setEditingInstruction(null);
    setFormData({
      packingType: 'solid_color',
      polyBagType: 'individual',
      cartonDimensions: { length: 0, width: 0, height: 0 },
      piecesPerCarton: 0,
      netWeightPerCarton: 0,
      grossWeightPerCarton: 0,
    });
    setShowForm(true);
  };

  const handleEdit = (instruction: PackingInstruction) => {
    setEditingInstruction(instruction);
    setFormData({ ...instruction });
    setShowForm(true);
  };

  const handleDelete = (packingInstructionId: string) => {
    if (confirm('Are you sure you want to delete this packing instruction?')) {
      setPackingInstructions(packingInstructions.filter(p => p.packingInstructionId !== packingInstructionId));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingInstruction) {
      merchantStore.updatePackingInstruction?.(editingInstruction.packingInstructionId, formData);
    } else {
      merchantStore.createPackingInstruction?.(formData as Omit<PackingInstruction, 'packingInstructionId' | 'createdAt' | 'updatedAt'>);
    }
    
    setShowForm(false);
    setEditingInstruction(null);
    setFormData({});
    loadPackingInstructions();
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingInstruction(null);
    setFormData({});
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Packing Instructions</h2>
            <p className="text-sm text-slate-500">Manage packing specifications for orders</p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Create Instruction
          </Button>
        </CardHeader>
        <CardContent>
          {packingInstructions.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              No packing instructions found. Create your first instruction to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Style Ref</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Packing Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Size Ratio</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Pieces/Carton</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Carton Dimensions</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Net Weight</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Gross Weight</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Poly Bag</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {packingInstructions.map((instruction) => (
                    <tr key={instruction.packingInstructionId} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm font-medium">{instruction.styleOrderReference}</td>
                      <td className="px-4 py-3 text-sm">{instruction.packingType.replace('_', ' ')}</td>
                      <td className="px-4 py-3 text-sm">{instruction.sizeRatioPerCarton}</td>
                      <td className="px-4 py-3 text-sm">{instruction.piecesPerCarton}</td>
                      <td className="px-4 py-3 text-sm">
                        {instruction.cartonDimensions.length} x {instruction.cartonDimensions.width} x {instruction.cartonDimensions.height}
                      </td>
                      <td className="px-4 py-3 text-sm">{instruction.netWeightPerCarton} kg</td>
                      <td className="px-4 py-3 text-sm">{instruction.grossWeightPerCarton} kg</td>
                      <td className="px-4 py-3 text-sm">{instruction.polyBagType.replace('_', ' ')}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button variant="secondary" size="sm" onClick={() => handleEdit(instruction)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="secondary" size="sm" onClick={() => handleDelete(instruction.packingInstructionId)}>
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
                {editingInstruction ? 'Edit Packing Instruction' : 'Create New Packing Instruction'}
              </h2>
              <p className="text-sm text-slate-500">
                {editingInstruction ? 'Update packing details' : 'Create a new packing instruction'}
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6 p-6">
              <div className="grid grid-cols-2 gap-4">
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
                  <label className="mb-1 block text-sm font-medium text-slate-700">Packing Type *</label>
                  <select
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={formData.packingType || ''}
                    onChange={(e) => setFormData({ ...formData, packingType: e.target.value as any })}
                  >
                    <option value="solid_color">Solid Color</option>
                    <option value="assorted">Assorted</option>
                    <option value="ratio_pack">Ratio Pack</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Size Ratio Per Carton *</label>
                  <Input
                    required
                    value={formData.sizeRatioPerCarton || ''}
                    onChange={(e) => setFormData({ ...formData, sizeRatioPerCarton: e.target.value })}
                    placeholder="e.g., S:M:L = 1:2:1"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Pieces Per Carton *</label>
                  <Input
                    required
                    type="number"
                    value={formData.piecesPerCarton || ''}
                    onChange={(e) => setFormData({ ...formData, piecesPerCarton: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Carton Length (cm) *</label>
                  <Input
                    required
                    type="number"
                    step="0.1"
                    value={formData.cartonDimensions?.length || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      cartonDimensions: {
                        ...(formData.cartonDimensions || { length: 0, width: 0, height: 0 }),
                        length: parseFloat(e.target.value) || 0,
                      },
                    })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Carton Width (cm) *</label>
                  <Input
                    required
                    type="number"
                    step="0.1"
                    value={formData.cartonDimensions?.width || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      cartonDimensions: {
                        ...(formData.cartonDimensions || { length: 0, width: 0, height: 0 }),
                        width: parseFloat(e.target.value) || 0,
                      },
                    })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Carton Height (cm) *</label>
                  <Input
                    required
                    type="number"
                    step="0.1"
                    value={formData.cartonDimensions?.height || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      cartonDimensions: {
                        ...(formData.cartonDimensions || { length: 0, width: 0, height: 0 }),
                        height: parseFloat(e.target.value) || 0,
                      },
                    })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Net Weight Per Carton (kg) *</label>
                  <Input
                    required
                    type="number"
                    step="0.1"
                    value={formData.netWeightPerCarton || ''}
                    onChange={(e) => setFormData({ ...formData, netWeightPerCarton: parseFloat(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Gross Weight Per Carton (kg) *</label>
                  <Input
                    required
                    type="number"
                    step="0.1"
                    value={formData.grossWeightPerCarton || ''}
                    onChange={(e) => setFormData({ ...formData, grossWeightPerCarton: parseFloat(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Poly Bag Type *</label>
                  <select
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={formData.polyBagType || ''}
                    onChange={(e) => setFormData({ ...formData, polyBagType: e.target.value as any })}
                  >
                    <option value="individual">Individual</option>
                    <option value="set_pack">Set Pack</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Hang Tag Position</label>
                  <Input
                    value={formData.hangTagPosition || ''}
                    onChange={(e) => setFormData({ ...formData, hangTagPosition: e.target.value })}
                    placeholder="e.g., Left side"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Price Tag Required</label>
                  <select
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={formData.priceTagRequired ? 'true' : 'false'}
                    onChange={(e) => setFormData({ ...formData, priceTagRequired: e.target.value === 'true' })}
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="mb-1 block text-sm font-medium text-slate-700">Carton Marking Details *</label>
                  <Input
                    required
                    value={formData.cartonMarkingDetails || ''}
                    onChange={(e) => setFormData({ ...formData, cartonMarkingDetails: e.target.value })}
                    placeholder="Carton marking specifications"
                  />
                </div>
                <div className="col-span-2">
                  <label className="mb-1 block text-sm font-medium text-slate-700">Barcode UPC Code Details</label>
                  <Input
                    value={formData.barcodeUPCCodeDetails || ''}
                    onChange={(e) => setFormData({ ...formData, barcodeUPCCodeDetails: e.target.value })}
                    placeholder="Barcode/UPC code specifications"
                  />
                </div>
                <div className="col-span-2">
                  <label className="mb-1 block text-sm font-medium text-slate-700">Special Packing Requirement</label>
                  <Input
                    value={formData.specialPackingRequirement || ''}
                    onChange={(e) => setFormData({ ...formData, specialPackingRequirement: e.target.value })}
                    placeholder="Any special packing requirements"
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
                  {editingInstruction ? 'Update Instruction' : 'Create Instruction'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
