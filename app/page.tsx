// File: app/page.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { WorkflowPipeline } from '@/components/WorkflowPipeline';
import { AICopilotPanel } from '@/components/AICopilotPanel';
import { ReversePlanCard } from '@/components/ReversePlanCard';
import { SampleImageThumb } from '@/components/SampleImageThumb';
import { TNAGlobalCalendar } from '@/components/TNAGlobalCalendar';
import { Sidebar } from '@/components/Sidebar';
import { TopNavbar } from '@/components/TopNavbar';
import { InquiryEntry, type InquiryData } from '@/components/InquiryEntry';
import type { SampleImage, TNAMilestone } from '@/lib/style-types';
import { QuantityPriorityBadge } from '@/components/phase1/QuantityPriorityBadge';
import { BarChart3, Package, Calendar, Factory, TrendingUp, MessageSquare, Sparkles, ChevronRight } from 'lucide-react';
import { calculatePriorityInsight } from '@/lib/planning';
import { formatDate, getPriorityColor, getStatusColor } from '@/lib/utils';
import { DEMO_STYLES, DEMO_MERCHANTS } from '@/lib/demo-data';
import { updateDemoStyle, resetDemoStore } from '@/lib/demo-store';

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
  quantityTier?: string;
  quantityPriorityNote?: string;
  fabricDetails?: { type: string; gsm: number; color: string };
  images?: SampleImage[];
  tna?: TNAMilestone[];
  departmentProgress?: { percentComplete: number; isBottleneck: boolean; department: string }[];
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inquiries' | 'styles' | 'sampling' | 'production' | 'planning' | 'tna' | 'workflow'>('dashboard');
  const [styles, setStyles] = useState<Style[]>([]);
  const [inquiries, setInquiries] = useState<InquiryData[]>([]);
  const [showInquiryEntry, setShowInquiryEntry] = useState(false);
  const [showStyleForm, setShowStyleForm] = useState(false);
  const [inquiryData, setInquiryData] = useState<InquiryData | null>(null);
  const [showNextSteps, setShowNextSteps] = useState(false);
  const [createdStyle, setCreatedStyle] = useState<Style | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    fetchStyles();
  }, []);


  const fetchStyles = async () => {
    setLoading(true);
    // Use demo data directly
    try {
      setStyles(DEMO_STYLES);
    } catch {
      setStyles([]);
    } finally {
      setLoading(false);
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
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} isOpen={isSidebarOpen} onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <TopNavbar isSidebarOpen={isSidebarOpen} />

      <main className={`mt-16 p-6 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-16'}`}>
        {loading ? (
          <p className="text-center text-slate-500">Loading styles…</p>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
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

            {activeTab === 'inquiries' && (
              <div className="space-y-4">
                <Card>
                  <CardHeader className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold">All Inquiries</h2>
                      <p className="text-sm text-slate-500">Manage buyer inquiries and convert to styles</p>
                    </div>
                    <Button onClick={() => setShowInquiryEntry(true)}>
                      Create Inquiry
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {inquiries.length === 0 ? (
                      <div className="py-12 text-center">
                        <p className="text-slate-500">No inquiries yet. Create your first inquiry to get started.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {inquiries.map((inquiry) => (
                          <div
                            key={inquiry.inquiryId}
                            className="rounded-xl border border-slate-200 p-4 hover:bg-slate-50 cursor-pointer"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold">{inquiry.inquiryId}</h3>
                                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                    inquiry.formStatus === 'approved' ? 'bg-green-100 text-green-700' :
                                    inquiry.formStatus === 'submitted' ? 'bg-blue-100 text-blue-700' :
                                    'bg-slate-100 text-slate-700'
                                  }`}>
                                    {inquiry.formStatus}
                                  </span>
                                </div>
                                <p className="text-sm text-slate-600 mt-1">
                                  {inquiry.buyerName} · {inquiry.styleNumber} · {inquiry.productCategory}
                                </p>
                                <p className="text-xs text-slate-500 mt-1">
                                  Qty: {inquiry.targetQty} · Target Ship: {formatDate(inquiry.targetShipDate)}
                                </p>
                              </div>
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => {
                                  setInquiryData(inquiry);
                                  setShowStyleForm(true);
                                }}
                              >
                                Create Style
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'styles' && (
              <div className="space-y-4">
                <Card>
                  <CardHeader className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold">All Styles</h2>
                      <p className="text-sm text-slate-500">Click a row for details, comments & status updates</p>
                    </div>
                    <Button onClick={() => setShowStyleForm(true)}>
                      New Style
                    </Button>
                  </CardHeader>
                  <CardContent className="p-0">
                    <StyleTable styles={styles} />
                  </CardContent>
                </Card>
              </div>
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
                          <p className="text-sm text-slate-600">{style.buyerName}</p>
                          <QuantityPriorityBadge quantity={style.quantity} note={style.quantityPriorityNote} />
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


            {activeTab === 'tna' && (
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-semibold">TNA Calendar — all styles</h2>
                  <p className="text-sm text-slate-500">Time & action milestones across buyers and departments</p>
                </CardHeader>
                <CardContent>
                  <TNAGlobalCalendar styles={styles} />
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

      {showInquiryEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="border-b border-slate-200 p-6">
              <h2 className="text-xl font-semibold">Inquiry Entry</h2>
              <p className="text-sm text-slate-500">Enter buyer inquiry details</p>
            </div>
            <InquiryEntry
              onSubmit={(data) => {
                setInquiries([...inquiries, data]);
                setShowInquiryEntry(false);
              }}
              onCancel={() => setShowInquiryEntry(false)}
            />
          </div>
        </div>
      )}

      {showStyleForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="border-b border-slate-200 p-6">
              <h2 className="text-xl font-semibold">Create New Style</h2>
              <p className="text-sm text-slate-500">Step 2: Merchant punches style — fabric, BOM, deadlines</p>
              {inquiryData && (
                <p className="mt-1 text-xs text-blue-600">Inquiry ID: {inquiryData.inquiryId}</p>
              )}
            </div>
            <StyleForm
              inquiryData={inquiryData}
              onSubmit={async (data) => {
                // Create new style object
                const newStyle: Style = {
                  _id: `new-${Date.now()}`,
                  designNumber: data.designNumber as string,
                  buyerName: data.buyerName as string,
                  merchant: { name: data.merchantName as string },
                  sampleType: data.sampleType as string,
                  fabricDetails: {
                    type: data.fabricType as string,
                    gsm: parseInt(data.fabricGsm as string, 10),
                    color: data.fabricColor as string,
                  },
                  quantity: parseInt(data.quantity as string, 10),
                  sampleDeadline: data.sampleDeadline as string,
                  deliveryDate: data.deliveryDate as string,
                  status: 'pending',
                  priority: 'medium',
                  images: [],
                };
                
                // Add to styles list
                setStyles([...styles, newStyle]);
                setCreatedStyle(newStyle);
                setShowStyleForm(false);
                setInquiryData(null);
                setShowNextSteps(true);
              }}
              onCancel={() => {
                setShowStyleForm(false);
                setInquiryData(null);
              }}
            />
          </div>
        </div>
      )}

      {showNextSteps && createdStyle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            <div className="border-b border-slate-200 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <Sparkles className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Style Created Successfully!</h2>
                  <p className="text-sm text-slate-500">{createdStyle.designNumber} - {createdStyle.buyerName}</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <h3 className="font-semibold text-slate-900 mb-4">What's Next?</h3>
              <div className="space-y-3">
                {[
                  { step: '1', title: 'Review your style', desc: 'Click on the style in the Styles tab to view details and pipeline status' },
                  { step: '2', title: 'Upload documents', desc: 'Add tech pack, design sketches, and other attachments' },
                  { step: '3', title: 'Create BOM', desc: 'Define Bill of Materials with fabric, trims, and accessories' },
                  { step: '4', title: 'Pre-costing', desc: 'Calculate costs and submit for approval' },
                  { step: '5', title: 'Track progress', desc: 'Monitor the pipeline and TNA calendar for milestones' },
                ].map((item) => (
                  <div key={item.step} className="flex gap-3 rounded-lg border border-slate-200 p-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900">{item.title}</h4>
                      <p className="text-sm text-slate-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <Button variant="secondary" onClick={() => setShowNextSteps(false)}>
                  Close
                </Button>
                <Button onClick={() => { setShowNextSteps(false); setActiveTab('styles'); }}>
                  Go to Styles
                </Button>
              </div>
            </div>
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
          <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Sample</th>
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
              <td className="px-4 py-3">
                <SampleImageThumb images={style.images} styleId={style._id} designNumber={style.designNumber} />
              </td>
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

function StyleForm({ onSubmit, onCancel, inquiryData }: { onSubmit: (data: Record<string, unknown>) => void; onCancel: () => void; inquiryData?: InquiryData | null }) {
  const [formData, setFormData] = useState({
    designNumber: inquiryData?.styleNumber || '',
    buyerName: inquiryData?.buyerName || '',
    buyerEmail: '',
    merchantName: inquiryData?.merchantName || '',
    merchantEmail: '',
    sampleType: 'proto',
    fabricType: inquiryData?.fabricComposition || '',
    fabricDescription: inquiryData?.styleDescription || '',
    fabricGsm: inquiryData?.fabricWeight || '',
    fabricColor: '',
    buttonsPerGarment: '',
    quantity: inquiryData?.targetQty || '',
    sampleDeadline: inquiryData?.sampleDeadline || '',
    deliveryDate: inquiryData?.targetShipDate || '',
    styleName: '',
    category: inquiryData?.productCategory || '',
    season: inquiryData?.season || '',
    brand: inquiryData?.brandLabel || '',
    designerName: '',
    targetCost: inquiryData?.targetPrice || '',
    targetMRP: '',
    fitType: 'regular',
    genderCategory: 'men',
    skuFormat: '{style}-{color}-{size}',
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
      targetCost: formData.targetCost ? parseFloat(formData.targetCost) : undefined,
      targetMRP: formData.targetMRP ? parseFloat(formData.targetMRP) : undefined,
      fitType: formData.fitType,
      genderCategory: formData.genderCategory,
      skuStructure: {
        format: formData.skuFormat,
        example: formData.skuFormat.replace('{style}', 'STY-001').replace('{color}', 'NVY').replace('{size}', 'M'),
      },
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
        {field('Style Name *', 'styleName')}
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
        <h3 className="mb-3 font-medium">Style Classification</h3>
        <div className="grid grid-cols-2 gap-4">
          {field('Category *', 'category')}
          {field('Season *', 'season')}
          {field('Brand *', 'brand')}
          {field('Designer Name *', 'designerName')}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Fit Type *</label>
            <select
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={formData.fitType}
              onChange={(e) => setFormData({ ...formData, fitType: e.target.value })}
            >
              <option value="slim">Slim Fit</option>
              <option value="regular">Regular Fit</option>
              <option value="relaxed">Relaxed Fit</option>
              <option value="oversized">Oversized</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Gender Category *</label>
            <select
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={formData.genderCategory}
              onChange={(e) => setFormData({ ...formData, genderCategory: e.target.value })}
            >
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="unisex">Unisex</option>
              <option value="kids">Kids</option>
            </select>
          </div>
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
        <h3 className="mb-3 font-medium">Costing</h3>
        <div className="grid grid-cols-2 gap-4">
          {field('Target Cost (₹)', 'targetCost', 'number', false)}
          {field('Target MRP (₹)', 'targetMRP', 'number', false)}
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="mb-3 font-medium">SKU Structure</h3>
        <div className="grid grid-cols-1 gap-4">
          {field('SKU Format *', 'skuFormat')}
          <p className="text-xs text-slate-500">Use placeholders: &#123;style&#125;, &#123;color&#125;, &#123;size&#125;. Example: &#123;style&#125;-&#123;color&#125;-&#123;size&#125;</p>
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
