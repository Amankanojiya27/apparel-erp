// File: app/api/styles/[id]/comments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Style from '@/models/Style';
import { DEMO_STYLES } from '@/lib/demo-data';

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const body = await request.json();

  try {
    await connectDB();
    const style = await Style.findById(id);

    if (style) {
      style.comments.push({
        user: body.user,
        text: body.text,
        timestamp: new Date(),
      });
      await style.save();
      const updatedStyle = await Style.findById(id).populate('buyer merchant');
      return NextResponse.json(updatedStyle);
    }
  } catch {
    /* demo fallback */
  }

  const demo = DEMO_STYLES.find((s) => s._id === id);
  if (demo) {
    const updated = {
      ...demo,
      comments: [
        ...(demo.comments || []),
        { user: body.user, text: body.text, timestamp: new Date().toISOString() },
      ],
    };
    return NextResponse.json(updated);
  }

  return NextResponse.json({ error: 'Style not found' }, { status: 404 });
}
