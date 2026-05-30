import { getPayload } from 'payload';
import config from '@/payload/payload.config';

export const dynamic = 'force-dynamic';

export async function GET() {
  const payload = await getPayload({ config });
  const regions = await payload.find({
    collection: 'regions',
    depth: 1,
  });
  return new Response(JSON.stringify(regions.docs), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=60, stale-while-revalidate=30',
    },
  });
}
