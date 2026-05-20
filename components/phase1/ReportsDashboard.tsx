'use client';

import Link from 'next/link';
import type { ReportsSummary } from '@/lib/reports';
import type { SampleImage } from '@/lib/style-types';
import { SampleImageThumb } from '@/components/SampleImageThumb';
import { formatDate } from '@/lib/utils';
import { BarChart3, TrendingUp, AlertTriangle, Package } from 'lucide-react';

interface Props {
  report: ReportsSummary;
  styles: Array<{ _id: string; designNumber: string; images?: SampleImage[] }>;
}

export function ReportsDashboard({ report, styles }: Props) {
  const imgMap = Object.fromEntries(styles.map((s) => [s._id, s.images]));

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'On-time rate', value: `${report.onTimeRate}%`, icon: TrendingUp, color: 'text-emerald-600' },
          { label: 'Avg completion', value: `${report.avgCompletion}%`, icon: BarChart3, color: 'text-blue-600' },
          { label: 'At risk', value: report.delayedStyles, icon: AlertTriangle, color: 'text-red-600' },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-slate-200 bg-white p-4">
            <s.icon className={`mb-2 h-5 w-5 ${s.color}`} />
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-sm text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="mb-4 font-semibold">Quantity breakdown</h3>
          <div className="space-y-3">
            {report.quantityBreakdown.map((q) => (
              <div key={q.tier}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{q.label}</span>
                  <span className="font-medium">{q.count} styles</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-blue-500"
                    style={{ width: `${report.totalStyles ? (q.count / report.totalStyles) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="mb-4 font-semibold">Department performance</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-500">
                <th className="pb-2">Dept</th>
                <th className="pb-2">Progress</th>
                <th className="pb-2">Delayed</th>
              </tr>
            </thead>
            <tbody>
              {report.departmentReports.map((d) => (
                <tr key={d.department} className="border-t border-slate-100">
                  <td className="py-2 font-medium">{d.department}</td>
                  <td className="py-2">{d.avgProgress}%</td>
                  <td className="py-2">{d.delayedCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <div className="border-b border-slate-200 px-5 py-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Package className="h-5 w-5" />
            Style-wise status report
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left">Style</th>
                <th className="px-4 py-3 text-left">Buyer</th>
                <th className="px-4 py-3 text-left">Qty</th>
                <th className="px-4 py-3 text-left">Progress</th>
                <th className="px-4 py-3 text-left">Delivery</th>
                <th className="px-4 py-3 text-left">Risk</th>
                <th className="px-4 py-3 text-left">Bottleneck</th>
              </tr>
            </thead>
            <tbody>
              {report.styleReports.map((row) => (
                <tr key={row._id} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <SampleImageThumb images={imgMap[row._id]} styleId={row._id} designNumber={row.designNumber} />
                      <Link href={`/styles/${row._id}`} className="font-medium text-blue-600 hover:underline">
                        {row.designNumber}
                      </Link>
                    </div>
                  </td>
                  <td className="px-4 py-3">{row.buyerName}</td>
                  <td className="px-4 py-3">{row.quantity.toLocaleString()}</td>
                  <td className="px-4 py-3">{row.overallProgress}%</td>
                  <td className="px-4 py-3">{formatDate(row.deliveryDate)}</td>
                  <td className="px-4 py-3">
                    {row.onTimeRisk ? (
                      <span className="text-red-600 font-medium">At risk</span>
                    ) : (
                      <span className="text-emerald-600">OK</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{row.bottleneckDept || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
