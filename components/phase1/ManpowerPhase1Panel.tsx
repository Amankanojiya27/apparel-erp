'use client';

import type { ManpowerPlan, ResourceConflict } from '@/lib/style-types';
import { Users, AlertTriangle } from 'lucide-react';

interface Props {
  manpower: ManpowerPlan[];
  conflicts?: ResourceConflict[];
}

export function ManpowerPhase1Panel({ manpower, conflicts = [] }: Props) {
  const avgUtil = Math.round(manpower.reduce((s, m) => s + m.utilizationPercent, 0) / (manpower.length || 1));
  const avgEff = Math.round(manpower.reduce((s, m) => s + (m.efficiencyPercent || 80), 0) / (manpower.length || 1));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-lg border bg-white p-3">
          <p className="text-xs text-slate-500">Avg utilization</p>
          <p className="text-xl font-bold">{avgUtil}%</p>
        </div>
        <div className="rounded-lg border bg-white p-3">
          <p className="text-xs text-slate-500">Avg efficiency</p>
          <p className="text-xl font-bold">{avgEff}%</p>
        </div>
        <div className="rounded-lg border bg-white p-3">
          <p className="text-xs text-slate-500">Departments</p>
          <p className="text-xl font-bold">{manpower.length}</p>
        </div>
        <div className="rounded-lg border bg-white p-3">
          <p className="text-xs text-slate-500">Conflicts</p>
          <p className="text-xl font-bold text-amber-700">{conflicts.length}</p>
        </div>
      </div>

      {conflicts.length > 0 && (
        <div className="space-y-2">
          {conflicts.map((c) => (
            <div
              key={c.department}
              className={`rounded-lg border p-3 text-sm ${
                c.severity === 'critical' ? 'border-red-300 bg-red-50' : 'border-amber-200 bg-amber-50'
              }`}
            >
              <p className="flex items-center gap-1 font-medium">
                <AlertTriangle className="h-4 w-4" />
                {c.message}
              </p>
              <p className="mt-1 text-slate-600">
                Styles: {c.competingStyles.map((s) => s.designNumber).join(', ')}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-3 text-sm text-indigo-900">
        <Users className="mb-1 inline h-4 w-4" />
        Planning uses manpower + dates — not dates alone.
      </div>

      <div className="space-y-3">
        {manpower.map((m) => (
          <div key={m.department} className="rounded-xl border border-slate-200 p-4">
            <div className="mb-2 flex justify-between text-sm">
              <span className="font-semibold">{m.department}</span>
              <span
                className={`font-bold ${
                  m.utilizationPercent > 95 ? 'text-red-600' : m.utilizationPercent < 70 ? 'text-amber-600' : 'text-emerald-600'
                }`}
              >
                {m.utilizationPercent}% util
              </span>
            </div>
            <div className="mb-2 grid grid-cols-3 gap-2 text-xs text-slate-600">
              <span>Required: {m.requiredHours}h</span>
              <span>Capacity: {m.capacityHours ?? m.availableHours}h</span>
              <span>Efficiency: {m.efficiencyPercent ?? '—'}%</span>
            </div>
            <div className="mb-2 h-2 rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full ${m.utilizationPercent > 95 ? 'bg-red-500' : 'bg-blue-500'}`}
                style={{ width: `${Math.min(100, m.utilizationPercent)}%` }}
              />
            </div>
            <p className="text-xs text-slate-500">{m.assignedWorkers} workers assigned</p>
            <p className="mt-2 text-xs text-indigo-700">{m.recommendation}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
