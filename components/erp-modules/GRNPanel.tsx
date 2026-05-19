'use client';

import type { GoodsReceiptNote } from '@/lib/style-types';
import { Package, Calendar, Truck, FileText, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

export function GRNPanel({ grn }: { grn?: GoodsReceiptNote }) {
  if (!grn) {
    return (
      <div className="text-center py-8 text-slate-500">
        <Package className="mx-auto h-12 w-12 mb-2 opacity-50" />
        <p>No goods receipt note available</p>
      </div>
    );
  }

  const statusColors = {
    pending: 'bg-amber-100 text-amber-800',
    passed: 'bg-emerald-100 text-emerald-800',
    failed: 'bg-red-100 text-red-800',
    conditional: 'bg-purple-100 text-purple-800',
  };

  const statusIcons = {
    pending: AlertTriangle,
    passed: CheckCircle2,
    failed: XCircle,
    conditional: AlertTriangle,
  };

  const StatusIcon = statusIcons[grn.qualityCheckStatus];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Package className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-slate-500">GRN No.</span>
          </div>
          <p className="text-lg font-semibold">{grn.grnNo}</p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-emerald-600" />
            <span className="text-sm text-slate-500">GRN Date</span>
          </div>
          <p className="text-lg font-semibold">{new Date(grn.grnDate).toLocaleDateString('en-IN')}</p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <StatusIcon className="h-4 w-4 text-purple-600" />
            <span className="text-sm text-slate-500">QC Status</span>
          </div>
          <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${statusColors[grn.qualityCheckStatus]}`}>
            <StatusIcon className="h-3 w-3" />
            {grn.qualityCheckStatus.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold">Receipt Details</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">PO Reference</span>
              <span className="font-medium">{grn.poReference}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Vendor</span>
              <span className="font-medium">{grn.vendor}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Invoice No.</span>
              <span className="font-medium">{grn.invoiceNo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Vehicle No.</span>
              <span className="font-medium">{grn.vehicleNo}</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <h3 className="font-semibold">Inventory Status</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Inventory Updated</span>
              <span className={`font-medium ${grn.inventoryUpdated ? 'text-emerald-600' : 'text-amber-600'}`}>
                {grn.inventoryUpdated ? 'Yes' : 'No'}
              </span>
            </div>
            {grn.inventoryUpdated && (
              <div className="text-emerald-600 text-xs mt-2">
                Stock has been updated in the inventory system
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
          <h3 className="font-semibold">Received Items</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase text-slate-500">
                <th className="px-4 py-3">Item</th>
                <th className="px-4 py-3">Ordered Qty</th>
                <th className="px-4 py-3">Received Qty</th>
                <th className="px-4 py-3">Accepted</th>
                <th className="px-4 py-3">Rejected</th>
                <th className="px-4 py-3">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {grn.lineItems.map((item, index) => (
                <tr key={index} className="border-b border-slate-100">
                  <td className="px-4 py-3 font-medium">{item.item}</td>
                  <td className="px-4 py-3">{item.orderedQty.toLocaleString()}</td>
                  <td className="px-4 py-3 font-medium">{item.receivedQty.toLocaleString()}</td>
                  <td className="px-4 py-3 text-emerald-600 font-medium">{item.accepted.toLocaleString()}</td>
                  <td className="px-4 py-3 text-red-600 font-medium">{item.rejected.toLocaleString()}</td>
                  <td className="px-4 py-3">{item.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
