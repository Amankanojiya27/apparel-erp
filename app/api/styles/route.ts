import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Style from '@/models/Style';
import User from '@/models/User';
import { getDemoStyles } from '@/lib/demo-store';
import { enrichStyle } from '@/lib/style-factory';

// GET all styles
export async function GET() {
  try {
    await connectDB();
    const styles = await Style.find().populate('buyer merchant').sort({ createdAt: -1 });
    if (styles.length === 0) {
      return NextResponse.json(getDemoStyles(), { headers: { 'X-Data-Source': 'demo' } });
    }
    return NextResponse.json(
      styles.map((s) => {
        const obj = s.toObject();
        return enrichStyle({
          ...obj,
          _id: String(obj._id),
          deliveryDate: new Date(obj.deliveryDate).toISOString(),
          sampleDeadline: new Date(obj.sampleDeadline).toISOString(),
          merchant: obj.merchant as unknown as { name: string; email?: string },
          buyer: obj.buyer as unknown as { name: string; email?: string },
        } as Parameters<typeof enrichStyle>[0]);
      })
    );
  } catch {
    return NextResponse.json(getDemoStyles(), { headers: { 'X-Data-Source': 'demo' } });
  }
}

// POST create new style
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    // Create or find buyer/merchant users
    let buyer = await User.findOne({ email: body.buyerEmail });
    if (!buyer) {
      buyer = await User.create({
        name: body.buyerName,
        email: body.buyerEmail,
        role: 'buyer',
        department: 'Buying',
      });
    }

    let merchant = await User.findOne({ email: body.merchantEmail });
    if (!merchant) {
      merchant = await User.create({
        name: body.merchantName,
        email: body.merchantEmail,
        role: 'merchant',
        department: 'Merchandising',
      });
    }

    const style = await Style.create({
      designNumber: body.designNumber,
      buyerName: body.buyerName,
      buyer: buyer._id,
      merchant: merchant._id,
      sampleType: body.sampleType,
      fabricDetails: body.fabricDetails,
      rawMaterials: body.rawMaterials,
      deliveryDate: new Date(body.deliveryDate),
      sampleDeadline: new Date(body.sampleDeadline),
      quantity: body.quantity,
    });

    const populatedStyle = await Style.findById(style._id).populate('buyer merchant');
    const obj = populatedStyle!.toObject();
    return NextResponse.json(
      enrichStyle({
        ...obj,
        _id: String(obj._id),
        deliveryDate: new Date(obj.deliveryDate).toISOString(),
        sampleDeadline: new Date(obj.sampleDeadline).toISOString(),
        merchant: obj.merchant as unknown as { name: string; email?: string },
        buyer: obj.buyer as unknown as { name: string; email?: string },
      } as Parameters<typeof enrichStyle>[0]),
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
