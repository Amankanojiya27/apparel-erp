// File: lib/style-factory.ts
import { calculateReversePlan } from './planning';
import {
  buildDepartmentProgress,
  buildMaterialChase,
  getQuantityTier,
  getQuantityPriorityNote,
} from './phase1';
import type {
  StyleExtensions,
  PipelineStep,
  PipelineStepStatus,
  BOMLine,
  TNAMilestone,
  PreCosting,
  SampleImage,
  ApprovalRecord,
  EmailThread,
} from './style-types';
import { PIPELINE_STEP_DEFS } from './style-types';

interface StyleInput {
  _id: string;
  designNumber: string;
  buyerName: string;
  sampleType: string;
  status: string;
  quantity: number;
  deliveryDate: string;
  sampleDeadline: string;
  fabricDetails: { type: string; gsm: number; color: string };
  rawMaterials?: { buttonsPerGarment?: number };
  merchant?: { name: string; email?: string };
  buyer?: { name: string; email?: string };
}

const SAMPLE_IMAGES: Record<string, string[]> = {
  fit: [
    'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1624378515194-6f4d0a6e0e0a?w=400&h=500&fit=crop',
  ],
  proto: [
    'https://images.unsplash.com/photo-1556906781-5a3f2e1f7c2b?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=500&fit=crop',
  ],
  production: [
    'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop',
  ],
  default: [
    'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&h=500&fit=crop',
  ],
};

function daysFrom(iso: string, offset: number): string {
  const d = new Date(iso);
  d.setDate(d.getDate() + offset);
  return d.toISOString();
}

function statusToStepIndex(status: string): number {
  const map: Record<string, number> = {
    pending: 2,
    sampling: 4,
    approved: 6,
    production: 8,
    completed: 11,
  };
  return map[status] ?? 1;
}

export function buildPipeline(status: string): PipelineStep[] {
  const activeIdx = statusToStepIndex(status);
  return PIPELINE_STEP_DEFS.map((def, i) => {
    let stepStatus: PipelineStepStatus = 'pending';
    if (i < activeIdx) stepStatus = 'completed';
    else if (i === activeIdx) stepStatus = 'active';
    else if (i === activeIdx + 1 && status === 'sampling') stepStatus = 'blocked';
    return {
      ...def,
      status: stepStatus,
      completedAt: i < activeIdx ? daysFrom(new Date().toISOString(), -(activeIdx - i) * 2) : undefined,
    };
  });
}

export function buildImages(style: StyleInput): SampleImage[] {
  const urls = SAMPLE_IMAGES[style.sampleType] || SAMPLE_IMAGES.default;
  const types = ['techpack', style.sampleType as SampleImage['type'], 'other'] as const;
  return urls.map((url, i) => ({
    _id: `${style._id}-img-${i}`,
    url,
    label: i === 0 ? 'Front view' : i === 1 ? 'Detail / BOM ref' : 'Tech pack',
    type: types[i] || 'other',
    uploadedAt: daysFrom(new Date().toISOString(), -5 - i),
  }));
}

export function buildBOM(style: StyleInput): BOMLine[] {
  const qty = style.quantity;
  const fabricM = 1.2;
  const buttons = style.rawMaterials?.buttonsPerGarment ?? 0;
  const lines: BOMLine[] = [
    {
      itemCode: 'FAB-001',
      itemDescription: `${style.fabricDetails.type} (${style.fabricDetails.color})`,
      category: 'fabric',
      consumptionPerGarment: fabricM,
      unit: 'm',
      rate: 0,
      amount: 0,
      totalRequired: Math.ceil(fabricM * qty * 1.05),
      inStock: Math.floor(qty * 0.3),
      toProcure: 0,
    },
    {
      itemCode: 'LBL-001',
      itemDescription: 'Main label',
      category: 'trim',
      consumptionPerGarment: 1,
      unit: 'pc',
      rate: 0,
      amount: 0,
      totalRequired: qty,
      inStock: Math.floor(qty * 0.5),
      toProcure: 0,
    },
    {
      itemCode: 'PKG-001',
      itemDescription: 'Polybag',
      category: 'packing',
      consumptionPerGarment: 1,
      unit: 'pc',
      rate: 0,
      amount: 0,
      totalRequired: qty,
      inStock: qty,
      toProcure: 0,
    },
    {
      itemCode: 'THR-001',
      itemDescription: 'Thread (contrast)',
      category: 'thread',
      consumptionPerGarment: 0.015,
      unit: 'kg',
      rate: 0,
      amount: 0,
      totalRequired: Math.ceil(0.015 * qty * 100) / 100,
      inStock: 50,
      toProcure: 0,
    },
  ];
  if (buttons > 0) {
    lines.splice(1, 0, {
      itemCode: 'BTN-001',
      itemDescription: 'Buttons',
      category: 'trim',
      consumptionPerGarment: buttons,
      unit: 'pc',
      rate: 0,
      amount: 0,
      totalRequired: buttons * qty,
      inStock: Math.floor(buttons * qty * 0.2),
      toProcure: 0,
    });
  }
  return lines.map((l) => ({
    ...l,
    toProcure: Math.max(0, l.totalRequired - l.inStock),
  }));
}

