// File: lib/phase1.ts
import type {
  DepartmentProgress,
  MaterialChase,
  ManpowerPlan,
  ResourceConflict,
  MaterialStatus,
  PatternStatus,
} from './style-types';

interface StyleForPhase1 {
  _id: string;
  designNumber: string;
  status: string;
  quantity: number;
  deliveryDate: string;
  sampleDeadline: string;
  fabricDetails: { type: string };
}

export function getQuantityTier(quantity: number): 'small' | 'medium' | 'large' | 'bulk' {
  if (quantity < 500) return 'small';
  if (quantity < 2000) return 'medium';
  if (quantity < 5000) return 'large';
  return 'bulk';
}

export function getQuantityPriorityNote(quantity: number, deliveryDays: number): string {
  const tier = getQuantityTier(quantity);
  if (tier === 'small' && deliveryDays > 45) {
    return 'Small qty — can slot between bulk runs without pulling capacity';
  }
  if (tier === 'bulk' && deliveryDays <= 45) {
    return 'Bulk order + close delivery — initiate cutting & sewing early';
  }
  if (tier === 'large' && deliveryDays <= 30) {
    return 'Large volume with tight ship date — allocate extra line hours now';
  }
  if (tier === 'medium') {
    return 'Medium qty — standard line allocation with sample deadline balance';
  }
  return 'Quantity factored into schedule alongside sample & delivery dates';
}

export function buildDepartmentProgress(style: StyleForPhase1): DepartmentProgress[] {
  const qty = style.quantity;
  const seed = style._id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const depts: DepartmentProgress['department'][] = ['Sampling', 'Cutting', 'Sewing', 'Finishing', 'Packaging'];

  const statusProgress: Record<string, number[]> = {
    pending: [20, 0, 0, 0, 0],
    sampling: [75, 10, 0, 0, 0],
    approved: [100, 40, 5, 0, 0],
    production: [100, 100, 55 + (seed % 25), 15 + (seed % 10), 0],
    completed: [100, 100, 100, 100, 100],
  };
  const percents = statusProgress[style.status] || [0, 0, 0, 0, 0];

  return depts.map((department, i) => {
    const percentComplete = percents[i];
    const targetUnits = Math.ceil(qty * (i === 0 ? 0.05 : 1));
    const completedUnits = Math.ceil((targetUnits * percentComplete) / 100);
    const isBottleneck =
      percentComplete > 0 &&
      percentComplete < 100 &&
      percents.every((p, j) => j === i || p >= percentComplete || p === 0) &&
      style.status === 'production' &&
      i === 2;

    const dailyUpdates = [];
    for (let d = 4; d >= 0; d--) {
      const dayPct = Math.max(0, percentComplete - d * 8);
      if (dayPct <= 0 && d > 2) continue;
      dailyUpdates.push({
        date: daysAgo(d),
        unitsCompleted: Math.max(0, Math.floor((completedUnits * (dayPct / 100)) / 5)),
        updatedBy: `${department} Supervisor`,
        notes: d === 0 && isBottleneck ? 'Bottleneck — need extra operators' : undefined,
      });
    }

    return {
      department,
      percentComplete,
      targetUnits,
      completedUnits,
      isBottleneck,
      status:
        percentComplete === 0
          ? 'not_started'
          : percentComplete === 100
            ? 'completed'
            : isBottleneck
              ? 'delayed'
              : 'in_progress',
      dailyUpdates,
    };
  });
}

