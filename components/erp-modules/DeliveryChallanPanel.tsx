'use client';

import type { DeliveryChallan } from '@/lib/style-types';
import { Truck, Calendar, MapPin, Package, CheckCircle2, Clock } from 'lucide-react';

export function DeliveryChallanPanel({ deliveryChallan }: { deliveryChallan?: DeliveryChallan }) {
  if (!deliveryChallan) {
    return (
      <div className="text-center py-8 text-slate-500">
        <Truck className="mx-auto h-12 w-12 mb-2 opacity-50" />
        <p>No delivery challan available</p>
      </div>
    );
  }

  const statusColors = {
    pending: 'bg-amber-100 text-amber-800',
    shipped: 'bg-blue-100 text-blue-800',
    delivered: 'bg-emerald-100 text-emerald-800',
  };

  const statusIcons = {
    pending: Clock,
    shipped: Truck,
    delivered: CheckCircle2,
  };

  const StatusIcon = statusIcons[deliveryChallan.status];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Truck className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-slate-500">DC No.</span>
          </div>
          <p className="text-lg font-semibold">{deliveryChallan.dcNo}</p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-emerald-600" />
            <span className="text-sm text-slate-500">DC Date</span>
          </div>
          <p className="text-lg font-semibold">{new Date(deliveryChallan.date).toLocaleDateString('en-IN')}</p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <StatusIcon className="h-4 w-4 text-purple-600" />
            <span className="text-sm text-slate-500">Status</span>
          </div>
          <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${statusColors[deliveryChallan.status]}`}>
            <StatusIcon className="h-3 w-3" />
            {deliveryChallan.status.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Truck className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold">Shipment Details</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Customer</span>
              <span className="font-medium">{deliveryChallan.customer}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">SO Reference</span>
              <span className="font-medium">{deliveryChallan.soReference}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Ship To</span>
              <span className="font-medium">{deliveryChallan.shipTo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Transporter</span>
              <span className="font-medium">{deliveryChallan.transporter}</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Package className="h-5 w-5 text-emerald-600" />
            <h3 className="font-semibold">Package Details</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">AWB/LR No.</span>
              <span className="font-medium">{deliveryChallan.awbLrNo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">No. of Cartons</span>
              <span className="font-medium">{deliveryChallan.noOfCartons}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
          <h3 className="font-semibold">Packed Items</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase text-slate-500">
                <th className="px-4 py-3">Style</th>
                <th className="px-4 py-3">Size</th>
                <th className="px-4 py-3">Color</th>
                <th className="px-4 py-3">Qty</th>
                <th className="px-4 py-3">Rate</th>
                <th className="px-4 py-3">Amount</th>
              </tr>
            </thead>
            <tbody>
              {deliveryChallan.packedItems.map((item, index) => (
                <tr key={index} className="border-b border-slate-100">
                  <td className="px-4 py-3 font-medium">{item.style}</td>
                  <td className="px-4 py-3">{item.size}</td>
                  <td className="px-4 py-3">{item.color}</td>
                  <td className="px-4 py-3 font-medium">{item.qty.toLocaleString()}</td>
                  <td className="px-4 py-3">₹{item.rate.toFixed(2)}</td>
                  <td className="px-4 py-3 font-semibold">₹{item.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