export function buildTNA(style: StyleInput): TNAMilestone[] {
  const plan = calculateReversePlan(style.deliveryDate);
  const d = (date: Date) => date.toISOString();
  return [
    { id: 'fabric', name: 'Fabric In-house', plannedDate: daysFrom(style.deliveryDate, -50), status: 'on_track', owner: 'Stores' },
    { id: 'pattern', name: 'Pattern Complete', plannedDate: style.sampleDeadline, status: style.status === 'pending' ? 'pending' : 'completed', owner: 'Sampling' },
    { id: 'cut', name: 'Planned Cut Date', plannedDate: d(plan.cuttingStart), status: plan.isDelayed ? 'delayed' : 'on_track', owner: 'Cutting' },
    { id: 'sew', name: 'Sewing Start', plannedDate: d(plan.productionStart), status: 'pending', owner: 'Production' },
    { id: 'finish', name: 'Finishing Complete', plannedDate: d(plan.finishingStart), status: 'pending', owner: 'Finishing' },
    { id: 'pack', name: 'Packing Complete', plannedDate: d(plan.packagingStart), status: 'pending', owner: 'Packing' },
    { id: 'exf', name: 'Ex-Factory', plannedDate: style.deliveryDate, status: style.status === 'completed' ? 'completed' : 'pending', owner: 'Merchant' },
  ];
}

export function buildPreCosting(style: StyleInput): PreCosting {
  const fabricConsumption = 1.2;
  const fabricRate = style.fabricDetails.gsm > 200 ? 4.5 : 3.2;
  const trimCost = (style.rawMaterials?.buttonsPerGarment ?? 0) * 0.08 + 0.45;
  const cmCost = style.quantity > 5000 ? 2.8 : 3.5;
  const commercialCost = 0.65;
  const wastagePercent = 5;
  const profitMarginPercent = 12;
  const base =
    fabricConsumption * fabricRate + trimCost + cmCost + commercialCost;
  const targetPrice = base * (1 + wastagePercent / 100) * (1 + profitMarginPercent / 100);
  return {
    fabricConsumption,
    fabricRate,
    trimCost,
    cmCost,
    commercialCost,
    wastagePercent,
    profitMarginPercent,
    targetPrice: Math.round(targetPrice * 100) / 100,
    quotedPrice: Math.round(targetPrice * 1.02 * 100) / 100,
    currency: 'USD',
  };
}


export function buildApprovals(style: StyleInput): ApprovalRecord[] {
  const merchant = style.merchant?.name || 'Merchant';
  const approvals: ApprovalRecord[] = [
    {
      _id: `${style._id}-a1`,
      stage: 'Pre-Costing',
      type: 'costing',
      status: style.status === 'pending' ? 'pending' : 'approved',
      requestedBy: merchant,
      reviewedBy: style.status === 'pending' ? undefined : style.buyerName,
      requestedAt: daysFrom(new Date().toISOString(), -8),
      reviewedAt: style.status === 'pending' ? undefined : daysFrom(new Date().toISOString(), -6),
    },
    {
      _id: `${style._id}-a2`,
      stage: `${style.sampleType} sample`,
      type: 'sample',
      status:
        style.status === 'sampling'
          ? 'pending'
          : ['approved', 'production', 'completed'].includes(style.status)
            ? 'approved'
            : 'pending',
      requestedBy: merchant,
      reviewedBy: ['approved', 'production', 'completed'].includes(style.status) ? style.buyerName : undefined,
      comments: style.status === 'sampling' ? 'Awaiting buyer fit comments' : undefined,
      requestedAt: daysFrom(new Date().toISOString(), -4),
      reviewedAt: ['approved', 'production', 'completed'].includes(style.status)
        ? daysFrom(new Date().toISOString(), -2)
        : undefined,
    },
    {
      _id: `${style._id}-a3`,
      stage: 'BOM & bulk materials',
      type: 'bom',
      status: ['production', 'completed'].includes(style.status) ? 'approved' : 'pending',
      requestedBy: 'Planning',
      requestedAt: daysFrom(new Date().toISOString(), -1),
    },
  ];
  return approvals;
}

