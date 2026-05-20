'use client';

import type { ConsumptionSheet } from '@/lib/style-types';
import { Scissors, Package, Ruler, CheckCircle2 } from 'lucide-react';

export function ConsumptionSheetPanel({ consumptionSheet }: { consumptionSheet?: ConsumptionSheet }) {
  if (!consumptionSheet) {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 text-center text-slate-500">
        <Scissors className="mx-auto mb-2 h-8 w-8" />
        <p>Consumption sheet not yet finalized</p>
      </div>
    );
  }

  const { markerPlan, fabricConsumption, trimConsumption, threadConsumption, packagingConsumption, cuttingWastagePercent, sewingWastagePercent, totalFabricRequired, finalizedAt, finalizedBy } = consumptionSheet;

  const trimEntries = Object.entries(trimConsumption);
  const packagingEntries = Object.entries(packagingConsumption);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm">
        <div>
          <p className="text-slate-500">Fabric Consumption</p>
          <p className="text-xl font-bold">{fabricConsumption.toFixed(2)} m/garment</p>
        </div>
        <div>
          <p className="text-slate-500">Thread Consumption</p>
          <p className="text-xl font-bold">{threadConsumption.toFixed(2)} m/garment</p>
        </div>
        <div>
          <p className="text-slate-500">Cutting Wastage</p>
          <p className="text-xl font-bold text-amber-700">{cuttingWastagePercent}%</p>
        </div>
        <div>
          <p className="text-slate-500">Sewing Wastage</p>
          <p className="text-xl font-bold text-amber-700">{sewingWastagePercent}%</p>
        </div>
      </div>

      {/* Marker Plan */}
      <div className="rounded-lg border border-slate-200 p-4">
        <h3 className="mb-3 flex items-center gap-2 font-semibold text-slate-800">
          <Ruler className="h-4 w-4" />
          Marker Plan
        </h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-slate-500">Marker Efficiency</p>
            <p className="font-medium">{markerPlan.markerEfficiency}%</p>
          </div>
          <div>
            <p className="text-slate-500">Number of Plies</p>
            <p className="font-medium">{markerPlan.numberOfPlies}</p>
          </div>
          <div>
            <p className="text-slate-500">Garment Length</p>
            <p className="font-medium">{markerPlan.garmentLength} cm</p>
          </div>
          <div>
            <p className="text-slate-500">Marker Width</p>
            <p className="font-medium">{markerPlan.markerWidth} cm</p>
          </div>
          <div>
            <p className="text-slate-500">Marker Length</p>
            <p className="font-medium">{markerPlan.markerLength} cm</p>
          </div>
          <div>
            <p className="text-slate-500">Total Fabric Required</p>
            <p className="font-bold text-slate-800">{totalFabricRequired.toFixed(2)} m</p>
          </div>
        </div>
      </div>

      {/* Trim Consumption */}
      {trimEntries.length > 0 && (
        <div className="rounded-lg border border-slate-200 p-4">
          <h3 className="mb-3 flex items-center gap-2 font-semibold text-slate-800">
            <Package className="h-4 w-4" />
            Trim Consumption (per garment)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs uppercase text-slate-500">
                  <th className="py-2 pr-4">Item Code</th>
                  <th className="py-2">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {trimEntries.map(([itemCode, qty]) => (
                  <tr key={itemCode} className="border-b border-slate-100">
                    <td className="py-2 pr-4 font-medium">{itemCode}</td>
                    <td className="py-2">{qty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Packaging Consumption */}
      {packagingEntries.length > 0 && (
        <div className="rounded-lg border border-slate-200 p-4">
          <h3 className="mb-3 flex items-center gap-2 font-semibold text-slate-800">
            <Package className="h-4 w-4" />
            Packaging Consumption (per garment)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs uppercase text-slate-500">
                  <th className="py-2 pr-4">Item</th>
                  <th className="py-2">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {packagingEntries.map(([item, qty]) => (
                  <tr key={item} className="border-b border-slate-100">
                    <td className="py-2 pr-4 font-medium">{item}</td>
                    <td className="py-2">{qty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Finalization Status */}
      {finalizedAt && finalizedBy && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
          <CheckCircle2 className="mb-1 inline h-4 w-4" />
          Consumption sheet finalized by {finalizedBy} on {new Date(finalizedAt).toLocaleDateString()}
        </div>
      )}
    </div>
  );
}
