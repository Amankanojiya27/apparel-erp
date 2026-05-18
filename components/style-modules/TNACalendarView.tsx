'use client';

import type { TNAMilestone } from '@/lib/style-types';
import { formatDate } from '@/lib/utils';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

const statusStyles = {
  pending: 'bg-slate-100 text-slate-600',
  on_track: 'bg-blue-100 text-blue-800',
  delayed: 'bg-red-100 text-red-800',
  completed: 'bg-emerald-100 text-emerald-800',
};

export function TNACalendarView({ milestones, compact }: { milestones: TNAMilestone[]; compact?: boolean }) {
  const sorted = [...milestones].sort(
    (a, b) => new Date(a.plannedDate).getTime() - new Date(b.plannedDate).getTime()
  );

  return (
    <div className={compact ? 'space-y-2' : 'space-y-3'}>
      {sorted.map((m) => (
        <div
          key={m.id}
          className={`flex items-center gap-3 rounded-lg border p-3 ${
            m.status === 'delayed' ? 'border-red-200 bg-red-50/50' : 'border-slate-200 bg-white'
          }`}
        >
          {m.status === 'completed' ? (
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
          ) : m.status === 'delayed' ? (
            <AlertTriangle className="h-5 w-5 shrink-0 text-red-600" />
          ) : (
            <div className="h-5 w-5 shrink-0 rounded-full border-2 border-slate-300" />
          )}
          <div className="min-w-0 flex-1">
            <p className="font-medium text-slate-900">{m.name}</p>
            <p className="text-xs text-slate-500">{m.owner}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">{formatDate(m.plannedDate)}</p>
            <span className={`mt-1 inline-block rounded px-1.5 py-0.5 text-xs capitalize ${statusStyles[m.status]}`}>
              {m.status.replace('_', ' ')}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
