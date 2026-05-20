// File: components/merchant-modules/FinalInspectionPanel.tsx
// Phase 9: Final Inspection - Full CRUD Component

'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import type { FinalInspection, MeasurementCheckResult, VisualCheckResult, PackingCheck } from '@/lib/merchant-types';
import { merchantStore } from '@/lib/merchant-store';

export function FinalInspectionPanel() {
  const [inspections, setInspections] = useState<FinalInspection[]>([]);
  const [workOrders, setWorkOrders] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingInspection, setEditingInspection] = useState<FinalInspection | null>(null);
  const [formData, setFormData] = useState<Partial<FinalInspection>>({});

  useEffect(() => {
    loadInspections();
    loadWorkOrders();
  }, []);

  const loadInspections = () => {
    setInspections(merchantStore.getAllFinalInspections?.() || []);
  };

  const loadWorkOrders = () => {
    setWorkOrders(merchantStore.getAllInternalWorkOrders?.() || []);
  };

  const handleCreate = () => {
    setEditingInspection(null);
    setFormData({
      aqlLevel: '2.5',
      samplingPlan: 'normal',
      measurementCheckResult: { checkedPieces: 0, passed: 0, failed: 0 },
      visualCheckResult: { defectWiseCount: [] },
      packingCheck: {
        cartonMarkingCheck: false,
        labelCheck: false,
        polyBagCheck: false,
        assortmentCheck: false,
      },
      finalResult: 'Passed',
      inspectorType: 'internal',
    });
    setShowForm(true);
  };

  const handleEdit = (inspection: FinalInspection) => {
    setEditingInspection(inspection);
    setFormData({ ...inspection });
    setShowForm(true);
  };

  const handleDelete = (finalInspectionId: string) => {
    if (confirm('Are you sure you want to delete this final inspection record?')) {
      setInspections(inspections.filter(i => i.finalInspectionId !== finalInspectionId));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingInspection) {
      merchantStore.updateFinalInspection?.(editingInspection.finalInspectionId, formData);
    } else {
      merchantStore.createFinalInspection(formData as Omit<FinalInspection, 'finalInspectionId' | 'fiNumber' | 'createdAt' | 'updatedAt'>);
    }
    
    setShowForm(false);
    setEditingInspection(null);
    setFormData({});
    loadInspections();
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingInspection(null);
    setFormData({});
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case 'Passed': return 'bg-green-100 text-green-700';
      case 'Failed': return 'bg-red-100 text-red-700';
      case 'Conditional Pass': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const addDefect = () => {
    const visualResult = formData.visualCheckResult || { defectWiseCount: [] };
    setFormData({
      ...formData,
      visualCheckResult: {
        ...visualResult,
        defectWiseCount: [...visualResult.defectWiseCount, { defectType: '', major: 0, minor: 0, critical: 0 }],
      },
    });
  };

  const updateDefect = (index: number, field: string, value: any) => {
    const visualResult = formData.visualCheckResult || { defectWiseCount: [] };
    const updated = [...visualResult.defectWiseCount];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({
      ...formData,
      visualCheckResult: { ...visualResult, defectWiseCount: updated },
    });
  };

  const removeDefect = (index: number) => {
    const visualResult = formData.visualCheckResult || { defectWiseCount: [] };
    const updated = visualResult.defectWiseCount.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      visualCheckResult: { ...visualResult, defectWiseCount: updated },
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Final Inspection</h2>
            <p className="text-sm text-slate-500">Manage final inspection records with AQL compliance</p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Create Inspection
          </Button>
        </CardHeader>
        <CardContent>
          {inspections.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              No final inspection records found. Create your first inspection to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">FI Number</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Style Ref</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Order Qty</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Inspected</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">AQL</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Inspector</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Result</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inspections.map((inspection) => (
                    <tr key={inspection.finalInspectionId} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm font-medium">{inspection.fiNumber}</td>
                      <td className="px-4 py-3 text-sm">{inspection.inspectionDate}</td>
                      <td className="px-4 py-3 text-sm">{inspection.styleOrderReference}</td>
                      <td className="px-4 py-3 text-sm">{inspection.orderQuantity}</td>
                      <td className="px-4 py-3 text-sm">{inspection.inspectedQuantity}</td>
                      <td className="px-4 py-3 text-sm">{inspection.aqlLevel}</td>
                      <td className="px-4 py-3 text-sm">{inspection.inspectorName}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getResultColor(inspection.finalResult)}`}>
                          {inspection.finalResult}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button variant="secondary" size="sm" onClick={() => handleEdit(inspection)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="secondary" size="sm" onClick={() => handleDelete(inspection.finalInspectionId)}>
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
                {editingInspection ? 'Edit Final Inspection' : 'Create New Final Inspection'}
              </h2>
              <p className="text-sm text-slate-500">
                {editingInspection ? 'Update inspection details' : 'Create a new final inspection record'}
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Inspection Date *</label>
                  <Input
                    required
                    type="date"
                    value={formData.inspectionDate || ''}
                    onChange={(e) => setFormData({ ...formData, inspectionDate: e.target.value })}
                  />
                </div>
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
                  <label className="mb-1 block text-sm font-medium text-slate-700">Order Quantity *</label>
                  <Input
                    required
                    type="number"
                    value={formData.orderQuantity || ''}
                    onChange={(e) => setFormData({ ...formData, orderQuantity: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Offered Quantity *</label>
                  <Input
                    required
                    type="number"
                    value={formData.offeredQuantity || ''}
                    onChange={(e) => setFormData({ ...formData, offeredQuantity: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Inspected Quantity *</label>
                  <Input
                    required
                    type="number"
                    value={formData.inspectedQuantity || ''}
                    onChange={(e) => setFormData({ ...formData, inspectedQuantity: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">AQL Level *</label>
                  <select
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={formData.aqlLevel || ''}
                    onChange={(e) => setFormData({ ...formData, aqlLevel: e.target.value as any })}
                  >
                    <option value="1.5">1.5</option>
                    <option value="2.5">2.5</option>
                    <option value="4.0">4.0</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Sampling Plan *</label>
                  <select
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={formData.samplingPlan || ''}
                    onChange={(e) => setFormData({ ...formData, samplingPlan: e.target.value as any })}
                  >
                    <option value="normal">Normal</option>
                    <option value="tightened">Tightened</option>
                    <option value="reduced">Reduced</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Inspector Name *</label>
                  <Input
                    required
                    value={formData.inspectorName || ''}
                    onChange={(e) => setFormData({ ...formData, inspectorName: e.target.value })}
                    placeholder="Inspector name"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Inspector Type *</label>
                  <select
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={formData.inspectorType || ''}
                    onChange={(e) => setFormData({ ...formData, inspectorType: e.target.value as any })}
                  >
                    <option value="internal">Internal</option>
                    <option value="third_party">Third Party</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Third Party Agency</label>
                  <select
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={formData.thirdPartyAgency || ''}
                    onChange={(e) => setFormData({ ...formData, thirdPartyAgency: e.target.value as any })}
                  >
                    <option value="">Select Agency</option>
                    <option value="Bureau Veritas">Bureau Veritas</option>
                    <option value="SGS">SGS</option>
                    <option value="Intertek">Intertek</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Buyer QC Name</label>
                  <Input
                    value={formData.buyerQCName || ''}
                    onChange={(e) => setFormData({ ...formData, buyerQCName: e.target.value })}
                    placeholder="Buyer QC name"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Final Result *</label>
                  <select
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={formData.finalResult || ''}
                    onChange={(e) => setFormData({ ...formData, finalResult: e.target.value as any })}
                  >
                    <option value="Passed">Passed</option>
                    <option value="Failed">Failed</option>
                    <option value="Conditional Pass">Conditional Pass</option>
                  </select>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-4">Measurement Check Result</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Checked Pieces</label>
                    <Input
                      type="number"
                      value={formData.measurementCheckResult?.checkedPieces || 0}
                      onChange={(e) => setFormData({
                        ...formData,
                        measurementCheckResult: {
                          ...(formData.measurementCheckResult || { checkedPieces: 0, passed: 0, failed: 0 }),
                          checkedPieces: parseInt(e.target.value) || 0,
                        },
                      })}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Passed</label>
                    <Input
                      type="number"
                      value={formData.measurementCheckResult?.passed || 0}
                      onChange={(e) => setFormData({
                        ...formData,
                        measurementCheckResult: {
                          ...(formData.measurementCheckResult || { checkedPieces: 0, passed: 0, failed: 0 }),
                          passed: parseInt(e.target.value) || 0,
                        },
                      })}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Failed</label>
                    <Input
                      type="number"
                      value={formData.measurementCheckResult?.failed || 0}
                      onChange={(e) => setFormData({
                        ...formData,
                        measurementCheckResult: {
                          ...(formData.measurementCheckResult || { checkedPieces: 0, passed: 0, failed: 0 }),
                          failed: parseInt(e.target.value) || 0,
                        },
                      })}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Visual Check Result - Defects</h3>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={addDefect}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Defect
                  </Button>
                </div>
                {formData.visualCheckResult?.defectWiseCount?.map((defect, index) => (
                  <div key={index} className="grid grid-cols-5 gap-2 mb-2">
                    <Input
                      placeholder="Defect Type"
                      value={defect.defectType}
                      onChange={(e) => updateDefect(index, 'defectType', e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="Major"
                      value={defect.major || ''}
                      onChange={(e) => updateDefect(index, 'major', parseInt(e.target.value) || 0)}
                    />
                    <Input
                      type="number"
                      placeholder="Minor"
                      value={defect.minor || ''}
                      onChange={(e) => updateDefect(index, 'minor', parseInt(e.target.value) || 0)}
                    />
                    <Input
                      type="number"
                      placeholder="Critical"
                      value={defect.critical || ''}
                      onChange={(e) => updateDefect(index, 'critical', parseInt(e.target.value) || 0)}
                    />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => removeDefect(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-4">Packing Check</h3>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.packingCheck?.cartonMarkingCheck || false}
                      onChange={(e) => setFormData({
                        ...formData,
                        packingCheck: {
                          ...(formData.packingCheck || {
                            cartonMarkingCheck: false,
                            labelCheck: false,
                            polyBagCheck: false,
                            assortmentCheck: false,
                          }),
                          cartonMarkingCheck: e.target.checked,
                        },
                      })}
                    />
                    <span className="text-sm">Carton Marking Check</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.packingCheck?.labelCheck || false}
                      onChange={(e) => setFormData({
                        ...formData,
                        packingCheck: {
                          ...(formData.packingCheck || {
                            cartonMarkingCheck: false,
                            labelCheck: false,
                            polyBagCheck: false,
                            assortmentCheck: false,
                          }),
                          labelCheck: e.target.checked,
                        },
                      })}
                    />
                    <span className="text-sm">Label Check</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.packingCheck?.polyBagCheck || false}
                      onChange={(e) => setFormData({
                        ...formData,
                        packingCheck: {
                          ...(formData.packingCheck || {
                            cartonMarkingCheck: false,
                            labelCheck: false,
                            polyBagCheck: false,
                            assortmentCheck: false,
                          }),
                          polyBagCheck: e.target.checked,
                        },
                      })}
                    />
                    <span className="text-sm">Poly Bag Check</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.packingCheck?.assortmentCheck || false}
                      onChange={(e) => setFormData({
                        ...formData,
                        packingCheck: {
                          ...(formData.packingCheck || {
                            cartonMarkingCheck: false,
                            labelCheck: false,
                            polyBagCheck: false,
                            assortmentCheck: false,
                          }),
                          assortmentCheck: e.target.checked,
                        },
                      })}
                    />
                    <span className="text-sm">Assortment Check</span>
                  </label>
                </div>
              </div>

              <div className="border-t pt-4">
                <label className="mb-1 block text-sm font-medium text-slate-700">FI Report URL</label>
                <Input
                  value={formData.fiReportUrl || ''}
                  onChange={(e) => setFormData({ ...formData, fiReportUrl: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div className="flex justify-end gap-3 border-t pt-4">
                <Button variant="secondary" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  {editingInspection ? 'Update Inspection' : 'Create Inspection'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
