'use client';

import type { BOMLine } from '@/lib/style-types';
import { Package, AlertTriangle } from 'lucide-react';

export function BOMMRPModule({ bom }: { bom: BOMLine[] }) {
  const totalProcure = bom.reduce((s, l) => s + l.toProcure, 0);
  const needsPR = bom.filter((l) => l.toProcure > 0);

  return (
    <div className="space-y-4">
      <div className="flex gap-4 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
        <div>
          <p className="text-slate-500">BOM lines</p>
          <p className="text-xl font-bold">{bom.length}</p>
        </div>
        <div>
          <p className="text-slate-500">Items to procure</p>
          <p className="text-xl font-bold text-amber-700">{needsPR.length}</p>
        </div>
        <div>
          <p className="text-slate-500">Net deficit lines</p>
          <p className="text-xl font-bold">{totalProcure > 0 ? 'Yes' : 'No'}</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-xs uppercase text-slate-500">
              <th className="py-2 pr-4">Item</th>
              <th className="py-2 pr-4">Category</th>
              <th className="py-2 pr-4">Per garment</th>
              <th className="py-2 pr-4">Total req.</th>
              <th className="py-2 pr-4">In stock</th>
              <th className="py-2">To procure</th>
            </tr>
          </thead>
          <tbody>
            {bom.map((line) => (
              <tr key={line.item} className="border-b border-slate-100">
                <td className="py-2 pr-4 font-medium">{line.item}</td>
                <td className="py-2 pr-4 capitalize text-slate-600">{line.category}</td>
                <td className="py-2 pr-4">
                  {line.consumptionPerGarment} {line.unit}
                </td>
                <td className="py-2 pr-4">{line.totalRequired}</td>
                <td className="py-2 pr-4">{line.inStock}</td>
                <td className="py-2">
                  {line.toProcure > 0 ? (
                    <span className="inline-flex items-center gap-1 text-amber-700 font-medium">
                      <AlertTriangle className="h-3 w-3" />
                      {line.toProcure} → PR
                    </span>
                  ) : (
                    <span className="text-emerald-600">Reserved</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {needsPR.length > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          <Package className="mb-1 inline h-4 w-4" /> MRP triggered {needsPR.length} purchase requisition(s) for materials not in warehouse.
        </div>
      )}
    </div>
  );
}
