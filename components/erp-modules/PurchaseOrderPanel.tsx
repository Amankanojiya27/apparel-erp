'use client';

import type { PurchaseOrder } from '@/lib/style-types';
import { ShoppingCart, Calendar, MapPin, CreditCard, CheckCircle2, Clock, Truck, FileText } from 'lucide-react';

export function PurchaseOrderPanel({ po }: { po?: PurchaseOrder }) {
  if (!po) {
    return (
      <div className="text-center py-8 text-slate-500">
        <ShoppingCart className="mx-auto h-12 w-12 mb-2 opacity-50" />
        <p>No purchase order available</p>
      </div>
    );
  }

  const statusColors = {
    pending: 'bg-amber-100 text-amber-800',
    approved: 'bg-emerald-100 text-emerald-800',
    sent: 'bg-blue-100 text-blue-800',
    partial_received: 'bg-purple-100 text-purple-800',
    completed: 'bg-green-100 text-green-800',
  };

  const statusIcons = {
    pending: Clock,
    approved: CheckCircle2,
    sent: Truck,
    partial_received: Clock,
    completed: CheckCircle2,
  };

  const StatusIcon = statusIcons[po.status];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <ShoppingCart className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-slate-500">PO No.</span>
          </div>
          <p className="text-lg font-semibold">{po.poNo}</p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-emerald-600" />
            <span className="text-sm text-slate-500">PO Date</span>
          </div>
          <p className="text-lg font-semibold">{new Date(po.poDate).toLocaleDateString('en-IN')}</p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <StatusIcon className="h-4 w-4 text-purple-600" />
            <span className="text-sm text-slate-500">Status</span>
          </div>
          <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${statusColors[po.status]}`}>
            <StatusIcon className="h-3 w-3" />
            {po.status.replace('_', ' ').toUpperCase()}
          </span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold">Order Details</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Vendor</span>
              <span className="font-medium">{po.vendorName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Vendor Code</span>
              <span className="font-medium">{po.vendor}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">PR Reference</span>
              <span className="font-medium">{po.prReference}</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Truck className="h-5 w-5 text-emerald-600" />
            <h3 className="font-semibold">Delivery Details</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Delivery Date</span>
              <span className="font-medium">{new Date(po.deliveryDate).toLocaleDateString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Delivery Location</span>
              <span className="font-medium">{po.deliveryLocation}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Payment Terms</span>
              <span className="font-medium">{po.paymentTerms}</span>
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
                <th className="px-4 py-3">Qty</th>
                <th className="px-4 py-3">Rate</th>
                <th className="px-4 py-3">Tax %</th>
                <th className="px-4 py-3">Tax Amount</th>
                <th className="px-4 py-3">Total</th>
              </tr>
            </thead>
            <tbody>
              {po.lineItems.map((item, index) => (
                <tr key={index} className="border-b border-slate-100">
                  <td className="px-4 py-3 font-medium">{item.itemCode}</td>
                  <td className="px-4 py-3">{item.description}</td>
                  <td className="px-4 py-3 font-medium">{item.qty.toLocaleString()}</td>
                  <td className="px-4 py-3">₹{item.rate.toFixed(2)}</td>
                  <td className="px-4 py-3">{item.taxPercent}%</td>
                  <td className="px-4 py-3">₹{item.taxAmount.toLocaleString()}</td>
                  <td className="px-4 py-3 font-semibold">₹{item.total.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-300 bg-slate-50">
                <td colSpan={6} className="px-4 py-3 text-right font-semibold">
                  Grand Total
                </td>
                <td className="px-4 py-3 font-bold text-lg">
                  ₹{po.lineItems.reduce((sum, item) => sum + item.total, 0).toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
