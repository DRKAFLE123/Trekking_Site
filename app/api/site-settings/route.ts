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
  const data: any = siteSettings.docs[0] ?? {};
  // Client widgets only link to these treks; the populated docs were ~2.5 MB.
  if (Array.isArray(data.top5Treks)) {
    data.top5Treks = data.top5Treks
      .filter((t: any) => t && typeof t === 'object')
      .map((t: any) => ({ id: t.id, slug: t.slug, title: t.title }));
  }
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, max-age=60, stale-while-revalidate=30',
    },
  });
}
