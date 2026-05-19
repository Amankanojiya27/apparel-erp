'use client';

import type { PurchaseRequisition } from '@/lib/style-types';
import { FileText, Calendar, User, Package, CheckCircle2, Clock, XCircle } from 'lucide-react';

export function PurchaseRequisitionPanel({ pr }: { pr?: PurchaseRequisition }) {
  if (!pr) {
    return (
      <div className="text-center py-8 text-slate-500">
        <FileText className="mx-auto h-12 w-12 mb-2 opacity-50" />
        <p>No purchase requisition available</p>
      </div>
    );
  }

  const statusColors = {
    pending: 'bg-amber-100 text-amber-800',
    approved: 'bg-emerald-100 text-emerald-800',
    rejected: 'bg-red-100 text-red-800',
    converted_to_po: 'bg-blue-100 text-blue-800',
  };

  const statusIcons = {
    pending: Clock,
    approved: CheckCircle2,
    rejected: XCircle,
    converted_to_po: CheckCircle2,
  };

  const StatusIcon = statusIcons[pr.status];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-slate-500">PR No.</span>
          </div>
          <p className="text-lg font-semibold">{pr.prNo}</p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-emerald-600" />
            <span className="text-sm text-slate-500">PR Date</span>
          </div>
          <p className="text-lg font-semibold">{new Date(pr.prDate).toLocaleDateString('en-IN')}</p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <StatusIcon className="h-4 w-4 text-purple-600" />
            <span className="text-sm text-slate-500">Status</span>
          </div>
          <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${statusColors[pr.status]}`}>
            <StatusIcon className="h-3 w-3" />
            {pr.status.replace('_', ' ').toUpperCase()}
          </span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Package className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold">Requisition Details</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Style Reference</span>
              <span className="font-medium">{pr.styleReference}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Required By</span>
              <span className="font-medium">{new Date(pr.requiredBy).toLocaleDateString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Department</span>
              <span className="font-medium">{pr.department}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Raised By</span>
              <span className="font-medium">{pr.raisedBy}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
          <h3 className="font-semibold">Line Items</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase text-slate-500">
                <th className="px-4 py-3">Item Code</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Qty Required</th>
                <th className="px-4 py-3">UOM</th>
                <th className="px-4 py-3">Preferred Vendor</th>
              </tr>
            </thead>
            <tbody>
              {pr.lineItems.map((item, index) => (
                <tr key={index} className="border-b border-slate-100">
                  <td className="px-4 py-3 font-medium">{item.itemCode}</td>
                  <td className="px-4 py-3">{item.description}</td>
                  <td className="px-4 py-3 font-medium">{item.qtyRequired.toLocaleString()}</td>
                  <td className="px-4 py-3">{item.uom}</td>
                  <td className="px-4 py-3">{item.preferredVendor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
