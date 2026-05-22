import { getPayload } from 'payload';
import config from '@/payload/payload.config';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  if (!slug) {
    return new NextResponse(JSON.stringify({ error: 'Missing slug' }), { status: 400 });
  }
  const payload = await getPayload({ config });
  const trek = await payload.find({
    collection: 'treks',
    where: { slug: { equals: slug } },
    depth: 2,
  });
  return new NextResponse(JSON.stringify(trek.docs[0] ?? null), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=60, stale-while-revalidate=30',
    },
  });
}
