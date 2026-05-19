'use client';

import type { SampleStage } from '@/lib/style-types';
import { CheckCircle, Clock, AlertCircle, RefreshCw, User, Calendar, MessageSquare } from 'lucide-react';

const stageLabels: Record<SampleStage['stageId'], string> = {
  proto: 'Proto Sample',
  fit: 'Fit Sample',
  pp: 'Pre-Production (PP)',
  size_set: 'Size Set',
  top: 'TOP (Top of Production)',
  approval: 'Final Approval',
};

const statusConfig: Record<SampleStage['status'], { color: string; bgColor: string; icon: typeof CheckCircle }> = {
  pending: { color: 'text-slate-600', bgColor: 'bg-slate-100', icon: Clock },
  in_progress: { color: 'text-blue-600', bgColor: 'bg-blue-100', icon: Clock },
  submitted: { color: 'text-amber-600', bgColor: 'bg-amber-100', icon: Clock },
  approved: { color: 'text-emerald-600', bgColor: 'bg-emerald-100', icon: CheckCircle },
  rejected: { color: 'text-red-600', bgColor: 'bg-red-100', icon: AlertCircle },
  revision: { color: 'text-orange-600', bgColor: 'bg-orange-100', icon: RefreshCw },
};

export function SampleWorkflowPanel({ sampleWorkflow }: { sampleWorkflow: SampleStage[] }) {
  const completedStages = sampleWorkflow.filter(s => s.status === 'approved').length;
  const totalStages = sampleWorkflow.length;
  const progressPercent = Math.round((completedStages / totalStages) * 100);

  const currentStage = sampleWorkflow.find(s => s.status === 'in_progress' || s.status === 'submitted');
  const pendingStages = sampleWorkflow.filter(s => s.status === 'pending');
  const revisionStages = sampleWorkflow.filter(s => s.status === 'revision');

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold">Sample Workflow Progress</h3>
          </div>
          <div className="text-sm text-slate-600">
            {completedStages} of {totalStages} stages completed ({progressPercent}%)
          </div>
        </div>
        
        <div className="w-full bg-slate-200 rounded-full h-2 mb-4">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {currentStage && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
            <strong>Current Stage:</strong> {stageLabels[currentStage.stageId]} - Assigned to {currentStage.assignedTo}
          </div>
        )}
      </div>

      {revisionStages.length > 0 && (
        <div className="rounded-lg border border-orange-200 bg-orange-50 p-3 text-sm text-orange-900">
          <div className="flex items-center gap-2 mb-2">
            <RefreshCw className="h-4 w-4" />
            <strong>Revision Required</strong>
          </div>
          <ul className="space-y-1">
            {revisionStages.map(stage => (
              <li key={stage.stageId}>
                {stageLabels[stage.stageId]}: {stage.buyerFeedback || 'No feedback provided'}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-3">
        {sampleWorkflow.map((stage) => {
          const config = statusConfig[stage.status];
          const StatusIcon = config.icon;

          return (
            <div
              key={stage.stageId}
              className={`rounded-lg border p-4 ${stage.status === 'in_progress' ? 'border-blue-300 bg-blue-50' : 'border-slate-200 bg-white'}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${config.bgColor}`}>
                    <StatusIcon className={`h-4 w-4 ${config.color}`} />
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">{stageLabels[stage.stageId]}</div>
                    <div className="flex items-center gap-4 mt-1 text-xs text-slate-600">
                      <span className={`capitalize ${config.color}`}>{stage.status.replace('_', ' ')}</span>
                      {stage.revisionCount > 0 && (
                        <span className="text-orange-600">Revision #{stage.revisionCount}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(stage.deadline).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-600">
                  <User className="h-3 w-3" />
                  <span>Assigned: {stage.assignedTo}</span>
                </div>
                {stage.submittedDate && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar className="h-3 w-3" />
                    <span>Submitted: {new Date(stage.submittedDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              {stage.buyerFeedback && (
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <div className="flex items-start gap-2 text-xs">
                    <MessageSquare className="h-3 w-3 text-slate-400 mt-0.5" />
                    <div className="text-slate-700">
                      <span className="font-medium">Feedback:</span> {stage.buyerFeedback}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {pendingStages.length > 0 && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
          <strong>Pending Stages:</strong> {pendingStages.map(s => stageLabels[s.stageId]).join(', ')}
        </div>
      )}
    </div>
  );
}
