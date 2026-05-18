'use client';

import { getQuantityTier } from '@/lib/phase1';

const tierStyles = {
  small: 'bg-slate-100 text-slate-700 border-slate-200',
  medium: 'bg-blue-50 text-blue-800 border-blue-200',
  large: 'bg-violet-50 text-violet-800 border-violet-200',
  bulk: 'bg-orange-50 text-orange-800 border-orange-200',
};

export function QuantityPriorityBadge({ quantity, note }: { quantity: number; note?: string }) {
  const tier = getQuantityTier(quantity);
  return (
    <div className="space-y-1">
      <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${tierStyles[tier]}`}>
        {tier} qty ({quantity.toLocaleString()})
      </span>
      {note && <p className="text-xs text-slate-600">{note}</p>}
    </div>
  );
}
