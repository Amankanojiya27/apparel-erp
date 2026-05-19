'use client';

import type { ProductionOrder } from '@/lib/style-types';
import { Factory, Calendar, MapPin, Package, CheckCircle2, Clock, Target } from 'lucide-react';

export function ProductionOrderPanel({ productionOrder }: { productionOrder?: ProductionOrder }) {
  if (!productionOrder) {
    return (
      <div className="text-center py-8 text-slate-500">
        <Factory className="mx-auto h-12 w-12 mb-2 opacity-50" />
        <p>No production order available</p>
      </div>
    );
  }

  const statusColors = {
    pending: 'bg-amber-100 text-amber-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-emerald-100 text-emerald-800',
  };

  const statusIcons = {
    pending: Clock,
    in_progress: Clock,
    completed: CheckCircle2,
  };

  const StatusIcon = statusIcons[productionOrder.status];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Factory className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-slate-500">WO No.</span>
          </div>
          <p className="text-lg font-semibold">{productionOrder.workOrderNo}</p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-emerald-600" />
            <span className="text-sm text-slate-500">WO Date</span>
          </div>
          <p className="text-lg font-semibold">{new Date(productionOrder.workOrderDate).toLocaleDateString('en-IN')}</p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <StatusIcon className="h-4 w-4 text-purple-600" />
            <span className="text-sm text-slate-500">Status</span>
          </div>
          <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${statusColors[productionOrder.status]}`}>
            <StatusIcon className="h-3 w-3" />
            {productionOrder.status.replace('_', ' ').toUpperCase()}
          </span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Factory className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold">Work Order Details</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Style Code</span>
              <span className="font-medium">{productionOrder.styleCode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Production Unit</span>
              <span className="font-medium">{productionOrder.productionUnit}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Start Date</span>
              <span className="font-medium">{new Date(productionOrder.startDate).toLocaleDateString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Target Completion</span>
              <span className="font-medium">{new Date(productionOrder.targetCompletion).toLocaleDateString('en-IN')}</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Target className="h-5 w-5 text-emerald-600" />
            <h3 className="font-semibold">Production Target</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Total Quantity</span>
              <span className="font-semibold text-lg">{productionOrder.totalQty.toLocaleString()} Pcs</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-slate-200">
          <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
            <h3 className="font-semibold">Size-wise Breakdown</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase text-slate-500">
                  <th className="px-4 py-3">Size</th>
                  <th className="px-4 py-3">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {productionOrder.sizeBreakdown.map((item, index) => (
                  <tr key={index} className="border-b border-slate-100">
                    <td className="px-4 py-3 font-medium">{item.size}</td>
                    <td className="px-4 py-3 font-medium">{item.qty.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200">
          <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
            <h3 className="font-semibold">Color-wise Breakdown</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase text-slate-500">
                  <th className="px-4 py-3">Color</th>
                  <th className="px-4 py-3">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {productionOrder.colorBreakdown.map((item, index) => (
                  <tr key={index} className="border-b border-slate-100">
                    <td className="px-4 py-3 font-medium">{item.color}</td>
                    <td className="px-4 py-3 font-medium">{item.qty.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
