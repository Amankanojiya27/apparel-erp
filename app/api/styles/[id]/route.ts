// File: app/api/styles/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Style from '@/models/Style';
import { getDemoStyleById, updateDemoStyle } from '@/lib/demo-store';
import { enrichStyle } from '@/lib/style-factory';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  try {
    await connectDB();
    const style = await Style.findById(id).populate('buyer merchant');
    if (style) {
      const obj = style.toObject();
      return NextResponse.json(
        enrichStyle({
          ...obj,
          _id: String(obj._id),
          deliveryDate: new Date(obj.deliveryDate).toISOString(),
          sampleDeadline: new Date(obj.sampleDeadline).toISOString(),
          merchant: obj.merchant as unknown as { name: string; email?: string },
          buyer: obj.buyer as unknown as { name: string; email?: string },
        } as Parameters<typeof enrichStyle>[0])
      );
    }
  } catch {
    /* fall through to demo */
  }

  const demo = getDemoStyleById(id);
  if (demo) return NextResponse.json(demo);
  return NextResponse.json({ error: 'Style not found' }, { status: 404 });
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  try {
    await connectDB();
    const body = await request.json();
    const style = await Style.findByIdAndUpdate(id, body, { new: true }).populate('buyer merchant');
    if (style) return NextResponse.json(style);
  } catch {
    /* demo fallback */
  }

  const body = await request.json();
  const updated = updateDemoStyle(id, body);
  if (updated) return NextResponse.json(updated);
  return NextResponse.json({ error: 'Style not found' }, { status: 404 });
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  try {
    await connectDB();
    const style = await Style.findByIdAndDelete(id);
    if (style) return NextResponse.json({ message: 'Style deleted successfully' });
  } catch {
    /* ignore */
  }
  return NextResponse.json({ message: 'Style deleted successfully' });
}
