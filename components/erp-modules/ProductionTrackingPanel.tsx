'use client';

import type { ProductionTracking } from '@/lib/style-types';
import { TrendingUp, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

export function ProductionTrackingPanel({ tracking }: { tracking?: ProductionTracking }) {
  if (!tracking) {
    return (
      <div className="text-center py-8 text-slate-500">
        <TrendingUp className="mx-auto h-12 w-12 mb-2 opacity-50" />
        <p>No production tracking data available</p>
      </div>
    );
  }

  const statusColors = {
    on_track: 'bg-emerald-100 text-emerald-800',
    delayed: 'bg-amber-100 text-amber-800',
    completed: 'bg-blue-100 text-blue-800',
  };

  const statusIcons = {
    on_track: CheckCircle2,
    delayed: AlertTriangle,
    completed: CheckCircle2,
  };

  const StatusIcon = statusIcons[tracking.status];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-slate-500">Work Order Ref</span>
          </div>
          <p className="text-lg font-semibold">{tracking.workOrderRef}</p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <StatusIcon className="h-4 w-4 text-purple-600" />
            <span className="text-sm text-slate-500">Status</span>
          </div>
          <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${statusColors[tracking.status]}`}>
            <StatusIcon className="h-3 w-3" />
            {tracking.status.replace('_', ' ').toUpperCase()}
          </span>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-emerald-600" />
            <span className="text-sm text-slate-500">Updates</span>
          </div>
          <p className="text-lg font-semibold">{tracking.updates.length} Entries</p>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
          <h3 className="font-semibold">Daily Production Progress</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase text-slate-500">
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Cutting Done</th>
                <th className="px-4 py-3">Stitching Done</th>
                <th className="px-4 py-3">Finishing Done</th>
                <th className="px-4 py-3">Packed</th>
                <th className="px-4 py-3">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {tracking.updates.map((update, index) => (
                <tr key={index} className="border-b border-slate-100">
                  <td className="px-4 py-3 font-medium">{new Date(update.date).toLocaleDateString('en-IN')}</td>
                  <td className="px-4 py-3 font-medium">{update.cuttingDone.toLocaleString()}</td>
                  <td className="px-4 py-3 font-medium">{update.stitchingDone.toLocaleString()}</td>
                  <td className="px-4 py-3 font-medium">{update.finishingDone.toLocaleString()}</td>
                  <td className="px-4 py-3 font-medium">{update.packed.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 ${update.remarks.includes('Complete') ? 'text-emerald-600' : 'text-slate-600'}`}>
                      {update.remarks.includes('Complete') && <CheckCircle2 className="h-4 w-4" />}
                      {update.remarks}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {tracking.updates.length > 0 && (
          <>
            <div className="rounded-lg border border-slate-200 bg-blue-50 p-4">
              <p className="text-sm text-slate-500">Total Cutting</p>
              <p className="text-2xl font-bold text-blue-700">
                {tracking.updates[tracking.updates.length - 1].cuttingDone.toLocaleString()}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-emerald-50 p-4">
              <p className="text-sm text-slate-500">Total Stitching</p>
              <p className="text-2xl font-bold text-emerald-700">
                {tracking.updates[tracking.updates.length - 1].stitchingDone.toLocaleString()}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-purple-50 p-4">
              <p className="text-sm text-slate-500">Total Finishing</p>
              <p className="text-2xl font-bold text-purple-700">
                {tracking.updates[tracking.updates.length - 1].finishingDone.toLocaleString()}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-amber-50 p-4">
              <p className="text-sm text-slate-500">Total Packed</p>
              <p className="text-2xl font-bold text-amber-700">
                {tracking.updates[tracking.updates.length - 1].packed.toLocaleString()}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
