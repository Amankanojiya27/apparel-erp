// File: components/phase1/MaterialChasePanel.tsx
'use client';

import type { MaterialChase } from '@/lib/style-types';
import { formatDate } from '@/lib/utils';
import { AlertTriangle, CheckCircle2, Truck, Package } from 'lucide-react';

const fabricLabels: Record<string, string> = {
  not_ordered: 'Not ordered',
  ordered: 'Ordered',
  in_transit: 'In transit',
  received: 'Received',
  qc_passed: 'QC passed',
  delayed: 'Delayed',
};

const patternLabels: Record<string, string> = {
  not_started: 'Not started',
  in_development: 'In development',
  completed: 'Completed',
  revision: 'Revision',
};

export function MaterialChasePanel({ chase }: { chase: MaterialChase }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div>
          <p className="text-sm text-slate-600">Production readiness</p>
          <p className="text-3xl font-bold text-slate-900">{chase.readinessPercent}%</p>
        </div>
        {chase.productionReady ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800">
            <CheckCircle2 className="h-4 w-4" />
            Ready for bulk
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">
            <AlertTriangle className="h-4 w-4" />
            Not ready
          </span>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 p-4">
          <div className="mb-3 flex items-center gap-2">
            <Truck className="h-5 w-5 text-blue-600" />
            <h4 className="font-semibold">Fabric chase</h4>
          </div>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">Status</dt>
              <dd className="font-medium capitalize">{fabricLabels[chase.fabric.status]}</dd>
            </div>
            {chase.fabric.supplier && (
              <div className="flex justify-between">
                <dt className="text-slate-500">Supplier</dt>
                <dd>{chase.fabric.supplier}</dd>
              </div>
            )}
            {chase.fabric.expectedDate && (
              <div className="flex justify-between">
                <dt className="text-slate-500">ETA</dt>
                <dd>{formatDate(chase.fabric.expectedDate)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-slate-500">Qty</dt>
              <dd>
                {chase.fabric.receivedQty ?? 0} / {chase.fabric.requiredQty} m
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-xl border border-slate-200 p-4">
          <div className="mb-3 flex items-center gap-2">
            <Package className="h-5 w-5 text-violet-600" />
            <h4 className="font-semibold">Pattern development</h4>
          </div>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">Status</dt>
              <dd className="font-medium">{patternLabels[chase.pattern.status]}</dd>
            </div>
            {chase.pattern.assignedTo && (
              <div className="flex justify-between">
                <dt className="text-slate-500">Assigned</dt>
                <dd>{chase.pattern.assignedTo}</dd>
              </div>
            )}
            {chase.pattern.dueDate && (
              <div className="flex justify-between">
                <dt className="text-slate-500">Due</dt>
                <dd>{formatDate(chase.pattern.dueDate)}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      {chase.alerts.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase text-red-600">Chase alerts</p>
          {chase.alerts.map((alert) => (
            <div key={alert} className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-900">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              {alert}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
