// File: app/api/production/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Production from '@/models/Production';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  try {
    await connectDB();
    const production = await Production.findById(id).populate('style');
    if (!production) {
      return NextResponse.json({ error: 'Production not found' }, { status: 404 });
    }
    return NextResponse.json(production);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch production' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  try {
    await connectDB();
    const body = await request.json();
    const production = await Production.findByIdAndUpdate(id, body, { new: true }).populate('style');
    if (!production) {
      return NextResponse.json({ error: 'Production not found' }, { status: 404 });
    }
    return NextResponse.json(production);
  } catch {
    return NextResponse.json({ error: 'Failed to update production' }, { status: 500 });
  }
}
