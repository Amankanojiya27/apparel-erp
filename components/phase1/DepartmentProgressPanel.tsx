// File: components/phase1/DepartmentProgressPanel.tsx
'use client';

import type { DepartmentProgress } from '@/lib/style-types';
import { Button } from '@/components/Button';
import { AlertTriangle } from 'lucide-react';

interface Props {
  progress: DepartmentProgress[];
  onDailyUpdate?: (department: string, units: number) => void;
}

export function DepartmentProgressPanel({ progress, onDailyUpdate }: Props) {
  return (
    <div className="space-y-4">
      {progress.map((dept) => (
        <div
          key={dept.department}
          className={`rounded-xl border p-4 ${dept.isBottleneck ? 'border-red-300 bg-red-50/40' : 'border-slate-200'}`}
        >
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h4 className="font-semibold text-slate-900">{dept.department}</h4>
              <p className="text-xs text-slate-500">
                {dept.completedUnits.toLocaleString()} / {dept.targetUnits.toLocaleString()} units
              </p>
            </div>
            <div className="flex items-center gap-2">
              {dept.isBottleneck && (
                <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                  <AlertTriangle className="h-3 w-3" />
                  Bottleneck
                </span>
              )}
              <span className="text-lg font-bold text-slate-900">{dept.percentComplete}%</span>
            </div>
          </div>
          <div className="mb-3 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full ${
                dept.status === 'delayed' ? 'bg-red-500' : dept.status === 'completed' ? 'bg-emerald-500' : 'bg-blue-500'
              }`}
              style={{ width: `${dept.percentComplete}%` }}
            />
          </div>
          <div className="overflow-x-auto">
            <p className="mb-2 text-xs font-medium uppercase text-slate-500">Daily updates</p>
            <table className="w-full min-w-[320px] text-xs">
              <thead>
                <tr className="text-left text-slate-500">
                  <th className="py-1 pr-3">Date</th>
                  <th className="py-1 pr-3">Units</th>
                  <th className="py-1 pr-3">By</th>
                  <th className="py-1">Notes</th>
                </tr>
              </thead>
              <tbody>
                {dept.dailyUpdates.map((u) => (
                  <tr key={u.date} className="border-t border-slate-100">
                    <td className="py-1.5 pr-3">{u.date}</td>
                    <td className="py-1.5 pr-3 font-medium">{u.unitsCompleted}</td>
                    <td className="py-1.5 pr-3">{u.updatedBy}</td>
                    <td className="py-1.5 text-slate-600">{u.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {onDailyUpdate && dept.status === 'in_progress' && (
            <Button
              size="sm"
              variant="secondary"
              className="mt-3"
              onClick={() => onDailyUpdate(dept.department, Math.ceil(dept.targetUnits * 0.02))}
            >
              Log today&apos;s progress
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
