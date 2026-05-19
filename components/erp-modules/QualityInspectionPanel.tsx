'use client';

import type { QualityInspection } from '@/lib/style-types';
import { CheckCircle2, XCircle, AlertTriangle, ClipboardCheck, User, Calendar } from 'lucide-react';

export function QualityInspectionPanel({ qc }: { qc?: QualityInspection }) {
  if (!qc) {
    return (
      <div className="text-center py-8 text-slate-500">
        <ClipboardCheck className="mx-auto h-12 w-12 mb-2 opacity-50" />
        <p>No quality inspection data available</p>
      </div>
    );
  }

  const decisionColors = {
    accepted: 'bg-emerald-100 text-emerald-800',
    rejected: 'bg-red-100 text-red-800',
    conditional: 'bg-amber-100 text-amber-800',
  };

  const decisionIcons = {
    accepted: CheckCircle2,
    rejected: XCircle,
    conditional: AlertTriangle,
  };

  const DecisionIcon = decisionIcons[qc.decision];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <ClipboardCheck className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-slate-500">GRN Reference</span>
          </div>
          <p className="text-lg font-semibold">{qc.grnReference}</p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <DecisionIcon className="h-4 w-4 text-purple-600" />
            <span className="text-sm text-slate-500">QC Decision</span>
          </div>
          <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${decisionColors[qc.decision]}`}>
            <DecisionIcon className="h-3 w-3" />
            {qc.decision.toUpperCase()}
          </span>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-emerald-600" />
            <span className="text-sm text-slate-500">Inspected On</span>
          </div>
          <p className="text-lg font-semibold">{new Date(qc.inspectedAt).toLocaleDateString('en-IN')}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 mb-3">
            <User className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold">Inspection Details</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Inspected By</span>
              <span className="font-medium">{qc.inspectedBy}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Inspection Date</span>
              <span className="font-medium">{new Date(qc.inspectedAt).toLocaleDateString('en-IN')}</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 mb-3">
            <ClipboardCheck className="h-5 w-5 text-emerald-600" />
            <h3 className="font-semibold">QC Remarks</h3>
          </div>
          <p className="text-sm text-slate-700">{qc.remarks}</p>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
          <h3 className="font-semibold">QC Parameters</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase text-slate-500">
                <th className="px-4 py-3">Parameter</th>
                <th className="px-4 py-3">Standard</th>
                <th className="px-4 py-3">Actual</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {qc.parameters.map((param, index) => (
                <tr key={index} className="border-b border-slate-100">
                  <td className="px-4 py-3 font-medium">{param.parameter}</td>
                  <td className="px-4 py-3">{param.standard}</td>
                  <td className="px-4 py-3">{param.actual}</td>
                  <td className="px-4 py-3">
                    {param.status === 'pass' ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                        <CheckCircle2 className="h-4 w-4" />
                        Pass
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-600 font-medium">
                        <XCircle className="h-4 w-4" />
                        Fail
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
