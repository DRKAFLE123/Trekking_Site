import { getPayload } from 'payload';
import config from '@/payload/payload.config';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const payload = await getPayload({ config });
  const siteSettings = await payload.find({
    collection: 'siteSettings',
    depth: 2,
  });
  const data = siteSettings.docs[0] ?? {};
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, max-age=60, stale-while-revalidate=30',
    },
  });
}
