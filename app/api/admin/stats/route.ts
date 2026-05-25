import { getPayload } from 'payload';
import config from '@/payload/payload.config';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const payload = await getPayload({ config });

    // Run highly optimized SELECT COUNT(*) queries in parallel on the server database
    const [
      treksRes,
      blogsRes,
      bookingsRes,
      inquiriesRes,
      departuresRes,
      paymentsRes,
      testimonialsRes,
      faqsRes,
      teamRes,
      regionsRes
    ] = await Promise.all([
      payload.count({ collection: 'treks' }),
      payload.count({ collection: 'blogPosts' }),
      payload.count({ collection: 'bookings' }),
      payload.count({ collection: 'inquiries' }),
      payload.count({ collection: 'departures' }),
      payload.count({ collection: 'payments' }),
      payload.count({ collection: 'testimonials' }),
      payload.count({ collection: 'faqs' }),
      payload.count({ collection: 'teamMembers' }),
      payload.count({ collection: 'regions' })
    ]);

    return NextResponse.json({
      treks: treksRes.totalDocs,
      blogs: blogsRes.totalDocs,
      bookings: bookingsRes.totalDocs,
      inquiries: inquiriesRes.totalDocs,
      departures: departuresRes.totalDocs,
      payments: paymentsRes.totalDocs,
      testimonials: testimonialsRes.totalDocs,
      faqs: faqsRes.totalDocs,
      team: teamRes.totalDocs,
      regions: regionsRes.totalDocs
    }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0, must-revalidate',
      }
    });
  } catch (err: any) {
    console.error('[Dashboard Stats API] Error fetching stats:', err);
    return NextResponse.json({ 
      error: err.message || 'Failed to fetch dashboard stats' 
    }, { status: 500 });
  }
}
