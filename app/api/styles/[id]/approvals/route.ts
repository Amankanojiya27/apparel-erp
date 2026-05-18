import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Style from '@/models/Style';
import { getDemoStyleById, updateDemoStyle } from '@/lib/demo-store';

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const body = await request.json();
  const { approvalId, status, comments } = body as {
    approvalId: string;
    status: string;
    comments?: string;
    reviewedBy?: string;
  };

  try {
    await connectDB();
    const style = await Style.findById(id);
    if (style?.approvals?.length) {
      const idx = style.approvals.findIndex(
        (a) => String((a as { _id?: { toString: () => string } })._id) === approvalId
      );
      if (idx >= 0) {
        style.approvals[idx].status = status;
        style.approvals[idx].reviewedAt = new Date();
        style.approvals[idx].reviewedBy = body.reviewedBy || 'Supervisor';
        if (comments) style.approvals[idx].comments = comments;
        await style.save();
        const updated = await Style.findById(id).populate('buyer merchant');
        return NextResponse.json(updated);
      }
    }
  } catch {
    /* demo */
  }

  const demo = getDemoStyleById(id);
  if (demo?.approvals) {
    const approvals = demo.approvals.map((a) =>
      a._id === approvalId
        ? {
            ...a,
            status: status as typeof a.status,
            reviewedAt: new Date().toISOString(),
            reviewedBy: 'Supervisor',
            comments: comments || a.comments,
          }
        : a
    );
    const updated = updateDemoStyle(id, { approvals });
    return NextResponse.json(updated);
  }

  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}
