import { getPayload } from 'payload';
import config from '@/payload/payload.config';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';


export async function GET() {
  const payload = await getPayload({ config });
  const result = await payload.find({ collection: 'faqs' });
  // Assuming payload.find returns { docs: [...] }
  const faqs = (result as any).docs ?? [];
  return new NextResponse(JSON.stringify(faqs), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=60, stale-while-revalidate=30',
    },
  });
}
