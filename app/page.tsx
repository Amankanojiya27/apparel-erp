// File: app/page.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { WorkflowPipeline } from '@/components/WorkflowPipeline';
import { AICopilotPanel } from '@/components/AICopilotPanel';
import { ReversePlanCard } from '@/components/ReversePlanCard';
import { calculatePriorityInsight } from '@/lib/planning';
import { formatDate, getPriorityColor, getStatusColor } from '@/lib/utils';
import {
  LayoutDashboard,
  Plus,
  Calendar,
  TrendingUp,
  Package,
  Sparkles,
  MessageSquare,
  ChevronRight,
  Database,
  Factory,
} from 'lucide-react';

type Style = {
  _id: string;
  designNumber: string;
  buyerName: string;
  merchant?: { name: string };
  sampleType: string;
  status: string;
  priority: string;
  deliveryDate: string;
  sampleDeadline: string;
  quantity: number;
  fabricDetails?: { type: string; gsm: number; color: string };
};

const TABS = ['dashboard', 'styles', 'sampling', 'production', 'planning', 'workflow'] as const;

export default function Home() {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>('dashboard');
  const [styles, setStyles] = useState<Style[]>([]);
  const [showStyleForm, setShowStyleForm] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStyles();
  }, []);

  const fetchStyles = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/styles');
      const data = await response.json();
      setDemoMode(response.headers.get('X-Data-Source') === 'demo');
      setStyles(Array.isArray(data) ? data : []);
    } catch {
      setStyles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      const data = await res.json();
      if (data.success) setDemoMode(false);
      await fetchStyles();
    } finally {
      setSeeding(false);
    }
  };

  const prioritized = useMemo(
    () =>
      [...styles].sort((a, b) => {
        const sa = calculatePriorityInsight(a.sampleDeadline, a.deliveryDate, a.quantity, a.status);
        const sb = calculatePriorityInsight(b.sampleDeadline, b.deliveryDate, b.quantity, b.status);
        return sb.score - sa.score;
      }),
    [styles]
  );

  const stats = [
    { label: 'Total Styles', value: styles.length, icon: Package, color: 'bg-blue-500' },
    { label: 'In Sampling', value: styles.filter((s) => s.status === 'sampling').length, icon: Calendar, color: 'bg-emerald-500' },
    { label: 'In Production', value: styles.filter((s) => s.status === 'production').length, icon: Factory, color: 'bg-violet-500' },
    { label: 'Urgent', value: prioritized.filter((s) => calculatePriorityInsight(s.sampleDeadline, s.deliveryDate, s.quantity, s.status).priority === 'urgent').length, icon: TrendingUp, color: 'bg-red-500' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
              <LayoutDashboard className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">Apparel ERP</h1>
              {/* <p className="text-xs text-slate-500">WFX + Visual Gems · Phase 1 Demo</p> */}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={handleSeed} disabled={seeding}>
              <Database className="mr-1 h-4 w-4" />
              {seeding ? 'Loading…' : 'Load Demo Data'}
            </Button>
            <Button onClick={() => setShowStyleForm(true)}>
              <Plus className="mr-1 h-4 w-4" />
              New Style
            </Button>
          </div>
        </div>
      </header>

      {demoMode && (
        <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-sm text-amber-800">
          <Sparkles className="mr-1 inline h-4 w-4" />
          Demo mode — sample data loaded. Connect MongoDB and click &quot;Load Demo Data&quot; to persist.
        </div>
      )}

      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 sm:px-6 lg:px-8">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 border-b-2 px-4 py-3 text-sm font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {loading ? (
          <p className="text-center text-slate-500">Loading styles…</p>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div className="rounded-2xl bg-gray-100 p-6 text-black shadow-lg">
                {/* <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white shadow-lg"> */}
                  <h2 className="text-2xl font-bold">Buyer Query → Delivery</h2>
                  <p className="mt-2 max-w-2xl text-black/50">
                    End-to-end apparel workflow: merchant assignment, fabric & BOM entry, sampling deadlines,
                    dual-factor priority (sample + shipment), reverse planning, and in-app collaboration.
                  </p>
                  <WorkflowPipeline activeStep={3} />
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                  {stats.map((stat) => (
                    <Card key={stat.label}>
                      <CardContent className="flex items-center justify-between p-5">
                        <div>
                          <p className="text-sm text-slate-600">{stat.label}</p>
                          <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                        </div>
                        <div className={`rounded-xl p-3 ${stat.color}`}>
                          <stat.icon className="h-6 w-6 text-white" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                  <div className="lg:col-span-2">
                    <Card>
                      <CardHeader className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold">Priority Queue</h2>
                        <Link href="#" onClick={(e) => { e.preventDefault(); setActiveTab('planning'); }} className="text-sm text-blue-600 hover:underline">
                          View all
                        </Link>
                      </CardHeader>
                      <CardContent className="p-0">
                        <StyleTable styles={prioritized.slice(0, 5)} compact />
                      </CardContent>
                    </Card>
                  </div>
                  <AICopilotPanel styles={styles} />
                </div>
              </div>
            )}

            {activeTab === 'styles' && (
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-semibold">All Styles</h2>
                  <p className="text-sm text-slate-500">Click a row for details, comments & status updates</p>
                </CardHeader>
                <CardContent className="p-0">
                  <StyleTable styles={styles} />
                </CardContent>
              </Card>
            )}

            {activeTab === 'sampling' && (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <h2 className="text-lg font-semibold">Sampling & Deadlines</h2>
                    <p className="text-sm text-slate-500">Cutting ↔ Sampling coordination · Proto, Fit, PP samples</p>
                  </CardHeader>
                  <CardContent>
                    {styles
                      .filter((s) => ['sampling', 'pending'].includes(s.status))
                      .map((style) => {
                        const insight = calculatePriorityInsight(
                          style.sampleDeadline,
                          style.deliveryDate,
                          style.quantity,
                          style.status
                        );
                        return (
                          <Link
                            key={style._id}
                            href={`/styles/${style._id}`}
                            className="mb-3 block rounded-xl border border-slate-200 p-4 transition hover:border-blue-300 hover:bg-blue-50/30"
                          >
                            <div className="flex justify-between">
                              <div>
                                <h3 className="font-semibold">{style.designNumber}</h3>
                                <p className="text-sm text-slate-600">
                                  {style.buyerName} · {style.sampleType} sample · {style.fabricDetails?.type}
                                </p>
                              </div>
                              <div className="text-right text-sm">
                                <p className="font-medium text-amber-700">
                                  Sample: {formatDate(style.sampleDeadline)}
                                </p>
                                <p className="text-slate-500">Delivery: {formatDate(style.deliveryDate)}</p>
                                <p className="mt-1 text-xs text-indigo-600">{insight.reason}</p>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'production' && (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <h2 className="text-lg font-semibold">Reverse Planning</h2>
                    <p className="text-sm text-slate-500">
                      From delivery date → packaging (3d) → finishing (5d) → production (25d) → cutting (3d)
                    </p>
                  </CardHeader>
                  <CardContent className="grid gap-4 md:grid-cols-2">
                    {styles
                      .filter((s) => ['production', 'approved'].includes(s.status))
                      .map((s) => (
                        <ReversePlanCard
                          key={s._id}
                          designNumber={s.designNumber}
                          buyerName={s.buyerName}
                          quantity={s.quantity}
                          deliveryDate={s.deliveryDate}
                        />
                      ))}
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'planning' && (
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-semibold">Priority Planning</h2>
                  <p className="text-sm text-slate-500">
                    Sample deadline + delivery date planned together — urgent shipment beats distant sample rush
                  </p>
                </CardHeader>
                <CardContent className="space-y-3">
                  {prioritized.map((style, index) => {
                    const insight = calculatePriorityInsight(
                      style.sampleDeadline,
                      style.deliveryDate,
                      style.quantity,
                      style.status
                    );
                    return (
                      <Link
                        key={style._id}
                        href={`/styles/${style._id}`}
                        className="flex items-center gap-4 rounded-xl border border-slate-200 p-4 hover:bg-slate-50"
                      >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                          {index + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold text-slate-900">{style.designNumber}</h3>
                            <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${getPriorityColor(insight.priority)}`}>
                              {insight.priority} · {insight.score}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600">{style.buyerName} · Qty {style.quantity}</p>
                          <p className="mt-1 text-xs text-indigo-600">{insight.reason}</p>
                        </div>
                        <div className="hidden shrink-0 text-right text-sm sm:block">
                          <p>Sample {formatDate(style.sampleDeadline)}</p>
                          <p className="text-slate-500">Ship {formatDate(style.deliveryDate)}</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-slate-400" />
                      </Link>
                    );
                  })}
                </CardContent>
              </Card>
            )}

            {activeTab === 'workflow' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <h2 className="text-lg font-semibold">Complete Process Flow</h2>
                  </CardHeader>
                  <CardContent>
                    <WorkflowPipeline activeStep={4} />
                    <div className="mt-8 grid gap-4 md:grid-cols-2">
                      {[
                        { title: '1. Buyer Query & Assignment', desc: 'Style assigned to merchant by buyer relationship' },
                        { title: '2. ERP Data Entry', desc: 'Design no., fabric (GSM, color), BOM, sample type (proto/fit)' },
                        { title: '3. Sampling', desc: 'Pattern development, cutting ↔ sampling deadlines' },
                        { title: '4. Buyer Approval', desc: 'Fit/proto sign-off before bulk' },
                        { title: '5. Production', desc: 'Cutting 3d → Production 20-30d → Finishing 5d → Packaging 3d' },
                        { title: '6. Communication', desc: 'Comments, threads, buyer platform sync (phase 2)' },
                      ].map((step) => (
                        <div key={step.title} className="rounded-lg border border-slate-200 p-4">
                          <h3 className="font-medium text-slate-900">{step.title}</h3>
                          <p className="mt-1 text-sm text-slate-600">{step.desc}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-slate-600" />
                      <h2 className="text-lg font-semibold">Integrated Communication</h2>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600">
                      Discussion threads per style reduce email dependency. Phase 2 adds buyer platform sync,
                      email client integration, and WhatsApp escalation — same architecture as your prior ERP rollout.
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </>
        )}
      </main>

      {showStyleForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="border-b border-slate-200 p-6">
              <h2 className="text-xl font-semibold">Create New Style</h2>
              <p className="text-sm text-slate-500">Merchant punches style — fabric, BOM, deadlines</p>
            </div>
            <StyleForm
              onSubmit={async (data) => {
                await fetch('/api/styles', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(data),
                });
                setShowStyleForm(false);
                fetchStyles();
              }}
              onCancel={() => setShowStyleForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function StyleTable({ styles, compact }: { styles: Style[]; compact?: boolean }) {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b border-slate-200 bg-slate-50/80">
          <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Design</th>
          <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Buyer</th>
          {!compact && <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Merchant</th>}
          <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Sample</th>
          <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Status</th>
          <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Priority</th>
          <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Delivery</th>
          <th className="px-4 py-3" />
        </tr>
      </thead>
      <tbody>
        {styles.map((style) => {
          const insight = calculatePriorityInsight(
            style.sampleDeadline,
            style.deliveryDate,
            style.quantity,
            style.status
          );
          return (
            <tr key={style._id} className="border-b border-slate-100 hover:bg-slate-50">
              <td className="px-4 py-3 text-sm font-medium">{style.designNumber}</td>
              <td className="px-4 py-3 text-sm text-slate-600">{style.buyerName}</td>
              {!compact && (
                <td className="px-4 py-3 text-sm text-slate-600">{style.merchant?.name || '—'}</td>
              )}
              <td className="px-4 py-3 text-sm capitalize text-slate-600">{style.sampleType}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(style.status)}`}>
                  {style.status}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${getPriorityColor(insight.priority)}`}>
                  {insight.priority}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-slate-600">{formatDate(style.deliveryDate)}</td>
              <td className="px-4 py-3">
                <Link href={`/styles/${style._id}`} className="text-blue-600 hover:text-blue-800">
                  <ChevronRight className="h-5 w-5" />
                </Link>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function StyleForm({ onSubmit, onCancel }: { onSubmit: (data: Record<string, unknown>) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState({
    designNumber: '',
    buyerName: '',
    buyerEmail: '',
    merchantName: '',
    merchantEmail: '',
    sampleType: 'proto',
    fabricType: '',
    fabricDescription: '',
    fabricGsm: '',
    fabricColor: '',
    buttonsPerGarment: '',
    quantity: '',
    sampleDeadline: '',
    deliveryDate: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      fabricDetails: {
        type: formData.fabricType,
        description: formData.fabricDescription,
        gsm: parseInt(formData.fabricGsm, 10),
        color: formData.fabricColor,
      },
      rawMaterials: {
        buttonsPerGarment: formData.buttonsPerGarment ? parseInt(formData.buttonsPerGarment, 10) : undefined,
      },
      quantity: parseInt(formData.quantity, 10),
    });
  };

  const field = (label: string, key: keyof typeof formData, type = 'text', required = true) => (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      <input
        type={type}
        required={required}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={formData[key]}
        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
      />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6">
      <div className="grid grid-cols-2 gap-4">
        {field('Design Number *', 'designNumber')}
        {field('Buyer Name *', 'buyerName')}
        {field('Buyer Email *', 'buyerEmail', 'email')}
        {field('Merchant Name *', 'merchantName')}
        {field('Merchant Email *', 'merchantEmail', 'email')}
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Sample Type *</label>
          <select
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            value={formData.sampleType}
            onChange={(e) => setFormData({ ...formData, sampleType: e.target.value })}
          >
            <option value="proto">Proto Sample</option>
            <option value="fit">Fit Sample</option>
            <option value="production">Production Sample</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="mb-3 font-medium">Fabric Details</h3>
        <div className="grid grid-cols-2 gap-4">
          {field('Fabric Type *', 'fabricType')}
          {field('GSM *', 'fabricGsm', 'number')}
          {field('Description *', 'fabricDescription')}
          {field('Color *', 'fabricColor')}
          {field('Buttons / Garment', 'buttonsPerGarment', 'number', false)}
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="mb-3 font-medium">Schedule</h3>
        <div className="grid grid-cols-3 gap-4">
          {field('Sample Deadline *', 'sampleDeadline', 'date')}
          {field('Delivery Date *', 'deliveryDate', 'date')}
          {field('Quantity *', 'quantity', 'number')}
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Create Style</Button>
      </div>
    </form>
  );
}
