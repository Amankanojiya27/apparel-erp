'use client';

import { calculateReversePlan } from '@/lib/planning';
import { formatDate } from '@/lib/utils';
import { AlertTriangle } from 'lucide-react';

interface Props {
  designNumber: string;
  buyerName: string;
  quantity: number;
  deliveryDate: string;
}

export function ReversePlanCard({ designNumber, buyerName, quantity, deliveryDate }: Props) {
  const plan = calculateReversePlan(deliveryDate);

  return (
    <div
      className={`rounded-xl border p-4 ${plan.isDelayed ? 'border-red-300 bg-red-50/50' : 'border-gray-200 bg-white'}`}
    >
      <div className="mb-3 flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">{designNumber}</h3>
          <p className="text-sm text-gray-600">
            {buyerName} · Qty {quantity.toLocaleString()}
          </p>
        </div>
        {plan.isDelayed && (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
            <AlertTriangle className="h-3 w-3" />
            {plan.daysLate}d late
          </span>
        )}
      </div>

      <div className="mb-3 flex gap-1">
        {plan.stages.map((stage, i) => (
          <div key={stage.name} className="flex-1">
            <div
              className={`mb-1 h-2 rounded-full ${plan.isDelayed && i === 0 ? 'bg-red-400' : 'bg-blue-400'}`}
              style={{ opacity: 0.4 + (i + 1) * 0.15 }}
            />
            <p className="text-[10px] font-medium text-gray-700">{stage.name}</p>
            <p className="text-[10px] text-gray-500">{stage.days}d</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Delivery</span>
          <span className="font-medium">{formatDate(plan.deliveryDate)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Cutting start</span>
          <span className={plan.isDelayed ? 'font-medium text-red-600' : 'font-medium'}>
            {formatDate(plan.cuttingStart)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Production</span>
          <span className="font-medium">{formatDate(plan.productionStart)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Packaging</span>
          <span className="font-medium">{formatDate(plan.packagingStart)}</span>
        </div>
      </div>
    </div>
  );
}
