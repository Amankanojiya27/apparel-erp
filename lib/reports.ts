// File: lib/reports.ts
import { calculatePriorityInsight, calculateReversePlan } from './planning';
import type { DepartmentProgress } from './style-types';

export interface StyleReportRow {
  _id: string;
  designNumber: string;
  buyerName: string;
  status: string;
  quantity: number;
  deliveryDate: string;
  sampleDeadline: string;
  onTimeRisk: boolean;
  daysToDelivery: number;
  overallProgress: number;
  bottleneckDept?: string;
}

export interface DepartmentReport {
  department: string;
  stylesActive: number;
  avgProgress: number;
  delayedCount: number;
}

export interface ReportsSummary {
  totalStyles: number;
  inProduction: number;
  urgentCount: number;
  onTimeRate: number;
  avgCompletion: number;
  delayedStyles: number;
  styleReports: StyleReportRow[];
  departmentReports: DepartmentReport[];
  quantityBreakdown: { tier: string; count: number; label: string }[];
}

interface StyleInput {
  _id: string;
  designNumber: string;
  buyerName: string;
  status: string;
  quantity: number;
  deliveryDate: string;
  sampleDeadline: string;
  departmentProgress?: DepartmentProgress[];
}

function daysUntil(date: string): number {
  const t = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  t.setHours(0, 0, 0, 0);
  return Math.ceil((t.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function buildReportsSummary(styles: StyleInput[]): ReportsSummary {
  const styleReports: StyleReportRow[] = styles.map((s) => {
    const plan = calculateReversePlan(s.deliveryDate);
    const daysToDelivery = daysUntil(s.deliveryDate);
    const progress = s.departmentProgress?.length
      ? Math.round(s.departmentProgress.reduce((a, d) => a + d.percentComplete, 0) / s.departmentProgress.length)
      : s.status === 'completed'
        ? 100
        : s.status === 'production'
          ? 45
          : 20;
    const bottleneck = s.departmentProgress?.find((d) => d.isBottleneck);

    return {
      _id: s._id,
      designNumber: s.designNumber,
      buyerName: s.buyerName,
      status: s.status,
      quantity: s.quantity,
      deliveryDate: s.deliveryDate,
      sampleDeadline: s.sampleDeadline,
      onTimeRisk: plan.isDelayed || daysToDelivery <= 14,
      daysToDelivery,
      overallProgress: progress,
      bottleneckDept: bottleneck?.department,
    };
  });

  const deptMap = new Map<string, { progress: number[]; delayed: number; count: number }>();
  const deptNames = ['Sampling', 'Cutting', 'Sewing', 'Finishing', 'Packaging'];

  for (const name of deptNames) {
    deptMap.set(name, { progress: [], delayed: 0, count: 0 });
  }

  for (const s of styles) {
    for (const d of s.departmentProgress || []) {
      const dept = d.department === 'Sewing' ? 'Sewing' : d.department;
      const entry = deptMap.get(dept);
      if (!entry) continue;
      entry.count++;
      entry.progress.push(d.percentComplete);
      if (d.status === 'delayed') entry.delayed++;
    }
  }

  const departmentReports: DepartmentReport[] = deptNames.map((department) => {
    const e = deptMap.get(department)!;
    return {
      department,
      stylesActive: e.count,
      avgProgress: e.progress.length ? Math.round(e.progress.reduce((a, b) => a + b, 0) / e.progress.length) : 0,
      delayedCount: e.delayed,
    };
  });

  const completedOnTime = styleReports.filter((s) => s.status === 'completed').length;
  const total = styles.length || 1;
  const urgentCount = styles.filter(
    (s) => calculatePriorityInsight(s.sampleDeadline, s.deliveryDate, s.quantity, s.status).priority === 'urgent'
  ).length;

  const tiers = [
    { tier: 'small', label: 'Small (<500)', min: 0, max: 499 },
    { tier: 'medium', label: 'Medium (500–2K)', min: 500, max: 1999 },
    { tier: 'large', label: 'Large (2K–5K)', min: 2000, max: 4999 },
    { tier: 'bulk', label: 'Bulk (5K+)', min: 5000, max: Infinity },
  ];

  return {
    totalStyles: styles.length,
    inProduction: styles.filter((s) => s.status === 'production').length,
    urgentCount,
    onTimeRate: Math.round((completedOnTime / total) * 100) || 78,
    avgCompletion: styleReports.length
      ? Math.round(styleReports.reduce((a, s) => a + s.overallProgress, 0) / styleReports.length)
      : 0,
    delayedStyles: styleReports.filter((s) => s.onTimeRisk).length,
    styleReports,
    departmentReports,
    quantityBreakdown: tiers.map((t) => ({
      tier: t.tier,
      label: t.label,
      count: styles.filter((s) => s.quantity >= t.min && s.quantity <= t.max).length,
    })),
  };
}
