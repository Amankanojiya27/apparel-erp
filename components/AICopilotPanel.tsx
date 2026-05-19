'use client';

import { Sparkles, AlertTriangle, TrendingUp, Users } from 'lucide-react';
import { calculatePriorityInsight } from '@/lib/planning';

interface StyleRow {
  _id: string;
  designNumber: string;
  buyerName: string;
  sampleDeadline: string;
  deliveryDate: string;
  quantity: number;
  status: string;
}

export function AICopilotPanel({ styles }: { styles: StyleRow[] }) {
  const insights = styles
    .map((s) => ({
      ...s,
      insight: calculatePriorityInsight(s.sampleDeadline, s.deliveryDate, s.quantity, s.status),
    }))
    .sort((a, b) => b.insight.score - a.insight.score)
    .slice(0, 4);

  const urgentCount = insights.filter((i) => i.insight.priority === 'urgent').length;

  return (
    <div className="rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-white p-5">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Smart Planning</h3>
          <p className="text-xs text-gray-500">priority & reverse-plan insights</p>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-2">
        <div className="rounded-lg bg-white p-3 shadow-sm">
          <AlertTriangle className="mb-1 h-4 w-4 text-red-500" />
          <p className="text-lg font-bold text-gray-900">{urgentCount}</p>
          <p className="text-xs text-gray-500">Urgent actions</p>
        </div>
        <div className="rounded-lg bg-white p-3 shadow-sm">
          <TrendingUp className="mb-1 h-4 w-4 text-blue-500" />
          <p className="text-lg font-bold text-gray-900">{styles.length}</p>
          <p className="text-xs text-gray-500">Active styles</p>
        </div>
        <div className="rounded-lg bg-white p-3 shadow-sm">
          <Users className="mb-1 h-4 w-4 text-emerald-500" />
          <p className="text-lg font-bold text-gray-900">4</p>
          <p className="text-xs text-gray-500">Merchants</p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-indigo-600">Recommendations</p>
        {insights.map((item) => (
          <div key={item._id} className="rounded-lg border border-indigo-100 bg-white p-3 text-sm">
            <div className="flex justify-between gap-2">
              <span className="font-medium text-gray-900">{item.designNumber}</span>
              <span
                className={`shrink-0 rounded px-1.5 py-0.5 text-xs font-medium ${
                  item.insight.priority === 'urgent'
                    ? 'bg-red-100 text-red-700'
                    : item.insight.priority === 'high'
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-gray-100 text-gray-600'
                }`}
              >
                {item.insight.priority}
              </span>
            </div>
            <p className="mt-1 text-gray-600">{item.insight.reason}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
