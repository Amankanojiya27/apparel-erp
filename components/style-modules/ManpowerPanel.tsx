'use client';

import type { ManpowerPlan } from '@/lib/style-types';
import { Users } from 'lucide-react';

export function ManpowerPanel({ manpower }: { manpower: ManpowerPlan[] }) {
  const avgUtil = Math.round(manpower.reduce((s, m) => s + m.utilizationPercent, 0) / manpower.length);

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-3 text-sm text-indigo-900">
        <Users className="mb-1 inline h-4 w-4" />
        Factory-wide utilization avg: <strong>{avgUtil}%</strong> — planning optimizes lines, not dates only.
      </div>
      <div className="space-y-3">
        {manpower.map((m) => (
          <div key={m.department} className="rounded-lg border border-slate-200 p-3">
            <div className="mb-2 flex justify-between text-sm">
              <span className="font-medium text-slate-900">{m.department}</span>
              <span
                className={`font-bold ${
                  m.utilizationPercent > 95 ? 'text-red-600' : m.utilizationPercent < 70 ? 'text-amber-600' : 'text-emerald-600'
                }`}
              >
                {m.utilizationPercent}%
              </span>
            </div>
            <div className="mb-2 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full ${
                  m.utilizationPercent > 95 ? 'bg-red-500' : m.utilizationPercent < 70 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, m.utilizationPercent)}%` }}
              />
            </div>
            <p className="text-xs text-slate-500">
              {m.requiredHours}h required / {m.availableHours}h available · {m.assignedWorkers} workers
            </p>
            <p className="mt-2 text-xs text-indigo-700">{m.recommendation}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
