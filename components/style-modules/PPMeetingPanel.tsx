'use client';

import type { PPMeeting } from '@/lib/style-types';
import { Users, Calendar, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';

export function PPMeetingPanel({ ppMeeting }: { ppMeeting?: PPMeeting }) {
  if (!ppMeeting) {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 text-center text-slate-500">
        <Users className="mx-auto mb-2 h-8 w-8" />
        <p>PP Meeting not yet scheduled</p>
      </div>
    );
  }

  const { meetingDate, attendees, checklist, overallStatus, minutes, approvedBy, approvedAt } = ppMeeting;

  const statusColors: Record<string, string> = {
    pending: 'bg-slate-100 text-slate-700',
    reviewed: 'bg-blue-100 text-blue-700',
    approved: 'bg-emerald-100 text-emerald-700',
    concern: 'bg-amber-100 text-amber-700',
  };

  const overallStatusColors: Record<string, string> = {
    pending: 'bg-slate-100 text-slate-700',
    approved: 'bg-emerald-100 text-emerald-700',
    conditional: 'bg-amber-100 text-amber-700',
    rejected: 'bg-red-100 text-red-700',
  };

  const approvedCount = checklist.filter((item) => item.status === 'approved').length;
  const concernCount = checklist.filter((item) => item.status === 'concern').length;
  const pendingCount = checklist.filter((item) => item.status === 'pending').length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm">
        <div>
          <p className="text-slate-500">Meeting Date</p>
          <p className="font-medium">{new Date(meetingDate).toLocaleDateString()}</p>
        </div>
        <div>
          <p className="text-slate-500">Overall Status</p>
          <p className={`font-medium ${overallStatusColors[overallStatus]}`}>{overallStatus}</p>
        </div>
        <div>
          <p className="text-slate-500">Attendees</p>
          <p className="font-medium">{attendees.length}</p>
        </div>
        <div>
          <p className="text-slate-500">Checklist Progress</p>
          <p className="font-medium">{approvedCount}/{checklist.length} approved</p>
        </div>
      </div>

      {concernCount > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          <AlertTriangle className="mb-1 inline h-4 w-4" />
          {concernCount} item(s) with concerns
        </div>
      )}

      <div className="rounded-lg border border-slate-200 p-4">
        <h3 className="mb-4 font-semibold text-slate-800">PP Meeting Checklist</h3>
        <div className="space-y-3">
          {checklist.map((item) => (
            <div key={item.itemId} className="rounded-lg border border-slate-200 p-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{item.itemName}</h4>
                    <span className={`rounded px-2 py-0.5 text-xs font-medium ${statusColors[item.status]}`}>
                      {item.status}
                    </span>
                  </div>
                  {item.reviewer && (
                    <p className="mt-1 text-sm text-slate-600">Reviewer: {item.reviewer}</p>
                  )}
                  {item.comments && (
                    <p className="mt-1 text-sm text-slate-600">{item.comments}</p>
                  )}
                  {item.reviewedAt && (
                    <p className="mt-1 text-xs text-slate-500">Reviewed: {new Date(item.reviewedAt).toLocaleDateString()}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 p-4">
        <h3 className="mb-3 font-semibold text-slate-800">Meeting Details</h3>
        <div className="space-y-2 text-sm">
          <div>
            <p className="text-slate-500">Attendees</p>
            <p className="font-medium">{attendees.join(', ')}</p>
          </div>
          {minutes && (
            <div>
              <p className="text-slate-500">Meeting Minutes</p>
              <p className="font-medium">{minutes}</p>
            </div>
          )}
          {approvedBy && approvedAt && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900">
              <CheckCircle2 className="mb-1 inline h-4 w-4" />
              Approved by {approvedBy} on {new Date(approvedAt).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
