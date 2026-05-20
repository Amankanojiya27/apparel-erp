// File: components/merchant-modules/PPMeetingPanel.tsx
// Phase 8: PP Meetings - Full CRUD Component

'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import type { PPMeetingRecord, PPMeetingActionItem } from '@/lib/merchant-types';
import { merchantStore } from '@/lib/merchant-store';

export function PPMeetingPanel() {
  const [ppMeetings, setPPMeetings] = useState<PPMeetingRecord[]>([]);
  const [workOrders, setWorkOrders] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<PPMeetingRecord | null>(null);
  const [formData, setFormData] = useState<Partial<PPMeetingRecord>>({});

  useEffect(() => {
    loadPPMeetings();
    loadWorkOrders();
  }, []);

  const loadPPMeetings = () => {
    setPPMeetings(merchantStore.getAllPPMeetings?.() || []);
  };

  const loadWorkOrders = () => {
    setWorkOrders(merchantStore.getAllInternalWorkOrders?.() || []);
  };

  const handleCreate = () => {
    setEditingMeeting(null);
    setFormData({
      ppMeetingStatus: 'Pending',
      ppSampleApprovalStatus: 'Pending',
      attendees: [],
      pointsDiscussed: [],
      issuesRaised: [],
      actionItems: [],
    });
    setShowForm(true);
  };

  const handleEdit = (meeting: PPMeetingRecord) => {
    setEditingMeeting(meeting);
    setFormData({ ...meeting });
    setShowForm(true);
  };

  const handleDelete = (ppMeetingId: string) => {
    if (confirm('Are you sure you want to delete this PP meeting record?')) {
      setPPMeetings(ppMeetings.filter(m => m.ppMeetingId !== ppMeetingId));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingMeeting) {
      merchantStore.updatePPMeeting?.(editingMeeting.ppMeetingId, formData);
    } else {
      merchantStore.createPPMeeting?.(formData as Omit<PPMeetingRecord, 'ppMeetingId' | 'createdAt' | 'updatedAt'>);
    }
    
    setShowForm(false);
    setEditingMeeting(null);
    setFormData({});
    loadPPMeetings();
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingMeeting(null);
    setFormData({});
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Done': return 'bg-green-100 text-green-700';
      case 'Approved': return 'bg-green-100 text-green-700';
      case 'Rejected': return 'bg-red-100 text-red-700';
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const addActionItem = () => {
    const newItem: PPMeetingActionItem = {
      actionItemId: `ACT-${Date.now()}`,
      actionDescription: '',
      owner: '',
      deadline: '',
      status: 'Open',
    };
    setFormData({
      ...formData,
      actionItems: [...(formData.actionItems || []), newItem],
    });
  };

  const updateActionItem = (index: number, field: keyof PPMeetingActionItem, value: any) => {
    const updated = [...(formData.actionItems || [])];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, actionItems: updated });
  };

  const removeActionItem = (index: number) => {
    const updated = formData.actionItems?.filter((_, i) => i !== index) || [];
    setFormData({ ...formData, actionItems: updated });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">PP Meetings</h2>
            <p className="text-sm text-slate-500">Manage pre-production meeting records</p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Create Meeting
          </Button>
        </CardHeader>
        <CardContent>
          {ppMeetings.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              No PP meetings found. Create your first meeting to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Meeting Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Style Ref</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Attendees</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Action Items</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Sample Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Meeting Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {ppMeetings.map((meeting) => (
                    <tr key={meeting.ppMeetingId} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm font-medium">{meeting.meetingDate}</td>
                      <td className="px-4 py-3 text-sm">{meeting.styleReference}</td>
                      <td className="px-4 py-3 text-sm">{meeting.attendees.length} attendees</td>
                      <td className="px-4 py-3 text-sm">{meeting.actionItems.length} items</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(meeting.ppSampleApprovalStatus)}`}>
                          {meeting.ppSampleApprovalStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(meeting.ppMeetingStatus)}`}>
                          {meeting.ppMeetingStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button variant="secondary" size="sm" onClick={() => handleEdit(meeting)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="secondary" size="sm" onClick={() => handleDelete(meeting.ppMeetingId)}>
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
                {editingMeeting ? 'Edit PP Meeting' : 'Create New PP Meeting'}
              </h2>
              <p className="text-sm text-slate-500">
                {editingMeeting ? 'Update meeting details' : 'Create a new pre-production meeting record'}
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Meeting Date *</label>
                  <Input
                    required
                    type="date"
                    value={formData.meetingDate || ''}
                    onChange={(e) => setFormData({ ...formData, meetingDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Style Reference *</label>
                  <select
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={formData.styleReference || ''}
                    onChange={(e) => setFormData({ ...formData, styleReference: e.target.value })}
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
                  <label className="mb-1 block text-sm font-medium text-slate-700">PP Sample Approval Status *</label>
                  <select
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={formData.ppSampleApprovalStatus || ''}
                    onChange={(e) => setFormData({ ...formData, ppSampleApprovalStatus: e.target.value as any })}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">PP Meeting Status *</label>
                  <select
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={formData.ppMeetingStatus || ''}
                    onChange={(e) => setFormData({ ...formData, ppMeetingStatus: e.target.value as any })}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Done">Done</option>
                  </select>
                </div>
              </div>

              <div className="border-t pt-4">
                <label className="mb-1 block text-sm font-medium text-slate-700">Attendees (comma-separated)</label>
                <Input
                  value={formData.attendees?.join(', ') || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    attendees: e.target.value.split(',').map(a => a.trim()).filter(Boolean)
                  })}
                  placeholder="e.g., John Doe, Jane Smith"
                />
              </div>

              <div className="border-t pt-4">
                <label className="mb-1 block text-sm font-medium text-slate-700">Points Discussed (comma-separated)</label>
                <Input
                  value={formData.pointsDiscussed?.join(', ') || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    pointsDiscussed: e.target.value.split(',').map(p => p.trim()).filter(Boolean)
                  })}
                  placeholder="e.g., Fabric quality, Delivery timeline"
                />
              </div>

              <div className="border-t pt-4">
                <label className="mb-1 block text-sm font-medium text-slate-700">Issues Raised (comma-separated)</label>
                <Input
                  value={formData.issuesRaised?.join(', ') || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    issuesRaised: e.target.value.split(',').map(i => i.trim()).filter(Boolean)
                  })}
                  placeholder="e.g., Color mismatch, Size issue"
                />
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Action Items</h3>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={addActionItem}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Action Item
                  </Button>
                </div>
                {formData.actionItems?.map((item, index) => (
                  <div key={index} className="grid grid-cols-5 gap-2 mb-2">
                    <Input
                      placeholder="Description"
                      value={item.actionDescription}
                      onChange={(e) => updateActionItem(index, 'actionDescription', e.target.value)}
                    />
                    <Input
                      placeholder="Owner"
                      value={item.owner}
                      onChange={(e) => updateActionItem(index, 'owner', e.target.value)}
                    />
                    <Input
                      type="date"
                      value={item.deadline}
                      onChange={(e) => updateActionItem(index, 'deadline', e.target.value)}
                    />
                    <select
                      value={item.status}
                      onChange={(e) => updateActionItem(index, 'status', e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    >
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => removeActionItem(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <label className="mb-1 block text-sm font-medium text-slate-700">PP Meeting Notes URL</label>
                <Input
                  value={formData.ppMeetingNotesUrl || ''}
                  onChange={(e) => setFormData({ ...formData, ppMeetingNotesUrl: e.target.value })}
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
                  {editingMeeting ? 'Update Meeting' : 'Create Meeting'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
