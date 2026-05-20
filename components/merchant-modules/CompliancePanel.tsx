// File: components/merchant-modules/CompliancePanel.tsx
// Phase 10: Compliance - Full CRUD Component

'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import type { ComplianceChecklist } from '@/lib/merchant-types';
import { merchantStore } from '@/lib/merchant-store';

export function CompliancePanel() {
  const [complianceChecklists, setComplianceChecklists] = useState<ComplianceChecklist[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingChecklist, setEditingChecklist] = useState<ComplianceChecklist | null>(null);
  const [formData, setFormData] = useState<Partial<ComplianceChecklist>>({});

  useEffect(() => {
    loadComplianceChecklists();
  }, []);

  const loadComplianceChecklists = () => {
    setComplianceChecklists(merchantStore.getAllComplianceChecklists?.() || []);
  };

  const handleCreate = () => {
    setEditingChecklist(null);
    setFormData({
      status: 'Pending',
      certificationStatus: [],
      buyerComplianceRequirementChecklist: [],
      complianceDocumentsUrls: [],
    });
    setShowForm(true);
  };

  const handleEdit = (checklist: ComplianceChecklist) => {
    setEditingChecklist(checklist);
    setFormData({ ...checklist });
    setShowForm(true);
  };

  const handleDelete = (complianceId: string) => {
    if (confirm('Are you sure you want to delete this compliance checklist?')) {
      setComplianceChecklists(complianceChecklists.filter(c => c.complianceId !== complianceId));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingChecklist) {
      merchantStore.updateComplianceChecklist?.(editingChecklist.complianceId, formData);
    } else {
      merchantStore.createComplianceChecklist(formData as Omit<ComplianceChecklist, 'complianceId' | 'createdAt' | 'updatedAt'>);
    }
    
    setShowForm(false);
    setEditingChecklist(null);
    setFormData({});
    loadComplianceChecklists();
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingChecklist(null);
    setFormData({});
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Compliant': return 'bg-green-100 text-green-700';
      case 'Non-Compliant': return 'bg-red-100 text-red-700';
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Compliance Checklist</h2>
            <p className="text-sm text-slate-500">Manage factory audit status and certifications</p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Create Checklist
          </Button>
        </CardHeader>
        <CardContent>
          {complianceChecklists.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              No compliance checklists found. Create your first checklist to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Factory Audit</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Audit Expiry</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Certifications</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Requirements</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Documents</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {complianceChecklists.map((checklist) => (
                    <tr key={checklist.complianceId} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm font-medium">{checklist.factoryAuditStatus}</td>
                      <td className="px-4 py-3 text-sm">{checklist.auditExpiryDate}</td>
                      <td className="px-4 py-3 text-sm">{checklist.certificationStatus.length} items</td>
                      <td className="px-4 py-3 text-sm">{checklist.buyerComplianceRequirementChecklist.length} items</td>
                      <td className="px-4 py-3 text-sm">{checklist.complianceDocumentsUrls.length} docs</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(checklist.status)}`}>
                          {checklist.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button variant="secondary" size="sm" onClick={() => handleEdit(checklist)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="secondary" size="sm" onClick={() => handleDelete(checklist.complianceId)}>
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
                {editingChecklist ? 'Edit Compliance Checklist' : 'Create New Compliance Checklist'}
              </h2>
              <p className="text-sm text-slate-500">
                {editingChecklist ? 'Update compliance details' : 'Create a new compliance checklist'}
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Factory Audit Status *</label>
                  <select
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={formData.factoryAuditStatus || ''}
                    onChange={(e) => setFormData({ ...formData, factoryAuditStatus: e.target.value })}
                  >
                    <option value="">Select Audit Type</option>
                    <option value="SMETA">SMETA</option>
                    <option value="BSCI">BSCI</option>
                    <option value="SA8000">SA8000</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Audit Expiry Date *</label>
                  <Input
                    required
                    type="date"
                    value={formData.auditExpiryDate || ''}
                    onChange={(e) => setFormData({ ...formData, auditExpiryDate: e.target.value })}
                  />
                </div>
                <div className="col-span-2">
                  <label className="mb-1 block text-sm font-medium text-slate-700">Certification Status (comma-separated) *</label>
                  <Input
                    required
                    value={formData.certificationStatus?.join(', ') || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      certificationStatus: e.target.value.split(',').map(c => c.trim()).filter(Boolean)
                    })}
                    placeholder="e.g., ISO, Oeko-Tex, GRS"
                  />
                </div>
                <div className="col-span-2">
                  <label className="mb-1 block text-sm font-medium text-slate-700">Buyer Compliance Requirements (comma-separated) *</label>
                  <Input
                    required
                    value={formData.buyerComplianceRequirementChecklist?.join(', ') || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      buyerComplianceRequirementChecklist: e.target.value.split(',').map(r => r.trim()).filter(Boolean)
                    })}
                    placeholder="e.g., Child labor policy, Working hours, Safety standards"
                  />
                </div>
                <div className="col-span-2">
                  <label className="mb-1 block text-sm font-medium text-slate-700">Compliance Document URLs (comma-separated)</label>
                  <Input
                    value={formData.complianceDocumentsUrls?.join(', ') || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      complianceDocumentsUrls: e.target.value.split(',').map(u => u.trim()).filter(Boolean)
                    })}
                    placeholder="https://..., https://..."
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
                    <option value="Compliant">Compliant</option>
                    <option value="Non-Compliant">Non-Compliant</option>
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
                  {editingChecklist ? 'Update Checklist' : 'Create Checklist'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
