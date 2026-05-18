'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/Card';
import { Button } from '@/components/Button';
import { ArrowLeft, MessageSquare, Calendar, Package, User, Clock } from 'lucide-react';
import { formatDate, getStatusColor, getPriorityColor } from '@/lib/utils';
import { calculatePriorityInsight } from '@/lib/planning';
import { ReversePlanCard } from '@/components/ReversePlanCard';
import { StylePipelineTracker } from '@/components/StylePipelineTracker';
import { SampleImageGallery } from '@/components/SampleImageGallery';
import { SampleImageThumb } from '@/components/SampleImageThumb';
import { PreCostingPanel } from '@/components/style-modules/PreCostingPanel';
import { BOMMRPModule } from '@/components/style-modules/BOMMRPModule';
import { TNACalendarView } from '@/components/style-modules/TNACalendarView';
import { ManpowerPhase1Panel } from '@/components/phase1/ManpowerPhase1Panel';
import { DepartmentProgressPanel } from '@/components/phase1/DepartmentProgressPanel';
import { MaterialChasePanel } from '@/components/phase1/MaterialChasePanel';
import { QuantityPriorityBadge } from '@/components/phase1/QuantityPriorityBadge';
import { detectResourceConflicts } from '@/lib/phase1';
import { ApprovalPanel } from '@/components/style-modules/ApprovalPanel';
import { EmailPanel } from '@/components/style-modules/EmailPanel';
import type { StyleExtensions } from '@/lib/style-types';

const DETAIL_TABS = [
  'overview',
  'pipeline',
  'progress',
  'materials',
  'costing',
  'bom',
  'tna',
  'manpower',
  'approvals',
  'email',
  'comments',
] as const;

type Style = StyleExtensions & {
  _id: string;
  designNumber: string;
  buyerName: string;
  merchant?: { name: string; email?: string };
  buyer?: { name: string; email?: string };
  sampleType: string;
  status: string;
  priority: string;
  quantity: number;
  sampleDeadline: string;
  deliveryDate: string;
  fabricDetails: { type: string; description: string; gsm: number; color: string };
  rawMaterials?: { buttonsPerGarment?: number; other?: string };
  comments?: Array<{ user: string; text: string; timestamp: string }>;
  createdAt?: string;
};

