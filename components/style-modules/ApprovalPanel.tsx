'use client';

import { useState } from 'react';
import type { ApprovalRecord } from '@/lib/style-types';
import { Button } from '@/components/Button';
import { formatDate } from '@/lib/utils';
import { CheckCircle2, XCircle, Clock, RotateCcw } from 'lucide-react';

const statusIcon = {
  pending: Clock,
  approved: CheckCircle2,
  rejected: XCircle,
  revised: RotateCcw,
};

interface Props {
  approvals: ApprovalRecord[];
  onUpdate?: (approvalId: string, status: ApprovalRecord['status'], comments?: string) => void;
}

export function ApprovalPanel({ approvals, onUpdate }: Props) {
  const [comments, setComments] = useState<Record<string, string>>({});

  return (
    <div className="space-y-3">
      {approvals.map((a) => {
        const Icon = statusIcon[a.status];
        return (
          <div key={a._id} className="rounded-xl border border-slate-200 p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-slate-900">{a.stage}</p>
                <p className="text-xs capitalize text-slate-500">{a.type} approval</p>
              </div>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium capitalize ${
                  a.status === 'approved'
                    ? 'bg-emerald-100 text-emerald-800'
                    : a.status === 'rejected'
                      ? 'bg-red-100 text-red-800'
                      : a.status === 'revised'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-700'
                }`}
              >
                <Icon className="h-3 w-3" />
                {a.status}
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-600">
              Requested by {a.requestedBy} · {formatDate(a.requestedAt)}
            </p>
            {a.reviewedBy && (
              <p className="text-sm text-slate-600">
                Reviewed by {a.reviewedBy}
                {a.reviewedAt && ` · ${formatDate(a.reviewedAt)}`}
              </p>
            )}
            {a.comments && <p className="mt-2 text-sm italic text-slate-500">{a.comments}</p>}

            {a.status === 'pending' && onUpdate && (
              <div className="mt-3 space-y-2 border-t border-slate-100 pt-3">
                <input
                  type="text"
                  placeholder="Review comments (optional)"
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
                  value={comments[a._id] || ''}
                  onChange={(e) => setComments({ ...comments, [a._id]: e.target.value })}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => onUpdate(a._id, 'approved', comments[a._id])}>
                    Approve
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => onUpdate(a._id, 'revised', comments[a._id])}>
                    Revise
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => onUpdate(a._id, 'rejected', comments[a._id])}>
                    Reject
                  </Button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
