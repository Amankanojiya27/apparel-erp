// File: components/merchant-modules/CostSheetPanel.tsx
// Phase 3: Cost Sheet - Full CRUD Component

'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Plus, Pencil, Trash2, Save, X, Calculator } from 'lucide-react';
import type { CostSheet, FabricCostItem, TrimCostItem, CMTCost, OtherCharges, CostSheetSummary } from '@/lib/merchant-types';
import { merchantStore } from '@/lib/merchant-store';

export function CostSheetPanel() {
  const [costSheets, setCostSheets] = useState<CostSheet[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCostSheet, setEditingCostSheet] = useState<CostSheet | null>(null);
  const [formData, setFormData] = useState<Partial<CostSheet>>({});

  useEffect(() => {
    loadCostSheets();
    loadInquiries();
  }, []);

  const loadCostSheets = () => {
    setCostSheets(merchantStore.getAllCostSheets());
  };

  const loadInquiries = () => {
    setInquiries(merchantStore.getAllInquiries());
  };

  const handleCreate = () => {
    setEditingCostSheet(null);
    setFormData({
      version: 'V1',
      status: 'Pending',
      currency: 'USD',
      fabricCosts: [],
      trimCosts: [],
      cmtCost: {
        cuttingCharges: 0,
        stitchingCharges: 0,
        finishingCharges: 0,
        totalCMT: 0,
      } as CMTCost,
      otherCharges: {
        testingCharges: 0,
        inspectionCharges: 0,
        commissionPercent: 0,
        commissionAmount: 0,
        bankCharges: 0,
        freightCharges: 0,
        insurance: 0,
        miscellaneous: 0,
        totalOtherCharges: 0,
      } as OtherCharges,
      summary: {
        totalRawMaterialCost: 0,
        totalCMTCost: 0,
        totalOtherCharges: 0,
        overheadPercent: 5,
        overheadAmount: 0,
        profitMarginPercent: 15,
        profitMarginAmount: 0,
        finalFOBPrice: 0,
        buyerTargetPrice: 0,
        difference: 0,
      } as CostSheetSummary,
    });
    setShowForm(true);
  };

  const handleEdit = (costSheet: CostSheet) => {
    setEditingCostSheet(costSheet);
    setFormData({ ...costSheet });
    setShowForm(true);
  };

  const handleDelete = (costSheetId: string) => {
    if (confirm('Are you sure you want to delete this cost sheet?')) {
      setCostSheets(costSheets.filter(c => c.costSheetId !== costSheetId));
    }
  };

  const calculateTotals = () => {
    const fabricCosts = formData.fabricCosts || [];
    const trimCosts = formData.trimCosts || [];
    const cmtCost = formData.cmtCost || { cuttingCharges: 0, stitchingCharges: 0, finishingCharges: 0, totalCMT: 0 };
    const otherCharges = formData.otherCharges as OtherCharges || { 
      testingCharges: 0, 
      inspectionCharges: 0, 
      commissionPercent: 0,
      commissionAmount: 0, 
      bankCharges: 0, 
      freightCharges: 0, 
      insurance: 0, 
      miscellaneous: 0,
      totalOtherCharges: 0 
    };

    const totalFabricCost = fabricCosts.reduce((sum, item) => sum + item.totalFabricCostPerPiece, 0);
    const totalTrimCost = trimCosts.reduce((sum, item) => sum + item.totalCostPerPiece, 0);
    const totalRawMaterialCost = totalFabricCost + totalTrimCost;
    const totalCMTCost = cmtCost.cuttingCharges + cmtCost.stitchingCharges + cmtCost.finishingCharges + (cmtCost.embroideryPrintCharges || 0) + (cmtCost.washingCharges || 0);
    const totalOtherCharges = otherCharges.testingCharges + otherCharges.inspectionCharges + otherCharges.commissionAmount + otherCharges.bankCharges + otherCharges.freightCharges + otherCharges.insurance + otherCharges.miscellaneous;

    const subtotal = totalRawMaterialCost + totalCMTCost + totalOtherCharges;
    const overheadPercent = formData.summary?.overheadPercent || 5;
    const overheadAmount = (subtotal * overheadPercent) / 100;
    const profitMarginPercent = formData.summary?.profitMarginPercent || 15;
    const profitMarginAmount = ((subtotal + overheadAmount) * profitMarginPercent) / 100;
    const finalFOBPrice = subtotal + overheadAmount + profitMarginAmount;
    const buyerTargetPrice = formData.summary?.buyerTargetPrice || 0;
    const difference = finalFOBPrice - buyerTargetPrice;

    setFormData({
      ...formData,
      summary: {
        totalRawMaterialCost,
        totalCMTCost,
        totalOtherCharges,
        overheadPercent,
        overheadAmount,
        profitMarginPercent,
        profitMarginAmount,
        finalFOBPrice,
        buyerTargetPrice,
        difference,
      } as CostSheetSummary,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculateTotals();
    
    if (editingCostSheet) {
      merchantStore.updateCostSheet(editingCostSheet.costSheetId, formData);
    } else {
      merchantStore.createCostSheet(formData as Omit<CostSheet, 'costSheetId' | 'costSheetNumber' | 'createdAt' | 'updatedAt'>);
    }
    
    setShowForm(false);
    setEditingCostSheet(null);
    setFormData({});
    loadCostSheets();
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCostSheet(null);
    setFormData({});
  };

  const addFabricCost = () => {
    const newFabricCost: FabricCostItem = {
      fabricName: '',
      fabricComposition: '',
      fabricWidth: 0,
      consumptionPerPiece: 0,
      fabricRate: 0,
      wastagePercent: 5,
      totalFabricCostPerPiece: 0,
      fabricSource: 'local',
    };
    setFormData({
      ...formData,
      fabricCosts: [...(formData.fabricCosts || []), newFabricCost],
    });
  };

  const updateFabricCost = (index: number, field: keyof FabricCostItem, value: any) => {
    const updatedFabricCosts = [...(formData.fabricCosts || [])];
    updatedFabricCosts[index] = { ...updatedFabricCosts[index], [field]: value };
    
    // Recalculate total for this item
    if (field === 'consumptionPerPiece' || field === 'fabricRate' || field === 'wastagePercent') {
      const item = updatedFabricCosts[index];
      const wastageMultiplier = 1 + (item.wastagePercent / 100);
      updatedFabricCosts[index] = { ...item, totalFabricCostPerPiece: item.consumptionPerPiece * item.fabricRate * wastageMultiplier };
    }
    
    setFormData({ ...formData, fabricCosts: updatedFabricCosts });
  };

  const removeFabricCost = (index: number) => {
    const updatedFabricCosts = (formData.fabricCosts || []).filter((_, i) => i !== index);
    setFormData({ ...formData, fabricCosts: updatedFabricCosts });
  };

  const addTrimCost = () => {
    const newTrimCost: TrimCostItem = {
      itemName: '',
      quantityPerGarment: 0,
      ratePerUnit: 0,
      totalCostPerPiece: 0,
    };
    setFormData({
      ...formData,
      trimCosts: [...(formData.trimCosts || []), newTrimCost],
    });
  };

  const updateTrimCost = (index: number, field: keyof TrimCostItem, value: any) => {
    const updatedTrimCosts = [...(formData.trimCosts || [])];
    updatedTrimCosts[index] = { ...updatedTrimCosts[index], [field]: value };
    
    // Recalculate total for this item
    const item = updatedTrimCosts[index];
    updatedTrimCosts[index] = { ...item, totalCostPerPiece: item.quantityPerGarment * item.ratePerUnit };
    
    setFormData({ ...formData, trimCosts: updatedTrimCosts });
  };

  const removeTrimCost = (index: number) => {
    const updatedTrimCosts = (formData.trimCosts || []).filter((_, i) => i !== index);
    setFormData({ ...formData, trimCosts: updatedTrimCosts });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-700';
      case 'Rejected': return 'bg-red-100 text-red-700';
      case 'Revised': return 'bg-yellow-100 text-yellow-700';
      case 'Pending': return 'bg-blue-100 text-blue-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Cost Sheet</h2>
            <p className="text-sm text-slate-500">Manage cost sheets and pricing calculations</p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Create Cost Sheet
          </Button>
        </CardHeader>
        <CardContent>
          {costSheets.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              No cost sheets found. Create your first cost sheet to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Cost Sheet No.</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Style Ref</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Buyer</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Version</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Total Cost</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">FOB Price</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {costSheets.map((costSheet) => (
                    <tr key={costSheet.costSheetId} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm font-medium">{costSheet.costSheetNumber}</td>
                      <td className="px-4 py-3 text-sm">{costSheet.styleReference}</td>
                      <td className="px-4 py-3 text-sm">{costSheet.buyerName}</td>
                      <td className="px-4 py-3 text-sm">{costSheet.version}</td>
                      <td className="px-4 py-3 text-sm">{costSheet.summary?.totalRawMaterialCost?.toFixed(2)} {costSheet.currency}</td>
                      <td className="px-4 py-3 text-sm font-medium">{costSheet.summary?.finalFOBPrice?.toFixed(2)} {costSheet.currency}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(costSheet.status)}`}>
                          {costSheet.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button variant="secondary" size="sm" onClick={() => handleEdit(costSheet)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="secondary" size="sm" onClick={() => handleDelete(costSheet.costSheetId)}>
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
          <div className="max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="border-b border-slate-200 p-6">
              <h2 className="text-xl font-semibold">
                {editingCostSheet ? 'Edit Cost Sheet' : 'Create New Cost Sheet'}
              </h2>
              <p className="text-sm text-slate-500">
                {editingCostSheet ? 'Update cost sheet details' : 'Create a new cost sheet with pricing breakdown'}
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6 p-6">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Costing Date *</label>
                  <Input
                    required
                    type="date"
                    value={formData.costingDate || ''}
                    onChange={(e) => setFormData({ ...formData, costingDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Style Reference *</label>
                  <select
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={formData.styleReference || ''}
                    onChange={(e) => {
                      const inquiry = inquiries.find(i => i.styleReferenceNumber === e.target.value);
                      setFormData({ 
                        ...formData, 
                        styleReference: e.target.value,
                        buyerName: inquiry?.buyerName || '',
                        seasonName: inquiry?.seasonName || '',
                      });
                    }}
                  >
                    <option value="">Select Inquiry</option>
                    {inquiries.map((inquiry) => (
                      <option key={inquiry.inquiryId} value={inquiry.styleReferenceNumber}>
                        {inquiry.styleReferenceNumber} - {inquiry.buyerName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Version *</label>
                  <Input
                    required
                    value={formData.version || ''}
                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                    placeholder="e.g., V1, V2, V3"
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
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Revised">Revised</option>
                  </select>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">Fabric Costs</h3>
                  <Button type="button" variant="secondary" size="sm" onClick={addFabricCost}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Fabric
                  </Button>
                </div>
                {formData.fabricCosts?.map((fabric, index) => (
                  <div key={index} className="mb-4 rounded-lg border border-slate-200 p-4">
                    <div className="grid grid-cols-4 gap-3">
                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-600">Fabric Name</label>
                        <Input
                          value={fabric.fabricName}
                          onChange={(e) => updateFabricCost(index, 'fabricName', e.target.value)}
                          placeholder="Fabric name"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-600">Composition</label>
                        <Input
                          value={fabric.fabricComposition}
                          onChange={(e) => updateFabricCost(index, 'fabricComposition', e.target.value)}
                          placeholder="e.g., 100% Cotton"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-600">Width (inch)</label>
                        <Input
                          type="number"
                          value={fabric.fabricWidth}
                          onChange={(e) => updateFabricCost(index, 'fabricWidth', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-600">Source</label>
                        <select
                          value={fabric.fabricSource}
                          onChange={(e) => updateFabricCost(index, 'fabricSource', e.target.value as any)}
                          className="w-full rounded-lg border border-slate-300 px-3 py-2"
                        >
                          <option value="local">Local</option>
                          <option value="import">Import</option>
                        </select>
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-600">Consumption (m)</label>
                        <Input
                          type="number"
                          step="0.01"
                          value={fabric.consumptionPerPiece}
                          onChange={(e) => updateFabricCost(index, 'consumptionPerPiece', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-600">Rate (per m)</label>
                        <Input
                          type="number"
                          step="0.01"
                          value={fabric.fabricRate}
                          onChange={(e) => updateFabricCost(index, 'fabricRate', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-600">Wastage %</label>
                        <Input
                          type="number"
                          value={fabric.wastagePercent}
                          onChange={(e) => updateFabricCost(index, 'wastagePercent', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="flex items-end">
                        <div className="flex-1">
                          <label className="mb-1 block text-xs font-medium text-slate-600">Total Cost</label>
                          <Input
                            type="number"
                            step="0.01"
                            value={fabric.totalFabricCostPerPiece.toFixed(2)}
                            readOnly
                            className="bg-slate-50"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          className="ml-2"
                          onClick={() => removeFabricCost(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">Trim & Accessories Costs</h3>
                  <Button type="button" variant="secondary" size="sm" onClick={addTrimCost}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Trim
                  </Button>
                </div>
                {formData.trimCosts?.map((trim, index) => (
                  <div key={index} className="mb-4 rounded-lg border border-slate-200 p-4">
                    <div className="grid grid-cols-4 gap-3">
                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-600">Item Name</label>
                        <Input
                          value={trim.itemName}
                          onChange={(e) => updateTrimCost(index, 'itemName', e.target.value)}
                          placeholder="e.g., Button, Zipper"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-600">Qty per Garment</label>
                        <Input
                          type="number"
                          value={trim.quantityPerGarment}
                          onChange={(e) => updateTrimCost(index, 'quantityPerGarment', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-600">Rate per Unit</label>
                        <Input
                          type="number"
                          step="0.01"
                          value={trim.ratePerUnit}
                          onChange={(e) => updateTrimCost(index, 'ratePerUnit', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="flex items-end">
                        <div className="flex-1">
                          <label className="mb-1 block text-xs font-medium text-slate-600">Total Cost</label>
                          <Input
                            type="number"
                            step="0.01"
                            value={trim.totalCostPerPiece.toFixed(2)}
                            readOnly
                            className="bg-slate-50"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          className="ml-2"
                          onClick={() => removeTrimCost(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <h3 className="mb-3 font-medium">CMT (Cut, Make, Trim) Costs</h3>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Cutting Charges</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.cmtCost?.cuttingCharges || 0}
                      onChange={(e) => setFormData({
                        ...formData,
                        cmtCost: { ...formData.cmtCost, cuttingCharges: parseFloat(e.target.value) || 0 } as any
                      })}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Stitching Charges</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.cmtCost?.stitchingCharges || 0}
                      onChange={(e) => setFormData({
                        ...formData,
                        cmtCost: { ...formData.cmtCost, stitchingCharges: parseFloat(e.target.value) || 0 } as any
                      })}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Finishing Charges</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.cmtCost?.finishingCharges || 0}
                      onChange={(e) => setFormData({
                        ...formData,
                        cmtCost: { ...formData.cmtCost, finishingCharges: parseFloat(e.target.value) || 0 } as any
                      })}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Embroidery/Print</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.cmtCost?.embroideryPrintCharges || 0}
                      onChange={(e) => setFormData({
                        ...formData,
                        cmtCost: { ...formData.cmtCost, embroideryPrintCharges: parseFloat(e.target.value) || 0 } as any
                      })}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="mb-3 font-medium">Summary & Pricing</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Overhead %</label>
                    <Input
                      type="number"
                      value={formData.summary?.overheadPercent || 5}
                      onChange={(e) => setFormData({
                        ...formData,
                        summary: { ...formData.summary, overheadPercent: parseFloat(e.target.value) || 5 } as any
                      })}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Profit Margin %</label>
                    <Input
                      type="number"
                      value={formData.summary?.profitMarginPercent || 15}
                      onChange={(e) => setFormData({
                        ...formData,
                        summary: { ...formData.summary, profitMarginPercent: parseFloat(e.target.value) || 15 } as any
                      })}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Buyer Target Price</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.summary?.buyerTargetPrice || 0}
                      onChange={(e) => setFormData({
                        ...formData,
                        summary: { ...formData.summary, buyerTargetPrice: parseFloat(e.target.value) || 0 } as any
                      })}
                    />
                  </div>
                </div>
                <Button type="button" variant="secondary" className="mt-4" onClick={calculateTotals}>
                  <Calculator className="h-4 w-4 mr-2" />
                  Calculate Totals
                </Button>
                {formData.summary && (
                  <div className="mt-4 rounded-lg bg-slate-50 p-4">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-slate-600">Total Raw Material: </span>
                        <span className="font-medium">{formData.summary.totalRawMaterialCost.toFixed(2)} {formData.currency}</span>
                      </div>
                      <div>
                        <span className="text-slate-600">Total CMT: </span>
                        <span className="font-medium">{formData.summary.totalCMTCost.toFixed(2)} {formData.currency}</span>
                      </div>
                      <div>
                        <span className="text-slate-600">Total Other Charges: </span>
                        <span className="font-medium">{formData.summary.totalOtherCharges.toFixed(2)} {formData.currency}</span>
                      </div>
                      <div>
                        <span className="text-slate-600">Overhead Amount: </span>
                        <span className="font-medium">{formData.summary.overheadAmount.toFixed(2)} {formData.currency}</span>
                      </div>
                      <div>
                        <span className="text-slate-600">Profit Margin: </span>
                        <span className="font-medium">{formData.summary.profitMarginAmount.toFixed(2)} {formData.currency}</span>
                      </div>
                      <div>
                        <span className="text-slate-600">Final FOB Price: </span>
                        <span className="font-bold text-green-700">{formData.summary.finalFOBPrice.toFixed(2)} {formData.currency}</span>
                      </div>
                      <div className="col-span-3">
                        <span className="text-slate-600">Difference from Target: </span>
                        <span className={`font-medium ${formData.summary.difference >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                          {formData.summary.difference >= 0 ? '+' : ''}{formData.summary.difference.toFixed(2)} {formData.currency}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t pt-4">
                <label className="mb-1 block text-sm font-medium text-slate-700">Costing Remarks</label>
                <textarea
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                  rows={3}
                  value={formData.costingRemarks || ''}
                  onChange={(e) => setFormData({ ...formData, costingRemarks: e.target.value })}
                  placeholder="Any notes about this costing..."
                />
              </div>

              <div className="flex justify-end gap-3 border-t pt-4">
                <Button variant="secondary" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  {editingCostSheet ? 'Update Cost Sheet' : 'Create Cost Sheet'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
