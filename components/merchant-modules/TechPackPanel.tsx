// File: components/merchant-modules/TechPackPanel.tsx
// Phase 6: Tech Pack/Style Specification - Full CRUD Component

'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import type { TechPack, ConstructionDetail, MeasurementPoint, BOMItem, Colorway } from '@/lib/merchant-types';
import { merchantStore } from '@/lib/merchant-store';

export function TechPackPanel() {
  const [techPacks, setTechPacks] = useState<TechPack[]>([]);
  const [buyerPOs, setBuyerPOs] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTechPack, setEditingTechPack] = useState<TechPack | null>(null);
  const [formData, setFormData] = useState<Partial<TechPack>>({});

  useEffect(() => {
    loadTechPacks();
    loadBuyerPOs();
  }, []);

  const loadTechPacks = () => {
    setTechPacks(merchantStore.getAllTechPacks?.() || []);
  };

  const loadBuyerPOs = () => {
    setBuyerPOs(merchantStore.getAllBuyerPOs?.() || []);
  };

  const handleCreate = () => {
    setEditingTechPack(null);
    setFormData({
      versionNumber: 'V1',
      measurementSheet: [],
      constructionDetails: {
        stitchingType: '',
        seamType: '',
        hemDetails: '',
        placketDetails: '',
        pocketDetails: '',
      },
      bom: {
        fabricDetails: { quality: '', color: '', quantity: 0 },
        trimsList: [],
      },
      colorways: [],
    });
    setShowForm(true);
  };

  const handleEdit = (techPack: TechPack) => {
    setEditingTechPack(techPack);
    setFormData({ ...techPack });
    setShowForm(true);
  };

  const handleDelete = (techPackId: string) => {
    if (confirm('Are you sure you want to delete this tech pack?')) {
      setTechPacks(techPacks.filter(t => t.techPackId !== techPackId));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingTechPack) {
      merchantStore.updateTechPack?.(editingTechPack.techPackId, formData);
    } else {
      merchantStore.createTechPack?.(formData as Omit<TechPack, 'techPackId' | 'techPackNumber' | 'createdAt' | 'updatedAt'>);
    }
    
    setShowForm(false);
    setEditingTechPack(null);
    setFormData({});
    loadTechPacks();
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTechPack(null);
    setFormData({});
  };

  const addMeasurementPoint = () => {
    const currentSheet = formData.measurementSheet || [];
    setFormData({
      ...formData,
      measurementSheet: [...currentSheet, {
        pointOfMeasure: '',
        sizeWiseMeasurements: [],
      }],
    });
  };

  const updateMeasurementPoint = (index: number, field: keyof MeasurementPoint, value: any) => {
    const updatedSheet = [...(formData.measurementSheet || [])];
    updatedSheet[index] = { ...updatedSheet[index], [field]: value };
    setFormData({ ...formData, measurementSheet: updatedSheet });
  };

  const removeMeasurementPoint = (index: number) => {
    const updatedSheet = (formData.measurementSheet || []).filter((_, i) => i !== index);
    setFormData({ ...formData, measurementSheet: updatedSheet });
  };

  const addSizeMeasurement = (pointIndex: number) => {
    const currentSheet = [...(formData.measurementSheet || [])];
    const point = currentSheet[pointIndex];
    if (point) {
      point.sizeWiseMeasurements = [...(point.sizeWiseMeasurements || []), { size: '', measurement: 0, tolerance: '' }];
      currentSheet[pointIndex] = point;
      setFormData({ ...formData, measurementSheet: currentSheet });
    }
  };

  const updateSizeMeasurement = (pointIndex: number, sizeIndex: number, field: 'size' | 'measurement' | 'tolerance', value: any) => {
    const currentSheet = [...(formData.measurementSheet || [])];
    const point = currentSheet[pointIndex];
    if (point && point.sizeWiseMeasurements) {
      point.sizeWiseMeasurements[sizeIndex] = { ...point.sizeWiseMeasurements[sizeIndex], [field]: value };
      currentSheet[pointIndex] = point;
      setFormData({ ...formData, measurementSheet: currentSheet });
    }
  };

  const removeSizeMeasurement = (pointIndex: number, sizeIndex: number) => {
    const currentSheet = [...(formData.measurementSheet || [])];
    const point = currentSheet[pointIndex];
    if (point && point.sizeWiseMeasurements) {
      point.sizeWiseMeasurements = point.sizeWiseMeasurements.filter((_, i) => i !== sizeIndex);
      currentSheet[pointIndex] = point;
      setFormData({ ...formData, measurementSheet: currentSheet });
    }
  };

  const addTrimItem = () => {
    const currentBom = formData.bom;
    if (currentBom) {
      setFormData({
        ...formData,
        bom: {
          ...currentBom,
          trimsList: [...(currentBom.trimsList || []), { item: '', details: '', quantity: 0 }],
        },
      });
    }
  };

  const updateTrimItem = (index: number, field: 'item' | 'details' | 'quantity', value: any) => {
    const currentBom = formData.bom;
    if (currentBom && currentBom.trimsList) {
      const updatedTrims = [...currentBom.trimsList];
      updatedTrims[index] = { ...updatedTrims[index], [field]: value };
      setFormData({
        ...formData,
        bom: { ...currentBom, trimsList: updatedTrims },
      });
    }
  };

  const removeTrimItem = (index: number) => {
    const currentBom = formData.bom;
    if (currentBom && currentBom.trimsList) {
      setFormData({
        ...formData,
        bom: { ...currentBom, trimsList: currentBom.trimsList.filter((_, i) => i !== index) },
      });
    }
  };

  const addColorway = () => {
    const currentColorways = formData.colorways || [];
    setFormData({
      ...formData,
      colorways: [...currentColorways, {
        colorName: '',
        pantoneCode: '',
        labDipReference: '',
        approvalStatus: 'Pending' as any,
      }],
    });
  };

  const updateColorway = (index: number, field: keyof Colorway, value: any) => {
    const updatedColorways = [...(formData.colorways || [])];
    updatedColorways[index] = { ...updatedColorways[index], [field]: value };
    setFormData({ ...formData, colorways: updatedColorways });
  };

  const removeColorway = (index: number) => {
    const updatedColorways = (formData.colorways || []).filter((_, i) => i !== index);
    setFormData({ ...formData, colorways: updatedColorways });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Tech Packs</h2>
            <p className="text-sm text-slate-500">Manage tech packs and style specifications</p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Create Tech Pack
          </Button>
        </CardHeader>
        <CardContent>
          {techPacks.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              No tech packs found. Create your first tech pack to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Tech Pack No.</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Style Ref</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Version</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Colorways</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {techPacks.map((techPack) => (
                    <tr key={techPack.techPackId} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm font-medium">{techPack.techPackNumber}</td>
                      <td className="px-4 py-3 text-sm">{techPack.styleReference}</td>
                      <td className="px-4 py-3 text-sm">{techPack.versionNumber}</td>
                      <td className="px-4 py-3 text-sm">{techPack.colorways.length}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button variant="secondary" size="sm" onClick={() => handleEdit(techPack)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="secondary" size="sm" onClick={() => handleDelete(techPack.techPackId)}>
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
                {editingTechPack ? 'Edit Tech Pack' : 'Create New Tech Pack'}
              </h2>
              <p className="text-sm text-slate-500">
                {editingTechPack ? 'Update tech pack details' : 'Create a new tech pack specification'}
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Style Reference *</label>
                  <select
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={formData.styleReference || ''}
                    onChange={(e) => {
                      const po = buyerPOs.find(p => p.styleReference === e.target.value);
                      setFormData({ 
                        ...formData, 
                        styleReference: e.target.value,
                      });
                    }}
                  >
                    <option value="">Select Style</option>
                    {buyerPOs.map((po) => (
                      <option key={po.buyerPOId} value={po.styleReference}>
                        {po.styleReference}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Version Number *</label>
                  <Input
                    required
                    value={formData.versionNumber || ''}
                    onChange={(e) => setFormData({ ...formData, versionNumber: e.target.value })}
                    placeholder="e.g., V1, V2, V3"
                  />
                </div>
                <div className="col-span-2">
                  <label className="mb-1 block text-sm font-medium text-slate-700">Tech Pack URL *</label>
                  <Input
                    required
                    value={formData.techPackUrl || ''}
                    onChange={(e) => setFormData({ ...formData, techPackUrl: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">Construction Details</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Stitching Type (SPI)</label>
                    <Input
                      value={formData.constructionDetails?.stitchingType || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        constructionDetails: { ...formData.constructionDetails, stitchingType: e.target.value } as ConstructionDetail
                      })}
                      placeholder="e.g., 12 SPI"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Seam Type</label>
                    <Input
                      value={formData.constructionDetails?.seamType || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        constructionDetails: { ...formData.constructionDetails, seamType: e.target.value } as ConstructionDetail
                      })}
                      placeholder="e.g., Flat seam, Overlock"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Hem Details</label>
                    <Input
                      value={formData.constructionDetails?.hemDetails || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        constructionDetails: { ...formData.constructionDetails, hemDetails: e.target.value } as ConstructionDetail
                      })}
                      placeholder="e.g., 1cm double folded hem"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Placket Details</label>
                    <Input
                      value={formData.constructionDetails?.placketDetails || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        constructionDetails: { ...formData.constructionDetails, placketDetails: e.target.value } as ConstructionDetail
                      })}
                      placeholder="e.g., Hidden placket with 5 buttons"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="mb-1 block text-sm font-medium text-slate-700">Pocket Details</label>
                    <Input
                      value={formData.constructionDetails?.pocketDetails || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        constructionDetails: { ...formData.constructionDetails, pocketDetails: e.target.value } as ConstructionDetail
                      })}
                      placeholder="e.g., Patch pocket with flap"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">Measurement Sheet</h3>
                  <Button type="button" variant="secondary" size="sm" onClick={addMeasurementPoint}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Measurement Point
                  </Button>
                </div>
                {formData.measurementSheet?.map((point, pointIndex) => (
                  <div key={pointIndex} className="mb-4 rounded-lg border border-slate-200 p-4">
                    <div className="mb-3">
                      <label className="mb-1 block text-xs font-medium text-slate-600">Point of Measure</label>
                      <Input
                        value={point.pointOfMeasure}
                        onChange={(e) => updateMeasurementPoint(pointIndex, 'pointOfMeasure', e.target.value)}
                        placeholder="e.g., Chest, Length, Sleeve"
                      />
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Size Wise Measurements</span>
                      <Button type="button" variant="secondary" size="sm" onClick={() => addSizeMeasurement(pointIndex)}>
                        <Plus className="h-4 w-4 mr-1" />
                        Add Size
                      </Button>
                    </div>
                    {point.sizeWiseMeasurements?.map((size, sizeIndex) => (
                      <div key={sizeIndex} className="mb-2 flex gap-3">
                        <Input
                          placeholder="Size"
                          value={size.size}
                          onChange={(e) => updateSizeMeasurement(pointIndex, sizeIndex, 'size', e.target.value)}
                          className="w-24"
                        />
                        <Input
                          type="number"
                          placeholder="Measurement"
                          value={size.measurement}
                          onChange={(e) => updateSizeMeasurement(pointIndex, sizeIndex, 'measurement', parseFloat(e.target.value) || 0)}
                          className="w-32"
                        />
                        <Input
                          placeholder="Tolerance"
                          value={size.tolerance}
                          onChange={(e) => updateSizeMeasurement(pointIndex, sizeIndex, 'tolerance', e.target.value)}
                          className="w-24"
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => removeSizeMeasurement(pointIndex, sizeIndex)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => removeMeasurementPoint(pointIndex)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remove Point
                    </Button>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">BOM - Fabric Details</h3>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Quality</label>
                    <Input
                      value={formData.bom?.fabricDetails?.quality || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        bom: { ...formData.bom, fabricDetails: { ...formData.bom?.fabricDetails, quality: e.target.value } } as BOMItem
                      })}
                      placeholder="e.g., 100% Cotton"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Color</label>
                    <Input
                      value={formData.bom?.fabricDetails?.color || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        bom: { ...formData.bom, fabricDetails: { ...formData.bom?.fabricDetails, color: e.target.value } } as BOMItem
                      })}
                      placeholder="e.g., Navy"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Quantity (m)</label>
                    <Input
                      type="number"
                      value={formData.bom?.fabricDetails?.quantity || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        bom: { ...formData.bom, fabricDetails: { ...formData.bom?.fabricDetails, quantity: parseFloat(e.target.value) || 0 } } as BOMItem
                      })}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">BOM - Trims List</h3>
                  <Button type="button" variant="secondary" size="sm" onClick={addTrimItem}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Trim
                  </Button>
                </div>
                {formData.bom?.trimsList?.map((trim, index) => (
                  <div key={index} className="mb-2 flex gap-3">
                    <Input
                      placeholder="Item (e.g., Button, Zipper)"
                      value={trim.item}
                      onChange={(e) => updateTrimItem(index, 'item', e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      placeholder="Details"
                      value={trim.details}
                      onChange={(e) => updateTrimItem(index, 'details', e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      placeholder="Qty"
                      value={trim.quantity}
                      onChange={(e) => updateTrimItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                      className="w-24"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => removeTrimItem(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">Colorways</h3>
                  <Button type="button" variant="secondary" size="sm" onClick={addColorway}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Colorway
                  </Button>
                </div>
                {formData.colorways?.map((colorway, index) => (
                  <div key={index} className="mb-2 grid grid-cols-4 gap-3">
                    <Input
                      placeholder="Color Name"
                      value={colorway.colorName}
                      onChange={(e) => updateColorway(index, 'colorName', e.target.value)}
                    />
                    <Input
                      placeholder="Pantone Code"
                      value={colorway.pantoneCode}
                      onChange={(e) => updateColorway(index, 'pantoneCode', e.target.value)}
                    />
                    <Input
                      placeholder="Lab Dip Reference"
                      value={colorway.labDipReference}
                      onChange={(e) => updateColorway(index, 'labDipReference', e.target.value)}
                    />
                    <div className="flex gap-2">
                      <select
                        value={colorway.approvalStatus}
                        onChange={(e) => updateColorway(index, 'approvalStatus', e.target.value as any)}
                        className="flex-1 rounded-lg border border-slate-300 px-3 py-2"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => removeColorway(index)}
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
                  {editingTechPack ? 'Update Tech Pack' : 'Create Tech Pack'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
