// File: components/merchant-modules/BuyerPurchaseOrderPanel.tsx
// Phase 5: Buyer Purchase Order - Full CRUD Component

'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import type { BuyerPurchaseOrder } from '@/lib/merchant-types';
import { merchantStore } from '@/lib/merchant-store';

export function BuyerPurchaseOrderPanel() {
  const [buyerPOs, setBuyerPOs] = useState<BuyerPurchaseOrder[]>([]);
  const [buyers, setBuyers] = useState<any[]>([]);
  const [quotations, setQuotations] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPO, setEditingPO] = useState<BuyerPurchaseOrder | null>(null);
  const [formData, setFormData] = useState<Partial<BuyerPurchaseOrder>>({});

  useEffect(() => {
    loadBuyerPOs();
    loadBuyers();
    loadQuotations();
  }, []);

  const loadBuyerPOs = () => {
    setBuyerPOs(merchantStore.getAllBuyerPOs?.() || []);
  };

  const loadBuyers = () => {
    setBuyers(merchantStore.getAllBuyers?.() || []);
  };

  const loadQuotations = () => {
    setQuotations(merchantStore.getAllQuotations?.() || []);
  };

  const handleCreate = () => {
    setEditingPO(null);
    setFormData({
      shipmentMode: 'Sea',
      poStatus: 'New',
    });
    setShowForm(true);
  };

  const handleEdit = (po: BuyerPurchaseOrder) => {
    setEditingPO(po);
    setFormData({ ...po });
    setShowForm(true);
  };

  const handleDelete = (buyerPOId: string) => {
    if (confirm('Are you sure you want to delete this PO?')) {
      setBuyerPOs(buyerPOs.filter(p => p.buyerPOId !== buyerPOId));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingPO) {
      merchantStore.updateBuyerPO(editingPO.buyerPOId, formData);
    } else {
      merchantStore.createBuyerPO(formData as Omit<BuyerPurchaseOrder, 'buyerPOId' | 'createdAt' | 'updatedAt'>);
    }
    
    setShowForm(false);
    setEditingPO(null);
    setFormData({});
    loadBuyerPOs();
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingPO(null);
    setFormData({});
  };

  const addSizeBreakup = () => {
    const currentBreakup = formData.sizeWiseBreakup || [];
    setFormData({
      ...formData,
      sizeWiseBreakup: [...currentBreakup, { size: '', quantity: 0 }],
    });
  };

  const updateSizeBreakup = (index: number, field: 'size' | 'quantity', value: string | number) => {
    const updatedBreakup = [...(formData.sizeWiseBreakup || [])];
    updatedBreakup[index] = { ...updatedBreakup[index], [field]: value };
    setFormData({ ...formData, sizeWiseBreakup: updatedBreakup });
  };

  const removeSizeBreakup = (index: number) => {
    const updatedBreakup = (formData.sizeWiseBreakup || []).filter((_, i) => i !== index);
    setFormData({ ...formData, sizeWiseBreakup: updatedBreakup });
  };

  const addColorBreakup = () => {
    const currentBreakup = formData.colorWiseBreakup || [];
    setFormData({
      ...formData,
      colorWiseBreakup: [...currentBreakup, { color: '', quantity: 0 }],
    });
  };

  const updateColorBreakup = (index: number, field: 'color' | 'quantity', value: string | number) => {
    const updatedBreakup = [...(formData.colorWiseBreakup || [])];
    updatedBreakup[index] = { ...updatedBreakup[index], [field]: value };
    setFormData({ ...formData, colorWiseBreakup: updatedBreakup });
  };

  const removeColorBreakup = (index: number) => {
    const updatedBreakup = (formData.colorWiseBreakup || []).filter((_, i) => i !== index);
    setFormData({ ...formData, colorWiseBreakup: updatedBreakup });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-100 text-green-700';
      case 'In Production': return 'bg-blue-100 text-blue-700';
      case 'Shipped': return 'bg-purple-100 text-purple-700';
      case 'Closed': return 'bg-slate-100 text-slate-700';
      case 'New': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Buyer Purchase Orders</h2>
            <p className="text-sm text-slate-500">Manage buyer purchase orders</p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Create PO
          </Button>
        </CardHeader>
        <CardContent>
          {buyerPOs.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              No POs found. Create your first PO to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">PO Number</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Buyer</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Style Ref</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Quantity</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Value</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Delivery</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {buyerPOs.map((po) => (
                    <tr key={po.buyerPOId} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm font-medium">{po.poNumber}</td>
                      <td className="px-4 py-3 text-sm">{po.poReceivedDate}</td>
                      <td className="px-4 py-3 text-sm">{po.buyerName}</td>
                      <td className="px-4 py-3 text-sm">{po.styleReference}</td>
                      <td className="px-4 py-3 text-sm">{po.poQuantity}</td>
                      <td className="px-4 py-3 text-sm">{po.totalPOValue.toFixed(2)} {po.currency}</td>
                      <td className="px-4 py-3 text-sm">{po.deliveryDate}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(po.poStatus)}`}>
                          {po.poStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button variant="secondary" size="sm" onClick={() => handleEdit(po)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="secondary" size="sm" onClick={() => handleDelete(po.buyerPOId)}>
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
                {editingPO ? 'Edit Buyer PO' : 'Create New Buyer PO'}
              </h2>
              <p className="text-sm text-slate-500">
                {editingPO ? 'Update PO details' : 'Record buyer purchase order'}
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">PO Number *</label>
                  <Input
                    required
                    value={formData.poNumber || ''}
                    onChange={(e) => setFormData({ ...formData, poNumber: e.target.value })}
                    placeholder="Buyer's PO number"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">PO Received Date *</label>
                  <Input
                    required
                    type="date"
                    value={formData.poReceivedDate || ''}
                    onChange={(e) => setFormData({ ...formData, poReceivedDate: e.target.value })}
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
                        buyerName: buyer?.buyerName || '',
                        currency: buyer?.currency || 'USD',
                        paymentTerms: buyer?.paymentTerms || '30 days',
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
                  <label className="mb-1 block text-sm font-medium text-slate-700">Season</label>
                  <Input
                    value={formData.seasonName || ''}
                    onChange={(e) => setFormData({ ...formData, seasonName: e.target.value })}
                    placeholder="e.g., SS24"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Style Reference *</label>
                  <Input
                    required
                    value={formData.styleReference || ''}
                    onChange={(e) => setFormData({ ...formData, styleReference: e.target.value })}
                    placeholder="e.g., STY-001"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Style Description</label>
                  <Input
                    value={formData.styleDescription || ''}
                    onChange={(e) => setFormData({ ...formData, styleDescription: e.target.value })}
                    placeholder="Style description"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">PO Quantity *</label>
                  <Input
                    required
                    type="number"
                    value={formData.poQuantity || ''}
                    onChange={(e) => setFormData({ ...formData, poQuantity: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Agreed Price per Piece *</label>
                  <Input
                    required
                    type="number"
                    step="0.01"
                    value={formData.agreedPricePerPiece || ''}
                    onChange={(e) => {
                      const price = parseFloat(e.target.value) || 0;
                      const qty = formData.poQuantity || 0;
                      setFormData({ 
                        ...formData, 
                        agreedPricePerPiece: price,
                        totalPOValue: price * qty,
                      });
                    }}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Currency</label>
                  <Input
                    value={formData.currency || ''}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    placeholder="e.g., USD"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Total PO Value</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.totalPOValue || ''}
                    onChange={(e) => setFormData({ ...formData, totalPOValue: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                    readOnly
                    className="bg-slate-50"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Delivery Date *</label>
                  <Input
                    required
                    type="date"
                    value={formData.deliveryDate || ''}
                    onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Shipment Mode *</label>
                  <select
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={formData.shipmentMode || ''}
                    onChange={(e) => setFormData({ ...formData, shipmentMode: e.target.value as any })}
                  >
                    <option value="Sea">Sea</option>
                    <option value="Air">Air</option>
                    <option value="Road">Road</option>
                    <option value="Courier">Courier</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">FOB Port</label>
                  <Input
                    value={formData.fobPort || ''}
                    onChange={(e) => setFormData({ ...formData, fobPort: e.target.value })}
                    placeholder="e.g., Shanghai"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Destination Port</label>
                  <Input
                    value={formData.destinationPort || ''}
                    onChange={(e) => setFormData({ ...formData, destinationPort: e.target.value })}
                    placeholder="e.g., Los Angeles"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Country of Delivery *</label>
                  <Input
                    required
                    value={formData.countryOfDelivery || ''}
                    onChange={(e) => setFormData({ ...formData, countryOfDelivery: e.target.value })}
                    placeholder="e.g., United States"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">PO Status *</label>
                  <select
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={formData.poStatus || ''}
                    onChange={(e) => setFormData({ ...formData, poStatus: e.target.value as any })}
                  >
                    <option value="New">New</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="In Production">In Production</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">Size Wise Breakup</h3>
                  <Button type="button" variant="secondary" size="sm" onClick={addSizeBreakup}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Size
                  </Button>
                </div>
                {formData.sizeWiseBreakup?.map((item, index) => (
                  <div key={index} className="mb-2 flex gap-3">
                    <Input
                      placeholder="Size (e.g., S, M, L)"
                      value={item.size}
                      onChange={(e) => updateSizeBreakup(index, 'size', e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      placeholder="Quantity"
                      value={item.quantity}
                      onChange={(e) => updateSizeBreakup(index, 'quantity', parseInt(e.target.value) || 0)}
                      className="w-32"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => removeSizeBreakup(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">Color Wise Breakup</h3>
                  <Button type="button" variant="secondary" size="sm" onClick={addColorBreakup}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Color
                  </Button>
                </div>
                {formData.colorWiseBreakup?.map((item, index) => (
                  <div key={index} className="mb-2 flex gap-3">
                    <Input
                      placeholder="Color (e.g., Navy, Black)"
                      value={item.color}
                      onChange={(e) => updateColorBreakup(index, 'color', e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      placeholder="Quantity"
                      value={item.quantity}
                      onChange={(e) => updateColorBreakup(index, 'quantity', parseInt(e.target.value) || 0)}
                      className="w-32"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => removeColorBreakup(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <label className="mb-1 block text-sm font-medium text-slate-700">Special Buyer Requirements</label>
                <textarea
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                  rows={3}
                  value={formData.specialBuyerRequirements || ''}
                  onChange={(e) => setFormData({ ...formData, specialBuyerRequirements: e.target.value })}
                  placeholder="Any special requirements from buyer..."
                />
              </div>

              <div className="border-t pt-4">
                <label className="mb-1 block text-sm font-medium text-slate-700">PO Document URL</label>
                <Input
                  value={formData.poDocumentUrl || ''}
                  onChange={(e) => setFormData({ ...formData, poDocumentUrl: e.target.value })}
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
                  {editingPO ? 'Update PO' : 'Create PO'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
