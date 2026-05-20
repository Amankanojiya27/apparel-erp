// File: components/merchant-modules/SeasonMasterPanel.tsx
// Phase 1: Season Master - Full CRUD Component

'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import type { SeasonMaster } from '@/lib/merchant-types';
import { merchantStore } from '@/lib/merchant-store';

export function SeasonMasterPanel() {
  const [seasons, setSeasons] = useState<SeasonMaster[]>([]);
  const [buyers, setBuyers] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSeason, setEditingSeason] = useState<SeasonMaster | null>(null);
  const [formData, setFormData] = useState<Partial<SeasonMaster>>({});

  useEffect(() => {
    loadSeasons();
    loadBuyers();
  }, []);

  const loadSeasons = () => {
    setSeasons(merchantStore.getAllSeasons?.() || []);
  };

  const loadBuyers = () => {
    setBuyers(merchantStore.getAllBuyers?.() || []);
  };

  const handleCreate = () => {
    setEditingSeason(null);
    setFormData({
      status: 'active',
    });
    setShowForm(true);
  };

  const handleEdit = (season: SeasonMaster) => {
    setEditingSeason(season);
    setFormData({ ...season });
    setShowForm(true);
  };

  const handleDelete = (seasonId: string) => {
    if (confirm('Are you sure you want to delete this season?')) {
      // Note: In a real app, you'd need to check for dependent records first
      setSeasons(seasons.filter(s => s.seasonId !== seasonId));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingSeason) {
      merchantStore.updateSeason?.(editingSeason.seasonId, formData);
    } else {
      merchantStore.createSeason?.(formData as Omit<SeasonMaster, 'seasonId' | 'createdAt'>);
    }
    
    setShowForm(false);
    setEditingSeason(null);
    setFormData({});
    loadSeasons();
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSeason(null);
    setFormData({});
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Season Master</h2>
            <p className="text-sm text-slate-500">Manage seasons and collections</p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Add Season
          </Button>
        </CardHeader>
        <CardContent>
          {seasons.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              No seasons found. Create your first season to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Season Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Collection</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Buyer</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Start Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">End Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {seasons.map((season) => (
                    <tr key={season.seasonId} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm font-medium">{season.seasonName}</td>
                      <td className="px-4 py-3 text-sm">{season.collectionName || '—'}</td>
                      <td className="px-4 py-3 text-sm">{season.buyerName}</td>
                      <td className="px-4 py-3 text-sm">{season.startDate}</td>
                      <td className="px-4 py-3 text-sm">{season.endDate}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          season.status === 'active' ? 'bg-green-100 text-green-700' :
                          season.status === 'closed' ? 'bg-slate-100 text-slate-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {season.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button variant="secondary" size="sm" onClick={() => handleEdit(season)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="secondary" size="sm" onClick={() => handleDelete(season.seasonId)}>
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
                {editingSeason ? 'Edit Season' : 'Create New Season'}
              </h2>
              <p className="text-sm text-slate-500">
                {editingSeason ? 'Update season information' : 'Add a new season to the system'}
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Season Name *</label>
                  <Input
                    required
                    value={formData.seasonName || ''}
                    onChange={(e) => setFormData({ ...formData, seasonName: e.target.value })}
                    placeholder="e.g., SS24, AW24, Holiday"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Collection Name</label>
                  <Input
                    value={formData.collectionName || ''}
                    onChange={(e) => setFormData({ ...formData, collectionName: e.target.value })}
                    placeholder="e.g., Summer Collection 2024"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Buyer *</label>
                  <select
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={formData.buyerId || ''}
                    onChange={(e) => {
                      const buyer = buyers.find(b => b.buyerId === e.target.value);
                      setFormData({ 
                        ...formData, 
                        buyerId: e.target.value,
                        buyerName: buyer?.buyerName || ''
                      });
                    }}
                  >
                    <option value="">Select Buyer</option>
                    {buyers.map((buyer) => (
                      <option key={buyer.buyerId} value={buyer.buyerId}>
                        {buyer.buyerName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Status *</label>
                  <select
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={formData.status || ''}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  >
                    <option value="active">Active</option>
                    <option value="closed">Closed</option>
                    <option value="upcoming">Upcoming</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Start Date *</label>
                  <Input
                    required
                    type="date"
                    value={formData.startDate || ''}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">End Date *</label>
                  <Input
                    required
                    type="date"
                    value={formData.endDate || ''}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <label className="mb-1 block text-sm font-medium text-slate-700">Style Range Plan URL</label>
                <Input
                  value={formData.styleRangePlanUrl || ''}
                  onChange={(e) => setFormData({ ...formData, styleRangePlanUrl: e.target.value })}
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
                  {editingSeason ? 'Update Season' : 'Create Season'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
