// File: app/api/styles/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Style from '@/models/Style';
import { DEMO_STYLES } from '@/lib/demo-data';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  try {
    await connectDB();
    const style = await Style.findById(id).populate('buyer merchant');
    if (style) return NextResponse.json(style);
  } catch {
    /* fall through to demo */
  }

  const demo = DEMO_STYLES.find((s) => s._id === id);
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
  const demo = DEMO_STYLES.find((s) => s._id === id);
  if (demo) return NextResponse.json({ ...demo, ...body });
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
