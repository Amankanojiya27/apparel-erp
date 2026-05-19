'use client';

import type { PreCosting, CostingSheet } from '@/lib/style-types';
import { DollarSign, Calculator, TrendingUp } from 'lucide-react';

export function PreCostingPanel({ costing, costingSheet }: { costing: PreCosting; costingSheet?: CostingSheet }) {
  const preCostingRows = [
    { label: 'Fabric consumption', value: `${costing.fabricConsumption} m/garment` },
    { label: 'Fabric rate', value: `${costing.currency}${costing.fabricRate}/m` },
    { label: 'Trims & embellishments', value: `${costing.currency}${costing.trimCost}` },
    { label: 'CM (Cost of Making)', value: `${costing.currency}${costing.cmCost}` },
    { label: 'Commercial / freight', value: `${costing.currency}${costing.commercialCost}` },
    { label: 'Wastage allowance', value: `${costing.wastagePercent}%` },
    { label: 'Profit margin', value: `${costing.profitMarginPercent}%` },
  ];

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold">Pre-Costing Details</h3>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {preCostingRows.map((r) => (
            <div key={r.label} className="flex justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm">
              <span className="text-slate-600">{r.label}</span>
              <span className="font-medium text-slate-900">{r.value}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between rounded-xl bg-emerald-50 border border-emerald-200 p-4 mt-4">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-emerald-600" />
            <span className="font-medium text-emerald-900">Target FOB</span>
          </div>
          <span className="text-2xl font-bold text-emerald-800">
            {costing.currency} {costing.targetPrice.toFixed(2)}
          </span>
        </div>
        {costing.quotedPrice && (
          <p className="text-sm text-slate-600 mt-2">
            Quoted to buyer: <strong>{costing.currency} {costing.quotedPrice.toFixed(2)}</strong>
          </p>
        )}
      </div>

      {costingSheet && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            <h3 className="font-semibold">Final Costing Sheet</h3>
          </div>
          <div className="rounded-lg border border-slate-200">
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-slate-100">
                  <td className="px-4 py-3 text-slate-600">Fabric Cost</td>
                  <td className="px-4 py-3 text-right font-medium">{costingSheet.currency} {costingSheet.fabricCost.toFixed(2)}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="px-4 py-3 text-slate-600">Trims & Accessories</td>
                  <td className="px-4 py-3 text-right font-medium">{costingSheet.currency} {costingSheet.trimsAccessories.toFixed(2)}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="px-4 py-3 text-slate-600">CMT (Cut-Make-Trim)</td>
                  <td className="px-4 py-3 text-right font-medium">{costingSheet.currency} {costingSheet.cmt.toFixed(2)}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="px-4 py-3 text-slate-600">Washing/Finishing</td>
                  <td className="px-4 py-3 text-right font-medium">{costingSheet.currency} {costingSheet.washingFinishing.toFixed(2)}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="px-4 py-3 text-slate-600">Packaging</td>
                  <td className="px-4 py-3 text-right font-medium">{costingSheet.currency} {costingSheet.packaging.toFixed(2)}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="px-4 py-3 text-slate-600">Overhead ({costingSheet.overheadPercent}%)</td>
                  <td className="px-4 py-3 text-right font-medium">{costingSheet.currency} {costingSheet.overheadAmount.toFixed(2)}</td>
                </tr>
                <tr className="border-b-2 border-slate-300 bg-slate-50">
                  <td className="px-4 py-3 font-semibold text-slate-900">Total Cost</td>
                  <td className="px-4 py-3 text-right font-bold text-slate-900">{costingSheet.currency} {costingSheet.totalCost.toFixed(2)}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="px-4 py-3 text-slate-600">Margin ({costingSheet.marginPercent}%)</td>
                  <td className="px-4 py-3 text-right font-medium">{costingSheet.currency} {costingSheet.marginAmount.toFixed(2)}</td>
                </tr>
                <tr className="bg-emerald-50">
                  <td className="px-4 py-3 font-semibold text-emerald-900">Suggested MRP</td>
                  <td className="px-4 py-3 text-right font-bold text-emerald-700 text-lg">{costingSheet.currency} {costingSheet.suggestedMRP.toFixed(0)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}