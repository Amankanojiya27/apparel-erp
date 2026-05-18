'use client';

import type { EmailThread } from '@/lib/style-types';
import { formatDate } from '@/lib/utils';
import { Mail, Link2 } from 'lucide-react';
import { Button } from '@/components/Button';

interface Props {
  emails: EmailThread[];
  buyerEmail?: string;
  onSync?: () => void;
}

export function EmailPanel({ emails, buyerEmail, onSync }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm">
        <div className="flex items-center gap-2 text-blue-900">
          <Mail className="h-4 w-4" />
          Email client linked — threads synced to style record
        </div>
        {onSync && (
          <Button size="sm" variant="secondary" onClick={onSync}>
            Sync inbox
          </Button>
        )}
      </div>

      {emails.map((e) => (
        <div key={e._id} className="rounded-xl border border-slate-200 p-4 hover:bg-slate-50">
          <div className="flex items-start justify-between gap-2">
            <p className="font-medium text-slate-900">{e.subject}</p>
            {e.synced && (
              <span className="shrink-0 rounded bg-emerald-100 px-1.5 py-0.5 text-xs text-emerald-700">Synced</span>
            )}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {e.from} → {e.to} · {formatDate(e.receivedAt)}
          </p>
          <p className="mt-2 text-sm text-slate-600">{e.preview}</p>
          {e.linkedStep && (
            <p className="mt-2 flex items-center gap-1 text-xs text-blue-600">
              <Link2 className="h-3 w-3" />
              Linked to pipeline: {e.linkedStep.replace('_', ' ')}
            </p>
          )}
        </div>
      ))}

      <p className="text-xs text-slate-500">
        Compose to buyer: {buyerEmail || '—'} · Replies auto-attach to this style (demo).
      </p>
    </div>
  );
}
