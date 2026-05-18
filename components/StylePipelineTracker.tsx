'use client';

import { CheckCircle2, Circle, Clock, AlertCircle, Ban } from 'lucide-react';
import type { PipelineStep } from '@/lib/style-types';

const icons = {
  completed: CheckCircle2,
  active: Clock,
  pending: Circle,
  blocked: Ban,
};

const colors = {
  completed: 'border-emerald-500 bg-emerald-50 text-emerald-700',
  active: 'border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-200',
  pending: 'border-slate-200 bg-white text-slate-400',
  blocked: 'border-amber-400 bg-amber-50 text-amber-700',
};

export function StylePipelineTracker({ pipeline }: { pipeline: PipelineStep[] }) {
  return (
    <div className="space-y-0">
      {pipeline.map((step, i) => {
        const Icon = icons[step.status] || Circle;
        const isLast = i === pipeline.length - 1;
        return (
          <div key={step.id} className="relative flex gap-4 pb-6 last:pb-0">
            {!isLast && (
              <div
                className={`absolute left-[19px] top-10 h-[calc(100%-16px)] w-0.5 ${
                  step.status === 'completed' ? 'bg-emerald-400' : 'bg-slate-200'
                }`}
              />
            )}
            <div
              className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 ${colors[step.status]}`}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1 pt-1">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="font-semibold text-slate-900">{step.label}</h4>
                <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{step.department}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                    step.status === 'completed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : step.status === 'active'
                        ? 'bg-blue-100 text-blue-800'
                        : step.status === 'blocked'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {step.status}
                </span>
              </div>
              {step.completedAt && (
                <p className="mt-1 text-xs text-slate-500">
                  Completed {new Date(step.completedAt).toLocaleDateString()}
                </p>
              )}
              {step.notes && <p className="mt-1 text-sm text-slate-600">{step.notes}</p>}
              {step.status === 'active' && (
                <p className="mt-2 flex items-center gap-1 text-xs text-blue-600">
                  <AlertCircle className="h-3 w-3" /> Current step — action required
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
