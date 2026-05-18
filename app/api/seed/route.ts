import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Style from '@/models/Style';
import User from '@/models/User';

const MERCHANTS = [
  { name: 'Rahul Sharma', email: 'rahul@factory.com' },
  { name: 'Priya Mehta', email: 'priya@factory.com' },
  { name: 'Amit Kumar', email: 'amit@factory.com' },
  { name: 'Sneha Patel', email: 'sneha@factory.com' },
];

const BUYERS = [
  { name: 'H&M Europe', email: 'buying@hm-demo.com' },
  { name: 'Zara Home', email: 'merch@zarahome-demo.com' },
  { name: 'Mango', email: 'tech@mango-demo.com' },
  { name: 'Target USA', email: 'sourcing@target-demo.com' },
  { name: 'Uniqlo', email: 'dev@uniqlo-demo.com' },
  { name: 'Gap Inc', email: 'pd@gap-demo.com' },
];

function daysFromNow(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

export async function POST() {
  try {
    await connectDB();

    await Style.deleteMany({});
    await User.deleteMany({ email: { $regex: /@factory\.com|@.*-demo\.com$/ } });

    const merchants = await Promise.all(
      MERCHANTS.map((m) =>
        User.create({ ...m, role: 'merchant', department: 'Merchandising' })
      )
    );
    const buyers = await Promise.all(
      BUYERS.map((b) => User.create({ ...b, role: 'buyer', department: 'Buying' }))
    );

    const seedStyles = [
      {
        designNumber: 'DN-2026-0142',
        buyerName: buyers[0].name,
        buyer: buyers[0]._id,
        merchant: merchants[0]._id,
        sampleType: 'fit',
        fabricDetails: { type: 'Cotton Twill', description: 'Stretch twill for chinos', gsm: 280, color: 'Navy' },
        rawMaterials: { buttonsPerGarment: 1, other: 'YKK zip' },
        status: 'sampling',
        priority: 'medium',
        sampleDeadline: daysFromNow(5),
        deliveryDate: daysFromNow(120),
        quantity: 800,
        comments: [{ user: 'Rahul Sharma', text: 'Fit sample this week; delivery Q3 — lower shipment urgency.', timestamp: new Date() }],
      },
      {
        designNumber: 'DN-2026-0089',
        buyerName: buyers[1].name,
        buyer: buyers[1]._id,
        merchant: merchants[1]._id,
        sampleType: 'proto',
        fabricDetails: { type: 'Linen Blend', description: 'Washed linen shirts', gsm: 160, color: 'Ecru' },
        rawMaterials: { buttonsPerGarment: 7 },
        status: 'production',
        priority: 'urgent',
        sampleDeadline: daysFromNow(-5),
        deliveryDate: daysFromNow(28),
        quantity: 5200,
        comments: [{ user: 'Priya Mehta', text: 'Delivery next month! Pattern must close in 15 days.', timestamp: new Date() }],
      },
      {
        designNumber: 'DN-2026-0201',
        buyerName: buyers[2].name,
        buyer: buyers[2]._id,
        merchant: merchants[2]._id,
        sampleType: 'fit',
        fabricDetails: { type: 'Poly Viscose', description: 'Printed blouse', gsm: 120, color: 'Floral' },
        rawMaterials: { buttonsPerGarment: 8 },
        status: 'approved',
        priority: 'high',
        sampleDeadline: daysFromNow(12),
        deliveryDate: daysFromNow(45),
        quantity: 3200,
        comments: [{ user: 'Amit Kumar', text: 'Fit approved — reverse plan from delivery.', timestamp: new Date() }],
      },
      {
        designNumber: 'DN-2026-0055',
        buyerName: buyers[3].name,
        buyer: buyers[3]._id,
        merchant: merchants[0]._id,
        sampleType: 'production',
        fabricDetails: { type: 'Fleece', description: 'Hoodie fleece', gsm: 320, color: 'Grey' },
        rawMaterials: { buttonsPerGarment: 0 },
        status: 'pending',
        priority: 'high',
        sampleDeadline: daysFromNow(18),
        deliveryDate: daysFromNow(55),
        quantity: 12000,
        comments: [],
      },
      {
        designNumber: 'DN-2026-0118',
        buyerName: buyers[4].name,
        buyer: buyers[4]._id,
        merchant: merchants[3]._id,
        sampleType: 'proto',
        fabricDetails: { type: 'Jersey', description: 'T-shirt jersey', gsm: 180, color: 'White' },
        rawMaterials: { buttonsPerGarment: 0 },
        status: 'sampling',
        priority: 'medium',
        sampleDeadline: daysFromNow(10),
        deliveryDate: daysFromNow(75),
        quantity: 450,
        comments: [{ user: 'Sneha Patel', text: 'Small qty — slot between bulk runs.', timestamp: new Date() }],
      },
    ];

    await Style.insertMany(seedStyles);
    const count = await Style.countDocuments();

    return NextResponse.json({ success: true, message: `Seeded ${count} styles`, count, mode: 'database' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Seed failed';
    return NextResponse.json({ success: false, error: message, mode: 'demo-fallback' }, { status: 503 });
  }
}
