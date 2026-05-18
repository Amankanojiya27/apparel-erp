// File: app/api/production/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Production from '@/models/Production';
import Style from '@/models/Style';

// GET all production records
export async function GET() {
  try {
    await connectDB();
    const productions = await Production.find().populate('style').sort({ createdAt: -1 });
    return NextResponse.json(productions);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch production records' }, { status: 500 });
  }
}

// POST create production record
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    const production = await Production.create({
      style: body.styleId,
      cuttingDays: body.cuttingDays || 3,
      productionDays: body.productionDays || 25,
      finishingDays: body.finishingDays || 5,
      packagingDays: body.packagingDays || 3,
    });

    // Update style status
    await Style.findByIdAndUpdate(body.styleId, { status: 'production' });

    const populatedProduction = await Production.findById(production._id).populate('style');
    return NextResponse.json(populatedProduction, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
