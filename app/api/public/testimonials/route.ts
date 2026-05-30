import { getPayload } from 'payload';
import config from '@/payload/payload.config';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';


export async function GET() {
  const payload = await getPayload({ config });
  const testimonials = await payload.find({ collection: 'testimonials', depth: 1 });
  return new NextResponse(JSON.stringify(testimonials.docs), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=60, stale-while-revalidate=30',
    },
  });
}
