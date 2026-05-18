import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Style from '@/models/Style';
import { getDemoStyleById, updateDemoStyle } from '@/lib/demo-store';
import type { DepartmentProgress } from '@/lib/style-types';

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const body = await request.json();
  const { department, unitsCompleted } = body as { department: string; unitsCompleted: number };

  const today = new Date().toISOString().split('T')[0];

  const updateProgress = (progress: DepartmentProgress[]) =>
    progress.map((d) => {
      if (d.department !== department) return d;
      const newCompleted = d.completedUnits + unitsCompleted;
      const percentComplete = Math.min(100, Math.round((newCompleted / d.targetUnits) * 100));
      return {
        ...d,
        completedUnits: newCompleted,
        percentComplete,
        status: percentComplete >= 100 ? 'completed' : 'in_progress',
        dailyUpdates: [
          { date: today, unitsCompleted, updatedBy: 'Floor Supervisor', notes: 'Logged via ERP' },
          ...d.dailyUpdates.filter((u) => u.date !== today),
        ].slice(0, 7),
      } as DepartmentProgress;
    });

  try {
    await connectDB();
    const style = await Style.findById(id);
    if (style?.departmentProgress) {
      style.departmentProgress = updateProgress(
        style.departmentProgress as unknown as DepartmentProgress[]
      ) as unknown as typeof style.departmentProgress;
      await style.save();
      return NextResponse.json(style);
    }
  } catch {
    /* demo */
  }

  const demo = getDemoStyleById(id);
  if (demo?.departmentProgress) {
    const updated = updateDemoStyle(id, {
      departmentProgress: updateProgress(demo.departmentProgress),
    });
    return NextResponse.json(updated);
  }

  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}