export default function StyleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [style, setStyle] = useState<Style | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<(typeof DETAIL_TABS)[number]>('overview');
  const [newComment, setNewComment] = useState('');
  const [commentUser, setCommentUser] = useState('');
  const [allStyles, setAllStyles] = useState<Array<{ _id: string; designNumber: string; manpower?: Style['manpower'] }>>([]);

  const fetchStyle = async () => {
    try {
      const response = await fetch(`/api/styles/${params.id}`);
      const data = await response.json();
      setStyle(data);
    } catch (error) {
      console.error('Failed to fetch style:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStyle();
    fetch('/api/styles')
      .then((r) => r.json())
      .then((data) => setAllStyles(Array.isArray(data) ? data : []))
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const handleDailyProgress = async (department: string, units: number) => {
    await fetch(`/api/styles/${params.id}/progress`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ department, unitsCompleted: units }),
    });
    fetchStyle();
  };

  const resourceConflicts = detectResourceConflicts(allStyles);

  const patchStyle = async (body: Record<string, unknown>) => {
    await fetch(`/api/styles/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    fetchStyle();
  };

  const handleApproval = async (approvalId: string, status: string, comments?: string) => {
    await fetch(`/api/styles/${params.id}/approvals`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approvalId, status, comments, reviewedBy: 'Supervisor' }),
    });
    fetchStyle();
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !commentUser.trim()) return;
    await fetch(`/api/styles/${params.id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: commentUser, text: newComment }),
    });
    setNewComment('');
    fetchStyle();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-600">Loading style…</p>
      </div>
    );
  }

  if (!style) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-600">Style not found</p>
      </div>
    );
  }

  const insight = calculatePriorityInsight(
    style.sampleDeadline,
    style.deliveryDate,
    style.quantity,
    style.status
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <SampleImageThumb images={style.images} size="md" />
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-bold text-slate-900">{style.designNumber}</h1>
            <p className="text-sm text-slate-600">
              {style.buyerName} · {style.sampleType} · Qty {style.quantity.toLocaleString()}
            </p>
            {style.quantityTier && (
              <div className="mt-1">
                <QuantityPriorityBadge quantity={style.quantity} note={style.quantityPriorityNote} />
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <span className={`rounded-full border px-3 py-1 text-sm font-medium ${getPriorityColor(insight.priority)}`}>
              {insight.priority}
            </span>
            <span className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(style.status)}`}>
              {style.status}
            </span>
          </div>
        </div>
        <nav className="mx-auto flex max-w-7xl gap-1 overflow-x-auto border-t border-slate-100 px-4 sm:px-6 lg:px-8">
          {DETAIL_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 border-b-2 px-3 py-2.5 text-sm font-medium capitalize ${
                activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'
              }`}
            >
              {tab === 'bom' ? 'BOM / MRP' : tab}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-semibold">Sample identification</h2>
                </CardHeader>
                <CardContent>
                  <SampleImageGallery images={style.images} designNumber={style.designNumber} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-semibold">Style & fabric data</h2>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-500">Sample deadline</p>
                      <p className="font-medium">{formatDate(style.sampleDeadline)}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Delivery</p>
                      <p className="font-medium">{formatDate(style.deliveryDate)}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Fabric</p>
                      <p className="font-medium">
                        {style.fabricDetails.type} · {style.fabricDetails.gsm} GSM · {style.fabricDetails.color}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">Description</p>
                      <p className="font-medium">{style.fabricDetails.description}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="flex flex-wrap gap-4">
                    <div>
                      <label className="mr-2 text-sm font-medium">Status</label>
                      <select
                        value={style.status}
                        onChange={(e) => patchStyle({ status: e.target.value })}
                        className="rounded-lg border px-2 py-1 text-sm"
                      >
                        <option value="pending">Pending</option>
                        <option value="sampling">Sampling</option>
                        <option value="approved">Approved</option>
                        <option value="production">Production</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                    <div>
                      <label className="mr-2 text-sm font-medium">Priority</label>
                      <select
                        value={style.priority}
                        onChange={(e) => patchStyle({ priority: e.target.value })}
                        className="rounded-lg border px-2 py-1 text-sm"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </div>
            <aside className="space-y-6">
              <Card>
                <CardHeader>
                  <h3 className="font-semibold">AI insight</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600">{insight.reason}</p>
                </CardContent>
              </Card>
              {['production', 'approved'].includes(style.status) && (
                <ReversePlanCard
                  designNumber={style.designNumber}
                  buyerName={style.buyerName}
                  quantity={style.quantity}
                  deliveryDate={style.deliveryDate}
                />
              )}
            </aside>
          </div>
        )}

        {activeTab === 'pipeline' && (
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Style pipeline — step by step</h2>
              <p className="text-sm text-slate-500">
                Current: <strong>{style.pipeline?.find((s) => s.status === 'active')?.label || '—'}</strong>
              </p>
            </CardHeader>
            <CardContent>
              <StylePipelineTracker pipeline={style.pipeline} />
            </CardContent>
          </Card>
        )}

        {activeTab === 'costing' && (
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Pre-costing sheet</h2>
              <p className="text-sm text-slate-500">CM, fabric, trims, wastage & margin → target FOB</p>
            </CardHeader>
            <CardContent>
              <PreCostingPanel costing={style.preCosting} />
            </CardContent>
          </Card>
        )}

        {activeTab === 'bom' && (
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">BOM & material requirement planning</h2>
            </CardHeader>
            <CardContent>
              <BOMMRPModule bom={style.bom} />
            </CardContent>
          </Card>
        )}

        {activeTab === 'tna' && (
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">TNA calendar</h2>
              <p className="text-sm text-slate-500">Critical path milestones for this style</p>
            </CardHeader>
            <CardContent>
              <TNACalendarView milestones={style.tna} />
            </CardContent>
          </Card>
        )}

        {activeTab === 'progress' && (
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Department progress & daily updates</h2>
              <p className="text-sm text-slate-500">Stage completion, bottlenecks, floor logging</p>
            </CardHeader>
            <CardContent>
              <DepartmentProgressPanel
                progress={style.departmentProgress}
                onDailyUpdate={handleDailyProgress}
              />
            </CardContent>
          </Card>
        )}

        {activeTab === 'materials' && (
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Fabric & pattern chase</h2>
              <p className="text-sm text-slate-500">Material readiness before cutting</p>
            </CardHeader>
            <CardContent>
              <MaterialChasePanel chase={style.materialChase} />
            </CardContent>
          </Card>
        )}

        {activeTab === 'manpower' && (
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Manpower utilization</h2>
              <p className="text-sm text-slate-500">Capacity, efficiency & resource conflicts</p>
            </CardHeader>
            <CardContent>
              <ManpowerPhase1Panel manpower={style.manpower} conflicts={resourceConflicts} />
            </CardContent>
          </Card>
        )}

        {activeTab === 'approvals' && (
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Approval system</h2>
              <p className="text-sm text-slate-500">Sample, costing, BOM & shipment sign-offs</p>
            </CardHeader>
            <CardContent>
              <ApprovalPanel approvals={style.approvals} onUpdate={handleApproval} />
            </CardContent>
          </Card>
        )}

        {activeTab === 'email' && (
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Email integration</h2>
            </CardHeader>
            <CardContent>
              <EmailPanel
                emails={style.emails}
                buyerEmail={style.buyer?.email}
                onSync={() => fetchStyle()}
              />
            </CardContent>
          </Card>
        )}

        {activeTab === 'comments' && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Discussion</h2>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6 space-y-4">
                {style.comments?.map((c, i) => (
                  <div key={i} className="rounded-lg bg-slate-50 p-4">
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="font-medium">{c.user}</span>
                      <span className="text-slate-500">{formatDate(c.timestamp)}</span>
                    </div>
                    <p className="text-slate-700">{c.text}</p>
                  </div>
                ))}
              </div>
              <form onSubmit={handleAddComment} className="space-y-3">
                <input
                  type="text"
                  placeholder="Your name"
                  value={commentUser}
                  onChange={(e) => setCommentUser(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                  required
                />
                <textarea
                  placeholder="Add comment…"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                  rows={3}
                  required
                />
                <Button type="submit" className="w-full">
                  Add comment
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
