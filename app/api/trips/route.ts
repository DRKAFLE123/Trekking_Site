import { getPayload } from 'payload';
import config from '@/payload/payload.config';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';


export async function GET() {
  const payload = await getPayload({ config });
  const trips = await payload.find({ collection: 'treks', depth: 1, limit: 100 });
  return new NextResponse(JSON.stringify(trips.docs), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=60, stale-while-revalidate=30',
    },
  });
}
