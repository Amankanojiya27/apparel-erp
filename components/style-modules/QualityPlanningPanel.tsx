'use client';

import type { QCPlan } from '@/lib/style-types';
import { Shield, CheckCircle2, AlertTriangle, FileText, ClipboardCheck } from 'lucide-react';

export function QualityPlanningPanel({ qualityPlan }: { qualityPlan?: QCPlan }) {
  if (!qualityPlan) {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 text-center text-slate-500">
        <Shield className="mx-auto mb-2 h-8 w-8" />
        <p>Quality plan not yet defined</p>
      </div>
    );
  }

  const { qualityStandardId, defectList, aqlLevel, inlineInspection, finalInspection } = qualityPlan;

  return (
    <div className="space-y-6">
      {/* AQL Level Summary */}
      <div className="grid grid-cols-2 gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm">
        <div>
          <p className="text-slate-500">Inspection Level</p>
          <p className="font-medium">{aqlLevel.inspectionLevel}</p>
        </div>
        <div>
          <p className="text-slate-500">AQL</p>
          <p className="font-medium">{aqlLevel.aql}</p>
        </div>
        <div>
          <p className="text-slate-500">Sample Size</p>
          <p className="font-medium">{aqlLevel.sampleSize}</p>
        </div>
        <div>
          <p className="text-slate-500">Accept/Reject Limit</p>
          <p className="font-medium">{aqlLevel.acceptLimit} / {aqlLevel.rejectLimit}</p>
        </div>
      </div>

      {/* Quality Standard */}
      <div className="rounded-lg border border-slate-200 p-4">
        <h3 className="mb-3 flex items-center gap-2 font-semibold text-slate-800">
          <FileText className="h-4 w-4" />
          Quality Standard
        </h3>
        <div className="space-y-2 text-sm">
          <div>
            <p className="text-slate-500">Standard ID</p>
            <p className="font-medium">{qualityStandardId}</p>
          </div>
          <div>
            <p className="text-slate-500">Defect List ({defectList.length} items)</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {defectList.map((defectId) => (
                <span key={defectId} className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-700">
                  {defectId}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Inline Inspection */}
      <div className="rounded-lg border border-slate-200 p-4">
        <h3 className="mb-3 flex items-center gap-2 font-semibold text-slate-800">
          <ClipboardCheck className="h-4 w-4" />
          Inline Inspection
        </h3>
        <div className="space-y-3 text-sm">
          <div>
            <p className="text-slate-500">Frequency</p>
            <p className="font-medium">{inlineInspection.frequency}</p>
          </div>
          <div>
            <p className="text-slate-500">Checkpoints</p>
            <ul className="mt-2 space-y-1">
              {inlineInspection.checkpoints.map((checkpoint, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600 shrink-0" />
                  <span>{checkpoint}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Final Inspection */}
      <div className="rounded-lg border border-slate-200 p-4">
        <h3 className="mb-3 flex items-center gap-2 font-semibold text-slate-800">
          <Shield className="h-4 w-4" />
          Final Inspection
        </h3>
        <div className="space-y-3 text-sm">
          <div>
            <p className="text-slate-500">Frequency</p>
            <p className="font-medium">{finalInspection.frequency}</p>
          </div>
          <div>
            <p className="text-slate-500">Checkpoints</p>
            <ul className="mt-2 space-y-1">
              {finalInspection.checkpoints.map((checkpoint, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600 shrink-0" />
                  <span>{checkpoint}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* AQL Info */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
        <AlertTriangle className="mb-1 inline h-4 w-4" />
        Based on AQL {aqlLevel.aql}, inspect {aqlLevel.sampleSize} units. Accept if defects ≤ {aqlLevel.acceptLimit}, reject if defects ≥ {aqlLevel.rejectLimit}.
      </div>
    </div>
  );
}