export function buildMaterialChase(style: StyleForPhase1): MaterialChase {
  const qty = style.quantity;
  const seed = style._id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const requiredQty = Math.ceil(qty * 1.2 * 1.05);

  let fabricStatus: MaterialStatus = 'not_ordered';
  let patternStatus: PatternStatus = 'not_started';
  const alerts: string[] = [];

  if (style.status === 'pending') {
    fabricStatus = 'ordered';
    patternStatus = 'not_started';
    alerts.push('Pattern not started — chase sampling dept');
  } else if (style.status === 'sampling') {
    fabricStatus = seed % 2 === 0 ? 'in_transit' : 'ordered';
    patternStatus = seed % 5 === 0 ? 'revision' : 'in_development';
    if (fabricStatus === 'ordered') alerts.push('Fabric not in-house — risk to sample deadline');
  } else if (style.status === 'approved') {
    fabricStatus = 'received';
    patternStatus = 'completed';
  } else if (style.status === 'production') {
    fabricStatus = seed % 4 === 0 ? 'delayed' : 'qc_passed';
    patternStatus = 'completed';
    if (seed % 3 === 0) alerts.push('Trim shortage — buttons PO pending');
  } else if (style.status === 'completed') {
    fabricStatus = 'qc_passed';
    patternStatus = 'completed';
  }

  if (fabricStatus === 'delayed' || (fabricStatus === 'ordered' && style.status === 'production')) {
    alerts.push('CRITICAL: Fabric chase overdue — blocks cutting');
  }

  let readinessPercent = 0;
  const fabricScore =
    fabricStatus === 'qc_passed' ? 50 : fabricStatus === 'received' ? 40 : fabricStatus === 'in_transit' ? 25 : fabricStatus === 'ordered' ? 15 : 0;
  const patternScore =
    patternStatus === 'completed' ? 50 : patternStatus === 'in_development' ? 30 : patternStatus === 'revision' ? 20 : 0;
  readinessPercent = fabricScore + patternScore;

  return {
    fabric: {
      status: fabricStatus,
      supplier: 'Mill Partner Co.',
      expectedDate: daysFromNow(7 - (seed % 5)),
      receivedQty: fabricStatus === 'qc_passed' || fabricStatus === 'received' ? requiredQty : Math.floor(requiredQty * 0.4),
      requiredQty,
    },
    pattern: {
      status: patternStatus,
      assignedTo: 'Sampling Team',
      dueDate: style.sampleDeadline,
    },
    readinessPercent,
    productionReady: readinessPercent >= 80 && patternStatus === 'completed',
    alerts,
  };
}

export function buildEnhancedManpower(style: StyleForPhase1): ManpowerPlan[] {
  const qty = style.quantity;
  const tier = getQuantityTier(qty);
  const multiplier = tier === 'bulk' ? 1.4 : tier === 'large' ? 1.2 : tier === 'small' ? 0.5 : 1;
  const seed = style._id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);

  const depts = [
    { department: 'Sampling', factor: 0.08 },
    { department: 'Cutting', factor: 0.12 },
    { department: 'Sewing Line A', factor: 0.35 },
    { department: 'Sewing Line B', factor: 0.25 },
    { department: 'Finishing', factor: 0.12 },
    { department: 'Packaging', factor: 0.08 },
  ];

  return depts.map(({ department, factor }) => {
    const baseHours = Math.ceil((qty / 500) * 25 * 8 * factor * multiplier);
    const requiredHours = Math.max(8, baseHours);
    const capacityHours = Math.ceil(requiredHours * 1.15);
    const availableHours = Math.ceil(capacityHours * (0.9 + (seed % 15) / 100));
    const utilizationPercent = Math.min(100, Math.round((requiredHours / availableHours) * 100));
    const efficiencyPercent = Math.min(98, 72 + (seed % 20));

    let recommendation = 'Balanced — maintain schedule';
    if (utilizationPercent > 95) recommendation = 'Overloaded — shift capacity or delay low-priority style';
    if (utilizationPercent < 65) recommendation = 'Underutilized — assign small-quantity styles here';

    return {
      department,
      requiredHours,
      availableHours,
      capacityHours,
      utilizationPercent,
      efficiencyPercent,
      assignedWorkers: Math.ceil(requiredHours / 8),
      assignedStyleIds: [style._id],
      recommendation,
    };
  });
}

export function detectResourceConflicts(
  styles: Array<{ _id: string; designNumber: string; manpower?: ManpowerPlan[] }>
): ResourceConflict[] {
  const byDept = new Map<string, Array<{ designNumber: string; styleId: string; utilizationPercent: number }>>();

  for (const s of styles) {
    for (const m of s.manpower || []) {
      if (m.utilizationPercent < 85) continue;
      const list = byDept.get(m.department) || [];
      list.push({ designNumber: s.designNumber, styleId: s._id, utilizationPercent: m.utilizationPercent });
      byDept.set(m.department, list);
    }
  }

  const conflicts: ResourceConflict[] = [];
  byDept.forEach((competingStyles, department) => {
    if (competingStyles.length < 2) return;
    const maxUtil = Math.max(...competingStyles.map((c) => c.utilizationPercent));
    conflicts.push({
      department,
      competingStyles,
      severity: maxUtil >= 98 ? 'critical' : 'warning',
      message: `${competingStyles.length} styles competing for ${department} (${maxUtil}% peak utilization)`,
    });
  });
  return conflicts;
}

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
}

function daysFromNow(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0];
}
