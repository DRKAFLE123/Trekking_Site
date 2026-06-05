import { getPayload } from 'payload';
import config from '@/payload/payload.config';
import { NextResponse } from 'next/server';
import { headers as nextHeaders } from 'next/headers';
import { apiErrorBody } from '@/lib/api-error';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const payload = await getPayload({ config });

    const requestHeaders = await nextHeaders();
    const { user } = await payload.auth({ headers: requestHeaders });
    if (!user || (user.role !== 'admin' && user.role !== 'editor' && user.role !== 'viewer' && user.role !== 'custom')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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
    return NextResponse.json(
      apiErrorBody(err, 'Failed to fetch dashboard stats', 'Dashboard Stats'),
      { status: 500 },
    );
  }
}
