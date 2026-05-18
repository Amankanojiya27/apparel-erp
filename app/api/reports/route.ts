import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Style from '@/models/Style';
import { getDemoStyles } from '@/lib/demo-store';
import { enrichStyle } from '@/lib/style-factory';
import { buildReportsSummary } from '@/lib/reports';

export async function GET() {
  try {
    await connectDB();
    const styles = await Style.find().populate('buyer merchant');
    if (styles.length > 0) {
      const enriched = styles.map((s) => {
        const obj = s.toObject();
        return enrichStyle({
          ...obj,
          _id: String(obj._id),
          deliveryDate: new Date(obj.deliveryDate).toISOString(),
          sampleDeadline: new Date(obj.sampleDeadline).toISOString(),
          merchant: obj.merchant as unknown as { name: string; email?: string },
          buyer: obj.buyer as unknown as { name: string; email?: string },
        } as Parameters<typeof enrichStyle>[0]);
      });
      return NextResponse.json(buildReportsSummary(enriched));
    }
  } catch {
    /* demo */
  }
  return NextResponse.json(buildReportsSummary(getDemoStyles()));
}