export function buildEmails(style: StyleInput): EmailThread[] {
  const buyerEmail = style.buyer?.email || `buyer@${style.buyerName.toLowerCase().replace(/\s/g, '')}.com`;
  const merchantEmail = style.merchant?.email || 'merchant@factory.com';
  return [
    {
      _id: `${style._id}-e1`,
      from: buyerEmail,
      to: merchantEmail,
      subject: `Style ${style.designNumber} — ${style.sampleType} sample request`,
      preview: `Please develop ${style.sampleType} sample. Fabric: ${style.fabricDetails.type}, GSM ${style.fabricDetails.gsm}.`,
      linkedStep: 'inquiry',
      receivedAt: daysFrom(new Date().toISOString(), -12),
      synced: true,
    },
    {
      _id: `${style._id}-e2`,
      from: merchantEmail,
      to: buyerEmail,
      subject: `Costing sheet — ${style.designNumber}`,
      preview: 'Attached pre-costing for your review. Target FOB as per consumption.',
      linkedStep: 'pre_costing',
      receivedAt: daysFrom(new Date().toISOString(), -5),
      synced: true,
    },
  ];
}

type StyleWithExt = StyleInput & Partial<StyleExtensions>;

export function enrichStyle(style: StyleWithExt & Record<string, unknown>): StyleWithExt & StyleExtensions {
  const normalized: StyleInput = {
    _id: String(style._id),
    designNumber: String(style.designNumber),
    buyerName: String(style.buyerName),
    sampleType: String(style.sampleType),
    status: String(style.status),
    quantity: Number(style.quantity),
    deliveryDate: String(style.deliveryDate),
    sampleDeadline: String(style.sampleDeadline),
    fabricDetails: style.fabricDetails as StyleInput['fabricDetails'],
    rawMaterials: style.rawMaterials as StyleInput['rawMaterials'],
    merchant: style.merchant as StyleInput['merchant'],
    buyer: style.buyer as StyleInput['buyer'],
  };
  const pipeline = (style as StyleWithExt).pipeline?.length
    ? (style as StyleWithExt).pipeline!
    : buildPipeline(normalized.status);
  const currentPipelineStep =
    pipeline.find((s) => s.status === 'active')?.id || pipeline.find((s) => s.status === 'pending')?.id || 'inquiry';

  const deliveryDays = Math.ceil(
    (new Date(normalized.deliveryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  return {
    ...normalized,
    ...style,
    pipeline,
    currentPipelineStep,
    quantityTier: getQuantityTier(normalized.quantity),
    quantityPriorityNote: getQuantityPriorityNote(normalized.quantity, deliveryDays),
    images: (style as StyleWithExt).images?.length ? (style as StyleWithExt).images! : buildImages(normalized),
    approvals: (style as StyleWithExt).approvals?.length ? (style as StyleWithExt).approvals! : buildApprovals(normalized),
    bom: (style as StyleWithExt).bom?.length ? (style as StyleWithExt).bom! : buildBOM(normalized),
    tna: (style as StyleWithExt).tna?.length ? (style as StyleWithExt).tna! : buildTNA(normalized),
    preCosting: (style as StyleWithExt).preCosting ?? buildPreCosting(normalized),
    departmentProgress: (style as StyleWithExt).departmentProgress?.length
      ? (style as StyleWithExt).departmentProgress!
      : buildDepartmentProgress(normalized),
    materialChase: (style as StyleWithExt).materialChase ?? buildMaterialChase(normalized),
    emails: (style as StyleWithExt).emails?.length ? (style as StyleWithExt).emails! : buildEmails(normalized),
  } as StyleWithExt & StyleExtensions;
}