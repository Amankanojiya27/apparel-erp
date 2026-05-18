'use client';

import type { PreCosting } from '@/lib/style-types';
import { DollarSign } from 'lucide-react';

export function PreCostingPanel({ costing }: { costing: PreCosting }) {
  const rows = [
    { label: 'Fabric consumption', value: `${costing.fabricConsumption} m/garment` },
    { label: 'Fabric rate', value: `$${costing.fabricRate}/m` },
    { label: 'Trims & embellishments', value: `$${costing.trimCost}` },
    { label: 'CM (Cost of Making)', value: `$${costing.cmCost}` },
    { label: 'Commercial / freight', value: `$${costing.commercialCost}` },
    { label: 'Wastage allowance', value: `${costing.wastagePercent}%` },
    { label: 'Profit margin', value: `${costing.profitMarginPercent}%` },
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-2 sm:grid-cols-2">
        {rows.map((r) => (
          <div key={r.label} className="flex justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm">
            <span className="text-slate-600">{r.label}</span>
            <span className="font-medium text-slate-900">{r.value}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between rounded-xl bg-emerald-50 border border-emerald-200 p-4">
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-emerald-600" />
          <span className="font-medium text-emerald-900">Target FOB</span>
        </div>
        <span className="text-2xl font-bold text-emerald-800">
          {costing.currency} {costing.targetPrice.toFixed(2)}
        </span>
      </div>
      {costing.quotedPrice && (
        <p className="text-sm text-slate-600">
          Quoted to buyer: <strong>{costing.currency} {costing.quotedPrice.toFixed(2)}</strong>
        </p>
      )}
    </div>
  );
}
