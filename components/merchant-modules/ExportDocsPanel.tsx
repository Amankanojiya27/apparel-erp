// File: components/merchant-modules/ExportDocsPanel.tsx
// Phase 12: Export Documents - Full CRUD Component

'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import type { ExportDocuments } from '@/lib/merchant-types';
import { merchantStore } from '@/lib/merchant-store';

export function ExportDocsPanel() {
  const [exportDocs, setExportDocs] = useState<ExportDocuments[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingDoc, setEditingDoc] = useState<ExportDocuments | null>(null);
  const [formData, setFormData] = useState<Partial<ExportDocuments>>({});

  useEffect(() => {
    loadExportDocs();
  }, []);

  const loadExportDocs = () => {
    setExportDocs(merchantStore.getAllExportDocuments?.() || []);
  };

  const handleCreate = () => {
    setEditingDoc(null);
    setFormData({
      status: 'Pending',
      bankDocuments: [],
      otherBuyerSpecificDocuments: [],
    });
    setShowForm(true);
  };

  const handleEdit = (doc: ExportDocuments) => {
    setEditingDoc(doc);
    setFormData({ ...doc });
    setShowForm(true);
  };

  const handleDelete = (exportDocumentsId: string) => {
    if (confirm('Are you sure you want to delete this export document record?')) {
      setExportDocs(exportDocs.filter(d => d.exportDocumentsId !== exportDocumentsId));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingDoc) {
      merchantStore.updateExportDocuments?.(editingDoc.exportDocumentsId, formData);
    } else {
      merchantStore.createExportDocuments(formData as Omit<ExportDocuments, 'exportDocumentsId' | 'createdAt' | 'updatedAt'>);
    }
    
    setShowForm(false);
    setEditingDoc(null);
    setFormData({});
    loadExportDocs();
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingDoc(null);
    setFormData({});
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Complete': return 'bg-green-100 text-green-700';
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const addBankDocument = () => {
    setFormData({
      ...formData,
      bankDocuments: [...(formData.bankDocuments || []), { documentType: '', url: '' }],
    });
  };

  const updateBankDocument = (index: number, field: string, value: any) => {
    const updated = [...(formData.bankDocuments || [])];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, bankDocuments: updated });
  };

  const removeBankDocument = (index: number) => {
    const updated = formData.bankDocuments?.filter((_, i) => i !== index) || [];
    setFormData({ ...formData, bankDocuments: updated });
  };

  const addOtherDocument = () => {
    setFormData({
      ...formData,
      otherBuyerSpecificDocuments: [...(formData.otherBuyerSpecificDocuments || []), { documentName: '', url: '' }],
    });
  };

  const updateOtherDocument = (index: number, field: string, value: any) => {
    const updated = [...(formData.otherBuyerSpecificDocuments || [])];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, otherBuyerSpecificDocuments: updated });
  };

  const removeOtherDocument = (index: number) => {
    const updated = formData.otherBuyerSpecificDocuments?.filter((_, i) => i !== index) || [];
    setFormData({ ...formData, otherBuyerSpecificDocuments: updated });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Export Documents</h2>
            <p className="text-sm text-slate-500">Manage export documentation for shipments</p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Create Export Docs
          </Button>
        </CardHeader>
        <CardContent>
          {exportDocs.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              No export documents found. Create your first export document to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Shipment Ref</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Commercial Invoice</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Packing List</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Bank Docs</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Other Docs</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {exportDocs.map((doc) => (
                    <tr key={doc.exportDocumentsId} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm font-medium">{doc.shipmentReference}</td>
                      <td className="px-4 py-3 text-sm">{doc.commercialInvoiceId}</td>
                      <td className="px-4 py-3 text-sm">{doc.packingListId}</td>
                      <td className="px-4 py-3 text-sm">{doc.bankDocuments.length} docs</td>
                      <td className="px-4 py-3 text-sm">{doc.otherBuyerSpecificDocuments.length} docs</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(doc.status)}`}>
                          {doc.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button variant="secondary" size="sm" onClick={() => handleEdit(doc)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="secondary" size="sm" onClick={() => handleDelete(doc.exportDocumentsId)}>
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
                {editingDoc ? 'Edit Export Documents' : 'Create New Export Documents'}
              </h2>
              <p className="text-sm text-slate-500">
                {editingDoc ? 'Update export document details' : 'Create a new export document record'}
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Shipment Reference *</label>
                  <Input
                    required
                    value={formData.shipmentReference || ''}
                    onChange={(e) => setFormData({ ...formData, shipmentReference: e.target.value })}
                    placeholder="Shipment reference"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Commercial Invoice ID *</label>
                  <Input
                    required
                    value={formData.commercialInvoiceId || ''}
                    onChange={(e) => setFormData({ ...formData, commercialInvoiceId: e.target.value })}
                    placeholder="Commercial invoice ID"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Packing List ID *</label>
                  <Input
                    required
                    value={formData.packingListId || ''}
                    onChange={(e) => setFormData({ ...formData, packingListId: e.target.value })}
                    placeholder="Packing list ID"
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
                    <option value="Complete">Complete</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Commercial Invoice URL</label>
                  <Input
                    value={formData.commercialInvoiceUrl || ''}
                    onChange={(e) => setFormData({ ...formData, commercialInvoiceUrl: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Packing List URL</label>
                  <Input
                    value={formData.packingListUrl || ''}
                    onChange={(e) => setFormData({ ...formData, packingListUrl: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Certificate of Origin URL</label>
                  <Input
                    value={formData.certificateOfOriginUrl || ''}
                    onChange={(e) => setFormData({ ...formData, certificateOfOriginUrl: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">GSP Certificate URL</label>
                  <Input
                    value={formData.gspCertificateUrl || ''}
                    onChange={(e) => setFormData({ ...formData, gspCertificateUrl: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Inspection Certificate URL</label>
                  <Input
                    value={formData.inspectionCertificateUrl || ''}
                    onChange={(e) => setFormData({ ...formData, inspectionCertificateUrl: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Bill of Lading URL</label>
                  <Input
                    value={formData.billOfLadingUrl || ''}
                    onChange={(e) => setFormData({ ...formData, billOfLadingUrl: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Airway Bill URL</label>
                  <Input
                    value={formData.airwayBillUrl || ''}
                    onChange={(e) => setFormData({ ...formData, airwayBillUrl: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Shipping Bill URL</label>
                  <Input
                    value={formData.shippingBillUrl || ''}
                    onChange={(e) => setFormData({ ...formData, shippingBillUrl: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Bank Documents</h3>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={addBankDocument}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Bank Document
                  </Button>
                </div>
                {formData.bankDocuments?.map((doc, index) => (
                  <div key={index} className="grid grid-cols-3 gap-2 mb-2">
                    <select
                      className="w-full rounded-lg border border-slate-300 px-3 py-2"
                      value={doc.documentType}
                      onChange={(e) => updateBankDocument(index, 'documentType', e.target.value)}
                    >
                      <option value="">Select Type</option>
                      <option value="LC">LC</option>
                      <option value="SWIFT copy">SWIFT copy</option>
                    </select>
                    <Input
                      placeholder="Document URL"
                      value={doc.url}
                      onChange={(e) => updateBankDocument(index, 'url', e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => removeBankDocument(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Other Buyer Specific Documents</h3>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={addOtherDocument}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Document
                  </Button>
                </div>
                {formData.otherBuyerSpecificDocuments?.map((doc, index) => (
                  <div key={index} className="grid grid-cols-3 gap-2 mb-2">
                    <Input
                      placeholder="Document Name"
                      value={doc.documentName}
                      onChange={(e) => updateOtherDocument(index, 'documentName', e.target.value)}
                    />
                    <Input
                      placeholder="Document URL"
                      value={doc.url}
                      onChange={(e) => updateOtherDocument(index, 'url', e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => removeOtherDocument(index)}
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
                  {editingDoc ? 'Update Export Docs' : 'Create Export Docs'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
