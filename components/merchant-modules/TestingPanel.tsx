// File: components/merchant-modules/TestingPanel.tsx
// Phase 10: Testing - Full CRUD Component

'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import type { TestingRequirement } from '@/lib/merchant-types';
import { merchantStore } from '@/lib/merchant-store';

export function TestingPanel() {
  const [testingRequirements, setTestingRequirements] = useState<TestingRequirement[]>([]);
  const [workOrders, setWorkOrders] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRequirement, setEditingRequirement] = useState<TestingRequirement | null>(null);
  const [formData, setFormData] = useState<Partial<TestingRequirement>>({});

  useEffect(() => {
    loadTestingRequirements();
    loadWorkOrders();
  }, []);

  const loadTestingRequirements = () => {
    setTestingRequirements(merchantStore.getAllTestingRequirements?.() || []);
  };

  const loadWorkOrders = () => {
    setWorkOrders(merchantStore.getAllInternalWorkOrders?.() || []);
  };

  const handleCreate = () => {
    setEditingRequirement(null);
    setFormData({
      status: 'Pending',
      reTestRequired: false,
    });
    setShowForm(true);
  };

  const handleEdit = (requirement: TestingRequirement) => {
    setEditingRequirement(requirement);
    setFormData({ ...requirement });
    setShowForm(true);
  };

  const handleDelete = (testingRequirementId: string) => {
    if (confirm('Are you sure you want to delete this testing requirement?')) {
      setTestingRequirements(testingRequirements.filter(t => t.testingRequirementId !== testingRequirementId));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingRequirement) {
      merchantStore.updateTestingRequirement?.(editingRequirement.testingRequirementId, formData);
    } else {
      merchantStore.createTestingRequirement?.(formData as Omit<TestingRequirement, 'testingRequirementId' | 'createdAt' | 'updatedAt'>);
    }
    
    setShowForm(false);
    setEditingRequirement(null);
    setFormData({});
    loadTestingRequirements();
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingRequirement(null);
    setFormData({});
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pass': return 'bg-green-100 text-green-700';
      case 'Fail': return 'bg-red-100 text-red-700';
      case 'Conditional': return 'bg-yellow-100 text-yellow-700';
      case 'Pending': return 'bg-slate-100 text-slate-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Testing Requirements</h2>
            <p className="text-sm text-slate-500">Manage fabric and garment testing requirements</p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Create Test
          </Button>
        </CardHeader>
        <CardContent>
          {testingRequirements.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              No testing requirements found. Create your first test to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Style Ref</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Test Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Test Details</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Lab Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Lab Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Sample Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Report Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Re-test</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {testingRequirements.map((requirement) => (
                    <tr key={requirement.testingRequirementId} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm font-medium">{requirement.styleOrderReference}</td>
                      <td className="px-4 py-3 text-sm">{requirement.testType}</td>
                      <td className="px-4 py-3 text-sm">{requirement.testDetails}</td>
                      <td className="px-4 py-3 text-sm">{requirement.testingLabName}</td>
                      <td className="px-4 py-3 text-sm">{requirement.labType === 'in_house' ? 'In-House' : 'Third Party'}</td>
                      <td className="px-4 py-3 text-sm">{requirement.sampleSubmittedDate}</td>
                      <td className="px-4 py-3 text-sm">{requirement.testReportReceivedDate || '-'}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(requirement.status)}`}>
                          {requirement.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">{requirement.reTestRequired ? 'Yes' : 'No'}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button variant="secondary" size="sm" onClick={() => handleEdit(requirement)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="secondary" size="sm" onClick={() => handleDelete(requirement.testingRequirementId)}>
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
                {editingRequirement ? 'Edit Testing Requirement' : 'Create New Testing Requirement'}
              </h2>
              <p className="text-sm text-slate-500">
                {editingRequirement ? 'Update testing details' : 'Create a new testing requirement'}
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
                  <label className="mb-1 block text-sm font-medium text-slate-700">Test Type *</label>
                  <select
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={formData.testType || ''}
                    onChange={(e) => setFormData({ ...formData, testType: e.target.value as any })}
                  >
                    <option value="Fabric Testing">Fabric Testing</option>
                    <option value="Garment Testing">Garment Testing</option>
                    <option value="Color Fastness">Color Fastness</option>
                    <option value="Dimensional Stability">Dimensional Stability</option>
                    <option value="Chemical Testing">Chemical Testing</option>
                    <option value="Physical Testing">Physical Testing</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="mb-1 block text-sm font-medium text-slate-700">Test Details *</label>
                  <Input
                    required
                    value={formData.testDetails || ''}
                    onChange={(e) => setFormData({ ...formData, testDetails: e.target.value })}
                    placeholder="e.g., GSM, shrinkage, color fastness, pilling, REACH, Oeko-Tex"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Testing Lab Name *</label>
                  <Input
                    required
                    value={formData.testingLabName || ''}
                    onChange={(e) => setFormData({ ...formData, testingLabName: e.target.value })}
                    placeholder="Lab name"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Lab Type *</label>
                  <select
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={formData.labType || ''}
                    onChange={(e) => setFormData({ ...formData, labType: e.target.value as any })}
                  >
                    <option value="in_house">In-House</option>
                    <option value="third_party">Third Party</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Sample Submitted Date *</label>
                  <Input
                    required
                    type="date"
                    value={formData.sampleSubmittedDate || ''}
                    onChange={(e) => setFormData({ ...formData, sampleSubmittedDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Test Report Received Date</label>
                  <Input
                    type="date"
                    value={formData.testReportReceivedDate || ''}
                    onChange={(e) => setFormData({ ...formData, testReportReceivedDate: e.target.value })}
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
                    <option value="Pass">Pass</option>
                    <option value="Fail">Fail</option>
                    <option value="Conditional">Conditional</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Re-test Required</label>
                  <select
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={formData.reTestRequired ? 'true' : 'false'}
                    onChange={(e) => setFormData({ ...formData, reTestRequired: e.target.value === 'true' })}
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="mb-1 block text-sm font-medium text-slate-700">Test Report URL</label>
                  <Input
                    value={formData.testReportUrl || ''}
                    onChange={(e) => setFormData({ ...formData, testReportUrl: e.target.value })}
                    placeholder="https://..."
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
                  {editingRequirement ? 'Update Test' : 'Create Test'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
