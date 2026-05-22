import { getPayload } from 'payload';
import config from '@/payload/payload.config';
import { NextResponse } from 'next/server';
import type { TeamMember } from '@/types';

export const dynamic = 'force-dynamic';


export async function GET() {
  const payload = await getPayload({ config });
  const team = await payload.find({
    collection: 'teamMembers',
    depth: 2,
  });
  const data: TeamMember[] = team.docs as unknown as TeamMember[];
  return new NextResponse(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=60, stale-while-revalidate=30',
    },
  });
}
