// File: lib/planning.ts
export const STAGE_DAYS = {
  cutting: 3,
  production: 25,
  finishing: 5,
  packaging: 3,
} as const;

export type ProductionStage = keyof typeof STAGE_DAYS;

export interface ReversePlan {
  deliveryDate: Date;
  packagingStart: Date;
  finishingStart: Date;
  productionStart: Date;
  cuttingStart: Date;
  isDelayed: boolean;
  daysLate: number;
  stages: Array<{
    name: string;
    days: number;
    startDate: Date;
    endDate: Date;
  }>;
}

export interface PriorityInsight {
  score: number;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  reason: string;
  sampleUrgency: number;
  deliveryUrgency: number;
  quantityFactor: number;
}

export function calculateReversePlan(
  deliveryDateInput: string | Date,
  overrides?: Partial<typeof STAGE_DAYS>
): ReversePlan {
  const days = { ...STAGE_DAYS, ...overrides };
  const deliveryDate = new Date(deliveryDateInput);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const packagingStart = addDays(deliveryDate, -days.packaging);
  const finishingStart = addDays(packagingStart, -days.finishing);
  const productionStart = addDays(finishingStart, -days.production);
  const cuttingStart = addDays(productionStart, -days.cutting);

  const isDelayed = cuttingStart < today;
  const daysLate = isDelayed
    ? Math.ceil((today.getTime() - cuttingStart.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const stages = [
    { name: 'Cutting', days: days.cutting, start: cuttingStart, end: addDays(productionStart, -1) },
    { name: 'Production', days: days.production, start: productionStart, end: addDays(finishingStart, -1) },
    { name: 'Finishing', days: days.finishing, start: finishingStart, end: addDays(packagingStart, -1) },
    { name: 'Packaging', days: days.packaging, start: packagingStart, end: addDays(deliveryDate, -1) },
  ].map((s) => ({
    name: s.name,
    days: s.days,
    startDate: s.start,
    endDate: s.end,
  }));

  return {
    deliveryDate,
    packagingStart,
    finishingStart,
    productionStart,
    cuttingStart,
    isDelayed,
    daysLate,
    stages,
  };
}

export function calculatePriorityInsight(
  sampleDeadline: string | Date,
  deliveryDate: string | Date,
  quantity: number,
  status: string
): PriorityInsight {
  const sampleDays = daysUntil(sampleDeadline);
  const deliveryDays = daysUntil(deliveryDate);

  // Sample urgency: tighter deadline = higher score (0-100)
  const sampleUrgency =
    sampleDays <= 0 ? 100 : sampleDays <= 7 ? 90 : sampleDays <= 14 ? 70 : sampleDays <= 30 ? 45 : 20;

  // Delivery urgency weighted higher per client discussion
  const deliveryUrgency =
    deliveryDays <= 0 ? 100 : deliveryDays <= 20 ? 95 : deliveryDays <= 30 ? 80 : deliveryDays <= 60 ? 50 : 25;

  // Large qty + close delivery = pull ahead
  const quantityFactor =
    quantity >= 5000 && deliveryDays <= 45 ? 15 : quantity <= 500 && deliveryDays > 60 ? -10 : 0;

  const statusBoost =
    status === 'production' ? 10 : status === 'approved' ? 5 : status === 'sampling' ? 0 : -5;

  // Delivery weighted 60%, sample 40% — matches "plan both together, delivery often wins"
  const score = Math.min(
    100,
    Math.round(deliveryUrgency * 0.6 + sampleUrgency * 0.4 + quantityFactor + statusBoost)
  );

  let priority: PriorityInsight['priority'] = 'low';
  if (score >= 85) priority = 'urgent';
  else if (score >= 65) priority = 'high';
  else if (score >= 40) priority = 'medium';

  let reason = '';
  if (deliveryDays <= 30 && sampleDays > 60) {
    reason = 'Delivery imminent — prioritize over distant sample rush';
  } else if (sampleDays <= 7 && deliveryDays > 90) {
    reason = 'Sample due soon; delivery still far — medium priority';
  } else if (deliveryDays <= 20) {
    reason = 'Shipment due within 20 days — fabric & pattern critical';
  } else if (sampleDays <= 7) {
    reason = 'Sample deadline this week';
  } else if (quantity >= 5000) {
    reason = 'High volume order — schedule capacity early';
  } else {
    reason = 'Balanced sample and delivery timeline';
  }

  return { score, priority, reason, sampleUrgency, deliveryUrgency, quantityFactor };
}

export function getWorkflowStep(status: string): number {
  const steps: Record<string, number> = {
    pending: 0,
    sampling: 1,
    approved: 2,
    production: 3,
    completed: 4,
  };
  return steps[status] ?? 0;
}

export const WORKFLOW_STEPS = [
  { id: 'query', label: 'Buyer Query', desc: 'Style inquiry received' },
  { id: 'assign', label: 'Merchant Assignment', desc: 'Style assigned to merchant' },
  { id: 'entry', label: 'ERP Data Entry', desc: 'Fabric, BOM, sample type' },
  { id: 'sampling', label: 'Sampling', desc: 'Pattern & sample development' },
  { id: 'approval', label: 'Buyer Approval', desc: 'Fit / proto sign-off' },
  { id: 'cutting', label: 'Cutting', desc: '3 days typical' },
  { id: 'production', label: 'Production', desc: '20–30 days' },
  { id: 'finishing', label: 'Finishing', desc: '5 days' },
  { id: 'packaging', label: 'Packaging', desc: '3 days' },
  { id: 'delivery', label: 'Ex-Factory', desc: 'Shipment delivery' },
];

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function daysUntil(date: string | Date): number {
  const target = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}
