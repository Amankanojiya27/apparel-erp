'use client';

import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { SampleImageThumb } from '@/components/SampleImageThumb';
import type { TNAMilestone, SampleImage } from '@/lib/style-types';

export interface TNAStyleRow {
  _id: string;
  designNumber: string;
  buyerName: string;
  images?: SampleImage[];
  tna?: TNAMilestone[];
}

export function TNAGlobalCalendar({ styles }: { styles: TNAStyleRow[] }) {
  const allMilestones = styles.flatMap((s) =>
    (s.tna || []).map((m) => ({ ...m, styleId: s._id, designNumber: s.designNumber, buyerName: s.buyerName, images: s.images }))
  );
  const sorted = allMilestones.sort(
    (a, b) => new Date(a.plannedDate).getTime() - new Date(b.plannedDate).getTime()
  );
  const delayed = sorted.filter((m) => m.status === 'delayed');

  return (
    <div className="space-y-6">
      {delayed.length > 0 && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="font-semibold text-red-900">{delayed.length} delayed milestone(s) across styles</p>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left">Style</th>
              <th className="px-4 py-3 text-left">Milestone</th>
              <th className="px-4 py-3 text-left">Planned</th>
              <th className="px-4 py-3 text-left">Owner</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((m) => (
              <tr key={`${m.styleId}-${m.id}`} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <SampleImageThumb images={m.images} styleId={m.styleId} designNumber={m.designNumber} />
                    <Link href={`/styles/${m.styleId}`} className="font-medium text-blue-600 hover:underline">
                      {m.designNumber}
                    </Link>
                    <span className="text-slate-500">{m.buyerName}</span>
                  </div>
                </td>
                <td className="px-4 py-3">{m.name}</td>
                <td className="px-4 py-3">{formatDate(m.plannedDate)}</td>
                <td className="px-4 py-3">{m.owner}</td>
                <td className="px-4 py-3 capitalize">
                  <span
                    className={`rounded px-2 py-0.5 text-xs ${
                      m.status === 'delayed' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {m.status.replace('_', ' ')}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
